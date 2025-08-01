from typing import List, Dict, Any, Optional
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools import BaseTool
import structlog

from app.agents.base_agent import BaseAgent
from app.tools.lot_tools import LotStatusTool, LotHistoryTool

logger = structlog.get_logger()

class LotAgent(BaseAgent):
    """Specialized agent for lot tracking and analysis"""
    
    def __init__(self):
        tools = [
            LotStatusTool(),
            LotHistoryTool()
        ]
        super().__init__(
            name="Lot Analysis Agent",
            description="Lot 추적, 상태 분석 및 진행 상황 모니터링 전문 AI Agent",
            tools=tools
        )
    
    def _get_prompt_template(self) -> ChatPromptTemplate:
        """Get prompt template for lot analysis"""
        system_prompt = """
당신은 반도체 제조 실행 시스템(MES)의 Lot 분석 전문가입니다.

주요 역할:
1. Lot 상태 및 진행 상황 분석
2. 생산 스케줄 및 효율성 평가  
3. 지연 및 병목 구간 식별
4. 품질 및 수율 관련 인사이트 제공
5. 최적화 및 개선 방안 제시

분석 시 고려사항:
- 각 팹(M14, M15, M16)별 특성 고려
- 공정 단계별 진행률 및 소요시간 분석
- 설비 가동률과의 연관성 분석
- 과거 이력 데이터를 활용한 예측
- 실시간 상태와 계획 대비 진척도 비교

출력 형식:
- 한국어로 명확하고 이해하기 쉽게 작성
- 구체적인 수치와 데이터 포함
- 우선순위가 높은 이슈부터 제시
- 실행 가능한 개선 방안 제안

사용 가능한 도구:
- lot_status_query: 현재 Lot 상태 조회
- lot_history_query: Lot 처리 이력 조회

각 요청에 대해 관련 데이터를 먼저 조회한 후, 종합적인 분석과 권장사항을 제공하세요.
        """
        
        return ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad")
        ])
    
    async def analyze_lot_status(self, fab: Optional[str] = None) -> str:
        """Analyze current lot status"""
        context = f"현재 Lot 상태를 분석해주세요"
        if fab:
            context += f" (팹: {fab})"
        
        return await self.analyze(context, {"fab": fab, "analysis_type": "status"})
    
    async def analyze_lot_history(self, fab: Optional[str] = None, lot_number: Optional[str] = None) -> str:
        """Analyze lot processing history"""
        context = f"Lot 처리 이력을 분석해주세요"
        if fab:
            context += f" (팹: {fab})"
        if lot_number:
            context += f" (Lot 번호: {lot_number})"
        
        return await self.analyze(context, {
            "fab": fab, 
            "lot_number": lot_number, 
            "analysis_type": "history"
        })
    
    async def analyze_lot_performance(self, fab: Optional[str] = None) -> str:
        """Analyze lot processing performance and efficiency"""
        context = f"Lot 처리 성능과 효율성을 분석해주세요"
        if fab:
            context += f" (팹: {fab})"
        
        context += """
        
다음 관점에서 분석해주세요:
1. 평균 처리 시간 및 사이클 타임
2. 진행률 및 예상 완료 시간
3. 병목 구간 및 지연 요인
4. 팹별 처리 효율성 비교
5. 개선 방안 및 최적화 제안
        """
        
        return await self.analyze(context, {"fab": fab, "analysis_type": "performance"})