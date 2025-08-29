// 검증 유틸리티 함수들

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidLotNumber = (lotNumber: string): boolean => {
  // LOT 번호 형식: LOT + 숫자 3자리 이상
  const lotRegex = /^LOT\d{3,}$/;
  return lotRegex.test(lotNumber);
};

export const isValidEquipmentId = (equipmentId: string): boolean => {
  // 설비 ID 형식: 영문대문자 + 하이픈 + 숫자 3자리
  const equipmentRegex = /^[A-Z]+-\d{3}$/;
  return equipmentRegex.test(equipmentId);
};

export const isValidReturnId = (returnId: string): boolean => {
  // 반송 ID 형식: RET + 년도 + 월 + 일련번호
  const returnRegex = /^RET\d{6}-\d{3,}$/;
  return returnRegex.test(returnId);
};

export const isValidFab = (fab: string): boolean => {
  // FAB 형식: M + 숫자 2자리
  const fabRegex = /^M\d{2}$/;
  return fabRegex.test(fab);
};

export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // 한국 휴대폰 번호 형식
  const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
  return phoneRegex.test(phoneNumber);
};

export const isValidPassword = (password: string): boolean => {
  // 비밀번호: 최소 8자, 영문대소문자, 숫자, 특수문자 포함
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 범위 검증
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// 문자열 길이 검증
export const isValidLength = (str: string, minLength: number, maxLength?: number): boolean => {
  if (str.length < minLength) return false;
  if (maxLength && str.length > maxLength) return false;
  return true;
};

// 필수 필드 검증
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// 숫자 형식 검증
export const isNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};

// 알파벳만 검증
export const isAlpha = (value: string): boolean => {
  return /^[A-Za-z]+$/.test(value);
};

// 알파벳과 숫자만 검증
export const isAlphanumeric = (value: string): boolean => {
  return /^[A-Za-z0-9]+$/.test(value);
};
