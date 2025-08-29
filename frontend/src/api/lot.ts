import { apiClient } from './client';
import type { ApiResponse, LotData } from '@/types';

// Lot 관련 API
class LotApiService {
  // Lot 이력 조회
  async getLotHistory(fab?: string): Promise<ApiResponse<LotData[]>> {
    try {
      const response = await apiClient.getBackendApi().get('/lots/history', {
        params: { fab }
      });
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'getLotHistory');
      throw error;
    }
  }

  // Lot 상태 조회
  async getLotStatus(fab?: string): Promise<ApiResponse<LotData[]>> {
    try {
      const response = await apiClient.getBackendApi().get('/lots/status', {
        params: { fab }
      });
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'getLotStatus');
      throw error;
    }
  }

  // Lot 검색
  async searchLots(keyword: string, fab?: string): Promise<ApiResponse<LotData[]>> {
    try {
      const params: any = { keyword };
      if (fab && fab !== 'all') {
        params.fab = fab;
      }
      
      const response = await apiClient.getBackendApi().get('/lots/search', { params });
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'searchLots');
      throw error;
    }
  }

  // 특정 Lot 상세 정보
  async getLotDetails(lotNumber: string): Promise<ApiResponse<LotData>> {
    try {
      const response = await apiClient.getBackendApi().get(`/lots/${lotNumber}`);
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'getLotDetails');
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const lotApi = new LotApiService();
