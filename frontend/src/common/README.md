# Common 패키지

프로젝트 전반에서 사용되는 공통 유틸리티 함수들을 체계적으로 관리하는 패키지입니다.

## 패키지 구조

```
src/common/
├── index.ts          # 메인 export 파일
├── styles.ts         # 스타일링 관련 유틸리티
├── formatters.ts     # 포맷팅 관련 유틸리티
├── validators.ts     # 검증 관련 유틸리티
├── helpers.ts        # 일반 헬퍼 함수들
├── storage.ts        # 스토리지 관련 유틸리티
└── README.md         # 이 파일
```

## 사용법

### 기본 사용법

```typescript
import { cn, getStatusColor, formatDate, isValidEmail } from '@/common';

// 스타일링
const className = cn('base-class', condition && 'conditional-class');
const statusClass = getStatusColor('completed');

// 포맷팅
const formattedDate = formatDate('2024-01-01T09:00:00Z');
const formattedNumber = formatNumber(1234567);

// 검증
const emailValid = isValidEmail('user@example.com');
const lotValid = isValidLotNumber('LOT001');
```

### 개별 모듈 import

```typescript
// 특정 모듈만 가져오기
import { getStatusColor, getSeverityColor } from '@/common/styles';
import { formatDate, formatDateTime } from '@/common/formatters';
import { storage, sessionStorage } from '@/common/storage';
```

## 모듈별 상세 설명

### 1. 스타일링 (`styles.ts`)

UI 스타일링과 관련된 유틸리티 함수들을 제공합니다.

```typescript
// Tailwind CSS 클래스 병합
cn('base-class', 'additional-class', condition && 'conditional-class')

// 상태별 색상 클래스 반환
getStatusColor('completed')     // 'bg-green-100 text-green-800'
getStatusColor('진행중')         // 'bg-blue-100 text-blue-800'

// 진행률별 색상
getProgressColor(85)           // 'bg-green-600'
getProgressColor(45, 'error')  // 'bg-red-600'

// 결과별 색상 (설비용)
getResultColor('정상')          // 'bg-green-100 text-green-800'

// 심각도별 색상 (반송용)
getSeverityColor('High')       // 'bg-red-100 text-red-800'
```

**지원하는 상태들:**
- **영문**: `completed`, `in_progress`, `waiting`, `error`, `running`, `idle`, `maintenance`, `resolved`, `processing`, `analyzing`
- **한국어**: `완료`, `진행중`, `대기`, `오류`, `해결완료`, `처리중`, `분석중`, `정상`, `지연`
- **심각도**: `High`, `Medium`, `Low`

### 2. 포맷팅 (`formatters.ts`)

데이터 포맷팅과 관련된 유틸리티 함수들을 제공합니다.

```typescript
// 날짜/시간 포맷팅
formatDate('2024-01-01T09:00:00Z')      // '2024.01.01'
formatDateTime('2024-01-01T09:00:00Z')  // '2024.01.01 09:00'
formatTime('2024-01-01T09:00:00Z')      // '09:00:00'

// 숫자 포맷팅
formatNumber(1234567)                   // '1,234,567'
formatPercentage(85.5)                  // '85.5%'
formatCurrency(50000)                   // '₩50,000'
formatFileSize(1048576)                 // '1 MB'

// 시간 관련
formatDuration(90000)                   // '1분 30초'
getRelativeTime('2024-01-01T09:00:00Z') // '2시간 전'
```

### 3. 검증 (`validators.ts`)

데이터 검증과 관련된 유틸리티 함수들을 제공합니다.

```typescript
// 기본 검증
isValidEmail('user@example.com')        // true
isValidUrl('https://example.com')       // true
isValidPassword('MyPass123!')           // true
isValidPhoneNumber('010-1234-5678')     // true

// 비즈니스 로직 검증
isValidLotNumber('LOT001')              // true
isValidEquipmentId('EQP-001')           // true
isValidReturnId('RET240101-001')        // true
isValidFab('M14')                       // true

// 범용 검증
isRequired('value')                     // true
isNumeric('123')                        // true
isAlpha('ABC')                          // true
isAlphanumeric('ABC123')                // true
isInRange(50, 0, 100)                   // true
isValidLength('text', 2, 10)            // true
```

### 4. 헬퍼 (`helpers.ts`)

일반적인 헬퍼 함수들을 제공합니다.

