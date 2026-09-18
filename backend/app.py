import os
from flask import Flask, jsonify
from flask_cors import CORS

# [INITIALIZATION] Create the main Flask application instance
app = Flask(__name__)

# [SECURITY] Enable CORS (Cross-Origin Resource Sharing) so Member 3's React dashboard can securely communicate with this backend
CORS(app)

# [API ROUTE] Health check endpoint to verify the server is running (Required by Shared API Contract)
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "vision": "pending",
        "database": "pending"
    }), 200

# [EXECUTION] Start the Flask server on port 5000 (Required by Local Ports Contract)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)