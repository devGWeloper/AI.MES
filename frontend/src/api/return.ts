import { backendApi, apiClient } from './client';
import type { ApiResponse, ReturnHistory } from '@/types';

// Return 관련 API
class ReturnApiService {
  // 반송 이력 조회
  async getReturnHistory(fab?: string, keyword?: string): Promise<ApiResponse<ReturnHistory[]>> {
    try {
      const params: any = {};
      if (fab && fab !== 'all') params.fab = fab;
      if (keyword) params.keyword = keyword;
      
      const response = await backendApi.get('/returns/history', { params });
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'getReturnHistory');
      throw error;
    }
  }

  // 새 반송 생성
  async createReturn(returnData: Partial<ReturnHistory>): Promise<ApiResponse<ReturnHistory>> {
    try {
      const response = await backendApi.post('/returns', returnData);
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'createReturn');
      throw error;
    }
  }

  // 반송 상태 업데이트
  async updateReturnStatus(returnId: string, status: string): Promise<ApiResponse<ReturnHistory>> {
    try {
      const response = await backendApi.patch(`/returns/${returnId}/status`, { status });
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'updateReturnStatus');
      throw error;
    }
  }

  // 특정 반송 상세 정보
  async getReturnDetails(returnId: string): Promise<ApiResponse<ReturnHistory>> {
    try {
      const response = await backendApi.get(`/returns/${returnId}`);
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'getReturnDetails');
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const returnApi = new ReturnApiService();
