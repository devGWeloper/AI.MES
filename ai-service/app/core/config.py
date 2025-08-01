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
    
    # Vector Store Configuration
    VECTOR_STORE_TYPE: str = "faiss"  # or "chroma"
    VECTOR_STORE_PATH: str = "./data/vector_store"
    EMBEDDING_MODEL: str = "text-embedding-ada-002"
    
    # Database Configuration (for tools)
    # M14 Database
    M14_DB_URL: str = os.getenv("M14_DB_URL", "oracle://m14_user:m14_password@localhost:1521/M14DB")
    
    # M15 Database
    M15_DB_URL: str = os.getenv("M15_DB_URL", "oracle://m15_user:m15_password@localhost:1521/M15DB")
    
    # M16 Database
    M16_DB_URL: str = os.getenv("M16_DB_URL", "oracle://m16_user:m16_password@localhost:1521/M16DB")
    
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