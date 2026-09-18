import React, { useState } from 'react';
import { Video, ShieldAlert, Maximize2, Radio, Eye } from 'lucide-react';

const CAMERAS = [
  { id: 'CAM-01', name: 'Northern Perimeter - Fence Alpha', status: 'ALERT', threat: 'Human Intrusion (94%)', streamUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80' },
  { id: 'CAM-02', name: 'Eastern Ridge - Sentry Post 3', status: 'CLEAR', threat: 'Normal', streamUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80' },
  { id: 'CAM-03', name: 'Buffer Zone - Thermal Sector B', status: 'ALERT', threat: 'Vehicle Crossing (88%)', streamUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
  { id: 'CAM-04', name: 'Southern Outpost - Gate Beta', status: 'CLEAR', threat: 'Normal', streamUrl: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=80' },
];

export default function CameraGrid({ onSelectCamera }) {
  const [selectedCam, setSelectedCam] = useState(CAMERAS[0].id);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-200">
            Tactical Feeds (4 Channels)
          </h2>
        </div>
        <span className="text-xs text-slate-500">Auto-Cycle: Active (10s)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CAMERAS.map((cam) => {
          const isAlert = cam.status === 'ALERT';
          const isSelected = selectedCam === cam.id;

          return (
            <div
              key={cam.id}
              onClick={() => {
                setSelectedCam(cam.id);
                if (onSelectCamera) onSelectCamera(cam);
              }}
              className={`relative group cursor-pointer overflow-hidden rounded-lg border bg-slate-900 transition-all duration-200 ${
                isSelected
                  ? 'border-sky-500 ring-1 ring-sky-500/50 shadow-lg shadow-sky-500/10'
                  : isAlert
                  ? 'border-red-500/60 shadow-lg shadow-red-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Meta Bar */}
              <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-slate-950/90 to-transparent text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100">{cam.id}</span>
                  <span className="text-slate-400 text-[11px] truncate max-w-[140px]">
                    {cam.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isAlert ? (
                    <span className="flex items-center gap-1 bg-red-600/30 border border-red-500 text-red-400 text-[10px] px-2 py-0.5 rounded font-bold animate-pulse">
                      <ShieldAlert className="w-3 h-3" /> INTRUSION
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-emerald-600/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> REC
                    </span>
                  )}
                </div>
              </div>

              {/* Feed Image & Tactical Scan Overlay */}
              <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                <img
                  src={cam.streamUrl}
                  alt={cam.name}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
                />

                {/* Tactical HUD Crosshair */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
                  <div className="w-12 h-12 border border-dashed border-sky-400/80 rounded-full" />
                </div>

                {/* Detection Bounding Box on Alert Feeds */}
                {isAlert && (
                  <div className="absolute inset-10 border-2 border-red-500 bg-red-500/10 rounded flex flex-col justify-between p-1.5 pointer-events-none animate-pulse">
                    <span className="bg-red-600 text-white font-mono text-[9px] px-1 py-0.5 w-fit rounded shadow font-bold">
                      {cam.threat}
                    </span>
                    <span className="text-right text-[8px] text-red-300 font-mono tracking-tighter">
                      CONFIDENCE: 94.2%
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Info Bar */}
              <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  <span>YOLO Optical Flow</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400">30 FPS</span>
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500 hover:text-slate-200" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}