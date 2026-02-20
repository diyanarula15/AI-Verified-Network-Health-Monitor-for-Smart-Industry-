import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Zap, Activity, Wifi, Server, ShieldAlert, RefreshCw, LogOut, Network, AlertOctagon } from 'lucide-react';

interface InjectorPanelProps {
    onLogout?: () => void;
    lineId?: string;
}

const InjectorPanel: React.FC<InjectorPanelProps> = ({ onLogout, lineId }) => {
  const { nodes, injectFault, resetSimulation, activeFaults } = useSimulation();
  const [selectedTarget, setSelectedTarget] = useState<string>(nodes[3].id); 

  const targets = nodes.filter(n => n.type !== 'wifi'); 

  return (
    <div className="w-full h-full bg-cyber-black p-8 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900/10 via-cyber-black to-cyber-black pointer-events-none"></div>

      <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
          >
              <LogOut size={16} />
              <span className="font-mono text-xs font-bold">DISCONNECT</span>
          </button>
      </div>

      <div className="max-w-6xl w-full z-10">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 tracking-tighter mb-2">
                CHAOS ENGINE v1.0
            </h1>
            <p className="text-slate-500 font-mono text-sm">
                NETWORK ADVERSARY SIMULATION CONSOLE 
                {lineId && <span className="text-slate-400 border-l border-slate-700 pl-2 ml-2">TARGET: {lineId.toUpperCase().replace('_', ' ')}</span>}
            </p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-rose-900/30 rounded-2xl p-8 shadow-2xl">
            
            {/* Target Selection */}
            <div className="mb-8 flex items-center justify-center gap-4">
                <label className="text-slate-400 font-mono text-sm">TARGET ASSET:</label>
                <select 
                    value={selectedTarget}
                    onChange={(e) => setSelectedTarget(e.target.value)}
                    className="bg-slate-800 text-rose-100 border border-rose-900/50 rounded px-4 py-2 font-mono focus:outline-none focus:border-rose-500"
                >
                    {targets.map(n => (
                        <option key={n.id} value={n.id}>{n.name} ({n.details.ip})</option>
                    ))}
                </select>
            </div>

            {/* Injection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                
                {/* L1 Physical */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-widest border-b border-rose-900/50 pb-2">
                        <Zap size={14}/> L1 Physical
                    </div>
                    <button 
                        onClick={() => injectFault('L1', selectedTarget, 'Cable Break')}
                        className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/50 rounded transition-all group"
                    >
                        <div className="text-slate-200 text-sm font-bold group-hover:text-rose-400">Inject Degradation</div>
                        <div className="text-slate-500 text-[10px] font-mono">SNR Drop / CRC Spikes</div>
                    </button>
                </div>

                {/* L2 Data Link */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest border-b border-orange-900/50 pb-2">
                        <Activity size={14}/> L2 Data Link
                    </div>
                    <button 
                        onClick={() => injectFault('L2', selectedTarget, 'Isochronous Jitter')}
                        className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-orange-950/40 border border-slate-700 hover:border-orange-500/50 rounded transition-all group"
                    >
                         <div className="text-slate-200 text-sm font-bold group-hover:text-orange-400">Inject Jitter</div>
                         <div className="text-slate-500 text-[10px] font-mono">Robot Desync Simulation</div>
                    </button>
                </div>

                 {/* L3 Network */}
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest border-b border-blue-900/50 pb-2">
                        <Network size={14}/> L3 Network
                    </div>
                    <button 
                        onClick={() => injectFault('L3', selectedTarget, 'Micro Burst')}
                        className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-blue-950/40 border border-slate-700 hover:border-blue-500/50 rounded transition-all group"
                    >
                         <div className="text-slate-200 text-sm font-bold group-hover:text-blue-400">Trigger Micro-Burst</div>
                         <div className="text-slate-500 text-[10px] font-mono">Bandwidth Spike / Overflow</div>
                    </button>
                </div>

                {/* L7 Application */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase tracking-widest border-b border-purple-900/50 pb-2">
                        <Server size={14}/> L7 Application
                    </div>
                    <button 
                        onClick={() => injectFault('L7', selectedTarget, 'Modbus Exception')}
                        className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-purple-950/40 border border-slate-700 hover:border-purple-500/50 rounded transition-all group"
                    >
                         <div className="text-slate-200 text-sm font-bold group-hover:text-purple-400">Force Timeout</div>
                         <div className="text-slate-500 text-[10px] font-mono">Modbus Write Failure</div>
                    </button>
                </div>

                {/* Additional Faults */}
                <div className="space-y-3 col-span-full border-t border-slate-800 pt-6">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">
                        <AlertOctagon size={14}/> Advanced Threats
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        <button 
                            onClick={() => injectFault('L1', selectedTarget, 'Connection Loss')}
                            className="bg-slate-800 hover:bg-rose-950/20 border border-slate-700 hover:border-rose-500/30 p-3 rounded text-left transition-all"
                        >
                             <div className="text-rose-100/90 text-xs font-bold">Cut Physical Link</div>
                             <div className="text-[9px] text-slate-500 font-mono">Cable Severed</div>
                        </button>
                        <button 
                            onClick={() => injectFault('L7', selectedTarget, 'Firmware Corruption')}
                            className="bg-slate-800 hover:bg-rose-950/20 border border-slate-700 hover:border-rose-500/30 p-3 rounded text-left transition-all"
                        >
                             <div className="text-rose-100/90 text-xs font-bold">Corrupt Firmware</div>
                             <div className="text-[9px] text-slate-500 font-mono">Hash Mismatch</div>
                        </button>
                        <button 
                            onClick={() => injectFault('L3', selectedTarget, 'Unauthorized Access')}
                            className="bg-slate-800 hover:bg-rose-950/20 border border-slate-700 hover:border-rose-500/30 p-3 rounded text-left transition-all"
                        >
                             <div className="text-rose-100/90 text-xs font-bold">Spoof MAC Address</div>
                             <div className="text-[9px] text-slate-500 font-mono">Port Security Trigger</div>
                        </button>
                        <button 
                            onClick={() => injectFault('L2', 'wifi_ap', 'Deauth Flood')}
                            className="bg-slate-800 hover:bg-rose-950/20 border border-slate-700 hover:border-rose-500/30 p-3 rounded text-left transition-all"
                        >
                             <div className="text-rose-100/90 text-xs font-bold">WiFi Deauth Flood</div>
                             <div className="text-[9px] text-slate-500 font-mono">Jamming Signal</div>
                        </button>
                    </div>
                </div>

            </div>

             {/* ROOT CAUSE SCENARIO */}
            <div className="bg-rose-950/10 border border-rose-900/30 rounded-lg p-6 mb-8">
                 <div className="flex items-center gap-2 text-rose-500 font-bold text-sm uppercase tracking-widest mb-4">
                     <AlertOctagon size={16} className="animate-pulse"/> CASCADING FAILURE SCENARIO
                 </div>
                 <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                        <h4 className="text-white font-bold text-sm mb-1">FAIL UPSTREAM SWITCH PORT 4</h4>
                        <p className="text-slate-400 text-xs font-mono">
                            Triggers critical failure on Core Switch. Expected behavior: 50+ Downstream alerts suppressed. Detective Engine should correlate to single root cause.
                        </p>
                    </div>
                    <button 
                         onClick={() => injectFault('ROOT_CAUSE', 'core_sw', 'Port Failure')}
                         className="px-6 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] transition-all transform hover:scale-105 active:scale-95"
                    >
                        INITIATE FAILURE
                    </button>
                 </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center border-t border-slate-800 pt-8">
                 <button 
                    onClick={resetSimulation}
                    className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-neon-green/20 text-slate-300 hover:text-neon-green border border-slate-600 hover:border-neon-green rounded-full transition-all"
                 >
                    <RefreshCw size={16} />
                    RESET SIMULATION
                 </button>
            </div>
            
            {/* Active Faults Monitor */}
            {activeFaults.length > 0 && (
                <div className="mt-8 p-4 bg-rose-950/20 border border-rose-900/50 rounded-lg w-full">
                    <div className="text-rose-500 font-mono text-xs font-bold mb-2 flex items-center gap-2">
                        <ShieldAlert size={14}/> ACTIVE THREAT VECTORS:
                    </div>
                    <div className="space-y-1">
                        {activeFaults.map((f) => (
                            <div key={f} className="text-xs font-mono text-rose-300/70">{'>'} {f}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default InjectorPanel;