```typescript
// 텍스트 처리
truncateText('Long text here', 10)      // 'Long text...'

// 함수 제어
const debouncedFn = debounce(fn, 300);
const throttledFn = throttle(fn, 1000);

// 배열/객체 조작
deepClone(originalObject)
removeDuplicates([1, 2, 2, 3])          // [1, 2, 3]
chunk([1, 2, 3, 4, 5], 2)               // [[1, 2], [3, 4], [5]]
removeEmptyValues({ a: 1, b: '', c: null }) // { a: 1 }

// 유틸리티
generateId(8)                           // 'Ak7Bm3Qx'
toCamelCase('user_name')                // 'userName'
toSnakeCase('userName')                 // 'user_name'
range(1, 5)                            // [1, 2, 3, 4, 5]
```

### 5. 스토리지 (`storage.ts`)

브라우저 스토리지와 관련된 유틸리티를 제공합니다.

```typescript
// 기본 localStorage
storage.set('key', 'value');
storage.get('key');                     // 'value'
storage.remove('key');
storage.clear();

// JSON 객체 저장
storage.setObject('user', { name: 'John', age: 30 });
const user = storage.getObject<User>('user');

// 만료 시간 설정 (TTL)
storage.setWithExpiry('temp', 'value', 60000); // 1분 후 만료
storage.getWithExpiry('temp');

// 세션 스토리지
sessionStorage.set('session_key', 'value');
sessionStorage.getObject<Data>('session_data');

// 타입 안전한 스토리지
interface AppStorage {
  user: User;
  settings: Settings;
}
const typedStorage = createTypedStorage<AppStorage>();
typedStorage.set('user', userObject);
```

**미리 정의된 스토리지 키들:**
```typescript
storageKeys.auth.token          // 'auth_token'
storageKeys.auth.user           // 'user_info'
storageKeys.settings.theme      // 'app_theme'
storageKeys.settings.fab        // 'selected_fab'
storageKeys.temp.searchHistory  // 'search_history'
```

## 마이그레이션 가이드

### 기존 코드에서 변경점

**Before (기존 lib/utils.ts 사용)**:
```typescript
import { cn, getStatusColor } from '@/lib/utils';
```

**After (새로운 common 패키지 사용)**:
```typescript
import { cn, getStatusColor } from '@/common';
// 또는 개별 모듈에서
import { cn } from '@/common/styles';
import { getStatusColor } from '@/common/styles';
```

### 컴포넌트에서 직접 정의한 함수들 대체

**Before**:
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case '완료': return 'bg-green-100 text-green-800';
    case '진행중': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
```

**After**:
```typescript
import { getStatusColor } from '@/common';
// 함수 정의 제거하고 직접 사용
```

## 새로운 유틸리티 추가 방법

### 1. 적절한 모듈 선택

- **스타일링 관련** → `styles.ts`
- **데이터 포맷팅** → `formatters.ts`
- **데이터 검증** → `validators.ts`
- **일반 헬퍼** → `helpers.ts`
- **스토리지 관련** → `storage.ts`

### 2. 함수 추가

```typescript
// formatters.ts에 새 함수 추가
export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};
```

### 3. index.ts에 export 추가

```typescript
// index.ts에 추가
export { formatPhoneNumber } from './formatters';
```

### 4. 사용

```typescript
import { formatPhoneNumber } from '@/common';
// 또는
import { formatPhoneNumber } from '@/common/formatters';
```

## 성능 고려사항

1. **Tree Shaking**: 개별 모듈에서 import하면 사용하지 않는 함수는 번들에서 제외됩니다.
2. **Debounce/Throttle**: 성능이 중요한 이벤트 핸들러에서 적극 활용하세요.
3. **Deep Clone**: 큰 객체에서는 성능에 주의하세요.
4. **Storage**: localStorage는 동기적이므로 큰 데이터 저장시 주의하세요.

## 테스트 가이드

각 유틸리티 함수는 순수 함수로 설계되어 테스트가 용이합니다:

```typescript
// __tests__/common/formatters.test.ts
import { formatDate } from '@/common/formatters';

describe('formatDate', () => {
  it('should format date correctly', () => {
    expect(formatDate('2024-01-01T00:00:00Z')).toBe('2024.01.01');
  });
});
```

## 타입 안전성

모든 함수는 TypeScript로 작성되어 타입 안전성을 보장합니다:

```typescript
// 타입 추론 자동 지원
const result = formatNumber(123); // string 타입
const isValid = isValidEmail('test'); // boolean 타입

// 제네릭 지원
const cloned = deepClone<User>(userObject); // User 타입 유지
```
