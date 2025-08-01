from langchain.tools import BaseTool
from typing import Type, Optional, Dict, Any, List
from pydantic import BaseModel, Field
import structlog
from app.core.config import settings

logger = structlog.get_logger()

class EquipmentQueryInput(BaseModel):
    """Input for equipment query tool"""
    fab: Optional[str] = Field(description="Fab code (M14, M15, M16)")
    equipment_id: Optional[str] = Field(description="Specific equipment ID")
    status: Optional[str] = Field(description="Equipment status filter")
    limit: int = Field(default=100, description="Maximum number of results")

class EquipmentStatusTool(BaseTool):
    """Tool for querying equipment status information"""
    name = "equipment_status_query"
    description = "Query real-time equipment status and performance metrics"
    args_schema: Type[BaseModel] = EquipmentQueryInput

    def _run(self, fab: Optional[str] = None, equipment_id: Optional[str] = None, 
             status: Optional[str] = None, limit: int = 100) -> str:
        """Execute the equipment status query"""
        try:
            # Mock equipment data
            mock_equipment = [
                {
                    "equipment_id": "LITHO-001",
                    "equipment_name": "Lithography Scanner A",
                    "fab": "M14",
                    "status": "running",
                    "current_operation": "Exposure",
                    "current_lot": "LOT001",
                    "utilization": 85,
                    "temperature": 23.5,
                    "pressure": 1.2,
                    "uptime": "168시간",
                    "alerts": 0
                },
                {
                    "equipment_id": "ETCH-002", 
                    "equipment_name": "Etching System B",
                    "fab": "M15",
                    "status": "error",
                    "current_operation": "Maintenance",
                    "current_lot": None,
                    "utilization": 45,
                    "temperature": 25.8,
                    "pressure": 0.9,
                    "uptime": "72시간",
                    "alerts": 3
                },
                {
                    "equipment_id": "DEP-003",
                    "equipment_name": "Deposition Chamber C", 
                    "fab": "M16",
                    "status": "maintenance",
                    "current_operation": "Scheduled PM",
                    "current_lot": None,
                    "utilization": 0,
                    "temperature": 22.1,
                    "pressure": 1.0,
                    "uptime": "0시간",
                    "alerts": 0
                },
                {
                    "equipment_id": "CMP-001",
                    "equipment_name": "CMP Polisher A",
                    "fab": "M14", 
                    "status": "idle",
                    "current_operation": None,
                    "current_lot": None,
                    "utilization": 65,
                    "temperature": 24.2,
                    "pressure": 1.1,
                    "uptime": "120시간",
                    "alerts": 1
                }
            ]
            
            # Filter results
            filtered_equipment = mock_equipment
            
            if fab:
                filtered_equipment = [eq for eq in filtered_equipment if eq["fab"] == fab.upper()]
            
            if equipment_id:
                filtered_equipment = [eq for eq in filtered_equipment if eq["equipment_id"] == equipment_id.upper()]
                
            if status:
                filtered_equipment = [eq for eq in filtered_equipment if eq["status"] == status.lower()]
            
            filtered_equipment = filtered_equipment[:limit]
            
            if not filtered_equipment:
                return "No equipment found matching the criteria"
            
            result = f"Found {len(filtered_equipment)} equipment records:\n"
            for eq in filtered_equipment:
                result += f"- {eq['equipment_id']}: {eq['equipment_name']} ({eq['fab']}) - {eq['status']}, {eq['utilization']}% 가동률"
                if eq['current_lot']:
                    result += f", 처리중: {eq['current_lot']}"
                if eq['alerts'] > 0:
                    result += f", 알람: {eq['alerts']}개"
                result += "\n"
            
            logger.info("Equipment status query completed", count=len(filtered_equipment))
            return result
            
        except Exception as e:
            logger.error("Error in equipment status query", error=str(e))
            return f"Error querying equipment status: {str(e)}"

