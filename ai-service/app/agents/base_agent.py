from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain.tools import BaseTool
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema import BaseMessage
import structlog
from app.core.config import settings

logger = structlog.get_logger()

class BaseAgent(ABC):
    """Base class for all MES AI agents"""
    
    def __init__(self, name: str, description: str, tools: List[BaseTool]):
        self.name = name
        self.description = description
        self.tools = tools
        self.llm = ChatOpenAI(
            model=settings.OPENAI_MODEL,
            temperature=settings.OPENAI_TEMPERATURE,
            max_tokens=settings.OPENAI_MAX_TOKENS,
            api_key=settings.OPENAI_API_KEY
        )
        self.agent_executor = self._create_agent()
    
    def _create_agent(self) -> AgentExecutor:
        """Create the agent executor with tools"""
        prompt = self._get_prompt_template()
        
        agent = create_openai_tools_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=prompt
        )
        
        return AgentExecutor(
            agent=agent,
            tools=self.tools,
            verbose=True,
            max_iterations=settings.MAX_ITERATIONS,
            handle_parsing_errors=True
        )
    
    @abstractmethod
    def _get_prompt_template(self) -> ChatPromptTemplate:
        """Get the prompt template specific to this agent"""
        pass
    
    async def analyze(self, context: str, data: Optional[Dict[str, Any]] = None) -> str:
        """Analyze the given context and data"""
        try:
            logger.info(f"Starting analysis with {self.name}", context=context)
            
            # Prepare input for the agent
            input_data = {
                "input": self._prepare_input(context, data),
                "chat_history": []
            }
            
            # Execute the agent
            result = await self.agent_executor.ainvoke(input_data)
            
            logger.info(f"Analysis completed by {self.name}")
            return result["output"]
            
        except Exception as e:
            logger.error(f"Error in {self.name} analysis", error=str(e))
            return f"분석 중 오류가 발생했습니다: {str(e)}"
    
    def _prepare_input(self, context: str, data: Optional[Dict[str, Any]] = None) -> str:
        """Prepare input for the agent"""
        input_text = f"Context: {context}\n"
        
        if data:
            input_text += f"Additional Data: {data}\n"
        
        input_text += "\n사용자의 요청에 대해 상세한 분석을 제공해주세요."
        
        return input_text