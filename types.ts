import { LucideIcon } from 'lucide-react';

export interface NetworkNode {
  id: string;
  name: string;
  type: 'server' | 'switch' | 'plc' | 'wifi' | 'hmi';
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  x: number;
  y: number;
  details: {
    ip: string;
    mac: string;
    uptime: string;
    firmware: string;
    vendor: string; // Added vendor
    location: string; // Added location
  };
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  status: 'active' | 'degraded' | 'critical' | 'high-traffic';
  latency: number; // ms
  bandwidth: number; // Mbps
}

export interface TelemetryPoint {
  time: string;
  latency: number;
  packetLoss: number;
  throughput: number;
  jitter: number;
  errors: number;
}

export interface InsightCard {
  id: string;
  type: 'alert' | 'verification' | 'action' | 'info' | 'prediction';
  title: string;
  content: string;
  timestamp: string;
  loading?: boolean; // For "Active Verification" state
  actionRequired?: boolean; // For approval button
  onAction?: () => void; // Function to execute
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

// Simulation Types
export type FaultLayer = 'L1' | 'L2' | 'L3' | 'L7';

export interface SimulationState {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  telemetry: TelemetryPoint[];
  insights: InsightCard[];
  activeFaults: string[]; // List of active fault IDs
  globalHealth: number;
  injectFault: (layer: FaultLayer | 'ROOT_CAUSE', targetId: string, faultType: string) => void;
  resetSimulation: () => void;
  selectedNode: NetworkNode | null;
  selectNode: (nodeId: string | null) => void;
}