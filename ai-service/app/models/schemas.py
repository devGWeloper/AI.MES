from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime

class AnalysisRequest(BaseModel):
    context: str
    data: Optional[Dict[str, Any]] = None
    type: str  # lot_analysis, equipment_analysis, return_analysis, status_insights
    fab: Optional[str] = None

class AnalysisResponse(BaseModel):
    analysis: str
    recommendations: Optional[List[str]] = None
    alerts: Optional[List[str]] = None
    timestamp: datetime

class HealthResponse(BaseModel):
    status: str
    message: str
    version: str

class LotData(BaseModel):
    id: str
    lot_number: str
    product: str
    fab: str
    status: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    step: str
    equipment: str
    progress: Optional[int] = None
    estimated_completion: Optional[datetime] = None

class EquipmentData(BaseModel):
    id: str
    equipment_id: str
    equipment_name: str
    fab: str
    status: str
    current_operation: Optional[str] = None
    current_lot: Optional[str] = None
    utilization: int
    temperature: Optional[float] = None
    pressure: Optional[float] = None
    alerts: int

class ReturnData(BaseModel):
    id: str
    return_id: str
    lot_number: str
    product: str
    fab: str
    return_reason: str
    return_step: str
    return_date: datetime
    status: str
    severity: str