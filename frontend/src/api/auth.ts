import { backendApi } from './client';
import { LoginRequest, LoginResponse, UserInfo, ApiResponse } from '@/types';
import { safeLog, maskSensitiveData } from '@/common/security';

export const authApi = {
  // 로그인
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    // 보안: 로그인 시도 로그 (비밀번호 마스킹)
    safeLog.info('로그인 시도:', maskSensitiveData(credentials));
    
    try {
      const response = await backendApi.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      
      // 성공 로그 (응답 데이터에서 토큰 마스킹)
      safeLog.info('로그인 성공:', { username: credentials.username });
      
      return response.data;
    } catch (error) {
      // 실패 로그 (에러 정보만, 민감한 데이터 제외)
      safeLog.error('로그인 실패:', { username: credentials.username, error: 'Authentication failed' });
      throw error;
    }
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
