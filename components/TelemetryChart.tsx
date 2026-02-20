import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import { Play, Pause, FastForward, Rewind } from 'lucide-react';

const TelemetryChart: React.FC = () => {
  const { telemetry } = useSimulation();
  const [playbackTime, setPlaybackTime] = useState(100);

  return (
    <div className="h-full w-full flex flex-col bg-slate-900/50 backdrop-blur-md border-t border-slate-700">
      <div className="flex justify-between items-center px-4 py-2 border-b border-slate-800">
         <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-rose animate-pulse"></span>
                LIVE TELEMETRY: Switch_Core &lt;-&gt; Robot_PLC
            </h3>
            <div className="flex gap-4 text-[10px] font-mono border-l border-slate-700 pl-4">
                <span className="flex items-center gap-1 text-neon-blue"><span className="w-2 h-2 bg-neon-blue rounded-sm"></span> Latency</span>
                <span className="flex items-center gap-1 text-neon-rose"><span className="w-2 h-2 bg-neon-rose rounded-sm"></span> Packet Loss</span>
                <span className="flex items-center gap-1 text-neon-amber"><span className="w-2 h-2 bg-neon-amber rounded-sm"></span> Jitter</span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mr-2">Telemetry DVR</div>
            <button className="p-1 hover:text-white text-slate-400"><Rewind size={14}/></button>
            <button className="p-1 hover:text-white text-slate-400"><Pause size={14}/></button>
            <button className="p-1 hover:text-white text-neon-green"><Play size={14}/></button>
            <button className="p-1 hover:text-white text-slate-400"><FastForward size={14}/></button>
         </div>
      </div>
      
      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={telemetry} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickMargin={10} />
            <YAxis stroke="#64748b" fontSize={10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            
            <Area 
                type="monotone" 
                dataKey="latency" 
                stroke="#06b6d4" 
                fill="url(#colorLatency)" 
                strokeWidth={2}
                name="Latency (ms)"
                isAnimationActive={false}
            />
            <Area 
                type="step" 
                dataKey="packetLoss" 
                stroke="#f43f5e" 
                fill="transparent" 
                strokeWidth={2}
                name="Packet Loss (%)"
                isAnimationActive={false}
            />
             <Area 
                type="monotone" 
                dataKey="jitter" 
                stroke="#f59e0b" 
                fill="transparent"
                strokeWidth={1}
                strokeDasharray="4 4"
                name="Jitter (ms)"
                isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="h-8 bg-slate-900 border-t border-slate-800 flex items-center px-4 gap-4">
        <span className="text-[10px] font-mono text-slate-500">HISTORY</span>
        <input 
            type="range" 
            min="0" 
            max="100" 
            value={playbackTime} 
            onChange={(e) => setPlaybackTime(parseInt(e.target.value))}
            className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-green"
        />
        <span className="text-[10px] font-mono text-slate-500">LIVE</span>
      </div>
    </div>
  );
};

export default TelemetryChart;
