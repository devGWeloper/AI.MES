from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import structlog
import os
from dotenv import load_dotenv

from app.core.config import settings
from app.services.analysis_service import AnalysisService
from app.models.schemas import (
    AnalysisRequest, 
    AnalysisResponse,
    HealthResponse
)

# Load environment variables
load_dotenv()

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Global services
analysis_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events"""
    global analysis_service
    
    logger.info("Starting AI MES Service...")
    
    # Initialize services
    analysis_service = AnalysisService()
    await analysis_service.initialize()
    
    logger.info("AI MES Service started successfully")
    
    yield
    
    logger.info("Shutting down AI MES Service...")
    if analysis_service:
        await analysis_service.cleanup()
    logger.info("AI MES Service shutdown complete")

# Create FastAPI app
app = FastAPI(
    title="AI MES Service",
    description="AI-powered Manufacturing Execution System Analysis Service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint"""
    return HealthResponse(
        status="healthy",
        message="AI MES Service is running",
        version="1.0.0"
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="Service is operational",
        version="1.0.0"
    )

@app.post("/api/analyze/lot", response_model=AnalysisResponse)
async def analyze_lot_data(request: AnalysisRequest):
    """Analyze lot data using AI"""
    try:
        logger.info("Received lot analysis request", context=request.context, type=request.type)
        
        if not analysis_service:
            raise HTTPException(status_code=503, detail="Analysis service not initialized")
        
        result = await analysis_service.analyze_lot_data(request)
        
        logger.info("Lot analysis completed successfully")
        return result
        
    except Exception as e:
        logger.error("Error in lot analysis", error=str(e))
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/analyze/equipment", response_model=AnalysisResponse)
async def analyze_equipment_data(request: AnalysisRequest):
    """Analyze equipment data using AI"""
    try:
        logger.info("Received equipment analysis request", context=request.context, type=request.type)
        
        if not analysis_service:
            raise HTTPException(status_code=503, detail="Analysis service not initialized")
        
        result = await analysis_service.analyze_equipment_data(request)
        
        logger.info("Equipment analysis completed successfully")
        return result
        
    except Exception as e:
        logger.error("Error in equipment analysis", error=str(e))
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/analyze/return", response_model=AnalysisResponse)
async def analyze_return_data(request: AnalysisRequest):
    """Analyze return data using AI"""
    try:
        logger.info("Received return analysis request", context=request.context, type=request.type)
        
        if not analysis_service:
            raise HTTPException(status_code=503, detail="Analysis service not initialized")
        
        result = await analysis_service.analyze_return_data(request)
        
        logger.info("Return analysis completed successfully")
        return result
        
    except Exception as e:
        logger.error("Error in return analysis", error=str(e))
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/analyze/status", response_model=AnalysisResponse)
async def get_status_insights(request: AnalysisRequest):
    """Get status monitoring insights using AI"""
    try:
        logger.info("Received status insights request", context=request.context, type=request.type)
        
        if not analysis_service:
            raise HTTPException(status_code=503, detail="Analysis service not initialized")
        
        result = await analysis_service.get_status_insights(request)
        
        logger.info("Status insights generated successfully")
        return result
        
    except Exception as e:
        logger.error("Error generating status insights", error=str(e))
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/analyze/chat", response_model=AnalysisResponse)
async def analyze_chat_message(request: dict):
    """Analyze chat message with context using appropriate agent"""
    try:
        message = request.get("message", "")
        agent_type = request.get("agentType", "general")
        context_data = request.get("context")
        
        logger.info("Received chat analysis request", 
                   message_length=len(message), 
                   agent_type=agent_type, 
                   has_context=bool(context_data))
        
        if not analysis_service:
            raise HTTPException(status_code=503, detail="Analysis service not initialized")
        
        if not message.strip():
            raise HTTPException(status_code=400, detail="Message is required")
        
        result = await analysis_service.analyze_chat_message(message, agent_type, context_data)
        
        logger.info("Chat analysis completed successfully")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error in chat analysis", error=str(e))
        raise HTTPException(status_code=500, detail=f"Chat analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )