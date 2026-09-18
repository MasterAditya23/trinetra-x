import sqlite3
import os

# [CONFIGURATION] Define the path to the database file inside the database folder
DB_PATH = os.path.join(os.path.dirname(__file__), 'trinetra.db')

def init_database():
    # [DATABASE] Connect to SQLite (this automatically creates the file if it doesn't exist)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # [DATABASE] Create the 'cameras' table based on the Shared Database Contract
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cameras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            camera_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            location TEXT,
            status TEXT DEFAULT 'ONLINE',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # [DATABASE] Create the 'events' table based on the Shared Database Contract
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            camera_id TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            event_type TEXT NOT NULL,
            object_type TEXT,
            confidence REAL,
            zone TEXT,
            snapshot_path TEXT,
            status TEXT DEFAULT 'NEW',
            FOREIGN KEY (camera_id) REFERENCES cameras (camera_id)
        )
    ''')

    # [DATABASE] Save changes and safely close the connection
    conn.commit()
    conn.close()
    print(f"Database successfully initialized at: {DB_PATH}")

# [EXECUTION] Run the initialization function when this file is executed
if __name__ == '__main__':
    init_database()