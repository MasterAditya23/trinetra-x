import cv2
import os
import datetime
import time
import json
from ultralytics import YOLO

def main():
    print("Loading YOLO AI Model...")
    model = YOLO('yolov8n.pt')

    cap = cv2.VideoCapture(0)
    print("Starting video feed. Press 'q' to stop.")

    FENCE_Y = 300 
    track_history = {}
    cooldowns = {}
    COOLDOWN_SECONDS = 5 

    snapshot_dir = "../data/snapshots"
    os.makedirs(snapshot_dir, exist_ok=True)

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame.")
            break

        frame = cv2.resize(frame, (800, 600))
        
        cv2.line(frame, (0, FENCE_Y), (800, FENCE_Y), (0, 0, 255), 2)
        cv2.putText(frame, "VIRTUAL FENCE", (10, FENCE_Y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

        # NEW: Added bytetrack.yaml to make tracking super fast and avoid laptop freezes!
        results = model.track(frame, persist=True, tracker="bytetrack.yaml", verbose=False)

        for r in results:
            boxes = r.boxes
            if boxes is not None and boxes.id is not None:
                for box, track_id, cls, conf_val in zip(boxes.xyxy, boxes.id, boxes.cls, boxes.conf):
                    class_name = model.names[int(cls)]
                    
                    if class_name in ['person', 'car', 'motorcycle', 'bus', 'truck']:
                        x1, y1, x2, y2 = map(int, box)
                        track_id = int(track_id)
                        conf = float(conf_val) 
                        conf_percent = int(conf * 100)
                        
                        cx = int((x1 + x2) / 2)
                        cy = int((y1 + y2) / 2)

                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        cv2.circle(frame, (cx, cy), 5, (255, 0, 0), -1)
                        label = f"ID:{track_id} {class_name.upper()} {conf_percent}%"
                        cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

                        if track_id in track_history:
                            prev_cy = track_history[track_id]
                            
                            if prev_cy < FENCE_Y and cy > FENCE_Y:
                                current_time = time.time()
                                
                                if track_id not in cooldowns or (current_time - cooldowns[track_id]) > COOLDOWN_SECONDS:
                                    
                                    cv2.putText(frame, "!!! INTRUSION DETECTED !!!", (150, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 3)
                                    
                                    timestamp_file = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                                    timestamp_json = datetime.datetime.now().isoformat()
                                    filename = f"CAM-01_{timestamp_file}_INTRUSION.jpg"
                                    filepath = os.path.join(snapshot_dir, filename)
                                    cv2.imwrite(filepath, frame)
                                    
                                    event_data = {
                                        "camera_id": "CAM-01",
                                        "event_type": "INTRUSION",
                                        "object_type": class_name,
                                        "confidence": round(conf, 2),
                                        "timestamp": timestamp_json,
                                        "snapshot": f"snapshots/{filename}",
                                        "zone": "Restricted Zone",
                                        "status": "NEW"
                                    }
                                    
                                    print(f"\n🚨 EVENT CONFIRMED!")
                                    print(json.dumps(event_data, indent=4))
                                    
                                    cooldowns[track_id] = current_time
                                    
                        track_history[track_id] = cy

        cv2.imshow("TRINETRA X - AI Tracking & Fence", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()