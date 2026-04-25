export type OrderStatus =
  | 'draft'
  | 'queued'
  | 'transmitting'
  | 'delivered'
  | 'acknowledged'
  | 'delayed'
  | 'failed'
  | 'completed';

export type Priority = 'critical' | 'high' | 'normal' | 'low';

export type Posture =
  | 'attack'
  | 'defend'
  | 'withdraw'
  | 'delay'
  | 'hold'
  | 'recon'
  | 'support';

export interface CommanderIntent {
  objective: string;
  commander'sIntent: string;
  endState: string;
  acceptableRisk?: string;
  constraints?: string[];
  coordinatingInstructions?: string[];
}

export interface Order {
  id: string;
  fromHqId: string;
  toUnitId: string;
  issuedAt: number;
  eta?: number;
  priority: Priority;
  posture: Posture;
  status: OrderStatus;
  intent: CommanderIntent;
  route?: string[];
  payload?: Record<string, unknown>;
  retries?: number;
  reliability?: number;
  notes?: string;
}

export interface Report {
  id: string;
  orderId?: string;
  fromUnitId: string;
  toHqId: string;
  timestamp: number;
  type: 'spotrep' | 'sitrep' | 'contact' | 'cas-request' | 'fire-mission' | 'status';
  summary: string;
  details?: Record<string, unknown>;
  priority?: Priority;
  acknowledged?: boolean;
}
