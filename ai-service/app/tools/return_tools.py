from langchain.tools import BaseTool
from typing import Type, Optional, Dict, Any, List
from pydantic import BaseModel, Field
import structlog
from app.core.config import settings

logger = structlog.get_logger()

class ReturnQueryInput(BaseModel):
    """Input for return query tool"""
    fab: Optional[str] = Field(description="Fab code (M14, M15, M16)")
    lot_number: Optional[str] = Field(description="Specific lot number")
    status: Optional[str] = Field(description="Return status filter")
    severity: Optional[str] = Field(description="Return severity filter") 
    limit: int = Field(default=100, description="Maximum number of results")

class ReturnHistoryTool(BaseTool):
    """Tool for querying return/rework history"""
    name = "return_history_query"
    description = "Query lot return and rework history information"
    args_schema: Type[BaseModel] = ReturnQueryInput

    def _run(self, fab: Optional[str] = None, lot_number: Optional[str] = None, 
             status: Optional[str] = None, severity: Optional[str] = None, limit: int = 100) -> str:
        """Execute the return history query"""
        try:
            # Mock return data
            mock_returns = [
                {
                    "return_id": "RET-001",
                    "lot_number": "LOT001",
                    "product": "Product A",
                    "fab": "M14",
                    "return_reason": "품질 불량",
                    "return_step": "Lithography",
                    "return_date": "2024-08-01 14:30:00",
                    "return_by": "김품질",
                    "target_step": "Clean",
                    "status": "resolved",
                    "severity": "High",
                    "resolved_date": "2024-08-01 16:45:00",
                    "comments": "PR 두께 재조정 후 재처리 완료"
                },
                {
                    "return_id": "RET-002",
                    "lot_number": "LOT002", 
                    "product": "Product B",
                    "fab": "M15",
                    "return_reason": "설비 오염",
                    "return_step": "Etching",
                    "return_date": "2024-08-01 11:15:00",
                    "return_by": "이공정",
                    "target_step": "Pre-Clean",
                    "status": "processing",
                    "severity": "Medium",
                    "resolved_date": None,
                    "comments": "챔버 클리닝 후 재진입 예정"
                },
                {
                    "return_id": "RET-003",
                    "lot_number": "LOT003",
                    "product": "Product C", 
                    "fab": "M16",
                    "return_reason": "측정값 이상",
                    "return_step": "Measurement",
                    "return_date": "2024-08-01 09:45:00",
                    "return_by": "박측정",
                    "target_step": "CMP",
                    "status": "analyzing",
                    "severity": "Low",
                    "resolved_date": None,
                    "comments": "재측정 결과 대기 중"
                },
                {
                    "return_id": "RET-004",
                    "lot_number": "LOT004",
                    "product": "Product A",
                    "fab": "M14", 
                    "return_reason": "공정 파라미터 오류",
                    "return_step": "Deposition",
                    "return_date": "2024-07-31 16:20:00",
                    "return_by": "최공정",
                    "target_step": "Strip",
                    "status": "resolved",
                    "severity": "High",
                    "resolved_date": "2024-08-01 08:30:00",
                    "comments": "레시피 수정 후 재처리 완료"
                }
            ]
            
            # Filter results
            filtered_returns = mock_returns
            
            if fab:
                filtered_returns = [r for r in filtered_returns if r["fab"] == fab.upper()]
            
            if lot_number:
                filtered_returns = [r for r in filtered_returns if r["lot_number"] == lot_number.upper()]
                
            if status:
                filtered_returns = [r for r in filtered_returns if r["status"] == status.lower()]
                
            if severity:
                filtered_returns = [r for r in filtered_returns if r["severity"] == severity.title()]
            
            filtered_returns = filtered_returns[:limit]
            
            if not filtered_returns:
                return "No return records found matching the criteria"
            
            result = f"Found {len(filtered_returns)} return records:\n"
            for ret in filtered_returns:
                result += f"- {ret['return_id']}: {ret['lot_number']} ({ret['fab']}) - {ret['return_reason']} from {ret['return_step']}"
                result += f", 상태: {ret['status']}, 심각도: {ret['severity']}"
                if ret['resolved_date']:
                    result += f", 해결완료: {ret['resolved_date']}"
                result += f"\n  → {ret['comments']}\n"
            
            logger.info("Return history query completed", count=len(filtered_returns))
            return result
            
        except Exception as e:
            logger.error("Error in return history query", error=str(e))
            return f"Error querying return history: {str(e)}"

class ReturnAnalysisTool(BaseTool):
    """Tool for analyzing return patterns and trends"""
    name = "return_analysis_query"
    description = "Analyze return patterns, trends, and root causes"
    args_schema: Type[BaseModel] = ReturnQueryInput

    def _run(self, fab: Optional[str] = None, lot_number: Optional[str] = None, 
             status: Optional[str] = None, severity: Optional[str] = None, limit: int = 100) -> str:
        """Execute return pattern analysis"""
        try:
            # Mock analysis data
            analysis_data = {
                "total_returns": 4,
                "by_fab": {"M14": 2, "M15": 1, "M16": 1},
                "by_severity": {"High": 2, "Medium": 1, "Low": 1},
                "by_status": {"resolved": 2, "processing": 1, "analyzing": 1},
                "top_reasons": [
                    {"reason": "품질 불량", "count": 1, "percentage": 25.0},
                    {"reason": "설비 오염", "count": 1, "percentage": 25.0},
                    {"reason": "측정값 이상", "count": 1, "percentage": 25.0},
                    {"reason": "공정 파라미터 오류", "count": 1, "percentage": 25.0}
                ],
                "problem_steps": [
                    {"step": "Lithography", "count": 1},
                    {"step": "Etching", "count": 1},
                    {"step": "Measurement", "count": 1},
                    {"step": "Deposition", "count": 1}
                ],
                "avg_resolution_time": "12.5시간",
                "recommendations": [
                    "M14 팹에서 반송률이 높음 - Product A 품질 관리 강화 필요",
                    "설비 청소 프로토콜 개선 검토",
                    "공정 파라미터 모니터링 강화",
                    "예방적 품질 관리 시스템 도입"
                ]
            }
            
            # Apply filters to analysis if specified
            if fab:
                fab_count = analysis_data["by_fab"].get(fab.upper(), 0)
                result = f"Return Analysis for {fab.upper()} Fab:\n"
                result += f"- Total returns: {fab_count}\n"
            else:
                result = f"Overall Return Analysis:\n"
                result += f"- Total returns: {analysis_data['total_returns']}\n"
            
            result += f"- Average resolution time: {analysis_data['avg_resolution_time']}\n\n"
            
            result += "Returns by Fab:\n"
            for fab_code, count in analysis_data["by_fab"].items():
                result += f"  - {fab_code}: {count} returns\n"
            
            result += "\nReturns by Severity:\n"
            for sev, count in analysis_data["by_severity"].items():
                result += f"  - {sev}: {count} returns\n"
            
            result += "\nTop Return Reasons:\n"
            for reason in analysis_data["top_reasons"]:
                result += f"  - {reason['reason']}: {reason['count']} returns ({reason['percentage']}%)\n"
            
            result += "\nProblem Steps:\n"
            for step in analysis_data["problem_steps"]:
                result += f"  - {step['step']}: {step['count']} returns\n"
            
            result += "\nRecommendations:\n"
            for rec in analysis_data["recommendations"]:
                result += f"  - {rec}\n"
            
            logger.info("Return analysis query completed")
            return result
            
        except Exception as e:
            logger.error("Error in return analysis query", error=str(e))
            return f"Error analyzing return data: {str(e)}"