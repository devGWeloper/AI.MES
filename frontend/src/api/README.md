# API 패키지

이 프로젝트의 모든 API 호출을 중앙화하여 관리하는 패키지입니다.

## 패키지 구조

```
src/api/
├── index.ts          # 메인 export 파일
├── client.ts         # 기본 API 클라이언트 (axios 설정, 인터셉터)
├── lot.ts           # Lot 관련 API
├── equipment.ts     # Equipment 관련 API  
├── return.ts        # Return 관련 API
├── ai.ts           # AI Analysis 관련 API
└── README.md       # 이 파일
```

## 사용법

### 기본 사용법

```typescript
import { lotApi, equipmentApi, returnApi, aiAnalysisApi } from '@/api';

// Lot 검색
const response = await lotApi.searchLots('LOT-001', 'M14');

// 설비 이력 조회
const equipmentHistory = await equipmentApi.getEquipmentHistory('M15');

// 반송 이력 조회
const returnHistory = await returnApi.getReturnHistory('M16', 'RETURN-001');

// AI 분석
const analysis = await aiAnalysisApi.analyzeLotData({
  agentType: 'lot',
  data: lotData,
  fab: 'M14'
});
```

### 직접 클라이언트 사용

```typescript
import { apiClient, backendApi, aiApi } from '@/api';

// 기본 클라이언트 사용
const health = await apiClient.healthCheck();
await apiClient.downloadFile('/export/data.csv', 'data.csv');

// 직접 axios 인스턴스 사용
const customResponse = await backendApi.get('/custom-endpoint');
const aiResponse = await aiApi.post('/custom-analysis', data);
```

## API 서비스들

### 1. Lot API (`lotApi`)

**파일**: `lot.ts`

```typescript
// 사용 가능한 메서드들
lotApi.getLotHistory(fab?: string)           // Lot 이력 조회
lotApi.getLotStatus(fab?: string)            // Lot 상태 조회
lotApi.searchLots(keyword: string, fab?: string)  // Lot 검색
lotApi.getLotDetails(lotNumber: string)      // 특정 Lot 상세 정보
```

### 2. Equipment API (`equipmentApi`)

**파일**: `equipment.ts`

```typescript
// 사용 가능한 메서드들
equipmentApi.getEquipmentHistory(fab?: string)           // 설비 이력 조회
equipmentApi.getEquipmentStatus(fab?: string)            // 설비 상태 조회
equipmentApi.searchEquipment(keyword: string, fab?: string)  // 설비 검색
equipmentApi.getEquipmentDetails(equipmentId: string)    // 특정 설비 상세 정보
```

### 3. Return API (`returnApi`)

**파일**: `return.ts`

```typescript
// 사용 가능한 메서드들
returnApi.getReturnHistory(fab?: string, keyword?: string)  // 반송 이력 조회
returnApi.createReturn(returnData: Partial<ReturnHistory>)  // 새 반송 생성
returnApi.updateReturnStatus(returnId: string, status: string)  // 반송 상태 업데이트
returnApi.getReturnDetails(returnId: string)              // 특정 반송 상세 정보
```

### 4. AI Analysis API (`aiAnalysisApi`)

**파일**: `ai.ts`

```typescript
// 사용 가능한 메서드들
aiAnalysisApi.analyzeLotData(request: AIAnalysisRequest)      // Lot 데이터 AI 분석
aiAnalysisApi.analyzeEquipmentData(request: AIAnalysisRequest) // 설비 데이터 AI 분석
aiAnalysisApi.analyzeReturnData(request: AIAnalysisRequest)   // 반송 데이터 AI 분석
aiAnalysisApi.getStatusInsights(request: AIAnalysisRequest)   // 상태 인사이트 분석
aiAnalysisApi.chatAnalysis(message: string, agentType: string, context?: any) // 채팅 분석
```

## 기본 클라이언트 (`apiClient`)

**파일**: `client.ts`

### 특징

1. **자동 인증**: localStorage의 `token` 또는 `authToken`을 자동으로 헤더에 추가
2. **에러 처리**: 통합된 에러 처리 및 사용자 친화적 메시지 제공
3. **로깅**: 모든 요청/응답을 콘솔에 로깅 (개발/디버깅용)
4. **타임아웃**: 백엔드 API 30초, AI API 60초
5. **401 처리**: 인증 실패시 자동으로 토큰 삭제

### 유틸리티 메서드

```typescript
// 파일 다운로드
await apiClient.downloadFile('/api/export/data.csv', 'data.csv');

// 헬스 체크
const { backend, ai } = await apiClient.healthCheck();

// 직접 axios 인스턴스 접근
const backendAxios = apiClient.getBackendApi();
const aiAxios = apiClient.getAiApi();
```

## 에러 처리

모든 API 호출에서 일관된 에러 처리가 적용됩니다:

```typescript
try {
  const data = await lotApi.searchLots('LOT-001');
  // 성공 처리
} catch (error: any) {
  // error.message는 사용자 친화적인 메시지
  console.error('API 에러:', error.message);
  alert(error.message); // 또는 toast 등으로 표시
}
```

### 에러 타입별 메시지

- **서버 응답 에러**: 서버에서 제공한 메시지 또는 기본 메시지
- **네트워크 에러**: "서버에 연결할 수 없습니다. 네트워크를 확인해주세요."
- **기타 에러**: "요청 처리 중 오류가 발생했습니다."

## 마이그레이션 가이드

### 기존 코드에서 변경점

**Before (기존 lib/apiClient.ts 사용)**:
```typescript
import { lotApi } from '@/lib/apiClient';
```

**After (새로운 api 패키지 사용)**:
```typescript
import { lotApi } from '@/api';
```

### 호환성

- 모든 기존 API 메서드는 동일한 시그니처 유지
- import 경로만 변경하면 기존 코드 그대로 사용 가능

## 새로운 API 추가 방법

### 1. 새로운 도메인 API 추가

```typescript
// src/api/newDomain.ts
import { apiClient } from './client';
import type { ApiResponse, NewDomainType } from '@/types';

class NewDomainApiService {
  async getNewDomainData(): Promise<ApiResponse<NewDomainType[]>> {
    try {
      const response = await apiClient.getBackendApi().get('/new-domain');
      return response.data;
    } catch (error) {
      apiClient.handleError(error, 'getNewDomainData');
      throw error;
    }
  }
}

export const newDomainApi = new NewDomainApiService();
```

### 2. index.ts에 export 추가

```typescript
// src/api/index.ts에 추가
export { newDomainApi } from './newDomain';
```

### 3. 사용

```typescript
import { newDomainApi } from '@/api';

const data = await newDomainApi.getNewDomainData();
```

## 개발 팁

1. **콘솔 로깅**: 개발 중에는 브라우저 개발자 도구에서 모든 API 요청/응답을 확인 가능
2. **타입 안전성**: TypeScript로 모든 API 응답 타입이 보장됨
3. **에러 디버깅**: 에러 발생시 콘솔에 상세한 정보가 출력됨
4. **테스트**: 각 API 서비스는 독립적으로 테스트 가능

## 환경 설정

API 기본 URL은 Next.js의 rewrites 설정에 의해 결정됩니다:

- `/api/backend/*` → 백엔드 서비스
- `/api/ai/*` → AI 서비스

자세한 설정은 `frontend/next.config.js` 참조하세요.
