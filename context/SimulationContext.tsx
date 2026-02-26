import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { NetworkNode, NetworkEdge, TelemetryPoint, InsightCard, FaultLayer, SimulationState } from '../types';
import { INITIAL_NODES, INITIAL_EDGES, generateTelemetryData } from '../constants';

const SimulationContext = createContext<SimulationState | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<NetworkEdge[]>(INITIAL_EDGES);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>(generateTelemetryData());
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [activeFaults, setActiveFaults] = useState<string[]>([]);
  const [globalHealth, setGlobalHealth] = useState(98);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  
  // Timeout tracking for simulation sequences
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const startTimeout = (callback: () => void, ms: number) => {
    const id = setTimeout(callback, ms);
    timeoutsRef.current.push(id);
  };

  // HOLISTIC TELEMETRY ENGINE
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const hasL1 = activeFaults.some(f => f.includes('L1')); 
        const hasL2 = activeFaults.some(f => f.includes('L2'));
        const hasL3 = activeFaults.some(f => f.includes('L3')); // Micro-burst
        const hasL7 = activeFaults.some(f => f.includes('L7'));

        let latency = 2 + Math.random() * 2;
        let packetLoss = 0;
        let jitter = 1 + Math.random();
        let throughput = 450 + Math.random() * 50;
        let errors = 0;

        if (hasL1) {
            latency = 120 + Math.random() * 100; 
            packetLoss = 15 + Math.random() * 25; 
            throughput = Math.random() * 10; 
            errors = Math.floor(Math.random() * 5); 
        } else if (hasL2) {
            latency = 45 + Math.random() * 30;
            jitter = 50 + Math.random() * 80; 
            packetLoss = 2 + Math.random() * 5; 
            errors = 20 + Math.floor(Math.random() * 50); 
        } else if (hasL3) {
            // L3 Physics: Micro-burst (Massive throughput spike causing queue drops)
            throughput = 9500 + Math.random() * 500; 
            packetLoss = 5 + Math.random() * 5; // Tail drop
            latency = 250 + Math.random() * 50; // Buffer bloat
        } else if (hasL7) {
            latency = 5 + Math.random() * 5; 
            errors = 1 + Math.floor(Math.random() * 3); 
            throughput = 10 + Math.random() * 100; 
        }

        const newPoint: TelemetryPoint = {
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          latency,
          packetLoss,
          throughput,
          jitter,
          errors
        };
        
        const newData = [...prev, newPoint];
        if (newData.length > 40) newData.shift();
        return newData;
      });
      
      setGlobalHealth(prev => {
         let target = 98;
         if (activeFaults.some(f => f.includes('L1'))) target = 35;
         else if (activeFaults.some(f => f.includes('ROOT_CAUSE'))) target = 20; 
         else if (activeFaults.some(f => f.includes('L7'))) target = 55;
         else if (activeFaults.some(f => f.includes('L2'))) target = 70;
         else if (activeFaults.some(f => f.includes('L3'))) target = 65;
         
         if (prev > target) return Math.max(target, prev - 3); 
         if (prev < target) return Math.min(target, prev + 1); 
         return prev;
      });

    }, 1000); 
    return () => clearInterval(interval);
  }, [activeFaults]);

  const selectNode = (nodeId: string | null) => {
    const node = nodes.find(n => n.id === nodeId);
    setSelectedNode(node || null);
  };

  const resetSimulation = () => {
    // Clear all pending simulation timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Reset everything to initial state (deep clone to avoid reference pollution)
    setNodes(JSON.parse(JSON.stringify(INITIAL_NODES)));
    setEdges(JSON.parse(JSON.stringify(INITIAL_EDGES)));
    setTelemetry(generateTelemetryData());
    setInsights([]);
    setActiveFaults([]);
    setGlobalHealth(98);
    setSelectedNode(null);

    // Broadcast reset to other clients
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'reset', payload: { origin: clientIdRef.current } }));
      }
    } catch (e) {
      // ignore
    }
  };
  // WebSocket client: connect to local broadcaster so Injector <> Operator sync in real-time
  const clientIdRef = useRef<string>((typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `client-${Date.now()}`);
  const wsRef = useRef<WebSocket | null>(null);

  // applyLocalInject contains the existing simulation mutation logic; it is reused both for local-only and when receiving events from the WS server
  const applyLocalInject = (layer: FaultLayer | 'ROOT_CAUSE', targetId: string, faultType: string) => {
    const faultId = `${layer}-${targetId}-${faultType}`;
    setActiveFaults(prev => {
      if (prev.includes(faultId)) return prev;
      return [...prev, faultId];
    });

    const timestamp = () => new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (layer === 'ROOT_CAUSE') {
      setNodes(prev => prev.map(n => {
        if (n.id === 'core_sw') return { ...n, status: 'critical' };
        if (['robot_plc', 'hmi_line', 'wifi_ap'].includes(n.id)) return { ...n, status: 'warning' };
        return n;
      }));

      setEdges(prev => prev.map(e => {
        if (e.source === 'core_sw' || e.target === 'core_sw') return { ...e, status: 'critical', latency: 999 };
        return { ...e, status: 'degraded' };
      }));

      setInsights(prev => [{
        id: `alert-${Date.now()}`, type: 'alert', title: 'WATCHDOG: ANOMALY DETECTED',
        content: `Simultaneous signal loss on 54 downstream assets.`, timestamp: timestamp()
      }, ...prev]);

      startTimeout(() => {
        setInsights(prev => [{
          id: `det-${Date.now()}`, type: 'info', title: 'DETECTIVE ENGINE',
          content: `Correlating 50 Symptoms... Pattern Match Confirmed. ROOT CAUSE: Switch Port 4 Failure.`, timestamp: timestamp()
        }, ...prev]);

        // STAGE THE DIAGNOSTIC TEST IMMEDIATELY (Hypothesis -> Action)
        startTimeout(() => {
             const actionId = `act-req-${Date.now()}`;
             setInsights(prev => [{
                 id: actionId,
                 type: 'action',
                 title: 'SECURE DIAGNOSTIC STAGED', // Action
                 content: 'Hypothesis: Layer 1 Cable Fault. AI has pre-loaded TDR Pulse Test on Hirschmann Switch Port 4. Awaiting secure encoded authorization.',
                 timestamp: timestamp(),
                 actionRequired: true,
                 onAction: () => { // Proof
                     setInsights(currentInternal => {
                         const filtered = currentInternal.filter(c => c.id !== actionId);
                         const verifId = `verif-${Date.now()}`;
                         
                         // Start async process
                         startTimeout(() => {
                              setInsights(verifState => verifState.map(c => {
                                  // Result: Verified Fact
                                  if (c.id === verifId) return { ...c, title: 'VERIFIED FACT', content: 'Open Circuit at 32m. Status: CONFIRMED.', loading: false };
                                  return c;
                              }));
                              
                              startTimeout(() => {
                                  setInsights(finalState => [{ 
                                      id: `rec-${Date.now()}`, 
                                      type: 'action', 
                                      title: 'EXPERT RECOMMENDATION', 
                                      content: `Replace CAT6 uplink cable in Tray 4 (Segment 32m).`, 
                                      timestamp: timestamp() 
                                  }, ...finalState]);
                              }, 1000);
                         }, 2000);

                         return [{ 
                             id: verifId, 
                             type: 'verification', 
                             title: 'EXECUTING SECURE TDR', 
                             content: `Authorized info received. Injecting electrical pulse on Port 4... Measuring reflections...`, 
                             timestamp: timestamp(), 
                             loading: true 
                         }, ...filtered];
                     });
                 }
             }, ...prev]);
        }, 500);

      }, 1500);
      return;
    }

    // Standard faults
    if (layer === 'L1') {
      const isCableFault = faultType === 'Connection Loss' || faultType === 'Degradation';
      setEdges(prev => prev.map(e => (e.target === targetId || e.source === targetId) ? { ...e, status: 'critical' } : e));
      setNodes(prev => prev.map(n => n.id === targetId ? { ...n, status: 'warning' } : n));
      
      // If L1 fault is recognized, STAGE A TEST
      if (isCableFault) {
          startTimeout(() => {
             const actionId = `act-req-l1-${Date.now()}`;
             setInsights(prev => [{
                 id: actionId,
                 type: 'action',
                 title: 'SECURE DIAGNOSTIC STAGED',
                 content: `Hypothesis: Layer 1 Fault on ${targetId}. Action: System automatically staged TDR Pulse Test on upstream Switch. Ready for Authorization.`,
                 timestamp: timestamp(),
                 actionRequired: true,
                 onAction: () => {
                     setInsights(currentInternal => {
                         const filtered = currentInternal.filter(c => c.id !== actionId);
                         const verifId = `verif-l1-${Date.now()}`;
                         
                         startTimeout(() => {
                              setInsights(verifState => verifState.map(c => {
                                  if (c.id === verifId) return { ...c, title: 'VERIFIED FACT', content: `Open Circuit at 32m. Status: CONFIRMED.`, loading: false };
                                  return c;
                              }));
                              
                              startTimeout(() => {
                                  setInsights(finalState => [{ 
                                      id: `rec-l1-${Date.now()}`, 
                                      type: 'action', 
                                      title: 'EXPERT RECOMMENDATION', 
                                      content: `Dispatched maintenance for segment replacement at 32m point.`, 
                                      timestamp: timestamp() 
                                  }, ...finalState]);
                              }, 1000);
                         }, 2000);

                         return [{ 
                             id: verifId, 
                             type: 'verification', 
                             title: 'EXECUTING SECURE TDR', 
                             content: `Authorized info received. Injecting electrical pulse... Measuring reflections...`, 
                             timestamp: timestamp(), 
                             loading: true 
                         }, ...filtered];
                     });
                 }
             }, ...prev]);
          }, 500);
      }
    } else if (layer === 'L2') {
      setEdges(prev => prev.map(e => (e.target === targetId || e.source === targetId) ? { ...e, status: 'degraded' } : e));
    } else if (layer === 'L3') {
      setEdges(prev => prev.map(e => (e.target === targetId || e.source === targetId) ? { ...e, status: 'high-traffic' } : e));
      setNodes(prev => prev.map(n => n.id === targetId ? { ...n, status: 'warning' } : n));
    } else if (layer === 'L7') {
      setNodes(prev => prev.map(n => n.id === targetId ? { ...n, status: 'critical' } : n));
    }

    let alertData = { title: 'ALERT', content: 'Issue detected.' };
    if (layer === 'L1') alertData = { title: 'PHYSICAL LAYER FAULT', content: `Signal Degradation detected. SNR dropped below threshold.` };
    if (layer === 'L2') alertData = { title: 'DATA LINK FAULT', content: `Jitter limit exceeded. Robot synchronization lost.` };
    if (layer === 'L3') alertData = { title: 'NETWORK CONGESTION', content: `Micro-Burst Detected. Buffer overflow on Interface Gi1/0/1.` };
    if (layer === 'L7') alertData = { title: 'APPLICATION FAULT', content: `Modbus Write Timeout. PLC failed to acknowledge safety packet.` };

    // New Fault Types
    let isCable = false;
    if (faultType === 'Connection Loss') { 
        alertData = { title: 'CONNECTION LOST', content: 'Physical link down. Carrier signal lost.' }; 
        setNodes(prev => prev.map(n => n.id === targetId ? { ...n, status: 'offline' } : n)); 
        isCable = true;
    }
    if (faultType === 'Firmware Corruption') { alertData = { title: 'SECURITY ALERT', content: 'Firmware hash mismatch. Possible tampering detected.' }; setNodes(prev => prev.map(n => n.id === targetId ? { ...n, status: 'critical' } : n)); }
    if (faultType === 'Unauthorized Access') { alertData = { title: 'INTRUSION DETECTED', content: 'Unrecognized MAC address on port security violation.' }; setNodes(prev => prev.map(n => n.id === targetId ? { ...n, status: 'critical' } : n)); }

    setInsights(prev => [{ id: `alert-${Date.now()}`, type: 'alert', title: alertData.title, content: alertData.content, timestamp: timestamp() }, ...prev]);

    // IF CABLE FAULT, STAGE TEST
    if (isCable) {
        startTimeout(() => {
             const actionId = `act-cable-${Date.now()}`;
             setInsights(prev => [{
                 id: actionId,
                 type: 'action',
                 title: 'SECURE DIAGNOSTIC STAGED',
                 content: `Hypothesis: Signal loss due to open circuit. Action: TDR Test pre-loaded on Switch Port 7. Awaiting Secure 1-Click Authorization.`,
                 timestamp: timestamp(),
                 actionRequired: true,
                 onAction: () => {
                     setInsights(currentInternal => {
                         const filtered = currentInternal.filter(c => c.id !== actionId);
                         const verifId = `verif-cable-${Date.now()}`;
                         
                         startTimeout(() => {
                              setInsights(verifState => verifState.map(c => {
                                  if (c.id === verifId) return { ...c, title: 'VERIFIED FACT', content: 'Open Circuit at 32m. Status: CONFIRMED.', loading: false };
                                  return c;
                              }));
                              
                              startTimeout(() => {
                                setInsights(finalState => [{ 
                                    id: `rec-c-${Date.now()}`, 
                                    type: 'action', 
                                    title: 'EXPERT RECOMMENDATION', 
                                    content: `Replace CAT6 cable section between Node 2 and Node 3.`, 
                                    timestamp: timestamp() 
                                }, ...finalState]);
                              }, 1000);
                         }, 2500);

                         return [{ 
                             id: verifId, 
                             type: 'verification', 
                             title: 'EXECUTING SECURE TDR', 
                             content: `Authorization verified. Running Active Pulse Diagnostic...`, 
                             timestamp: timestamp(), 
                             loading: true 
                         }, ...filtered];
                     });
                 }
             }, ...prev]);
        }, 1200);
    }
  };

  // Setup WebSocket connection to local broadcast server
  useEffect(() => {
    let mounted = true;
    try {
      const wsUrl = (window as any).__PULSEGUARD_WS_URL || 'ws://localhost:4000';
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mounted) return;
        console.log('SimulationContext: WS connected');
      };

      ws.onmessage = (evt) => {
        try {
          const m = JSON.parse(evt.data);
          if (m?.type === 'injectFault' && m.payload && m.payload.origin !== clientIdRef.current) {
            const { layer, targetId, faultType } = m.payload;
            applyLocalInject(layer, targetId, faultType);
          } else if (m?.type === 'reset' && m.payload && m.payload.origin !== clientIdRef.current) {
             // Remote reset received
             timeoutsRef.current.forEach(clearTimeout);
             timeoutsRef.current = [];
             setNodes(JSON.parse(JSON.stringify(INITIAL_NODES)));
             setEdges(JSON.parse(JSON.stringify(INITIAL_EDGES)));
             setTelemetry(generateTelemetryData());
             setInsights([]);
             setActiveFaults([]);
             setGlobalHealth(98);
             setSelectedNode(null);
          }
        } catch (e) {
          // ignore
        }
      };

      ws.onclose = () => {
        console.log('SimulationContext: WS closed');
      };
    } catch (e) {
      // ignore: environment may block WS
    }
    return () => { mounted = false; if (wsRef.current) wsRef.current.close(); };
  }, []);

  // New public API: injectFault will prefer sending to the server, which broadcasts to all clients.
  const injectFault = (layer: FaultLayer | 'ROOT_CAUSE', targetId: string, faultType: string) => {
    const payload = { type: 'injectFault', payload: { layer, targetId, faultType, origin: clientIdRef.current } };
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
        // apply locally immediately for responsive UI (the broadcast will be ignored by origin check)
        applyLocalInject(layer, targetId, faultType);
        return;
      }
    } catch (e) {
      // fall back to local
    }
    // fallback: no WS
    applyLocalInject(layer, targetId, faultType);
  };

  return (
    <SimulationContext.Provider value={{ 
      nodes, edges, telemetry, insights, activeFaults, globalHealth, 
      injectFault, resetSimulation, selectedNode, selectNode 
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within a SimulationProvider');
  return context;
};