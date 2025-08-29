// 로컬 스토리지 유틸리티

export const storage = {
  // 기본 localStorage 래퍼
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage get error:', error);
      return null;
    }
  },

  set: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('localStorage set error:', error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('localStorage remove error:', error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('localStorage clear error:', error);
    }
  },

  // JSON 객체 저장/조회
  getObject: <T>(key: string): T | null => {
    const item = storage.get(key);
    if (!item) return null;
    
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn('localStorage JSON parse error:', error);
      return null;
    }
  },

  setObject: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      storage.set(key, serialized);
    } catch (error) {
      console.warn('localStorage JSON stringify error:', error);
    }
  },

  // 만료 시간이 있는 저장소
  setWithExpiry: (key: string, value: string, ttlMs: number): void => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttlMs,
    };
    storage.setObject(key, item);
  },

  getWithExpiry: (key: string): string | null => {
    const item = storage.getObject<{ value: string; expiry: number }>(key);
    if (!item) return null;

    const now = new Date();
    if (now.getTime() > item.expiry) {
      storage.remove(key);
      return null;
    }

    return item.value;
  },
};

// 세션 스토리지 유틸리티
export const sessionStorage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      console.warn('sessionStorage get error:', error);
      return null;
    }
  },

  set: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {
      console.warn('sessionStorage set error:', error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('sessionStorage remove error:', error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.warn('sessionStorage clear error:', error);
    }
  },

  getObject: <T>(key: string): T | null => {
    const item = sessionStorage.get(key);
    if (!item) return null;
    
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn('sessionStorage JSON parse error:', error);
      return null;
    }
  },

  setObject: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      sessionStorage.set(key, serialized);
    } catch (error) {
      console.warn('sessionStorage JSON stringify error:', error);
    }
  },
};

// 특정 키들에 대한 타입 안전한 스토리지 래퍼
export const createTypedStorage = <T extends Record<string, any>>() => {
  return {
    get: <K extends keyof T>(key: K): T[K] | null => {
      return storage.getObject<T[K]>(key as string);
    },
    
    set: <K extends keyof T>(key: K, value: T[K]): void => {
      storage.setObject(key as string, value);
    },
    
    remove: <K extends keyof T>(key: K): void => {
      storage.remove(key as string);
    },
  };
};

// 앱별 스토리지 키 관리
export const storageKeys = {
  // 인증 관련
  auth: {
    token: 'auth_token',
    refreshToken: 'refresh_token',
    user: 'user_info',
  },
  
  // 사용자 설정
  settings: {
    theme: 'app_theme',
    language: 'app_language',
    fab: 'selected_fab',
  },
  
  // 임시 데이터
  temp: {
    searchHistory: 'search_history',
    filters: 'applied_filters',
  },
} as const;
