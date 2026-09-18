import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Activity, 
  Layers, 
  EyeOff, 
  Cpu 
} from 'lucide-react';

export default function AlertBanner({ stats, activeAlert, onAcknowledge }) {
  const [muted, setMuted] = useState(false);

  return (
    <div className="space-y-4">
      {/* High-Severity Intrusion Banner */}
      {activeAlert && (
        <div className="relative overflow-hidden rounded-lg border border-red-500/80 bg-red-950/40 p-4 shadow-lg shadow-red-950/50">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-600 text-white rounded-lg animate-bounce shadow">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-600/40">
                    CRITICAL BREACH
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {activeAlert.timestamp || 'JUST NOW'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mt-1">
                  {activeAlert.label || 'Intruder Detected in Buffer Zone'}
                </h3>
                <p className="text-xs text-slate-300 font-sans mt-0.5">
                  Location: <span className="font-semibold text-red-300">{activeAlert.location || 'CAM-01 (Fence Alpha)'}</span> &bull; Confidence: <strong className="text-emerald-400">{activeAlert.confidence || '94.2%'}</strong>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMuted(!muted)}
                title={muted ? 'Unmute Siren' : 'Mute Siren'}
                className="p-2 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition"
              >
                {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
              <button
                onClick={onAcknowledge}
                className="flex items-center gap-1.5 px-3 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-sans text-xs font-semibold tracking-wide transition shadow"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-Card Tactical Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Threat Level</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-amber-400 tracking-tight">HIGH (DEFCON 2)</span>
            <p className="text-[10px] text-slate-500 font-sans">Automated Intercept Armed</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Incidents</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-red-400 tracking-tight">02 UNRESOLVED</span>
            <p className="text-[10px] text-slate-500 font-sans">Sector 04 Perimeter</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Monitored Gates</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-slate-100 tracking-tight">04 / 04 ACTIVE</span>
            <p className="text-[10px] text-emerald-400 font-sans">Coverage: 100% Optical</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Edge AI Inference</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-emerald-400 tracking-tight">21 ms</span>
            <p className="text-[10px] text-slate-500 font-sans">Latency (YOLO TensorRT)</p>
          </div>
        </div>
      </div>
    </div>
  );
}