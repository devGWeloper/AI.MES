import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API 클라이언트 기본 설정
class BaseApiClient {
  private backendApi: AxiosInstance;
  private aiApi: AxiosInstance;

  constructor() {
    // 백엔드 API 인스턴스
    this.backendApi = axios.create({
      baseURL: '/api/backend',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30초 타임아웃
    });

    // AI 서비스 API 인스턴스
    this.aiApi = axios.create({
      baseURL: '/api/ai',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 60000, // AI 분석은 더 긴 타임아웃
    });

    this.setupInterceptors();
  }

  // 인터셉터 설정
  private setupInterceptors() {
    // 백엔드 요청 인터셉터
    this.backendApi.interceptors.request.use(
      (config) => {
        // 토큰이 있으면 헤더에 추가
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('authToken') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data);
        return config;
      },
      (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );

    // 백엔드 응답 인터셉터
    this.backendApi.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`[API Response] ${response.config.url}`, response.data);
        return response;
      },
      (error: AxiosError) => {
        console.error('[Backend API Error]', error.response?.data || error.message);
        
        // 401 에러시 토큰 삭제 및 로그인 페이지로 리다이렉트
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          // window.location.href = '/login'; // 필요시 활성화
        }
        
        return Promise.reject(error);
      }
    );

    // AI API 인터셉터
    this.aiApi.interceptors.request.use(
      (config) => {
        console.log(`[AI API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
        return config;
      },
      (error) => {
        console.error('[AI API Request Error]', error);
        return Promise.reject(error);
      }
    );

    this.aiApi.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`[AI API Response] ${response.config.url}`, response.data);
        return response;
      },
      (error: AxiosError) => {
        console.error('[AI API Error]', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // 에러 핸들링 헬퍼 (외부에서 접근 가능하도록)
  public handleError(error: any, context: string): never {
    console.error(`[${context}] API 에러:`, error);
    
    if (error.response) {
      // 서버 응답이 있는 경우
      const message = error.response.data?.message || error.response.data?.error || '서버 오류가 발생했습니다.';
      throw new Error(message);
    } else if (error.request) {
      // 요청은 했지만 응답이 없는 경우
      throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
    } else {
      // 요청 설정 중 오류 발생
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }

  // 유틸리티 메서드들
  
  // 파일 다운로드
  async downloadFile(url: string, filename: string): Promise<void> {
    try {
      const response = await this.backendApi.get(url, {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      this.handleError(error, 'downloadFile');
    }
  }

  // 헬스 체크
  async healthCheck(): Promise<{ backend: boolean; ai: boolean }> {
    const results = { backend: false, ai: false };
    
    try {
      await this.backendApi.get('/health');
      results.backend = true;
    } catch (error) {
      console.warn('Backend health check failed:', error);
    }
    
    try {
      await this.aiApi.get('/health');
      results.ai = true;
    } catch (error) {
      console.warn('AI service health check failed:', error);
    }
    
    return results;
  }

  // 직접 axios 인스턴스 접근 (필요시)
  getBackendApi(): AxiosInstance {
    return this.backendApi;
  }

  getAiApi(): AxiosInstance {
    return this.aiApi;
  }
}

// 싱글톤 인스턴스 생성
export const apiClient = new BaseApiClient();

// 기존 호환성을 위한 exports
export const backendApi = apiClient.getBackendApi();
export const aiApi = apiClient.getAiApi();
export default apiClient;
