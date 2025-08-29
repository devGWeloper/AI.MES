from typing import Optional, Dict, Any
import structlog
from datetime import datetime

from app.models.schemas import AnalysisRequest, AnalysisResponse
from app.agents.lot_agent import LotAgent
from app.agents.equipment_agent import EquipmentAgent
from app.agents.return_agent import ReturnAgent
from app.core.config import settings

logger = structlog.get_logger()

class AnalysisService:
    """Main service for coordinating AI analysis requests"""
    
    def __init__(self):
        self.lot_agent: Optional[LotAgent] = None
        self.equipment_agent: Optional[EquipmentAgent] = None
        self.return_agent: Optional[ReturnAgent] = None
        self._initialized = False
    
    async def initialize(self):
        """Initialize all agents"""
        try:
            logger.info("Initializing AI agents...")
            
            self.lot_agent = LotAgent()
            self.equipment_agent = EquipmentAgent()
            self.return_agent = ReturnAgent()
            
            self._initialized = True
            logger.info("AI agents initialized successfully")
            
        except Exception as e:
            logger.error("Failed to initialize AI agents", error=str(e))
            raise
    
    async def cleanup(self):
        """Cleanup resources"""
        logger.info("Cleaning up analysis service...")
        self._initialized = False
    
    def _ensure_initialized(self):
        """Ensure service is initialized"""
        if not self._initialized:
            raise RuntimeError("Analysis service not initialized")
    
    async def analyze_lot_data(self, request: AnalysisRequest) -> AnalysisResponse:
        """Analyze lot data using the lot agent"""
        self._ensure_initialized()
        
        try:
            logger.info("Starting lot data analysis", type=request.type, fab=request.fab)
            
            # Determine the specific analysis type
            if "status" in request.type.lower():
                analysis = await self.lot_agent.analyze_lot_status(request.fab)
            elif "history" in request.type.lower():
                analysis = await self.lot_agent.analyze_lot_history(request.fab)
            elif "performance" in request.type.lower():
                analysis = await self.lot_agent.analyze_lot_performance(request.fab)
            else:
                # General analysis
                analysis = await self.lot_agent.analyze(request.context, request.data)
            
            # Extract recommendations and alerts from analysis
            recommendations, alerts = self._extract_insights(analysis)
            
            return AnalysisResponse(
                analysis=analysis,
                recommendations=recommendations,
                alerts=alerts,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            logger.error("Error in lot data analysis", error=str(e))
            raise
    
    async def analyze_equipment_data(self, request: AnalysisRequest) -> AnalysisResponse:
        """Analyze equipment data using the equipment agent"""
        self._ensure_initialized()
        
        try:
            logger.info("Starting equipment data analysis", type=request.type, fab=request.fab)
            
            # Determine the specific analysis type
            if "status" in request.type.lower():
                analysis = await self.equipment_agent.analyze_equipment_status(request.fab)
            elif "performance" in request.type.lower():
                analysis = await self.equipment_agent.analyze_equipment_performance(request.fab)
            elif "alert" in request.type.lower():
                analysis = await self.equipment_agent.analyze_equipment_alerts(request.fab)
            elif "maintenance" in request.type.lower():
                equipment_id = request.data.get("equipment_id") if request.data else None
                analysis = await self.equipment_agent.predict_maintenance_needs(equipment_id)
            else:
                # General analysis
                analysis = await self.equipment_agent.analyze(request.context, request.data)
            
            # Extract recommendations and alerts from analysis
            recommendations, alerts = self._extract_insights(analysis)
            
            return AnalysisResponse(
                analysis=analysis,
                recommendations=recommendations,
                alerts=alerts,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            logger.error("Error in equipment data analysis", error=str(e))
            raise
    
    async def analyze_return_data(self, request: AnalysisRequest) -> AnalysisResponse:
        """Analyze return data using the return agent"""
        self._ensure_initialized()
        
        try:
            logger.info("Starting return data analysis", type=request.type, fab=request.fab)
            
            # Determine the specific analysis type
            if "history" in request.type.lower():
                analysis = await self.return_agent.analyze_return_history(request.fab)
            elif "pattern" in request.type.lower():
                analysis = await self.return_agent.analyze_return_patterns(request.fab)
            elif "improvement" in request.type.lower():
                analysis = await self.return_agent.recommend_improvements(request.fab)
            elif "impact" in request.type.lower():
                severity = request.data.get("severity") if request.data else None
                analysis = await self.return_agent.analyze_return_impact(severity)
            else:
                # General analysis
                analysis = await self.return_agent.analyze(request.context, request.data)
            
            # Extract recommendations and alerts from analysis
            recommendations, alerts = self._extract_insights(analysis)
            
            return AnalysisResponse(
                analysis=analysis,
                recommendations=recommendations,
                alerts=alerts,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            logger.error("Error in return data analysis", error=str(e))
            raise
    
    async def get_status_insights(self, request: AnalysisRequest) -> AnalysisResponse:
        """Get comprehensive status insights across all domains"""
        self._ensure_initialized()
        
        try:
            logger.info("Starting status insights generation", type=request.type, fab=request.fab)
            
            # Get insights from all agents
            lot_insights = await self.lot_agent.analyze_lot_status(request.fab)
            equipment_insights = await self.equipment_agent.analyze_equipment_status(request.fab)
            return_insights = await self.return_agent.analyze_return_history(request.fab)
            
            # Combine insights
            combined_analysis = f"""
🤖 종합 시스템 상태 인사이트 ({request.fab or '전체 팹'}):

📊 Lot 현황:
{lot_insights}

🔧 설비 현황:
{equipment_insights}

🔄 반송 현황:
{return_insights}

💡 종합 권장사항:
- 전체 시스템 통합 모니터링 강화
- 팹 간 성능 비교 및 모범 사례 공유
- 예측적 품질 관리 시스템 구축
- 실시간 의사결정 지원 시스템 활용
            """
            
            # Extract comprehensive recommendations and alerts
            recommendations, alerts = self._extract_comprehensive_insights(
                lot_insights, equipment_insights, return_insights
            )
            
            return AnalysisResponse(
                analysis=combined_analysis,
                recommendations=recommendations,
                alerts=alerts,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            logger.error("Error generating status insights", error=str(e))
            raise
    
    def _extract_insights(self, analysis: str) -> tuple[list[str], list[str]]:
        """Extract recommendations and alerts from analysis text"""
        recommendations = []
        alerts = []
        
        lines = analysis.split('\n')
        current_section = ""
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if "권장" in line or "제안" in line or "개선" in line:
                current_section = "recommendations"
            elif "경고" in line or "알람" in line or "주의" in line or "긴급" in line:
                current_section = "alerts"
            elif line.startswith('- ') or line.startswith('• '):
                content = line[2:].strip()
                if current_section == "recommendations":
                    recommendations.append(content)
                elif current_section == "alerts":
                    alerts.append(content)
                    
        return recommendations, alerts
    
    def _extract_comprehensive_insights(self, lot_analysis: str, equipment_analysis: str, 
                                      return_analysis: str) -> tuple[list[str], list[str]]:
        """Extract comprehensive recommendations and alerts from multiple analyses"""
        all_recommendations = []
        all_alerts = []
        
        # Extract from each analysis
        for analysis in [lot_analysis, equipment_analysis, return_analysis]:
            recs, alerts = self._extract_insights(analysis)
            all_recommendations.extend(recs)
            all_alerts.extend(alerts)
        
        # Add comprehensive recommendations
        all_recommendations.extend([
            "통합 대시보드를 통한 실시간 모니터링 강화",
            "AI 기반 예측 분석 시스템 도입",
            "팹 간 성능 벤치마킹 및 모범 사례 공유",
            "자동화된 알림 및 에스컬레이션 시스템 구축"
        ])
        
        return all_recommendations[:10], all_alerts[:10]  # Limit to top 10 each
    
    async def analyze_chat_message(self, message: str, agent_type: str, context_data: Optional[Dict[str, Any]] = None) -> AnalysisResponse:
        """Analyze chat message with context using appropriate agent"""
        self._ensure_initialized()
        
        try:
            logger.info("Starting chat message analysis", agent_type=agent_type, has_context=bool(context_data))
            
            analysis = ""
            
            if agent_type == "lot":
                analysis = await self.lot_agent.analyze_with_context(message, context_data)
            elif agent_type == "equipment":
                analysis = await self.equipment_agent.analyze_with_context(message, context_data)
            elif agent_type == "return":
                analysis = await self.return_agent.analyze_with_context(message, context_data)
            else:
                # General analysis - 가장 적절한 agent 선택
                analysis = await self.lot_agent.analyze_with_context(message, context_data)
            
            # Extract recommendations and alerts from analysis
            recommendations, alerts = self._extract_insights(analysis)
            
            return AnalysisResponse(
                analysis=analysis,
                recommendations=recommendations,
                alerts=alerts,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            logger.error("Error in chat message analysis", error=str(e), agent_type=agent_type)
            raise