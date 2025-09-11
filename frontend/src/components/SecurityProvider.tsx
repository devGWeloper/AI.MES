'use client';

import { useEffect } from 'react';
import { protectDevTools } from '@/common/security';

/**
 * 보안 기능을 초기화하는 클라이언트 컴포넌트
 */
export default function SecurityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 개발자 도구 보호 기능 활성화
    protectDevTools();
    
    // 프로덕션 환경에서 추가 보안 메시지
    if (process.env.NODE_ENV === 'production') {
      console.clear();
      console.log(
        '%cAI MES System',
        'color: #3b82f6; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);'
      );
      console.log(
        '%c⚠️ 보안 경고: 이 콘솔은 개발자 전용입니다.',
        'color: #ef4444; font-size: 16px; font-weight: bold;'
      );
      console.log(
        '%c누군가가 여기에 코드를 입력하라고 했다면 사기일 가능성이 높습니다.',
        'color: #f59e0b; font-size: 14px;'
      );
    }
  }, []);

  return <>{children}</>;
}
