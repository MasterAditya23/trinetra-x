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

# [API ROUTE] GET Events endpoint to provide the frontend with the history of intrusions
@app.route('/api/events', methods=['GET'])
def get_events():
    conn = get_db_connection()
    events = conn.execute('SELECT * FROM events ORDER BY timestamp DESC').fetchall()
    conn.close()

    event_list = []
    for evt in events:
        event_list.append({
            "id": evt["id"],
            "camera_id": evt["camera_id"],
            "timestamp": evt["timestamp"],
            "event_type": evt["event_type"],
            "object_type": evt["object_type"],
            "confidence": evt["confidence"],
            "zone": evt["zone"],
            "snapshot": evt["snapshot_path"],
            "status": evt["status"]
        })
        
    return jsonify(event_list), 200

# [API ROUTE] GET Stats endpoint to provide the frontend with dashboard metrics
@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_db_connection()
    
    # [DATABASE] Calculate totals directly from SQLite using SQL COUNT queries
    total_events = conn.execute('SELECT COUNT(*) FROM events').fetchone()[0]
    online_cameras = conn.execute("SELECT COUNT(*) FROM cameras WHERE status = 'ONLINE'").fetchone()[0]
    offline_cameras = conn.execute("SELECT COUNT(*) FROM cameras WHERE status = 'OFFLINE'").fetchone()[0]
    
    conn.close()

    # [API RESPONSE] Return the aggregated dashboard statistics
    return jsonify({
        "total_events": total_events,
        "active_cameras": online_cameras,
        "offline_cameras": offline_cameras
    }), 200

# [API ROUTE] POST Events endpoint to receive intrusion detections from Member 1 (Vision)
@app.route('/api/events', methods=['POST'])
def create_event():
    data = request.get_json()
    
    if not data or not data.get('camera_id') or not data.get('event_type'):
        return jsonify({"error": "Invalid data, camera_id and event_type are required"}), 400

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

    return jsonify({"message": "Event created successfully", "event_id": event_id}), 201

# [EXECUTION] Start the Flask server on port 5000
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)