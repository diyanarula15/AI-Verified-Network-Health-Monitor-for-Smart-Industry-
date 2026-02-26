import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopologyGraph from './TopologyGraph';
import TelemetryChart from './TelemetryChart';
import InsightPanel from './InsightPanel';
import DigitalTwinModal from './DigitalTwinModal';
import { Wifi, ChevronDown, LogOut, Activity, Layers, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

interface OperatorDashboardProps {
  lineId: string;
  onLogout: () => void;
}

const OperatorDashboard: React.FC<OperatorDashboardProps> = ({ lineId, onLogout }) => {
  const { globalHealth, insights } = useSimulation();
  const [viewMode, setViewMode] = useState<'physical' | 'protocol' | 'security'>('physical');
  const [activeAction, setActiveAction] = useState<any>(null);

  useEffect(() => {
    // Find the high-priority action that needs approval
    const action = insights.find(i => i.type === 'action' && i.actionRequired);
    setActiveAction(action);
  }, [insights]);

  return (
    <div className="flex h-screen w-full bg-cyber-black text-slate-200 overflow-hidden font-sans relative">
        <DigitalTwinModal />
        
        {/* ACTIVE RESPONSE OVERLAY */}
        {activeAction && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-10 fade-in duration-500 w-auto">
            <div className="bg-slate-900/95 backdrop-blur-xl border-l-4 border-neon-blue rounded-r-lg shadow-2xl p-6 flex flex-col gap-4 max-w-2xl ring-1 ring-white/10">
              <div className="flex items-start justify-between gap-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-neon-blue/10 rounded-full h-12 w-12 flex items-center justify-center animate-pulse">
                    <ShieldCheck className="text-neon-blue w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide font-mono flex items-center gap-2">
                      <span className="text-neon-blue">AI INTERVENTION REQUIRED</span>
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] rounded border border-rose-500/30">CRITICAL</span>
                    </h3>
                    <p className="text-slate-300 text-sm mt-1 leading-relaxed max-w-lg">
                      {activeAction.content}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2 pl-16">
                 {/* Visual indicator of the test being staged */}
                 <div className="flex-1 flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Activity size={14} className="animate-pulse text-neon-green" />
                    TDR DIAGNOSTIC PRE-LOADED ON SWITCH
                 </div>

                 <button 
                   onClick={() => activeAction.onAction && activeAction.onAction()}
                   className="bg-neon-blue hover:bg-blue-500 text-slate-900 font-bold py-2.5 px-6 rounded shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
                 >
                   <CheckCircle2 size={18} />
                   AUTHORIZE 1-CLICK TEST
                 </button>
              </div>
            </div>
            
            {/* Connecting line to the map center (visual flair) */}
            <div className="h-8 w-0.5 bg-gradient-to-b from-neon-blue/50 to-transparent mx-auto"></div>
          </div>
        )}

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
