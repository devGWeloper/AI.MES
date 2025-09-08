import { apiClient } from './client';
import { LoginRequest, LoginResponse, UserInfo, ApiResponse } from '@/types';

export const authApi = {
  // 로그인
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/backend/auth/login', credentials);
    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/backend/auth/logout');
    return response.data;
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<ApiResponse<UserInfo>> => {
    const response = await apiClient.get<ApiResponse<UserInfo>>('/backend/auth/me');
    return response.data;
  },

  // 토큰 유효성 검사
  validateToken: async (): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.get<ApiResponse<boolean>>('/backend/auth/validate');
    return response.data;
  },
};
