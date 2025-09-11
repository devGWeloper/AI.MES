import { backendApi } from './client';
import { LoginRequest, LoginResponse, UserInfo, ApiResponse } from '@/types';

export const authApi = {
  // 로그인
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await backendApi.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await backendApi.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<ApiResponse<UserInfo>> => {
    const response = await backendApi.get<ApiResponse<UserInfo>>('/auth/me');
    return response.data;
  },

  // 토큰 유효성 검사
  validateToken: async (): Promise<ApiResponse<boolean>> => {
    const response = await backendApi.get<ApiResponse<boolean>>('/auth/validate');
    return response.data;
  },
};
