// API 클라이언트 메인 export 파일
export { apiClient, backendApi, aiApi } from './client';

// 도메인별 API 서비스들
export { lotApi } from './lot';
export { equipmentApi } from './equipment';
export { returnApi } from './return';
export { aiAnalysisApi } from './ai';

// 기존 호환성을 위한 re-export
export { apiClient as default } from './client';

// 타입들 re-export (편의를 위해)
export type { ApiResponse, LotData, EquipmentData, ReturnHistory, AIAnalysisRequest, AIAnalysisResponse } from '@/types';
