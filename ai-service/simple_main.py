from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
from datetime import datetime

app = FastAPI(
    title="AI MES Service (Simple)",
    description="Simplified AI-powered Manufacturing Execution System Analysis Service",
    version="1.0.0-simple"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발용으로 모든 origin 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    analysis: str
    recommendations: Optional[list] = None
    alerts: Optional[list] = None
    timestamp: datetime

@app.get("/")
async def root():
    return {"status": "healthy", "message": "AI MES Service (Simple) is running", "version": "1.0.0-simple"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Service is operational", "version": "1.0.0-simple"}

@app.post("/api/analyze/chat")
async def analyze_chat_message(request: Dict[str, Any]):
    try:
        message = request.get("message", "")
        agent_type = request.get("agentType", "general")
        context_data = request.get("context")
        
        if not message.strip():
            raise HTTPException(status_code=400, detail="Message is required")
        
        # 컨텍스트 기반 분석 생성
        analysis = generate_context_analysis(message, agent_type, context_data)
        
        # 간단한 추천사항과 알림 추출
        recommendations = extract_recommendations(analysis)
        alerts = extract_alerts(analysis)
        
        return AnalysisResponse(
            analysis=analysis,
            recommendations=recommendations,
            alerts=alerts,
            timestamp=datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat analysis failed: {str(e)}")

def generate_context_analysis(message: str, agent_type: str, context_data: Optional[Dict[str, Any]]) -> str:
    """컨텍스트 기반 분석 생성"""
    
    if not context_data:
        return f"""질문에 대한 분석을 제공합니다.

사용자 질문: "{message}"

현재 컨텍스트 정보가 없어 일반적인 답변을 제공합니다.
더 정확한 분석을 위해서는 화면의 데이터와 함께 질문해주세요.

권장사항:
- 구체적인 데이터나 조건을 포함하여 질문해주세요
- 특정 팹이나 기간을 명시하면 더 정확한 답변이 가능합니다
"""

    page_type = context_data.get('pageType', '')
    total_count = context_data.get('totalCount', 0)
    
    if page_type == 'lot_history':
        return generate_lot_analysis(message, context_data)
    elif page_type == 'equipment_history':
        return generate_equipment_analysis(message, context_data)
    elif page_type == 'return_history':
        return generate_return_analysis(message, context_data)
    else:
        return f"""질문: "{message}"

컨텍스트 정보를 바탕으로 분석을 제공합니다.
- 페이지 타입: {page_type}
- 데이터 수: {total_count}개

더 구체적인 분석을 위해 추가 정보가 필요합니다.
"""

def generate_lot_analysis(message: str, context_data: Dict[str, Any]) -> str:
    """Lot 데이터 기반 분석"""
    lot_data = context_data.get('lotData', [])
    search_term = context_data.get('searchTerm', '')
    selected_fab = context_data.get('selectedFab', 'all')
    total_count = len(lot_data)
    
    if not lot_data:
        return f"""Lot 분석 결과

질문: "{message}"

현재 조회된 Lot 데이터가 없습니다.
- 검색어: {search_term}
- 선택된 팹: {selected_fab}

권장사항:
- LOT 번호를 정확히 입력했는지 확인해주세요
- 다른 팹에서 검색해보세요
- 검색 조건을 넓혀서 다시 시도해주세요
"""

    # 데이터 분석
    fabs = list(set(lot.get('fab', '') for lot in lot_data))
    statuses = list(set(lot.get('status', '') for lot in lot_data))
    products = list(set(lot.get('product', '') for lot in lot_data))
    
    # 상태별 통계
    status_counts = {}
    for lot in lot_data:
        status = lot.get('status', 'unknown')
        status_counts[status] = status_counts.get(status, 0) + 1
    
    analysis = f"""🔍 Lot 분석 결과

질문: "{message}"

📊 현재 데이터 현황:
- 총 Lot 수: {total_count}개
- 검색어: {search_term}
- 대상 팹: {', '.join(fabs)}
- 제품: {', '.join(products[:3])}{'...' if len(products) > 3 else ''}

📈 상태별 분포:"""

    for status, count in status_counts.items():
        percentage = (count / total_count) * 100
        analysis += f"\n- {translate_status(status)}: {count}개 ({percentage:.1f}%)"
    
    analysis += f"""

💡 주요 인사이트:
- 검색된 {total_count}개 Lot의 상태 분포가 확인되었습니다
- {fabs[0] if fabs else 'N/A'} 팹에서 주로 처리되고 있습니다"""

    if 'completed' in status_counts and status_counts['completed'] > 0:
        completion_rate = (status_counts['completed'] / total_count) * 100
        analysis += f"\n- 완료율: {completion_rate:.1f}% (양호)"
    
    if 'error' in status_counts and status_counts['error'] > 0:
        error_rate = (status_counts['error'] / total_count) * 100
        analysis += f"\n- 오류율: {error_rate:.1f}% (주의 필요)"

    analysis += """

🎯 권장사항:
- 진행 중인 Lot들의 예상 완료 시간을 모니터링하세요
- 오류 상태의 Lot이 있다면 우선 처리가 필요합니다
- 팹별 처리 효율성을 비교 분석해보세요"""

    return analysis

def generate_equipment_analysis(message: str, context_data: Dict[str, Any]) -> str:
    """설비 데이터 기반 분석"""
    equipment_data = context_data.get('equipmentData', [])
    search_term = context_data.get('searchTerm', '')
    selected_fab = context_data.get('selectedFab', 'all')
    selected_status = context_data.get('selectedStatus', 'all')
    total_count = len(equipment_data)
    
    if not equipment_data:
        return f"""🔧 설비 분석 결과

질문: "{message}"

현재 조회된 설비 데이터가 없습니다.
- 검색어: {search_term}
- 선택된 팹: {selected_fab}
- 선택된 상태: {selected_status}

권장사항:
- 설비 ID 또는 설비명을 정확히 입력했는지 확인해주세요
- 다른 팹에서 검색해보세요
- 상태 필터를 변경해서 다시 시도해주세요
"""

    # 데이터 분석
    fabs = list(set(eq.get('fab', '') for eq in equipment_data))
    statuses = list(set(eq.get('status', '') for eq in equipment_data))
    results = list(set(eq.get('result', '') for eq in equipment_data))
    
    # 상태별 통계
    status_counts = {}
    result_counts = {}
    
    for eq in equipment_data:
        status = eq.get('status', 'unknown')
        result = eq.get('result', 'unknown')
        status_counts[status] = status_counts.get(status, 0) + 1
        result_counts[result] = result_counts.get(result, 0) + 1
    
    analysis = f"""🔧 설비 분석 결과

질문: "{message}"

📊 현재 설비 현황:
- 총 설비 수: {total_count}개
- 검색어: {search_term}
- 대상 팹: {', '.join(fabs)}

📈 상태별 분포:"""

    for status, count in status_counts.items():
        percentage = (count / total_count) * 100
        analysis += f"\n- {status}: {count}개 ({percentage:.1f}%)"
    
    analysis += f"""

🎯 결과별 분포:"""

    for result, count in result_counts.items():
        percentage = (count / total_count) * 100
        analysis += f"\n- {result}: {count}개 ({percentage:.1f}%)"

    analysis += f"""

💡 주요 인사이트:
- 총 {total_count}개 설비의 운영 현황이 분석되었습니다"""

    if 'N/A' not in results and results:
        normal_count = result_counts.get('정상', 0)
        if normal_count > 0:
            normal_rate = (normal_count / total_count) * 100
            analysis += f"\n- 정상 운영률: {normal_rate:.1f}%"
        
        warning_count = result_counts.get('경고', 0)
        if warning_count > 0:
            warning_rate = (warning_count / total_count) * 100
            analysis += f"\n- 경고 상태: {warning_rate:.1f}% (점검 필요)"

    analysis += """

🔍 권장사항:
- 경고 상태의 설비는 우선적으로 점검이 필요합니다
- 설비별 가동률을 지속적으로 모니터링하세요
- 정비 스케줄을 최적화하여 다운타임을 최소화하세요"""

    return analysis

def generate_return_analysis(message: str, context_data: Dict[str, Any]) -> str:
    """반송 데이터 기반 분석"""
    return_data = context_data.get('returnData', [])
    search_term = context_data.get('searchTerm', '')
    selected_fab = context_data.get('selectedFab', 'all')
    selected_severity = context_data.get('selectedSeverity', 'all')
    summary_stats = context_data.get('summaryStats', {})
    total_count = len(return_data)
    
    if not return_data:
        return f"""🔄 반송 분석 결과

질문: "{message}"

현재 조회된 반송 데이터가 없습니다.
- 검색어: {search_term}
- 선택된 팹: {selected_fab}
- 선택된 심각도: {selected_severity}

권장사항:
- 반송 ID 또는 LOT 번호를 정확히 입력했는지 확인해주세요
- 다른 팹에서 검색해보세요
- 심각도 필터를 변경해서 다시 시도해주세요
"""

    # 데이터 분석
    fabs = list(set(ret.get('fab', '') for ret in return_data))
    severities = list(set(ret.get('severity', '') for ret in return_data))
    reasons = list(set(ret.get('returnReason', '') for ret in return_data))
    
    analysis = f"""🔄 반송 분석 결과

질문: "{message}"

📊 반송 현황 요약:
- 총 반송 건수: {summary_stats.get('totalReturns', total_count)}개
- 해결완료: {summary_stats.get('resolvedCount', 0)}개
- 처리중: {summary_stats.get('inProgressCount', 0)}개
- High 심각도: {summary_stats.get('highSeverityCount', 0)}개

📈 현재 검색 결과:
- 검색된 반송: {total_count}개
- 대상 팹: {', '.join(fabs)}
- 심각도: {', '.join(severities)}

🔍 주요 반송 사유:"""

    # 반송 사유별 통계 (상위 5개)
    reason_counts = {}
    for ret in return_data:
        reason = ret.get('returnReason', 'unknown')
        reason_counts[reason] = reason_counts.get(reason, 0) + 1
    
    sorted_reasons = sorted(reason_counts.items(), key=lambda x: x[1], reverse=True)
    for reason, count in sorted_reasons[:5]:
        percentage = (count / total_count) * 100
        analysis += f"\n- {reason}: {count}건 ({percentage:.1f}%)"

    # 심각도 분석
    high_severity_count = summary_stats.get('highSeverityCount', 0)
    total_returns = summary_stats.get('totalReturns', total_count)
    
    if high_severity_count > 0 and total_returns > 0:
        high_severity_rate = (high_severity_count / total_returns) * 100
        analysis += f"""

⚠️ 심각도 분석:
- High 심각도 비율: {high_severity_rate:.1f}%"""
        
        if high_severity_rate > 20:
            analysis += " (높음 - 주의 필요)"
        elif high_severity_rate > 10:
            analysis += " (보통)"
        else:
            analysis += " (낮음 - 양호)"

    # 해결률 분석
    resolved_count = summary_stats.get('resolvedCount', 0)
    if total_returns > 0:
        resolution_rate = (resolved_count / total_returns) * 100
        analysis += f"""

📈 처리 효율성:
- 해결률: {resolution_rate:.1f}%"""
        
        if resolution_rate > 80:
            analysis += " (우수)"
        elif resolution_rate > 60:
            analysis += " (양호)"
        else:
            analysis += " (개선 필요)"

    analysis += """

🎯 권장사항:
- High 심각도 반송의 근본 원인 분석을 우선 실시하세요
- 반복적으로 발생하는 반송 사유에 대한 예방책을 수립하세요
- 팹별 반송 패턴을 분석하여 개선점을 도출하세요
- 반송 해결 시간을 단축할 수 있는 방안을 검토하세요"""

    return analysis

def translate_status(status: str) -> str:
    """상태 번역"""
    translations = {
        'completed': '완료',
        'in_progress': '진행중',
        'waiting': '대기',
        'error': '오류',
        'pending': '대기중'
    }
    return translations.get(status, status)

def extract_recommendations(analysis: str) -> list:
    """분석에서 권장사항 추출"""
    recommendations = []
    lines = analysis.split('\n')
    in_recommendations = False
    
    for line in lines:
        line = line.strip()
        if '권장사항' in line or '🎯' in line:
            in_recommendations = True
            continue
        elif in_recommendations and line.startswith('-'):
            recommendations.append(line[1:].strip())
        elif in_recommendations and line and not line.startswith('-'):
            in_recommendations = False
    
    return recommendations[:5]  # 최대 5개

def extract_alerts(analysis: str) -> list:
    """분석에서 알림 추출"""
    alerts = []
    lines = analysis.split('\n')
    
    for line in lines:
        line = line.strip()
        if '주의 필요' in line or '경고' in line or '⚠️' in line or '높음' in line:
            alerts.append(line)
    
    return alerts[:3]  # 최대 3개

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "simple_main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
