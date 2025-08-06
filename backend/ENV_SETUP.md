# 환경변수 설정 가이드

## 로컬 개발 환경 설정

### 1. 환경변수 파일 생성 (권장 방법)

프로젝트 루트(`backend/` 폴더)에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

**이 방법이 가장 간단하고 권장됩니다!** Spring Boot 애플리케이션이 시작될 때 자동으로 `.env.local` 파일을 읽어서 환경변수로 설정합니다.

```bash
# M14 Fab Database
M14_DB_URL=jdbc:postgresql://localhost:5432/m14db
M14_DB_USERNAME=m14_user
M14_DB_PASSWORD=m14_password

# M15 Fab Database
M15_DB_URL=jdbc:postgresql://localhost:5432/m15db
M15_DB_USERNAME=m15_user
M15_DB_PASSWORD=m15_password

# M16 Fab Database
M16_DB_URL=jdbc:postgresql://localhost:5432/m16db
M16_DB_USERNAME=m16_user
M16_DB_PASSWORD=m16_password
```

### 2. 시스템 환경변수 설정 (대안 방법)

만약 `.env.local` 파일을 사용하지 않으려면, 시스템 환경변수로 설정할 수도 있습니다:

```bash
# ~/.zshrc 또는 ~/.bashrc 파일에 추가
export M14_DB_URL="jdbc:postgresql://localhost:5432/m14db"
export M14_DB_USERNAME="m14_user"
export M14_DB_PASSWORD="m14_password"

export M15_DB_URL="jdbc:postgresql://localhost:5432/m15db"
export M15_DB_USERNAME="m15_user"
export M15_DB_PASSWORD="m15_password"

export M16_DB_URL="jdbc:postgresql://localhost:5432/m16db"
export M16_DB_USERNAME="m16_user"
export M16_DB_PASSWORD="m16_password"
```

### 3. IntelliJ IDEA에서 환경변수 설정 (대안 방법)

만약 `.env.local` 파일을 사용하지 않으려면, IntelliJ IDEA에서 직접 환경변수를 설정할 수도 있습니다:

1. Run/Debug Configurations 열기
2. Environment variables 섹션에서 다음 변수들 추가:
   - `M14_DB_URL`
   - `M14_DB_USERNAME`
   - `M14_DB_PASSWORD`
   - `M15_DB_URL`
   - `M15_DB_USERNAME`
   - `M15_DB_PASSWORD`
   - `M16_DB_URL`
   - `M16_DB_USERNAME`
   - `M16_DB_PASSWORD`

## 프로덕션 환경 설정

프로덕션 환경에서는 다음 환경변수들을 설정해야 합니다:

```bash
# M14 Fab Database
M14_DB_URL=jdbc:postgresql://your-m14-host:5432/m14db
M14_DB_USERNAME=your_m14_username
M14_DB_PASSWORD=your_m14_password

# M15 Fab Database
M15_DB_URL=jdbc:postgresql://your-m15-host:5432/m15db
M15_DB_USERNAME=your_m15_username
M15_DB_PASSWORD=your_m15_password

# M16 Fab Database
M16_DB_URL=jdbc:postgresql://your-m16-host:5432/m16db
M16_DB_USERNAME=your_m16_username
M16_DB_PASSWORD=your_m16_password
```

## 동작 원리

Spring Boot 애플리케이션이 시작될 때 `EnvironmentConfig` 클래스가 자동으로 실행되어:

1. `.env.local` 파일이 존재하는지 확인
2. 파일이 존재하면 내용을 읽어서 시스템 환경변수로 설정
3. `application.yml`에서 `${M14_DB_URL}` 등의 환경변수를 사용

## 보안 주의사항

1. `.env.local` 파일은 절대 Git에 커밋하지 마세요 (이미 `.gitignore`에 추가됨)
2. 프로덕션 비밀번호는 안전한 방법으로 관리하세요
3. 정기적으로 비밀번호를 변경하세요
4. 데이터베이스 접근 권한을 최소한으로 제한하세요 