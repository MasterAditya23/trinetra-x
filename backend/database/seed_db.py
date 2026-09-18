import sqlite3
import os

# [CONFIGURATION] Define the path to the existing database file
DB_PATH = os.path.join(os.path.dirname(__file__), 'trinetra.db')

def seed_cameras():
    # [DATABASE] Connect to SQLite database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # [DATA] Define the required cameras according to the Shared Camera Contract
    cameras = [
        ("CAM-01", "Border Camera 01", "North Sector", "ONLINE"),
        ("CAM-02", "Border Camera 02", "South Sector", "ONLINE"),
        ("CAM-03", "Border Camera 03", "East Sector", "ONLINE"),
        ("CAM-04", "Border Camera 04", "West Sector", "OFFLINE")
    ]

    # [DATABASE] Insert cameras safely (INSERT OR IGNORE prevents errors if we run this twice)
    cursor.executemany('''
        INSERT OR IGNORE INTO cameras (camera_id, name, location, status)
        VALUES (?, ?, ?, ?)
    ''', cameras)

    # [DATABASE] Save changes and close the connection
    conn.commit()
    print(f"Successfully seeded {cursor.rowcount} cameras into the database.")
    conn.close()

# [EXECUTION] Run the seed function when this file is executed
if __name__ == '__main__':
    seed_cameras()