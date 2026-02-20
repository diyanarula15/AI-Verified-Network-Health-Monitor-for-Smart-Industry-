import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopologyGraph from './TopologyGraph';
import TelemetryChart from './TelemetryChart';
import InsightPanel from './InsightPanel';
import DigitalTwinModal from './DigitalTwinModal';
import { Wifi, ChevronDown, LogOut, Eye, Layers, ShieldCheck, Activity } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

interface OperatorDashboardProps {
  lineId: string;
  onLogout: () => void;
}

const OperatorDashboard: React.FC<OperatorDashboardProps> = ({ lineId, onLogout }) => {
  const { globalHealth } = useSimulation();
  const [viewMode, setViewMode] = useState<'physical' | 'protocol' | 'security'>('physical');

  return (
    <div className="flex h-screen w-full bg-cyber-black text-slate-200 overflow-hidden font-sans">
        <DigitalTwinModal />
        <Sidebar />

        <main className="flex-1 flex flex-col min-w-0 relative">
            {/* Top Header */}
            <header className="h-14 border-b border-slate-800 bg-cyber-slate/50 backdrop-blur px-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold tracking-tight text-white">FACTORY_01_NET</h1>
                    <div className="h-4 w-px bg-slate-700 mx-2"></div>
                    <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors border border-slate-700">
                        {lineId === 'zone_b' ? 'Zone B: Paint Shop' : 'Zone A: Assembly'}
                        <ChevronDown size={14} className="text-slate-500" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-400 font-mono">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Global Health</span>
                    <span className={`text-lg font-bold leading-none ${globalHealth > 80 ? 'text-neon-green' : globalHealth > 50 ? 'text-neon-amber' : 'text-neon-rose'}`}>
                        {globalHealth}% HEALTHY
                    </span>
                </div>
                
                <div className="h-8 w-px bg-slate-800"></div>

                <div className="flex items-center gap-2">
                    <Wifi size={14} className="text-slate-500"/>
                    <span className="text-xs">Signal Floor: -85dBm</span>
                </div>

                <div className="h-8 w-px bg-slate-800"></div>
                
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Disconnect Session"
                >
                   <LogOut size={18} />
                </button>
            </div>
            </header>

            <div className="flex-1 flex flex-col relative">
            
            {/* X-Ray Controls */}
            <div className="absolute top-4 right-4 z-20 flex bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-1 gap-1 shadow-xl">
                <button 
                  onClick={() => setViewMode('physical')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${viewMode === 'physical' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <Activity size={14} /> PHYSICAL
                </button>
                <button 
                  onClick={() => setViewMode('protocol')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${viewMode === 'protocol' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <Layers size={14} /> PROTOCOL
                </button>
                <button 
                  onClick={() => setViewMode('security')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${viewMode === 'security' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <ShieldCheck size={14} /> SECURITY
                </button>
            </div>

            <div className="flex-1 p-4 relative">
                <TopologyGraph viewMode={viewMode} />
            </div>
            <div className="h-64 border-t border-slate-800 z-10">
                <TelemetryChart />
            </div>
            </div>
        </main>

        <InsightPanel />
    </div>
  );
};

export default OperatorDashboard;
