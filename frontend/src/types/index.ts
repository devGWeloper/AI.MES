// Common types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Fab types
export type FabType = 'M14' | 'M15' | 'M16';

// Lot related types
export interface LotData {
  id: string;
  lotNumber: string;
  product: string;
  fab: FabType;
  status: 'completed' | 'in_progress' | 'waiting' | 'error';
  startTime: string;
  endTime?: string;
  step: string;
  equipment: string;
  progress?: number;
  estimatedCompletion?: string;
}

export interface LotHistory extends LotData {
  duration?: string;
  result: 'normal' | 'delayed' | 'error';
}

// Equipment related types
export interface EquipmentData {
  id: string;
  equipmentId: string;
  equipmentName: string;
  fab: FabType;
  status: 'running' | 'idle' | 'maintenance' | 'error';
  currentOperation?: string;
  currentLot?: string;
  utilization: number;
  lastMaintenance: string;
  nextMaintenance: string;
  temperature?: number;
  pressure?: number;
  uptime: string;
  alerts: number;
}

export interface EquipmentHistory {
  id: string;
  equipmentId: string;
  equipmentName: string;
  fab: FabType;
  operation: string;
  startTime: string;
  endTime?: string;
  duration: string;
  status: 'completed' | 'in_progress' | 'error';
  lotNumber?: string;
  result: 'normal' | 'delayed' | 'error';
}

// Return related types
export interface ReturnHistory {
  id: string;
  returnId: string;
  lotNumber: string;
  product: string;
  fab: FabType;
  returnReason: string;
  returnStep: string;
  returnDate: string;
  returnBy: string;
  targetStep: string;
  status: 'resolved' | 'processing' | 'analyzing';
  severity: 'High' | 'Medium' | 'Low';
  resolvedDate?: string;
  comments?: string;
}

// AI related types
export interface AIAnalysisRequest {
  context: string;
  data?: any;
  type: 'lot_analysis' | 'equipment_analysis' | 'return_analysis' | 'status_insights';
}

export interface AIAnalysisResponse {
  analysis: string;
  recommendations?: string[];
  alerts?: string[];
  timestamp: string;
}