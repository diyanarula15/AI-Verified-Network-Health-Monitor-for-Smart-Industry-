import React from 'react';
import { ChevronRight, Server, Box, Layers, ArrowLeft } from 'lucide-react';

interface LineSelectionProps {
  onSelectLine: (lineId: string) => void;
  onBack: () => void;
  role: 'operator' | 'injector';
}

const LineSelection: React.FC<LineSelectionProps> = ({ onSelectLine, onBack, role }) => {
  const themeColor = role === 'operator' ? 'text-neon-blue' : 'text-neon-rose';
  const borderColor = role === 'operator' ? 'hover:border-neon-blue' : 'hover:border-neon-rose';

  const lines = [
    { id: 'zone_a', name: 'Zone A: Assembly Line', active: true, nodes: 45, alert: false },
    { id: 'zone_b', name: 'Zone B: Paint Shop', active: true, nodes: 12, alert: true }, // The active simulation line
    { id: 'zone_c', name: 'Zone C: Packaging', active: false, nodes: 28, alert: false },
  ];

  return (
    <div className="min-h-screen w-full bg-cyber-black flex flex-col items-center justify-center p-6 relative">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-mono text-sm">BACK TO PORTAL</span>
      </button>

      <div className="max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-white mb-2">Select Production Environment</h2>
        <p className="text-slate-400 mb-10">Choose a target zone to {role === 'operator' ? 'monitor' : 'infiltrate'}.</p>

        <div className="grid gap-4">
          {lines.map((line) => (
            <button
              key={line.id}
              onClick={() => line.active && onSelectLine(line.id)}
              disabled={!line.active}
              className={`w-full flex items-center justify-between p-6 bg-slate-900/50 border border-slate-700 rounded-xl transition-all duration-200 group ${
                line.active ? `${borderColor} hover:bg-slate-800` : 'opacity-50 cursor-not-allowed grayscale'
              }`}
            >
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-slate-800 ${line.alert ? 'animate-pulse' : ''}`}>
                    {line.id === 'zone_a' && <Layers className="text-slate-400" />}
                    {line.id === 'zone_b' && <Server className={line.alert && role === 'operator' ? 'text-neon-amber' : 'text-neon-green'} />}
                    {line.id === 'zone_c' && <Box className="text-slate-400" />}
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white group-hover:text-white flex items-center gap-3">
                    {line.name}
                    {line.alert && role === 'operator' && (
                        <span className="text-[10px] bg-neon-amber/20 text-neon-amber px-2 py-0.5 rounded border border-neon-amber/30 font-mono">
                            WARNINGS DETECTED
                        </span>
                    )}
                     {line.alert && role === 'injector' && (
                        <span className="text-[10px] bg-neon-green/20 text-neon-green px-2 py-0.5 rounded border border-neon-green/30 font-mono">
                            ACTIVE TARGET
                        </span>
                    )}
                  </h3>
                  <p className="text-sm text-slate-500 font-mono mt-1">
                    {line.nodes} ACTIVE NODES | IP RANGE: 192.168.{line.id === 'zone_a' ? '10' : line.id === 'zone_b' ? '20' : '30'}.x
                  </p>
                </div>
              </div>
              
              <div className="text-slate-600 group-hover:text-white transition-colors">
                 <ChevronRight size={24} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineSelection;
