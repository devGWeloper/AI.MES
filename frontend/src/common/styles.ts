import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind CSS 클래스 병합 유틸리티
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 상태별 색상 클래스 반환
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    waiting: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    running: 'bg-green-100 text-green-800',
    idle: 'bg-yellow-100 text-yellow-800',
    maintenance: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    analyzing: 'bg-yellow-100 text-yellow-800',
    normal: 'bg-green-100 text-green-800',
    delayed: 'bg-yellow-100 text-yellow-800',
    // 한국어 상태
    '완료': 'bg-green-100 text-green-800',
    '진행중': 'bg-blue-100 text-blue-800',
    '대기': 'bg-yellow-100 text-yellow-800',
    '오류': 'bg-red-100 text-red-800',
    '해결완료': 'bg-green-100 text-green-800',
    '처리중': 'bg-blue-100 text-blue-800',
    '분석중': 'bg-yellow-100 text-yellow-800',
    '정상': 'bg-green-100 text-green-800',
    '지연': 'bg-yellow-100 text-yellow-800',
    // 심각도
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800',
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

// 진행률별 색상 클래스 반환
export const getProgressColor = (progress: number, status?: string): string => {
  if (status === 'error' || status === '오류') return 'bg-red-600';
  if (status === 'delayed' || status === '지연') return 'bg-yellow-600';
  if (progress >= 80) return 'bg-green-600';
  if (progress >= 60) return 'bg-blue-600';
  if (progress >= 40) return 'bg-yellow-600';
  return 'bg-red-600';
};

// 결과별 색상 클래스 반환 (설비 이력용)
export const getResultColor = (result: string): string => {
  const colorMap: Record<string, string> = {
    '정상': 'bg-green-100 text-green-800',
    '지연': 'bg-yellow-100 text-yellow-800',
    '오류': 'bg-red-100 text-red-800',
    'normal': 'bg-green-100 text-green-800',
    'delayed': 'bg-yellow-100 text-yellow-800',
    'error': 'bg-red-100 text-red-800',
  };
  
  return colorMap[result] || 'bg-gray-100 text-gray-800';
};

// 심각도별 색상 클래스 반환 (반송용)
export const getSeverityColor = (severity: string): string => {
  const colorMap: Record<string, string> = {
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800',
    'high': 'bg-red-100 text-red-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'low': 'bg-green-100 text-green-800',
  };
  
  return colorMap[severity] || 'bg-gray-100 text-gray-800';
};
