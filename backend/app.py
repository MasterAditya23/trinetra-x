import os
import sqlite3
from flask import Flask, jsonify
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

# [API ROUTE] Health check endpoint to verify the server is running (Required by Shared API Contract)
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
    # [DATABASE] Open connection and fetch all camera records
    conn = get_db_connection()
    cameras = conn.execute('SELECT * FROM cameras').fetchall()
    conn.close()

    # [DATA FORMATTING] Convert database rows into a standard Python list of dictionaries
    camera_list = []
    for cam in cameras:
        camera_list.append({
            "camera_id": cam["camera_id"],
            "name": cam["name"],
            "location": cam["location"],
            "status": cam["status"]
        })
        
    # [API RESPONSE] Return the formatted list as JSON with a 200 OK status
    return jsonify(camera_list), 200

# [EXECUTION] Start the Flask server on port 5000 (Required by Local Ports Contract)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)