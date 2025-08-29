import { apiClient } from './client';
import type { ApiResponse, EquipmentData } from '@/types';

// Equipment 관련 API
class EquipmentApiService {
  // 설비 이력 조회
  async getEquipmentHistory(fab?: string): Promise<ApiResponse<EquipmentData[]>> {
    try {
      const response = await apiClient.getBackendApi().get('/equipment/history', {
        params: { fab }
      });
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'getEquipmentHistory');
      throw error;
    }
  }

  // 설비 상태 조회
  async getEquipmentStatus(fab?: string): Promise<ApiResponse<EquipmentData[]>> {
    try {
      const response = await apiClient.getBackendApi().get('/equipment/status', {
        params: { fab }
      });
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'getEquipmentStatus');
      throw error;
    }
  }

  // 설비 검색
  async searchEquipment(keyword: string, fab?: string): Promise<ApiResponse<any[]>> {
    try {
      const params: any = { keyword };
      if (fab && fab !== 'all') {
        params.fab = fab;
      }
      
      const response = await apiClient.getBackendApi().get('/equipment/search', { params });
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'searchEquipment');
      throw error;
    }
  }

  // 특정 설비 상세 정보
  async getEquipmentDetails(equipmentId: string): Promise<ApiResponse<EquipmentData>> {
    try {
      const response = await apiClient.getBackendApi().get(`/equipment/${equipmentId}`);
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'getEquipmentDetails');
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const equipmentApi = new EquipmentApiService();
