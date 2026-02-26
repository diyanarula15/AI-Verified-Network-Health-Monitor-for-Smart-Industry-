import { NetworkNode, NetworkEdge, TelemetryPoint, InsightCard } from './types';

// Network Topology Data
export const INITIAL_NODES: NetworkNode[] = [
  {
    id: 'core_sw',
    name: 'Switch_Core_01',
    type: 'switch',
    status: 'healthy',
    x: 400,
    y: 100,
    details: { ip: '192.168.10.1', mac: '00:1B:44:11:3A:B7', uptime: '45d 12h', firmware: 'Hirschmann HiOS 8.2', vendor: 'Hirschmann', location: 'Server Room A' }
  },
  {
    id: 'historian',
    name: 'Server_Historian',
    type: 'server',
    status: 'healthy',
    x: 150,
    y: 100,
    details: { ip: '192.168.10.5', mac: '00:1B:44:88:99:AA', uptime: '120d 4h', firmware: 'Win Svr 2019', vendor: 'Dell EMC', location: 'Rack 4, U10' }
  },
  {
    id: 'dist_sw_a',
    name: 'Switch_Dist_A',
    type: 'switch',
    status: 'healthy',
    x: 250,
    y: 250,
    details: { ip: '192.168.20.1', mac: '00:1B:44:22:4C:D8', uptime: '45d 11h', firmware: 'Hirschmann HiOS 8.2', vendor: 'Hirschmann', location: 'Zone B, Cabinet 2' }
  },
  {
    id: 'robot_plc',
    name: 'Robot_PLC_Cell_2',
    type: 'plc',
    status: 'healthy', // Initial status healthy, injector will modify
    x: 550,
    y: 250,
    details: { ip: '192.168.20.55', mac: '00:0E:CF:55:12:33', uptime: '2d 4h', firmware: 'Siemens S7-1500 v2.8', vendor: 'Siemens', location: 'Assembly Cell 2' }
  },
  {
    id: 'wifi_ap',
    name: 'WiFi_AP_ZoneB',
    type: 'wifi',
    status: 'healthy',
    x: 700,
    y: 150,
    details: { ip: '192.168.30.10', mac: '00:40:96:XX:YY:ZZ', uptime: '12d 1h', firmware: 'Cisco IOS-XE', vendor: 'Cisco', location: 'Zone B Ceiling' }
  },
  {
    id: 'hmi_line',
    name: 'HMI_Line_1',
    type: 'hmi',
    status: 'healthy',
    x: 250,
    y: 380,
    details: { ip: '192.168.20.101', mac: '00:0F:23:44:55:66', uptime: '5d 22h', firmware: 'TP1200 Comfort', vendor: 'Siemens', location: 'Line 1 Operator Station' }
  },
  {
    id: 'backup_svr',
    name: 'Backup_Server',
    type: 'server',
    status: 'healthy', 
    x: 100,
    y: 250,
    details: { ip: '192.168.10.6', mac: '00:1B:44:88:99:BB', uptime: '10d 2h', firmware: 'Win Svr 2019', vendor: 'Dell EMC', location: 'Rack 4, U12' }
  }
];

export const INITIAL_EDGES: NetworkEdge[] = [
  { id: 'e1', source: 'historian', target: 'core_sw', status: 'active', latency: 8, bandwidth: 950 }, 
  { id: 'e2', source: 'core_sw', target: 'dist_sw_a', status: 'active', latency: 4, bandwidth: 400 },
  { id: 'e3', source: 'core_sw', target: 'robot_plc', status: 'active', latency: 150, bandwidth: 10 }, 
  { id: 'e4', source: 'core_sw', target: 'wifi_ap', status: 'active', latency: 12, bandwidth: 54 },
  { id: 'e5', source: 'dist_sw_a', target: 'hmi_line', status: 'active', latency: 5, bandwidth: 100 },
  { id: 'e6', source: 'backup_svr', target: 'historian', status: 'active', latency: 0, bandwidth: 0 },
];

// Initial Telemetry Data (Static Story Timeline)
export const generateTelemetryData = (): TelemetryPoint[] => {
  const data: TelemetryPoint[] = [];
  
  // Create a fixed timeline around 10:42:00
  const baseTime = new Date();
  baseTime.setHours(10, 41, 45, 0); 

  for (let i = 0; i < 40; i++) {
    const time = new Date(baseTime.getTime() + i * 1000);
    const timeString = time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    data.push({
      time: timeString,
      latency: 10 + Math.random() * 5,
      packetLoss: Math.random() * 0.5,
      throughput: 850 + Math.random() * 100,
      jitter: 2 + Math.random() * 2, 
      errors: 0 
    });
  }
  return data;
};

// Initial Insights - Empty now, controlled by Simulation Context
export const INITIAL_INSIGHTS: InsightCard[] = [];
