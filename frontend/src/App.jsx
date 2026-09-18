import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Radio, 
  Video, 
  Clock 
} from 'lucide-react';
import CameraGrid from './components/CameraGrid';
import AlertBanner from './components/AlertBanner';
import EventLog from './components/EventLog';
import EventModal from './components/EventModal';
import { checkBackendHealth, fetchCameras, fetchEvents } from './services/api';

export default function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [backendOnline, setBackendOnline] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [currentAlert, setCurrentAlert] = useState({
    id: 'EVT-4091',
    label: 'Unidentified Humanoid Crossing Sector Perimeter',
    location: 'CAM-01 (Fence Alpha)',
    confidence: '95.4%',
    timestamp: '17:24:02'
  });

  // Tactical live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll backend health every 5 seconds
  useEffect(() => {
    async function syncBackendStatus() {
      const isAlive = await checkBackendHealth();
      setBackendOnline(isAlive);
    }

    syncBackendStatus();
    const interval = setInterval(syncBackendStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-mono selection:bg-red-500 selection:text-white">
      {/* Top Tactical Command Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600/20 border border-red-500 rounded-lg text-red-500 shadow-inner">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-wider text-slate-100">TRINETRA X</h1>
              <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded tracking-widest uppercase font-semibold">
                Sector 04 active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans tracking-tight">
              AI Border Surveillance & Automated Intrusion Defense System
            </p>
          </div>
        </div>

        {/* Center Indicators */}
        <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2 border-r border-slate-800 pr-6">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>YOLOv8 Stream: <strong className="text-emerald-400">30 FPS</strong></span>
          </div>
          <div className="flex items-center gap-2 border-r border-slate-800 pr-6">
            <Video className="w-4 h-4 text-sky-400" />
            <span>Active Feeds: <strong className="text-slate-200">4 / 4 Online</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Threat Level: <strong className="text-amber-400">ELEVATED</strong></span>
          </div>
        </div>

        {/* Right Status Block */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-md text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-200 font-mono tracking-wider">{time}</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-md text-xs">
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-slate-300 font-sans font-medium">
              {backendOnline ? 'BACKEND LINKED (PORT 5000)' : 'MOCK ENGINE'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Tactical Workspace */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1920px] mx-auto w-full">
        {/* Left 2 Cols: 4-Channel Camera Grid */}
        <div className="lg:col-span-2 space-y-6">
          <CameraGrid 
            onSelectCamera={(cam) => {
              setSelectedEvent({
                id: `FEED-${cam.id}`,
                timestamp: time,
                camera: cam.id,
                target: cam.threat.split(' ')[0],
                confidence: '94.2%',
                severity: cam.status === 'ALERT' ? 'CRITICAL' : 'LOW',
                zone: cam.name
              });
            }} 
          />
        </div>

        {/* Right 1 Col: Alert Banner, Stats, and Intrusion Event Log */}
        <div className="space-y-4">
          <AlertBanner 
            activeAlert={currentAlert} 
            onAcknowledge={() => setCurrentAlert(null)} 
          />

          <EventLog 
            onSelectEvent={(evt) => setSelectedEvent(evt)} 
          />
        </div>
      </main>

      {/* Detail Forensics Modal */}
      <EventModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </div>
  );
}