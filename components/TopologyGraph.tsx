import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Server, Router, Cpu, Wifi, Monitor, AlertTriangle, CheckCircle, AlertOctagon, XCircle } from 'lucide-react';

interface TopologyGraphProps {
  viewMode?: 'physical' | 'protocol' | 'security';
}

const TopologyGraph: React.FC<TopologyGraphProps> = ({ viewMode = 'physical' }) => {
  const { nodes, edges, selectNode } = useSimulation();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Force-directed simulation mockup (nodes already have coords, but we can animate them slightly)
  // For a true force-directed graph, we'd use d3-force or react-force-graph. 
  // Here we use the existing coordinates but add a float animation.
  
  const getNodeIcon = (type: string, size: number = 24) => {
    switch (type) {
      case 'switch': return <Router size={size} />;
      case 'server': return <Server size={size} />;
      case 'plc': return <Cpu size={size} />;
      case 'wifi': return <Wifi size={size} />;
      case 'hmi': return <Monitor size={size} />;
      default: return <Server size={size} />;
    }
  };

  const getStatusColor = (status: string, node: any) => {
    // X-Ray Filters: Security View
    if (viewMode === 'security') {
        const isSecure = !['backup_svr', 'wifi_ap'].includes(node.id); // Mock logic for security
        if (status === 'critical' || status === 'warning') return 'text-neon-rose border-neon-rose shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse';
        return isSecure 
            ? 'text-emerald-500 border-emerald-900 bg-emerald-950/30' 
            : 'text-amber-500 border-amber-900 bg-amber-950/30 animate-pulse'; // Highlight potentially insecure nodes
    }

    switch (status) {
      case 'healthy': return 'text-neon-green border-neon-green shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      case 'warning': return 'text-neon-amber border-neon-amber shadow-[0_0_15px_rgba(245,158,11,0.3)]';
      case 'critical': return 'text-neon-rose border-neon-rose shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse';
      case 'offline': return 'text-slate-500 border-slate-600 bg-slate-800/50 grayscale';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  // Special Highlight for Critical/Offline Nodes (Automatic "Pointing")
  const renderFaultIndicator = (node: any) => {
      if (node.status === 'critical' || node.status === 'offline') {
          return (
              <div className="absolute inset-0 z-0 pointer-events-none">
                  {/* Ping Animation */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-rose-500 rounded-full animate-ping opacity-20"></div>
                  {/* Target Reticle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-dashed border-rose-500 rounded-full animate-spin opacity-60" style={{ animationDuration: '3s' }}></div>
                  {/* Label */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-rose-950/90 text-rose-300 text-[10px] px-2 py-0.5 rounded border border-rose-500/50 whitespace-nowrap animate-bounce">
                      FAULT DETECTED
                  </div>
              </div>
          );
      }
      return null;
  };

  const getEdgeStyle = (status: string, edge: any) => {
    // X-Ray Filters: Protocol View
    if (viewMode === 'protocol') {
        // Mock protocol coloring
        if (edge.source === 'robot_plc' || edge.target === 'robot_plc') return 'stroke-purple-500 stroke-[3] stroke-dasharray-2 opacity-80'; // Profinet
        if (edge.target === 'wifi_ap') return 'stroke-cyan-400 stroke-[2] stroke-dasharray-4 opacity-60'; // Wireless
        return 'stroke-slate-700 stroke-[1] opacity-20'; // Background noise
    }
    
    // X-Ray Filters: Physical View (Highlight breaks)
    if (viewMode === 'physical') {
        if (status === 'critical' || status === 'offline') return 'stroke-rose-600 stroke-[4] animate-pulse';
        return 'stroke-slate-600 stroke-2';
    }

    switch (status) {
      case 'active': return 'stroke-slate-600 stroke-2';
      case 'high-traffic': return 'stroke-neon-amber stroke-[3]';
      case 'degraded': return 'stroke-neon-amber stroke-2 stroke-dasharray-4';
      case 'critical': return 'stroke-neon-rose stroke-[3] stroke-dasharray-4 animate-dash';
      default: return 'stroke-slate-700';
    }
  };

  return (
    <div className="relative w-full h-full bg-[#050a10] overflow-hidden rounded-xl border border-slate-800 shadow-inner">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <svg className="w-full h-full absolute inset-0 pointer-events-none">
        {edges.map((edge) => {
            const source = nodes.find(n => n.id === edge.source);
            const target = nodes.find(n => n.id === edge.target);
            if (!source || !target) return null;

            return (
              <g key={edge.id}>
                 {edge.status === 'critical' && (
                    <line 
                      x1={source.x} y1={source.y} 
                      x2={target.x} y2={target.y} 
                      className="stroke-neon-rose stroke-[6] opacity-20 blur-sm"
                    />
                 )}
                 <line
                    x1={source.x} y1={source.y}
                    x2={target.x} y2={target.y}
                    className={getEdgeStyle(edge.status, edge)}
                 />
                 {(edge.status === 'active' || edge.status === 'high-traffic') && (viewMode !== 'physical') && (
                    <circle r="3" fill={edge.status === 'high-traffic' ? '#fbbf24' : '#fff'} className="animate-ping">
                      <animateMotion dur={`${edge.latency * 20}ms`} repeatCount="indefinite"
                        path={`M${source.x},${source.y} L${target.x},${target.y}`} />
                    </circle>
                 )}
              </g>
            );
        })}
      </svg>

      {nodes.map((node) => (
        <div
          key={node.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 hover:scale-110`}
          style={{ left: node.x, top: node.y }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={() => selectNode(node.id)}
        >
          {renderFaultIndicator(node)}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/80 border border-slate-700 
              ${node.status === 'critical' ? 'text-neon-rose' : node.status === 'offline' ? 'text-slate-500' : 'text-slate-300'}`}>
              {node.name}
            </span>
          </div>

          <div className={`w-12 h-12 rounded-full bg-cyber-slate border-2 flex items-center justify-center transition-all ${getStatusColor(node.status, node)}`}>
            {getNodeIcon(node.type)}
          </div>

          <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5">
             {node.status === 'healthy' && <CheckCircle size={14} className="text-neon-green fill-black" />}
             {node.status === 'warning' && <AlertOctagon size={14} className="text-neon-amber fill-black" />}
             {node.status === 'critical' && <AlertTriangle size={14} className="text-neon-rose fill-black" />}
             {node.status === 'offline' && <XCircle size={14} className="text-slate-500 fill-black" />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopologyGraph;
