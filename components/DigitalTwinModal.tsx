import React from 'react';
import { X, Server, Cpu, Activity, ShieldCheck, Clock, MapPin, Hash, AlertTriangle } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const DigitalTwinModal: React.FC = () => {
  const { selectedNode, selectNode, activeFaults } = useSimulation();

  if (!selectedNode) return null;

  // Simulate Digital Twin Metrics responding to faults
  // If L7 fault (Application logic), CPU spikes. If L1 (Cable), CPU idles (waiting for data).
  const isFaulty = activeFaults.some(f => f.includes(selectedNode.id)) || selectedNode.status !== 'healthy';
  const hasL7Fault = activeFaults.some(f => f.includes('L7') && f.includes(selectedNode.id));
  
  const cpuLoad = hasL7Fault 
    ? 90 + Math.floor(Math.random() * 10) // App freeze/loop
    : isFaulty 
        ? 5 + Math.floor(Math.random() * 5) // Idle/Waiting for network
        : 15 + Math.floor(Math.random() * 10); // Normal

  const temp = hasL7Fault
    ? 75 + Math.floor(Math.random() * 10) // Overheating due to loop
    : 35 + Math.floor(Math.random() * 5); // Normal

  const power = hasL7Fault ? 150 : 45; // Watts

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
       <div className="bg-slate-900 border border-slate-600 w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="h-28 bg-gradient-to-r from-slate-800 to-slate-900 p-6 relative overflow-hidden flex-shrink-0">
             <div className="absolute right-0 top-0 p-4 opacity-10">
                <Cpu size={140} />
             </div>
             <button 
                onClick={() => selectNode(null)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white p-2 z-20"
             >
                <X size={20} />
             </button>
             <h2 className="text-xl font-bold text-white relative z-10">{selectedNode.name}</h2>
             <div className="flex items-center gap-2 mt-2 relative z-10">
                <span className={`w-2.5 h-2.5 rounded-full ${selectedNode.status === 'healthy' ? 'bg-neon-green' : selectedNode.status === 'critical' ? 'bg-neon-rose' : 'bg-neon-amber'} animate-pulse`}></span>
                <span className={`text-xs font-mono font-bold uppercase tracking-wide ${selectedNode.status === 'healthy' ? 'text-neon-green' : selectedNode.status === 'critical' ? 'text-neon-rose' : 'text-neon-amber'}`}>
                    {selectedNode.status} STATUS
                </span>
             </div>
             {isFaulty && (
                 <div className="absolute bottom-2 right-4 flex items-center gap-1 text-neon-rose text-[10px] font-mono font-bold animate-pulse">
                     <AlertTriangle size={12}/> ANOMALY DETECTED
                 </div>
             )}
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto">
             
             {/* Identity Section */}
             <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800 pb-1">DIGITAL IDENTITY</div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                        <div className="flex items-center gap-2 text-slate-400 mb-1"><MapPin size={12}/> <span className="text-[10px] font-mono">LOCATION</span></div>
                        <div className="text-sm font-bold text-slate-200 truncate">{selectedNode.details.location}</div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                         <div className="flex items-center gap-2 text-slate-400 mb-1"><Hash size={12}/> <span className="text-[10px] font-mono">VENDOR</span></div>
                         <div className="text-sm font-bold text-slate-200 truncate">{selectedNode.details.vendor}</div>
                    </div>
                </div>
             </div>

             {/* Tech Specs */}
             <div className="space-y-3 bg-slate-950/30 p-4 rounded-lg border border-slate-800">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">IP Address</span>
                    <span className="text-xs font-mono text-neon-blue">{selectedNode.details.ip}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">MAC Address</span>
                    <span className="text-xs font-mono text-slate-300">{selectedNode.details.mac}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Firmware</span>
                    <span className="text-xs font-mono text-slate-300">{selectedNode.details.firmware}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Uptime</span>
                    <span className="text-xs font-mono text-neon-green">{selectedNode.details.uptime}</span>
                 </div>
             </div>

             {/* Live Metrics */}
             <div className={`rounded-lg p-4 border transition-colors duration-500 ${isFaulty ? 'bg-rose-950/20 border-rose-900/50' : 'bg-slate-950 border-slate-800'}`}>
                 <div className="flex items-center gap-2 text-slate-400 mb-4">
                    <Activity size={14} className={isFaulty ? 'text-neon-rose animate-bounce' : 'text-neon-blue'}/>
                    <span className="text-[10px] font-mono uppercase tracking-widest">LIVE TELEMETRY STREAM</span>
                 </div>
                 <div className="flex justify-between gap-2">
                     <div className="text-center flex-1 bg-slate-900/50 rounded py-2">
                        <div className={`text-xl font-bold ${temp > 60 ? 'text-neon-rose' : 'text-white'}`}>{temp}<span className="text-xs text-slate-500 font-normal">°C</span></div>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">TEMP</div>
                     </div>
                     <div className="text-center flex-1 bg-slate-900/50 rounded py-2">
                        <div className={`text-xl font-bold ${cpuLoad > 80 ? 'text-neon-rose' : 'text-white'}`}>{cpuLoad}<span className="text-xs text-slate-500 font-normal">%</span></div>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">CPU LOAD</div>
                     </div>
                     <div className="text-center flex-1 bg-slate-900/50 rounded py-2">
                        <div className="text-xl font-bold text-white">{power}<span className="text-xs text-slate-500 font-normal">W</span></div>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">POWER</div>
                     </div>
                 </div>
             </div>
             
             <button className="w-full py-3 bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/30 rounded text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-2 group">
                <ShieldCheck size={16} className="group-hover:scale-110 transition-transform"/>
                RUN DEEP DIAGNOSTIC
             </button>

          </div>
       </div>
    </div>
  );
};

export default DigitalTwinModal;