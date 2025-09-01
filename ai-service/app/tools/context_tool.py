"""
간소화된 Context Tool - 프론트엔드에서 전달받은 데이터만 활용
🔥 사내 수정 포인트: 실제 데이터 소스와 연동할 때 이 파일만 수정하면 됩니다
"""

from langchain.tools import BaseTool
from typing import Type, Optional, Dict, Any
from pydantic import BaseModel, Field
import structlog
import json

logger = structlog.get_logger()

class ContextInput(BaseModel):
    """Context tool input"""
    context_type: str = Field(description="Type of context data to analyze")
    
class ContextTool(BaseTool):
    """단순화된 컨텍스트 기반 데이터 분석 도구"""
    name = "context_analyzer"
    description = "프론트엔드에서 전달받은 컨텍스트 데이터를 분석합니다"
    args_schema: Type[BaseModel] = ContextInput
    context_data: Dict[str, Any] = Field(default_factory=dict)
    
    def __init__(self, context_data: Optional[Dict[str, Any]] = None, **kwargs):
        super().__init__(context_data=context_data or {}, **kwargs)
    
    def _run(self, context_type: str = "general") -> str:
        """컨텍스트 데이터 분석 실행"""
        try:
            if not self.context_data:
                return "분석할 컨텍스트 데이터가 없습니다."
            
            # 페이지 타입에 따른 데이터 분석
            page_type = self.context_data.get('pageType', '')
            
            if 'lot' in page_type.lower():
                return self._analyze_lot_context()
            elif 'equipment' in page_type.lower():
                return self._analyze_equipment_context()
            elif 'return' in page_type.lower():
                return self._analyze_return_context()
            else:
                return self._analyze_general_context()
                
        except Exception as e:
            logger.error("Context analysis error", error=str(e))
            return f"컨텍스트 분석 중 오류 발생: {str(e)}"
    
    def _analyze_lot_context(self) -> str:
        """LOT 컨텍스트 데이터 분석"""
        lot_data = self.context_data.get('lotData', [])
        search_term = self.context_data.get('searchTerm', '')
        selected_fab = self.context_data.get('selectedFab', 'all')
        total_count = len(lot_data)
        
        # 🔥 사내 수정 포인트: 실제 LOT 데이터 분석 로직으로 변경
        if not lot_data:
            return f"LOT 데이터가 없습니다. (검색어: {search_term}, 팹: {selected_fab})"
        
        # 기본 통계 생성
        fabs = list(set(lot.get('fab', '') for lot in lot_data))
        statuses = list(set(lot.get('status', '') for lot in lot_data))
        products = list(set(lot.get('product', '') for lot in lot_data))
        
        result = f"""📊 LOT 데이터 분석 결과:
총 LOT 수: {total_count}개
팹: {', '.join(fabs)}
상태: {', '.join(statuses)}
제품: {', '.join(products[:3])}{'...' if len(products) > 3 else ''}

주요 LOT 정보:"""
        
        # 상위 5개 LOT 정보 표시
        for i, lot in enumerate(lot_data[:5]):
            result += f"\n{i+1}. {lot.get('lotNumber', 'N/A')}: {lot.get('product', 'N/A')} ({lot.get('fab', 'N/A')}) - {lot.get('status', 'N/A')}"
        
        if total_count > 5:
            result += f"\n... 외 {total_count - 5}개"
            
        return result
    
    def _analyze_equipment_context(self) -> str:
        """설비 컨텍스트 데이터 분석"""
        equipment_data = self.context_data.get('equipmentData', [])
        search_term = self.context_data.get('searchTerm', '')
        selected_fab = self.context_data.get('selectedFab', 'all')
        selected_status = self.context_data.get('selectedStatus', 'all')
        total_count = len(equipment_data)
        
        # 🔥 사내 수정 포인트: 실제 설비 데이터 분석 로직으로 변경
        if not equipment_data:
            return f"설비 데이터가 없습니다. (검색어: {search_term}, 팹: {selected_fab}, 상태: {selected_status})"
        
        fabs = list(set(eq.get('fab', '') for eq in equipment_data))
        statuses = list(set(eq.get('status', '') for eq in equipment_data))
        
        result = f"""🔧 설비 데이터 분석 결과:
총 설비 수: {total_count}개
팹: {', '.join(fabs)}
상태: {', '.join(statuses)}

주요 설비 정보:"""
        
        for i, eq in enumerate(equipment_data[:5]):
            result += f"\n{i+1}. {eq.get('equipmentId', 'N/A')}: {eq.get('fab', 'N/A')} - {eq.get('status', 'N/A')}"
        
        if total_count > 5:
            result += f"\n... 외 {total_count - 5}개"
            
        return result
    
    def _analyze_return_context(self) -> str:
        """반송 컨텍스트 데이터 분석"""
        return_data = self.context_data.get('returnData', [])
        summary_stats = self.context_data.get('summaryStats', {})
        search_term = self.context_data.get('searchTerm', '')
        selected_fab = self.context_data.get('selectedFab', 'all')
        total_count = len(return_data)
        
        # 🔥 사내 수정 포인트: 실제 반송 데이터 분석 로직으로 변경
        if not return_data:
            return f"반송 데이터가 없습니다. (검색어: {search_term}, 팹: {selected_fab})"
        
        result = f"""🔄 반송 데이터 분석 결과:
총 반송 건수: {summary_stats.get('totalReturns', total_count)}개
해결완료: {summary_stats.get('resolvedCount', 0)}개
처리중: {summary_stats.get('inProgressCount', 0)}개
High 심각도: {summary_stats.get('highSeverityCount', 0)}개

주요 반송 정보:"""
        
        for i, ret in enumerate(return_data[:5]):
            result += f"\n{i+1}. {ret.get('returnId', 'N/A')}: {ret.get('severity', 'N/A')} - {ret.get('status', 'N/A')}"
        
        if total_count > 5:
            result += f"\n... 외 {total_count - 5}개"
            
        return result
    
    def _analyze_general_context(self) -> str:
        """일반 컨텍스트 분석"""
        return f"컨텍스트 데이터: {json.dumps(self.context_data, ensure_ascii=False, indent=2)}"
