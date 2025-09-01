from typing import List, Dict, Any, Optional
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools import BaseTool
import structlog

from app.agents.base_agent import BaseAgent
from app.tools.context_tool import ContextTool

logger = structlog.get_logger()

class EquipmentAgent(BaseAgent):
    """설비 모니터링 및 분석 전문 에이전트"""
    
    def __init__(self, context_data: Optional[Dict[str, Any]] = None):
        tools = [ContextTool(context_data)]
        super().__init__(
            name="설비 분석 에이전트",
            description="설비 모니터링, 성능 분석 및 예측 정비 전문 AI",
            tools=tools
        )
        self.context_data = context_data or {}
    
    def _get_prompt_template(self) -> ChatPromptTemplate:
        """설비 분석용 프롬프트 템플릿"""
        # 🔥 사내 수정 포인트: 프롬프트를 사내 설비 관리 정책에 맞게 수정
        system_prompt = """
당신은 반도체 제조 설비 관리 전문 AI입니다.

🎯 주요 업무:
- 설비 가동률 분석 및 최적화
- 설비 이상 징후 감지 및 대응방안 제시
- 예방 정비 스케줄 최적화
- 설비별 성능 비교 분석

📊 분석 기준:
- 설비별 특성 및 운영 임계값
- 정비 이력과 성능 상관관계
- 생산 계획과 설비 할당 효율성
- 예방 정비 시점 판단

💡 출력 가이드라인:
- 한국어로 명확하고 구체적으로 작성
- 긴급도에 따른 우선순위 제시
- 실행 가능한 조치 방안 포함
- 수치 데이터 기반 객관적 분석

🔧 사용 도구:
- context_analyzer: 현재 화면의 설비 데이터 분석

🔥 TODO: 사내 설비 관리 정책에 맞게 수정 필요
- 실제 설비명과 코드로 변경 (EQP-001 → 실제 설비명)
- 사내 정비 기준 추가 (온도/압력/가동률 임계값)
- 알람 임계값을 실제 값으로 설정
- 정비 담당팀 및 연락처 정보 추가
        """
        
        return ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad")
        ])
    
    async def analyze_with_context(self, user_message: str, context_data: Optional[Dict[str, Any]] = None) -> str:
        """컨텍스트 기반 사용자 질문 분석 - 메인 분석 메서드"""
        # 🔥 사내 수정 포인트: 설비 관련 컨텍스트 데이터 해석 로직
        
        if context_data:
            self.tools = [ContextTool(context_data)]
            self.agent_executor = self._create_agent()
        
        prompt = f"""사용자 질문: {user_message}

현재 화면 정보:
- 페이지 타입: {context_data.get('pageType', 'N/A') if context_data else 'N/A'}
- 설비 수: {context_data.get('totalCount', 0) if context_data else 0}개

위 컨텍스트를 바탕으로 사용자 질문에 대해 구체적이고 실용적인 설비 분석을 제공해주세요.
먼저 context_analyzer 도구를 사용하여 현재 설비 데이터를 분석한 후 답변하세요."""
        
        return await self.analyze(prompt, context_data or {})
