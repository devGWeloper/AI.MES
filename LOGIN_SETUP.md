# 로그인 시스템 설정 가이드

AI MES 시스템의 로그인 기능을 사용하기 위한 설정 가이드입니다.

## 🔧 백엔드 설정

### 1. 환경 변수 설정

`.env.local` 파일에 Next DB 연결 정보를 추가하세요:

```env
# Next Login Database
NEXT_DB_URL=jdbc:postgresql://localhost:5432/next_db
NEXT_DB_USERNAME=your_username
NEXT_DB_PASSWORD=your_password
```

### 2. 데이터베이스 설정

PostgreSQL에 Next 데이터베이스를 생성하고 초기 데이터를 설정하세요:

```sql
-- 데이터베이스 생성
CREATE DATABASE next_db;

-- 초기화 스크립트 실행
\i backend/src/main/resources/sql/init-next-database.sql
```

### 3. 기본 사용자 계정

시스템에는 다음 기본 계정이 설정되어 있습니다:

| 사용자명 | 비밀번호 | 역할 | 부서 |
|---------|---------|------|------|
| admin | admin123 | ADMIN | IT |
| user1 | admin123 | USER | 생산관리 |
| manager1 | admin123 | MANAGER | 품질관리 |

## 🎨 프론트엔드 기능

### 1. 로그인 페이지
- **경로**: `/login`
- **기능**: 모던한 UI와 함께 사용자 인증
- **특징**: 
  - 반응형 디자인
  - 비밀번호 표시/숨김 토글
  - 실시간 유효성 검사
  - 로딩 상태 표시

### 2. 인증 상태 관리
- **AuthContext**: React Context를 통한 전역 인증 상태 관리
- **자동 리다이렉트**: 인증 상태에 따른 페이지 접근 제어
- **토큰 관리**: HttpOnly 쿠키를 통한 안전한 JWT 토큰 저장

### 3. 사용자 메뉴
- **위치**: 네비게이션 바 우측 상단
- **기능**: 사용자 정보 표시 및 로그아웃

## 🔐 보안 기능

### 1. JWT 토큰
- **저장 방식**: HttpOnly 쿠키 (XSS 공격 방지)
- **만료 시간**: 24시간
- **자동 갱신**: 페이지 로드 시 토큰 유효성 검사

### 2. 비밀번호 암호화
- **방식**: BCrypt 해싱
- **솔트**: 자동 생성

### 3. CORS 설정
- **허용 도메인**: localhost:3000, *.mes.ai
- **쿠키 지원**: credentials: true

## 🚀 시작하기

### 1. 백엔드 실행
```bash
cd backend
./mvnw spring-boot:run
```

### 2. 프론트엔드 실행
```bash
cd frontend
npm run dev
```

### 3. 접속
1. 브라우저에서 `http://localhost:3000` 접속
2. "시스템 시작하기" 버튼 클릭
3. 로그인 페이지에서 기본 계정으로 로그인

## 🔍 API 엔드포인트

### 인증 관련
- `POST /api/backend/auth/login` - 로그인
- `POST /api/backend/auth/logout` - 로그아웃
- `GET /api/backend/auth/me` - 현재 사용자 정보
- `GET /api/backend/auth/validate` - 토큰 유효성 검사

### 응답 형식
모든 API는 다음 형식으로 응답합니다:
```json
{
  "success": true,
  "data": { ... },
  "message": "성공 메시지",
  "error": null
}
```

## 🛠️ 개발 참고사항

### 1. 새 사용자 추가
```sql
INSERT INTO users (username, password, name, email, department, role) 
VALUES ('newuser', '$2a$10$...', '사용자명', 'email@domain.com', '부서', 'USER');
```

### 2. 역할 기반 접근 제어
사용자 역할에 따른 접근 제어를 구현하려면 `UserPrincipal`의 권한을 확인하세요.

### 3. 프론트엔드 인증 상태 확인
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>로그인이 필요합니다</div>;
  }
  
  return <div>안녕하세요, {user?.name}님!</div>;
}
```

## ❗ 주의사항

1. **프로덕션 환경**에서는 반드시 다음을 변경하세요:
   - JWT 시크릿 키
   - 기본 사용자 계정 비밀번호
   - HTTPS 사용 (쿠키 secure 플래그)

2. **데이터베이스 연결**이 실패하면 애플리케이션이 시작되지 않습니다.

3. **CORS 설정**을 프로덕션 도메인에 맞게 조정하세요.
