# AI MES Backend

AI MES 백엔드 애플리케이션입니다.

## 기술 스택

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security**
- **MyBatis**
- **PostgreSQL**
- **JWT**

## 데이터베이스 설정

### PostgreSQL 설치 및 실행

#### 로컬 PostgreSQL 설치

1. **PostgreSQL 15 이상 설치**
   - macOS: `brew install postgresql@15`
   - Ubuntu: `sudo apt-get install postgresql-15`
   - Windows: PostgreSQL 공식 웹사이트에서 다운로드

2. **PostgreSQL 서비스 시작**
   ```bash
   # macOS
   brew services start postgresql@15
   
   # Ubuntu
   sudo systemctl start postgresql
   
   # Windows
   # 서비스 관리자에서 PostgreSQL 서비스 시작
   ```

3. **데이터베이스 및 사용자 생성**
   ```bash
   # PostgreSQL에 접속
   psql -U postgres
   
   # 초기화 스크립트 실행
   \i src/main/resources/sql/init-databases.sql
   ```

### 데이터베이스 연결 정보

- **M14 Fab Database**: `jdbc:postgresql://localhost:5432/m14db`
- **M15 Fab Database**: `jdbc:postgresql://localhost:5432/m15db`
- **M16 Fab Database**: `jdbc:postgresql://localhost:5432/m16db`

## 애플리케이션 실행

### 개발 환경

```bash
# 의존성 설치
mvn clean install

# 로컬 프로파일로 실행
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### 프로덕션 환경

```bash
# 프로덕션 프로파일로 실행
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## 환경 변수 설정

프로덕션 환경에서는 다음 환경 변수를 설정해야 합니다:

```bash
# M14 Fab Database
export M14_DB_URL=jdbc:postgresql://your-host:5432/m14db
export M14_DB_USERNAME=m14_user
export M14_DB_PASSWORD=your_password

# M15 Fab Database
export M15_DB_URL=jdbc:postgresql://your-host:5432/m15db
export M15_DB_USERNAME=m15_user
export M15_DB_PASSWORD=your_password

# M16 Fab Database
export M16_DB_URL=jdbc:postgresql://your-host:5432/m16db
export M16_DB_USERNAME=m16_user
export M16_DB_PASSWORD=your_password
```

## API 문서

애플리케이션 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

- Swagger UI: http://localhost:8080/api/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api/v3/api-docs

## 주요 기능

- **Equipment Management**: 설비 관리
- **Lot Management**: 로트 관리
- **Return Management**: 반품 관리
- **AI Integration**: AI 서비스 연동
- **Security**: JWT 기반 인증/인가

## 개발 가이드

### 새로운 매퍼 추가

1. `src/main/java/com/ai/mes/mapper/{fab}` 패키지에 매퍼 인터페이스 생성
2. `src/main/resources/mapper/{fab}` 디렉토리에 XML 매퍼 파일 생성
3. 해당 Fab의 DatabaseConfig에 매퍼 스캔 설정 확인

### PostgreSQL 특화 SQL 작성

PostgreSQL에서는 다음과 같은 문법을 사용합니다:

```sql
-- 시퀀스 사용
SELECT nextval('sequence_name');

-- JSON 타입 사용
SELECT json_build_object('key', 'value');

-- 배열 타입 사용
SELECT ARRAY['value1', 'value2'];

-- 날짜 함수
SELECT CURRENT_TIMESTAMP;
SELECT NOW();
```

## 문제 해결

### 데이터베이스 연결 오류

1. PostgreSQL 서비스가 실행 중인지 확인
2. 포트 5432가 사용 가능한지 확인
3. 데이터베이스와 사용자가 생성되었는지 확인
4. 방화벽 설정 확인

### 권한 오류

```sql
-- PostgreSQL에 접속하여 권한 재설정
GRANT ALL PRIVILEGES ON DATABASE m14db TO m14_user;
GRANT ALL PRIVILEGES ON DATABASE m15db TO m15_user;
GRANT ALL PRIVILEGES ON DATABASE m16db TO m16_user;
```

### PostgreSQL 설치 확인

```bash
# PostgreSQL 버전 확인
psql --version

# PostgreSQL 서비스 상태 확인
# macOS
brew services list | grep postgresql

# Ubuntu
sudo systemctl status postgresql
``` 