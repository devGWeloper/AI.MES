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
    
    async def analyze_lot_status(self, fab: Optional[str] = None, context_data: Optional[Dict[str, Any]] = None) -> str:
        """Analyze current lot status"""
        context = f"현재 Lot 상태를 분석해주세요"
        if fab:
            context += f" (팹: {fab})"
        
        # 컨텍스트 데이터가 있으면 추가 정보 포함
        if context_data and context_data.get('lotData'):
            lot_count = len(context_data['lotData'])
            context += f"\n\n현재 화면에 {lot_count}개의 Lot 데이터가 있습니다."
            
        data = {"fab": fab, "analysis_type": "status"}
        if context_data:
            data.update(context_data)
            
        return await self.analyze(context, data)
    
    async def analyze_lot_history(self, fab: Optional[str] = None, lot_number: Optional[str] = None, context_data: Optional[Dict[str, Any]] = None) -> str:
        """Analyze lot processing history"""
        context = f"Lot 처리 이력을 분석해주세요"
        if fab:
            context += f" (팹: {fab})"
        if lot_number:
            context += f" (Lot 번호: {lot_number})"
        
        # 컨텍스트 데이터가 있으면 추가 정보 포함
        if context_data and context_data.get('lotData'):
            lot_count = len(context_data['lotData'])
            context += f"\n\n현재 화면에 {lot_count}개의 Lot 데이터가 있습니다."
            
        data = {
            "fab": fab, 
            "lot_number": lot_number, 
            "analysis_type": "history"
        }
        if context_data:
            data.update(context_data)
            
        return await self.analyze(context, data)
    
    async def analyze_lot_performance(self, fab: Optional[str] = None, context_data: Optional[Dict[str, Any]] = None) -> str:
        """Analyze lot processing performance and efficiency"""
        context = f"Lot 처리 성능과 효율성을 분석해주세요"
        if fab:
            context += f" (팹: {fab})"
        
        # 컨텍스트 데이터가 있으면 추가 정보 포함
        if context_data and context_data.get('lotData'):
            lot_count = len(context_data['lotData'])
            context += f"\n\n현재 화면에 {lot_count}개의 Lot 데이터가 있습니다."
        
        context += """
        
다음 관점에서 분석해주세요:
1. 평균 처리 시간 및 사이클 타임
2. 진행률 및 예상 완료 시간
3. 병목 구간 및 지연 요인
4. 팹별 처리 효율성 비교
5. 개선 방안 및 최적화 제안
        """
        
        data = {"fab": fab, "analysis_type": "performance"}
        if context_data:
            data.update(context_data)
            
        return await self.analyze(context, data)
    
    async def analyze_with_context(self, user_message: str, context_data: Optional[Dict[str, Any]] = None) -> str:
        """컨텍스트 데이터를 활용한 사용자 질문 분석"""
        context = f"사용자 질문: {user_message}"
        
        # 컨텍스트 데이터 분석 및 프롬프트에 포함
        if context_data:
            if context_data.get('pageType') == 'lot_history':
                context += f"\n\n현재 사용자는 Lot History 화면에 있습니다."
                
            if context_data.get('lotData'):
                lots = context_data['lotData']
                lot_count = len(lots)
                context += f"\n화면에 표시된 Lot 데이터: {lot_count}개"
                
                # Lot 데이터 요약
                if lots:
                    fabs = list(set(lot.get('fab', '') for lot in lots))
                    statuses = list(set(lot.get('status', '') for lot in lots))
                    context += f"\n팹: {', '.join(fabs)}"
                    context += f"\n상태: {', '.join(statuses)}"
                    
                    # 처음 몇 개 Lot 정보 포함
                    context += f"\n\n주요 Lot 정보:"
                    for i, lot in enumerate(lots[:5]):  # 처음 5개만
                        context += f"\n{i+1}. LOT: {lot.get('lotNumber', 'N/A')}, 제품: {lot.get('product', 'N/A')}, 상태: {lot.get('status', 'N/A')}, 팹: {lot.get('fab', 'N/A')}"
                    
                    if lot_count > 5:
                        context += f"\n... 외 {lot_count - 5}개 추가"
                        
            if context_data.get('searchTerm'):
                context += f"\n검색어: {context_data['searchTerm']}"
                
            if context_data.get('selectedFab') and context_data.get('selectedFab') != 'all':
                context += f"\n선택된 팹: {context_data['selectedFab']}"
        
        context += f"\n\n위 컨텍스트 정보를 바탕으로 사용자의 질문에 대해 구체적이고 유용한 분석을 제공해주세요."
        
        data = {"analysis_type": "context_chat"}
        if context_data:
            data.update(context_data)
            
        return await self.analyze(context, data)