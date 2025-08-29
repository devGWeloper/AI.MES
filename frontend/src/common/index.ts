// Common 패키지 메인 export 파일

// 스타일링 유틸리티
export {
  cn,
  getStatusColor,
  getProgressColor,
  getResultColor,
  getSeverityColor,
} from './styles';

// 포맷팅 유틸리티
export {
  formatDate,
  formatDateTime,
  formatTime,
  formatNumber,
  formatPercentage,
  formatCurrency,
  formatFileSize,
  formatDuration,
  getRelativeTime,
} from './formatters';

// 검증 유틸리티
export {
  isValidEmail,
  isValidLotNumber,
  isValidEquipmentId,
  isValidReturnId,
  isValidFab,
  isValidPhoneNumber,
  isValidPassword,
  isValidUrl,
  isInRange,
  isValidLength,
  isRequired,
  isNumeric,
  isAlpha,
  isAlphanumeric,
} from './validators';

// 헬퍼 유틸리티
export {
  truncateText,
  debounce,
  throttle,
  deepClone,
  removeDuplicates,
  chunk,
  removeEmptyValues,
  generateId,
  toCamelCase,
  toSnakeCase,
  arrayToObject,
  range,
  getFileExtension,
  removeFileExtension,
} from './helpers';

// 스토리지 유틸리티
export {
  storage,
  sessionStorage,
  createTypedStorage,
  storageKeys,
} from './storage';

// 타입 정의 (필요시 추가)
export type StorageKey = keyof typeof import('./storage').storageKeys;

// 기존 호환성을 위한 통합 export (deprecated, 개별 import 권장)
export * from './styles';
export * from './formatters';
export * from './validators';
export * from './helpers';
export * from './storage';
