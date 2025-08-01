from typing import List, Dict, Any, Optional
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools import BaseTool
import structlog

from app.agents.base_agent import BaseAgent
from app.tools.equipment_tools import EquipmentStatusTool, EquipmentHistoryTool, EquipmentAlertTool

logger = structlog.get_logger()

class EquipmentAgent(BaseAgent):
    """Specialized agent for equipment monitoring and analysis"""
    
    def __init__(self):
        tools = [
            EquipmentStatusTool(),
            EquipmentHistoryTool(),
            EquipmentAlertTool()
        ]
        super().__init__(
            name="Equipment Analysis Agent",
            description="설비 모니터링, 성능 분석 및 예측 정비 전문 AI Agent",
            tools=tools
        )
    
    def _get_prompt_template(self) -> ChatPromptTemplate:
        """Get prompt template for equipment analysis"""
        system_prompt = """
당신은 반도체 제조 설비 모니터링 및 분석 전문가입니다.

주요 역할:
1. 설비 실시간 상태 모니터링 및 분석
2. 설비 성능 및 가동률 평가
3. 알람 및 이상 징후 분석
4. 예측 정비 및 유지보수 계획 수립
5. 설비 최적화 및 효율성 개선 방안 제시

분석 시 고려사항:
- 각 팹(M14, M15, M16)별 설비 특성
- 설비별 온도, 압력, 가동률 등 핵심 지표 분석
- 알람 및 경고 신호의 심각도 평가
- 과거 정비 이력 및 패턴 분석
- 설비 간 연관성 및 생산 라인 영향도 고려

출력 형식:
- 한국어로 명확하고 이해하기 쉽게 작성
- 구체적인 수치와 상태 정보 포함
- 긴급도에 따른 우선순위 제시
- 구체적인 조치 방안 및 일정 제안

사용 가능한 도구:
- equipment_status_query: 설비 실시간 상태 조회
- equipment_history_query: 설비 작업 이력 조회
- equipment_alert_query: 설비 알람 및 경고 조회

각 요청에 대해 관련 설비 정보를 먼저 조회한 후, 종합적인 분석과 조치 방안을 제공하세요.
        """
        
        return ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad")
        ])
    
    async def analyze_equipment_status(self, fab: Optional[str] = None) -> str:
        """Analyze current equipment status"""
        context = f"현재 설비 상태를 종합적으로 분석해주세요"
        if fab:
            context += f" (팹: {fab})"
        
        context += """
        
다음 관점에서 분석해주세요:
1. 설비별 현재 상태 및 가동률
2. 알람 및 경고 상황 분석
3. 성능 지표 (온도, 압력 등) 평가
4. 즉시 조치가 필요한 설비 식별
5. 전체적인 설비 운영 효율성
        """
        
        return await self.analyze(context, {"fab": fab, "analysis_type": "status"})
    
    async def analyze_equipment_performance(self, fab: Optional[str] = None) -> str:
        """Analyze equipment performance and efficiency"""
        context = f"설비 성능과 효율성을 분석해주세요"
        if fab:
            context += f" (팹: {fab})"
        
        context += """
        
다음 관점에서 분석해주세요:
1. 설비별 가동률 및 활용도
2. 처리 시간 및 생산성 지표
3. 설비 간 성능 비교
4. 병목 설비 및 개선 포인트
5. 최적화 방안 및 효율성 개선 제안
        """
        
        return await self.analyze(context, {"fab": fab, "analysis_type": "performance"})
    
    async def analyze_equipment_alerts(self, fab: Optional[str] = None) -> str:
        """Analyze equipment alerts and maintenance needs"""
        context = f"설비 알람 및 정비 필요사항을 분석해주세요"
        if fab:
            context += f" (팹: {fab})"
        
        context += """
        
다음 관점에서 분석해주세요:
1. 현재 활성화된 알람 분석
2. 알람 심각도 및 우선순위 평가
3. 정비 필요 설비 식별
4. 예측 정비 계획 수립
5. 예방 조치 및 모니터링 강화 방안
        """
        
        return await self.analyze(context, {"fab": fab, "analysis_type": "alerts"})
    
    async def predict_maintenance_needs(self, equipment_id: Optional[str] = None) -> str:
        """Predict maintenance needs for equipment"""
        context = f"설비 예측 정비 필요성을 분석해주세요"
        if equipment_id:
            context += f" (설비 ID: {equipment_id})"
        
        context += """
        
다음 관점에서 예측 분석해주세요:
1. 현재 설비 상태 기반 정비 시기 예측
2. 과거 정비 패턴 및 주기 분석
3. 성능 저하 징후 및 위험 요소
4. 최적 정비 스케줄 제안
5. 예방 정비를 통한 효과 및 비용 절감
        """
        
        return await self.analyze(context, {"equipment_id": equipment_id, "analysis_type": "prediction"})