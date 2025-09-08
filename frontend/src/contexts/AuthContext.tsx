'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '@/api/auth';
import { UserInfo } from '@/types';

interface AuthContextType {
  user: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user;

  // 페이지 로드 시 사용자 정보 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 인증 상태에 따른 리다이렉트 처리
  useEffect(() => {
    if (!isLoading) {
      const publicPaths = ['/', '/login'];
      const isPublicPath = publicPaths.includes(pathname);

      if (!isAuthenticated && !isPublicPath) {
        // 인증되지 않은 사용자가 보호된 페이지 접근 시 로그인 페이지로 리다이렉트
        router.push('/login');
      } else if (isAuthenticated && pathname === '/login') {
        // 이미 로그인된 사용자가 로그인 페이지 접근 시 대시보드로 리다이렉트
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // 토큰 유효성 검사
      const validateResponse = await authApi.validateToken();
      
      if (validateResponse.success && validateResponse.data) {
        // 토큰이 유효하면 사용자 정보 가져오기
        const userResponse = await authApi.getCurrentUser();
        
        if (userResponse.success) {
          setUser(userResponse.data);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ username, password });
      
      if (response.success) {
        // 로그인 성공 후 사용자 정보 새로고침
        await refreshUser();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      
      if (response.success) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
