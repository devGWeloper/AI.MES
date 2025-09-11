import { aiApi, apiClient } from './client';
import type { ApiResponse, AIAnalysisRequest, AIAnalysisResponse } from '@/types';

// AI Analysis 관련 API
class AIAnalysisApiService {
  // Lot 데이터 AI 분석
  async analyzeLotData(request: AIAnalysisRequest): Promise<ApiResponse<AIAnalysisResponse>> {
    try {
      const response = await aiApi.post('/analyze/lot', request);
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'analyzeLotData');
      throw error;
    }
  }

  // 설비 데이터 AI 분석
  async analyzeEquipmentData(request: AIAnalysisRequest): Promise<ApiResponse<AIAnalysisResponse>> {
    try {
      const response = await aiApi.post('/analyze/equipment', request);
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'analyzeEquipmentData');
      throw error;
    }
  }

  // 반송 데이터 AI 분석
  async analyzeReturnData(request: AIAnalysisRequest): Promise<ApiResponse<AIAnalysisResponse>> {
    try {
      const response = await aiApi.post('/analyze/return', request);
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'analyzeReturnData');
      throw error;
    }
  }

  // 상태 인사이트 분석
  async getStatusInsights(request: AIAnalysisRequest): Promise<ApiResponse<AIAnalysisResponse>> {
    try {
      const response = await aiApi.post('/analyze/status', request);
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'getStatusInsights');
      throw error;
    }
  }

  // 채팅 기반 분석 (AIChatPanel용)
  async chatAnalysis(message: string, agentType: string, context?: any): Promise<ApiResponse<AIAnalysisResponse>> {
    try {
      const request = {
        message,
        agentType,
        context,
        timestamp: new Date().toISOString()
      };
      
      const response = await aiApi.post('/analyze/chat', request);
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'chatAnalysis');
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const aiAnalysisApi = new AIAnalysisApiService();
