import os
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS

# [INITIALIZATION] Create the main Flask application instance
app = Flask(__name__)

# [SECURITY] Enable CORS so Member 3's React dashboard can securely communicate with this backend
CORS(app)

# [CONFIGURATION] Define the absolute path to the SQLite database file
DB_PATH = os.path.join(os.path.dirname(__file__), 'database', 'trinetra.db')

# [DATABASE] Helper function to securely connect to the database and return dictionary-like rows
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# [API ROUTE] Health check endpoint to verify the server is running
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "vision": "pending",
        "database": "online"
    }), 200

# [API ROUTE] Cameras endpoint to provide the frontend with the list of active cameras
@app.route('/api/cameras', methods=['GET'])
def get_cameras():
    conn = get_db_connection()
    cameras = conn.execute('SELECT * FROM cameras').fetchall()
    conn.close()

    camera_list = []
    for cam in cameras:
        camera_list.append({
            "camera_id": cam["camera_id"],
            "name": cam["name"],
            "location": cam["location"],
            "status": cam["status"]
        })
        
    return jsonify(camera_list), 200

# [API ROUTE] POST Events endpoint to receive intrusion detections from Member 1 (Vision)
@app.route('/api/events', methods=['POST'])
def create_event():
    # [DATA VALIDATION] Extract JSON payload from the incoming Vision request
    data = request.get_json()
    
    if not data or not data.get('camera_id') or not data.get('event_type'):
        return jsonify({"error": "Invalid data, camera_id and event_type are required"}), 400

    # [DATABASE] Insert the new event into the SQLite database safely
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO events (camera_id, timestamp, event_type, object_type, confidence, zone, snapshot_path, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('camera_id'),
        data.get('timestamp'),
        data.get('event_type'),
        data.get('object_type'),
        data.get('confidence'),
        data.get('zone'),
        data.get('snapshot'),
        data.get('status', 'NEW')
    ))
    
    conn.commit()
    event_id = cursor.lastrowid
    conn.close()

    # [API RESPONSE] Return success message with the generated Event ID
    return jsonify({"message": "Event created successfully", "event_id": event_id}), 201

# [EXECUTION] Start the Flask server on port 5000
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)