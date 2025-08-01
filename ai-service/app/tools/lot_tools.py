from langchain.tools import BaseTool
from typing import Type, Optional, Dict, Any, List
from pydantic import BaseModel, Field
import structlog
from sqlalchemy import create_engine, text
from app.core.config import settings

logger = structlog.get_logger()

class LotQueryInput(BaseModel):
    """Input for lot query tool"""
    fab: Optional[str] = Field(description="Fab code (M14, M15, M16)")
    lot_number: Optional[str] = Field(description="Specific lot number")
    status: Optional[str] = Field(description="Lot status filter")
    limit: int = Field(default=100, description="Maximum number of results")

class LotStatusTool(BaseTool):
    """Tool for querying lot status information"""
    name = "lot_status_query"
    description = "Query lot status information from the manufacturing database"
    args_schema: Type[BaseModel] = LotQueryInput

    def _get_db_url(self, fab: str) -> str:
        """Get database URL for specific fab"""
        fab_urls = {
            "M14": settings.M14_DB_URL,
            "M15": settings.M15_DB_URL,  
            "M16": settings.M16_DB_URL
        }
        return fab_urls.get(fab.upper(), settings.M14_DB_URL)

    def _run(self, fab: Optional[str] = None, lot_number: Optional[str] = None, 
             status: Optional[str] = None, limit: int = 100) -> str:
        """Execute the lot status query"""
        try:
            # Mock data for development - replace with actual database queries
            mock_lots = [
                {
                    "lot_number": "LOT001",
                    "product": "Product A", 
                    "fab": "M14",
                    "status": "completed",
                    "current_step": "Step 5",
                    "equipment": "EQP-001",
                    "progress": 100
                },
                {
                    "lot_number": "LOT002",
                    "product": "Product B",
                    "fab": "M15", 
                    "status": "in_progress",
                    "current_step": "Step 3",
                    "equipment": "EQP-002",
                    "progress": 45
                },
                {
                    "lot_number": "LOT003",
                    "product": "Product C",
                    "fab": "M16",
                    "status": "waiting",
                    "current_step": "Step 1", 
                    "equipment": "EQP-003",
                    "progress": 12
                }
            ]
            
            # Filter results based on parameters
            filtered_lots = mock_lots
            
            if fab:
                filtered_lots = [lot for lot in filtered_lots if lot["fab"] == fab.upper()]
            
            if lot_number:
                filtered_lots = [lot for lot in filtered_lots if lot["lot_number"] == lot_number.upper()]
                
            if status:
                filtered_lots = [lot for lot in filtered_lots if lot["status"] == status.lower()]
            
            # Limit results
            filtered_lots = filtered_lots[:limit]
            
            if not filtered_lots:
                return "No lots found matching the criteria"
            
            # Format results
            result = f"Found {len(filtered_lots)} lots:\n"
            for lot in filtered_lots:
                result += f"- {lot['lot_number']}: {lot['product']} ({lot['fab']}) - {lot['status']} at {lot['current_step']} ({lot['progress']}%)\n"
            
            logger.info("Lot status query completed", count=len(filtered_lots))
            return result
            
        except Exception as e:
            logger.error("Error in lot status query", error=str(e))
            return f"Error querying lot status: {str(e)}"

class LotHistoryTool(BaseTool):
    """Tool for querying lot history information"""
    name = "lot_history_query"
    description = "Query historical lot processing information"
    args_schema: Type[BaseModel] = LotQueryInput

    def _run(self, fab: Optional[str] = None, lot_number: Optional[str] = None, 
             status: Optional[str] = None, limit: int = 100) -> str:
        """Execute the lot history query"""
        try:
            # Mock historical data
            mock_history = [
                {
                    "lot_number": "LOT001",
                    "product": "Product A",
                    "fab": "M14", 
                    "start_time": "2024-08-01 09:00:00",
                    "end_time": "2024-08-01 15:30:00",
                    "duration": "6시간 30분",
                    "steps_completed": 5,
                    "result": "정상 완료"
                },
                {
                    "lot_number": "LOT002",
                    "product": "Product B",
                    "fab": "M15",
                    "start_time": "2024-08-01 10:00:00", 
                    "end_time": None,
                    "duration": "진행중 (4시간 경과)",
                    "steps_completed": 3,
                    "result": "진행중 (지연)"
                }
            ]
            
            # Filter and format results similar to status tool
            filtered_history = mock_history
            
            if fab:
                filtered_history = [h for h in filtered_history if h["fab"] == fab.upper()]
            
            if lot_number:
                filtered_history = [h for h in filtered_history if h["lot_number"] == lot_number.upper()]
            
            filtered_history = filtered_history[:limit]
            
            if not filtered_history:
                return "No lot history found matching the criteria"
            
            result = f"Found {len(filtered_history)} lot history records:\n"
            for hist in filtered_history:
                result += f"- {hist['lot_number']}: {hist['product']} ({hist['fab']}) - {hist['duration']}, {hist['steps_completed']} steps, {hist['result']}\n"
            
            logger.info("Lot history query completed", count=len(filtered_history))
            return result
            
        except Exception as e:
            logger.error("Error in lot history query", error=str(e))
            return f"Error querying lot history: {str(e)}"