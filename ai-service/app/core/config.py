from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "AI MES Service"
    VERSION: str = "1.0.0"
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8080",
        "https://*.mes.ai"
    ]
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-4"
    OPENAI_TEMPERATURE: float = 0.7
    OPENAI_MAX_TOKENS: int = 2000
    
    # 🔥 사내 수정 포인트: 필요시 벡터 스토어 설정 추가
    # VECTOR_STORE_TYPE: str = "faiss"
    # VECTOR_STORE_PATH: str = "./data/vector_store" 
    # EMBEDDING_MODEL: str = "text-embedding-ada-002"
    
    # Database Configuration (for tools) - Currently using mock data
    # TODO: Implement actual database connections when needed
    # M14_DB_URL: str = os.getenv("M14_DB_URL", "")
    # M15_DB_URL: str = os.getenv("M15_DB_URL", "")
    # M16_DB_URL: str = os.getenv("M16_DB_URL", "")
    
    # Agent Configuration
    MAX_ITERATIONS: int = 10
    AGENT_TIMEOUT: int = 30  # seconds
    
    # Logging Configuration
    LOG_LEVEL: str = "INFO"
    
    # Development Configuration
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()