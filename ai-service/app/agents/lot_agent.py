from typing import List, Dict, Any, Optional
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools import BaseTool
import structlog

from app.agents.base_agent import BaseAgent
from app.tools.context_tool import ContextTool

logger = structlog.get_logger()

class LotAgent(BaseAgent):
    """LOT 추적 및 분석 전문 에이전트"""
    
    def __init__(self, context_data: Optional[Dict[str, Any]] = None):
        # 🔥 사내 수정 포인트: 컨텍스트 데이터 기반 도구 생성
        tools = [ContextTool(context_data)]
        
        super().__init__(
            name="LOT 분석 에이전트",
            description="LOT 추적, 상태 분석 및 생산 진행 상황 모니터링 전문 AI",
            tools=tools
        )
        self.context_data = context_data or {}
    
    def _get_prompt_template(self) -> ChatPromptTemplate:
        """LOT 분석용 프롬프트 템플릿"""
        # 🔥 사내 수정 포인트: 프롬프트를 사내 LOT 관리 정책에 맞게 수정
        system_prompt = """
당신은 반도체 제조 LOT 관리 전문 AI입니다.

🎯 주요 업무:
- LOT 진행 상황 분석 및 모니터링
- 생산 지연 원인 파악 및 해결방안 제시
- LOT별 품질 이슈 분석
- 생산 효율성 개선 방안 제안

📊 분석 기준:
- 팹별 생산 특성 차이 (M14/M15/M16)
- 공정별 표준 소요 시간 대비 실적
- 설비 가동률과의 연관성
- 품질 기준 준수 여부

💡 출력 가이드라인:
- 한국어로 명확하고 구체적으로 작성
- 우선순위가 높은 이슈부터 제시
- 실행 가능한 개선 방안 포함
- 수치 데이터 기반 객관적 분석

🔧 사용 도구:
- context_analyzer: 현재 화면의 LOT 데이터 분석

🔥 TODO: 사내 LOT 관리 정책에 맞게 수정 필요
- 실제 공정 단계명으로 변경 (Step 1-5 → 실제 공정명)
- 사내 품질 기준 추가
- 팀별 담당 영역 명시
- 사내 용어 및 약어 적용
        """
        
        return ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad")
        ])
    
    async def analyze_with_context(self, user_message: str, context_data: Optional[Dict[str, Any]] = None) -> str:
        """컨텍스트 기반 사용자 질문 분석 - 메인 분석 메서드"""
        # 🔥 사내 수정 포인트: 컨텍스트 데이터 해석 로직
        
        # 새로운 ContextTool로 에이전트 도구 업데이트
        if context_data:
            self.tools = [ContextTool(context_data)]
            # BaseAgent의 agent_executor를 새로 생성
            self.agent_executor = self._create_agent()
        
        # 사용자 질문과 함께 컨텍스트 분석 수행
        prompt = f"""사용자 질문: {user_message}

현재 화면 정보:
- 페이지 타입: {context_data.get('pageType', 'N/A') if context_data else 'N/A'}
- 데이터 수: {context_data.get('totalCount', 0) if context_data else 0}개

위 컨텍스트를 바탕으로 사용자 질문에 대해 구체적이고 실용적인 분석을 제공해주세요.
먼저 context_analyzer 도구를 사용하여 현재 데이터를 분석한 후 답변하세요."""
        
        return await self.analyze(prompt, context_data or {})