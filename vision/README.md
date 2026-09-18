# TRINETRA X - Vision Module

This module handles the AI and Computer Vision pipeline for TRINETRA X. 

## Features Completed
- [x] Video Input (Webcam/IP Camera/Video File)
- [x] YOLOv8 Person & Vehicle Detection
- [x] ByteTrack Object Tracking
- [x] Virtual Fence & Crossing Logic
- [x] Event Cooldown (5 seconds)
- [x] Evidence Snapshot Generation
- [x] Shared JSON Event Generation
- [x] Software-based Night Mode (Gamma + CLAHE)

## How to Run
1. Ensure you are in the `vision` folder.
2. Install requirements: `pip install -r requirements.txt`
3. Run the detector: `python detector.py`

## Controls
- Press **'q'** to quit the video stream.
- Press **'n'** to toggle Night Mode ON/OFF.

## Integration Note
When an intrusion occurs, this module automatically saves a snapshot to `../data/snapshots/` and prints a structured JSON event to the terminal. In the final integration, this JSON will be sent to the Backend API via HTTP POST.