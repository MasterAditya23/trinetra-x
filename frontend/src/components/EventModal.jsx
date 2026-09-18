import React from 'react';
import { 
  X, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Camera, 
  Download, 
  Radio, 
  Send,
  Cpu
} from 'lucide-react';

export default function EventModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden text-slate-200 font-mono">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-red-600/20 text-red-400 border border-red-500/30 rounded">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
                Incident Forensics: {event.id}
              </span>
              <p className="text-[11px] text-slate-400 font-sans">
                Sector 04 Perimeter Intrusion Analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto font-sans">
          {/* Tactical Freeze Frame with Crosshair & Bounding Box */}
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80"
              alt="Intrusion Forensic Capture"
              className="w-full h-full object-cover opacity-90"
            />

            {/* Simulated YOLO Detection Bounding Box */}
            <div className="absolute top-[28%] left-[38%] w-[26%] h-[48%] border-2 border-red-500 bg-red-500/10 rounded flex flex-col justify-between p-1 pointer-events-none animate-pulse">
              <span className="bg-red-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded w-fit font-bold shadow">
                {event.target} ({event.confidence})
              </span>
              <span className="text-[9px] text-red-200 font-mono tracking-tighter text-right">
                [X: 382, Y: 290, W: 120, H: 240]
              </span>
            </div>

            {/* Capture Badge */}
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-950/80 rounded border border-slate-700 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
              <Camera className="w-3 h-3" />
              <span>SENSOR SNAPSHOT RAW</span>
            </div>
          </div>

          {/* Telemetry Matrix Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded">
              <span className="text-slate-500 block text-[10px]">TIME RECORDED</span>
              <strong className="text-slate-200 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-sky-400" /> {event.timestamp}
              </strong>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded">
              <span className="text-slate-500 block text-[10px]">STATION / CAM</span>
              <strong className="text-slate-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-red-400" /> {event.camera}
              </strong>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded">
              <span className="text-slate-500 block text-[10px]">MODEL CONFIDENCE</span>
              <strong className="text-emerald-400 flex items-center gap-1 mt-0.5">
                <Cpu className="w-3 h-3 text-emerald-400" /> {event.confidence}
              </strong>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded">
              <span className="text-slate-500 block text-[10px]">DEFENSE THREAT</span>
              <strong className="text-amber-400 flex items-center gap-1 mt-0.5">
                <Radio className="w-3 h-3 text-amber-400" /> {event.severity}
              </strong>
            </div>
          </div>

          {/* Operational Dispatch Notes */}
          <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded text-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Automated Tactical Guidance:
            </span>
            <p className="text-slate-300 leading-relaxed">
              Target breached infrared perimeter wireline at Zone {event.zone}. Optical velocity indicates foot movement towards eastern ravine. Sentry post audio alarm triggered automatically.
            </p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-sans">
          <button 
            onClick={() => alert(`Forensic Dossier for ${event.id} downloaded.`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export Event Log (.JSON)
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert(`Quick Response Unit dispatched to ${event.camera} (${event.zone})!`);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-semibold shadow transition"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Patrol Unit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}