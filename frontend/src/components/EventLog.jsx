import React, { useState } from 'react';
import { 
  History, 
  AlertTriangle, 
  Filter, 
  ChevronRight, 
  ExternalLink,
  ShieldAlert,
  UserX,
  Truck,
  Dog
} from 'lucide-react';

const INITIAL_EVENTS = [
  { id: 'EVT-4091', timestamp: '17:24:02', camera: 'CAM-01', target: 'Person', confidence: '95.4%', severity: 'CRITICAL', zone: 'Perimeter Alpha' },
  { id: 'EVT-4090', timestamp: '17:21:45', camera: 'CAM-03', target: 'Vehicle', confidence: '88.1%', severity: 'HIGH', zone: 'Buffer Zone B' },
  { id: 'EVT-4089', timestamp: '17:15:10', camera: 'CAM-02', target: 'Animal (Wildlife)', confidence: '92.0%', severity: 'LOW', zone: 'Eastern Ridge' },
  { id: 'EVT-4088', timestamp: '16:58:33', camera: 'CAM-01', target: 'Person', confidence: '91.2%', severity: 'HIGH', zone: 'Perimeter Alpha' },
  { id: 'EVT-4087', timestamp: '16:42:19', camera: 'CAM-04', target: 'Person', confidence: '78.5%', severity: 'MEDIUM', zone: 'Gate Beta' },
];

export default function EventLog({ onSelectEvent }) {
  const [filter, setFilter] = useState('ALL');

  const getTargetIcon = (target) => {
    if (target.includes('Person')) return <UserX className="w-3.5 h-3.5 text-red-400" />;
    if (target.includes('Vehicle')) return <Truck className="w-3.5 h-3.5 text-amber-400" />;
    return <Dog className="w-3.5 h-3.5 text-emerald-400" />;
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-950/80 text-red-400 border border-red-500/50">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/40">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-950/80 text-sky-400 border border-sky-500/30">MEDIUM</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400 bg-slate-800">LOW</span>;
    }
  };

  const filteredEvents = INITIAL_EVENTS.filter((e) => {
    if (filter === 'ALL') return true;
    if (filter === 'CRITICAL') return e.severity === 'CRITICAL' || e.severity === 'HIGH';
    return e.target.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg flex flex-col overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-sky-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Intrusion Audit Log
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-[11px]">
          {['ALL', 'CRITICAL', 'Person', 'Vehicle'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-2 py-0.5 rounded transition ${
                filter === item 
                  ? 'bg-sky-600 text-white font-semibold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Event Records List */}
      <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => onSelectEvent && onSelectEvent(evt)}
            className="p-3 hover:bg-slate-800/50 cursor-pointer flex items-center justify-between transition group"
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5">{getTargetIcon(evt.target)}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-200">{evt.target}</span>
                  {getSeverityBadge(evt.severity)}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="text-slate-300 font-semibold">{evt.camera}</span>
                  <span>&bull;</span>
                  <span>{evt.zone}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-400 font-mono">Conf: {evt.confidence}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-slate-500">{evt.timestamp}</span>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition transform group-hover:translate-x-0.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/60 text-[10px] text-slate-500 flex justify-between items-center">
        <span>Displaying {filteredEvents.length} Recent Detections</span>
        <span className="text-sky-400/80">Continuous Edge Sync &bull; OK</span>
      </div>
    </div>
  );
}