from typing import List, Dict, Any, Optional
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools import BaseTool
import structlog

from app.agents.base_agent import BaseAgent
from app.tools.return_tools import ReturnHistoryTool, ReturnAnalysisTool

logger = structlog.get_logger()

class ReturnAgent(BaseAgent):
    """Specialized agent for return/rework analysis"""
    
    def __init__(self):
        tools = [
            ReturnHistoryTool(),
            ReturnAnalysisTool()
        ]
        super().__init__(
            name="Return Analysis Agent", 
            description="반송 및 재작업 분석, 품질 개선 전문 AI Agent",
            tools=tools
        )
    
    def _get_prompt_template(self) -> ChatPromptTemplate:
        """Get prompt template for return analysis"""
        system_prompt = """
당신은 반도체 제조 품질 관리 및 반송 분석 전문가입니다.

주요 역할:
1. 반송 및 재작업 이력 분석
2. 반송 원인 및 패턴 분석  
3. 품질 문제 근본 원인 규명
4. 재발 방지 대책 수립
5. 품질 개선 및 수율 향상 방안 제시

분석 시 고려사항:
- 각 팹(M14, M15, M16)별 반송 패턴
- 공정 단계별 반송 발생률 분석
- 반송 사유별 심각도 및 영향도 평가
- 설비 및 공정 조건과의 연관성 분석
- 반송 해결 시간 및 효율성 평가

출력 형식:
- 한국어로 명확하고 이해하기 쉽게 작성
- 구체적인 통계 및 트렌드 정보 포함
- 우선순위가 높은 문제부터 제시
- 실행 가능한 개선 방안 및 예방책 제안

사용 가능한 도구:
- return_history_query: 반송 이력 조회
- return_analysis_query: 반송 패턴 및 트렌드 분석

각 요청에 대해 관련 반송 데이터를 먼저 조회한 후, 근본 원인 분석과 개선 방안을 제공하세요.
        """
        
        return ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad")
        ])
    
    async def analyze_return_history(self, fab: Optional[str] = None) -> str:
        """Analyze return history and patterns"""
        context = f"반송 이력을 종합적으로 분석해주세요"
        if fab:
            context += f" (팹: {fab})"
        
        context += """
        
다음 관점에서 분석해주세요:
1. 최근 반송 발생 현황 및 트렌드
2. 팹별/제품별 반송률 비교
3. 주요 반송 사유 및 발생 공정
4. 반송 해결 시간 및 처리 효율성
5. 반복적으로 발생하는 문제 식별
        """
        
        return await self.analyze(context, {"fab": fab, "analysis_type": "history"})
    
    async def analyze_return_patterns(self, fab: Optional[str] = None) -> str:
        """Analyze return patterns and root causes"""
        context = f"반송 패턴과 근본 원인을 분석해주세요"
        if fab:
            context += f" (팹: {fab})"
        
        context += """
        
다음 관점에서 심층 분석해주세요:
1. 반송 발생 패턴 및 주기성 분석
2. 공정별/설비별 반송 발생률
3. 품질 불량 유형별 분포 및 특성
4. 반송 원인별 근본 원인 분석
5. 연관성 분석 (시간, 조건, 환경 등)
        """
        
        return await self.analyze(context, {"fab": fab, "analysis_type": "patterns"})
    
    async def recommend_improvements(self, fab: Optional[str] = None) -> str:
        """Recommend quality improvements and prevention measures"""
        context = f"품질 개선 및 반송 예방 방안을 제시해주세요"
        if fab:
            context += f" (팹: {fab})"
        
        context += """
        
다음 관점에서 개선 방안을 제시해주세요:
1. 단기적 개선 방안 (즉시 실행 가능)
2. 중장기적 개선 계획 (시스템 개선)
3. 공정 조건 최적화 방안
4. 예방적 품질 관리 체계 구축
5. 모니터링 강화 및 조기 감지 시스템
6. 교육 및 인식 개선 방안
        """
        
        return await self.analyze(context, {"fab": fab, "analysis_type": "improvements"})
    
    async def analyze_return_impact(self, severity: Optional[str] = None) -> str:
        """Analyze business impact of returns"""
        context = f"반송이 생산성과 비용에 미치는 영향을 분석해주세요"
        if severity:
            context += f" (심각도: {severity})"
        
        context += """
        
다음 관점에서 영향도를 분석해주세요:
1. 반송으로 인한 생산 지연 영향
2. 추가 비용 및 자원 소모 분석
3. 설비 가동률 및 효율성 영향
4. 납기 준수율 및 고객 만족도 영향
5. 수율 저하 및 품질 비용 분석
        """
        
        return await self.analyze(context, {"severity": severity, "analysis_type": "impact"})