class EquipmentHistoryTool(BaseTool):
    """Tool for querying equipment operation history"""
    name = "equipment_history_query"
    description = "Query historical equipment operation and maintenance records"
    args_schema: Type[BaseModel] = EquipmentQueryInput

    def _run(self, fab: Optional[str] = None, equipment_id: Optional[str] = None, 
             status: Optional[str] = None, limit: int = 100) -> str:
        """Execute the equipment history query"""
        try:
            # Mock historical data
            mock_history = [
                {
                    "equipment_id": "LITHO-001",
                    "operation": "Exposure",
                    "fab": "M14",
                    "start_time": "2024-08-01 09:00:00",
                    "end_time": "2024-08-01 11:30:00", 
                    "duration": "2시간 30분",
                    "lot_number": "LOT001",
                    "result": "정상 완료"
                },
                {
                    "equipment_id": "ETCH-002",
                    "operation": "Dry Etch",
                    "fab": "M15",
                    "start_time": "2024-08-01 10:15:00",
                    "end_time": "2024-08-01 14:45:00",
                    "duration": "4시간 30분",
                    "lot_number": "LOT002", 
                    "result": "지연 완료"
                },
                {
                    "equipment_id": "DEP-003",
                    "operation": "CVD",
                    "fab": "M16",
                    "start_time": "2024-08-01 11:00:00",
                    "end_time": None,
                    "duration": "진행중",
                    "lot_number": "LOT003",
                    "result": "진행중 (오류 발생)"
                }
            ]
            
            # Filter results
            filtered_history = mock_history
            
            if fab:
                filtered_history = [h for h in filtered_history if h["fab"] == fab.upper()]
            
            if equipment_id:
                filtered_history = [h for h in filtered_history if h["equipment_id"] == equipment_id.upper()]
            
            filtered_history = filtered_history[:limit]
            
            if not filtered_history:
                return "No equipment history found matching the criteria"
            
            result = f"Found {len(filtered_history)} equipment history records:\n"
            for hist in filtered_history:
                result += f"- {hist['equipment_id']}: {hist['operation']} ({hist['fab']}) - {hist['duration']}"
                if hist['lot_number']:
                    result += f", LOT: {hist['lot_number']}"
                result += f", {hist['result']}\n"
            
            logger.info("Equipment history query completed", count=len(filtered_history))
            return result
            
        except Exception as e:
            logger.error("Error in equipment history query", error=str(e))
            return f"Error querying equipment history: {str(e)}"

class EquipmentAlertTool(BaseTool):
    """Tool for querying equipment alerts and issues"""
    name = "equipment_alert_query"
    description = "Query current equipment alerts, alarms, and maintenance needs"
    args_schema: Type[BaseModel] = EquipmentQueryInput

    def _run(self, fab: Optional[str] = None, equipment_id: Optional[str] = None, 
             status: Optional[str] = None, limit: int = 100) -> str:
        """Execute the equipment alert query"""
        try:
            # Mock alert data
            mock_alerts = [
                {
                    "equipment_id": "ETCH-002",
                    "fab": "M15",
                    "alert_type": "ERROR",
                    "message": "가스 압력 이상 (0.9 bar)",
                    "severity": "HIGH",
                    "timestamp": "2024-08-01 14:30:00"
                },
                {
                    "equipment_id": "ETCH-002", 
                    "fab": "M15",
                    "alert_type": "WARNING",
                    "message": "온도 변동 감지",
                    "severity": "MEDIUM",
                    "timestamp": "2024-08-01 14:25:00"
                },
                {
                    "equipment_id": "CMP-001",
                    "fab": "M14",
                    "alert_type": "MAINTENANCE",
                    "message": "소모품 교체 시기 임박",
                    "severity": "LOW", 
                    "timestamp": "2024-08-01 12:00:00"
                }
            ]
            
            # Filter results
            filtered_alerts = mock_alerts
            
            if fab:
                filtered_alerts = [a for a in filtered_alerts if a["fab"] == fab.upper()]
            
            if equipment_id:
                filtered_alerts = [a for a in filtered_alerts if a["equipment_id"] == equipment_id.upper()]
            
            filtered_alerts = filtered_alerts[:limit]
            
            if not filtered_alerts:
                return "No equipment alerts found matching the criteria"
            
            result = f"Found {len(filtered_alerts)} equipment alerts:\n"
            for alert in filtered_alerts:
                result += f"- {alert['equipment_id']} ({alert['fab']}): {alert['alert_type']} - {alert['message']} [심각도: {alert['severity']}]\n"
            
            logger.info("Equipment alert query completed", count=len(filtered_alerts))
            return result
            
        except Exception as e:
            logger.error("Error in equipment alert query", error=str(e))
            return f"Error querying equipment alerts: {str(e)}"