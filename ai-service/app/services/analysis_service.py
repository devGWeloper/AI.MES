"""
간소화된 AI 분석 서비스
🔥 사내 수정 포인트: 각 에이전트의 프롬프트와 분석 로직을 사내 업무에 맞게 수정
"""

from typing import Optional, Dict, Any
import structlog
from datetime import datetime

from app.models.schemas import AnalysisResponse
from app.agents.lot_agent import LotAgent
from app.agents.equipment_agent import EquipmentAgent
from app.agents.return_agent import ReturnAgent

logger = structlog.get_logger()

class AnalysisService:
    """간소화된 AI 분석 서비스 - 채팅 기반 분석에 집중"""
    
    def __init__(self):
        self.agents = {}
        self._initialized = False
    
    async def initialize(self):
        """에이전트 초기화"""
        try:
            logger.info("AI 에이전트 초기화 중...")
            
            self.agents = {
                'lot': LotAgent(),
                'equipment': EquipmentAgent(), 
                'return': ReturnAgent()
            }
            
            self._initialized = True
            logger.info("AI 에이전트 초기화 완료")
            
        except Exception as e:
            logger.error("에이전트 초기화 실패", error=str(e))
            raise
    
    def _ensure_initialized(self):
        """초기화 상태 확인"""
        if not self._initialized:
            raise RuntimeError("Analysis service not initialized")
    
    async def analyze_chat_message(self, message: str, agent_type: str, context_data: Optional[Dict[str, Any]] = None) -> AnalysisResponse:
        """메인 분석 메서드 - 채팅 메시지와 컨텍스트를 기반으로 AI 분석 수행"""
        self._ensure_initialized()
        
        try:
            logger.info("채팅 메시지 분석 시작", agent_type=agent_type, has_context=bool(context_data))
            
            # 🔥 사내 수정 포인트: 에이전트 타입에 따른 분석 로직
            agent = self.agents.get(agent_type, self.agents.get('lot'))  # 기본값은 lot agent
            
            if not agent:
                raise ValueError(f"지원하지 않는 에이전트 타입: {agent_type}")
            
            # 컨텍스트를 포함한 분석 수행
            analysis = await agent.analyze_with_context(message, context_data)
            
            # 권장사항과 알림 추출
            recommendations, alerts = self._extract_insights(analysis)
            
            return AnalysisResponse(
                analysis=analysis,
                recommendations=recommendations,
                alerts=alerts,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            logger.error("채팅 분석 실패", error=str(e), agent_type=agent_type)
            raise
    
    def _extract_insights(self, analysis: str) -> tuple[list[str], list[str]]:
        """분석 결과에서 권장사항과 알림 추출"""
        recommendations = []
        alerts = []
        
        lines = analysis.split('\n')
        current_section = ""
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # 🔥 사내 수정 포인트: 키워드를 사내 용어에 맞게 수정
            if any(keyword in line for keyword in ["권장", "제안", "개선", "🎯"]):
                current_section = "recommendations"
            elif any(keyword in line for keyword in ["경고", "알람", "주의", "긴급", "⚠️"]):
                current_section = "alerts"
            elif line.startswith('- ') or line.startswith('• '):
                content = line[2:].strip()
                if current_section == "recommendations":
                    recommendations.append(content)
                elif current_section == "alerts":
                    alerts.append(content)
                    
        return recommendations[:5], alerts[:3]  # 최대 5개 권장사항, 3개 알림