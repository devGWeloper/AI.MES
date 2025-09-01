from typing import List, Dict, Any, Optional
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools import BaseTool
import structlog

from app.agents.base_agent import BaseAgent
from app.tools.context_tool import ContextTool

logger = structlog.get_logger()

class ReturnAgent(BaseAgent):
    """반송/재작업 관리 전문 에이전트"""
    
    def __init__(self, context_data: Optional[Dict[str, Any]] = None):
        tools = [ContextTool(context_data)]
        super().__init__(
            name="반송 분석 에이전트",
            description="반송/재작업 분석 및 품질 개선 전문 AI",
            tools=tools
        )
        self.context_data = context_data or {}
    
    def _get_prompt_template(self) -> ChatPromptTemplate:
        """반송 분석용 프롬프트 템플릿"""
        # 🔥 사내 수정 포인트: 프롬프트를 사내 품질 관리 정책에 맞게 수정
        system_prompt = """
당신은 반도체 제조 반송/재작업 관리 전문 AI입니다.

🎯 주요 업무:
- 반송 원인 분석 및 패턴 파악
- 반송률 개선 방안 제시
- 품질 이슈 근본 원인 분석
- 재발 방지 대책 수립

📊 분석 기준:
- 반송 사유별 빈도 및 트렌드 분석
- 공정별/설비별 반송 패턴
- 반송 해결 시간 및 효율성
- 재발 방지 효과성 평가

💡 출력 가이드라인:
- 한국어로 명확하고 구체적으로 작성
- 심각도에 따른 우선순위 제시
- 실행 가능한 개선 방안 포함
- 수치 데이터 기반 객관적 분석

🔧 사용 도구:
- context_analyzer: 현재 화면의 반송 데이터 분석

🔥 TODO: 사내 품질 관리 정책에 맞게 수정 필요
- 실제 반송 사유 코드로 변경 (일반적 사유 → 사내 코드)
- 사내 품질 기준 및 임계값 추가
- 책임 부서별 대응 프로세스 명시
- 품질 관련 규정 및 표준 반영
        """
        
        return ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad")
        ])
    
    async def analyze_with_context(self, user_message: str, context_data: Optional[Dict[str, Any]] = None) -> str:
        """컨텍스트 기반 사용자 질문 분석 - 메인 분석 메서드"""
        # 🔥 사내 수정 포인트: 반송 관련 컨텍스트 데이터 해석 로직
        
        if context_data:
            self.tools = [ContextTool(context_data)]
            self.agent_executor = self._create_agent()
        
        prompt = f"""사용자 질문: {user_message}

현재 화면 정보:
- 페이지 타입: {context_data.get('pageType', 'N/A') if context_data else 'N/A'}
- 반송 건수: {context_data.get('totalCount', 0) if context_data else 0}개

위 컨텍스트를 바탕으로 사용자 질문에 대해 구체적이고 실용적인 반송 분석을 제공해주세요.
먼저 context_analyzer 도구를 사용하여 현재 반송 데이터를 분석한 후 답변하세요."""
        
        return await self.analyze(prompt, context_data or {})
