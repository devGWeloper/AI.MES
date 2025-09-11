/**
 * 보안 관련 유틸리티 함수들
 */

import { LoginRequest, SafeLoginRequest } from '@/types';

/**
 * 민감한 데이터를 마스킹하는 함수
 */
export const maskSensitiveData = <T>(data: T): T extends LoginRequest ? SafeLoginRequest : T => {
  if (!data || typeof data !== 'object') {
    return data as any;
  }

  // LoginRequest 타입인지 확인
  if ('username' in data && 'password' in data) {
    return {
      ...data,
      password: '[PROTECTED]'
    } as any;
  }

  // 다른 객체에서 password 필드가 있으면 마스킹
  const maskedData = { ...data } as any;
  if ('password' in maskedData) {
    maskedData.password = '[PROTECTED]';
  }
  if ('newPassword' in maskedData) {
    maskedData.newPassword = '[PROTECTED]';
  }
  if ('oldPassword' in maskedData) {
    maskedData.oldPassword = '[PROTECTED]';
  }
  if ('confirmPassword' in maskedData) {
    maskedData.confirmPassword = '[PROTECTED]';
  }

  return maskedData;
};

/**
 * 로깅을 위해 안전한 객체를 생성하는 함수
 */
export const createSafeLogObject = (data: any): any => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => createSafeLogObject(item));
  }

  const safeObject: any = {};
  
  for (const [key, value] of Object.entries(data)) {
    // 민감한 필드들을 마스킹
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth', 'credential'];
    const isSensitiveField = sensitiveFields.some(field => 
      key.toLowerCase().includes(field)
    );

    if (isSensitiveField) {
      safeObject[key] = '[PROTECTED]';
    } else if (value && typeof value === 'object') {
      safeObject[key] = createSafeLogObject(value);
    } else {
      safeObject[key] = value;
    }
  }

  return safeObject;
};

/**
 * URL에서 민감한 정보를 마스킹하는 함수
 */
export const maskSensitiveUrl = (url: string): string => {
  // 쿼리 파라미터에서 민감한 정보 제거
  const sensitiveParams = ['password', 'token', 'secret', 'key', 'auth'];
  
  try {
    const urlObj = new URL(url, window.location.origin);
    
    sensitiveParams.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.set(param, '[PROTECTED]');
      }
    });
    
    return urlObj.toString();
  } catch {
    // URL 파싱 실패시 원본 반환
    return url;
  }
};

/**
 * 개발 환경에서만 로깅하는 안전한 로거
 */
export const safeLog = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, data ? createSafeLogObject(data) : '');
    }
  },
  
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message, data ? createSafeLogObject(data) : '');
    }
  },
  
  error: (message: string, error?: any) => {
    console.error(message, error ? createSafeLogObject(error) : '');
  }
};

/**
 * 브라우저 개발자 도구에서 민감한 정보 보호
 */
export const protectDevTools = () => {
  // 프로덕션 환경에서 개발자 도구 감지 및 경고
  if (process.env.NODE_ENV === 'production') {
    // 개발자 도구 열림 감지
    let devtools = false;
    
    setInterval(() => {
      const threshold = 160;
      
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools) {
          devtools = true;
          console.clear();
          console.warn('%c⚠️ 보안 경고', 'color: red; font-size: 20px; font-weight: bold;');
          console.warn('%c이 기능은 개발자를 위한 것입니다. 누군가가 여기에 코드를 복사하여 붙여넣으라고 했다면, 이는 사기일 가능성이 높습니다.', 'color: red; font-size: 14px;');
        }
      } else {
        devtools = false;
      }
    }, 500);
  }
};
