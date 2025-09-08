'use client';

import { useAuth } from '@/contexts/AuthContext';
import { FullPageLoading } from './LoadingSpinner';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoading />;
  }

  return <>{children}</>;
}
