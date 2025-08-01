# AI MES (Manufacturing Execution System)

AI 기능이 통합된 차세대 제조 실행 시스템입니다. LangChain과 OpenAI를 활용한 지능형 분석 및 의사결정 지원 시스템을 제공합니다.

## 🏗 시스템 구조

```
AI.MES/
├── frontend/          # Next.js 14 (React, Tailwind CSS)
├── backend/           # Spring Boot 3.x (Java, MyBatis, Oracle)
├── ai-service/        # FastAPI (Python, LangChain, OpenAI)
└── README.md
```

## 🚀 주요 기능

### 📊 Lot 관리
- **Lot History**: Lot 처리 이력 조회 및 AI 분석
- **Lot Status**: 실시간 Lot 상태 모니터링 및 진행률 추적

### 🔧 설비 관리  
- **Equipment History**: 설비 작업 이력 및 성능 분석
- **Equipment Status**: 실시간 설비 상태 모니터링 및 예측 정비

### 🔄 반송 관리
- **Return History**: 반송 이력 조회 및 품질 분석

### 🤖 AI 기능
- **화면별 전용 AI Agent**: 각 화면에 특화된 AI 분석 및 권장사항
- **실시간 인사이트**: 상황별 맞춤형 AI 분석
- **예측 분석**: 설비 정비, 품질 예측, 생산 최적화

## 🛠 기술 스택

### Frontend (Next.js)
- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Query
- **Icons**: Lucide React

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security + JWT
- **Database**: MyBatis + Oracle (팹별 멀티 DB)
- **API Documentation**: Swagger/OpenAPI
- **Build Tool**: Maven

### AI Service (FastAPI)
- **Framework**: FastAPI
- **AI/ML**: LangChain + OpenAI GPT-4
- **Vector Store**: FAISS
- **Tools**: 팹별 DB 연동 도구
- **Agents**: 화면별 전용 AI Agent

## 🗄 데이터베이스 구성

```
M14 팹 DB ── Backend ── AI Service
M15 팹 DB ── Backend ── AI Service  
M16 팹 DB ── Backend ── AI Service
```

각 팹별로 독립된 Oracle 데이터베이스를 사용하며, MyBatis를 통해 멀티 데이터소스를 관리합니다.

## 🚀 시작하기

### 사전 요구사항
- Node.js 18+
- Java 17+
- Python 3.11+
- Oracle Database
- OpenAI API Key

### 1. 환경 설정

#### Backend 설정
```bash
cd backend
# application.yml에서 DB 연결 정보 수정
# M14, M15, M16 각 팹별 DB 설정 필요
```

#### AI Service 설정
```bash
cd ai-service
cp .env.example .env
# .env 파일에 OpenAI API Key 및 DB 정보 설정
```

### 2. 각 서비스 실행

#### Frontend 실행
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

#### Backend 실행
```bash
cd backend
mvn spring-boot:run
# http://localhost:8080/api
```

#### AI Service 실행
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload
# http://localhost:8000
```

### 3. 전체 시스템 접속
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **AI Service**: http://localhost:8000
- **Swagger UI**: http://localhost:8080/swagger-ui.html

## 🎯 주요 화면

### 1. 랜딩 페이지
- AI MES 시스템 소개
- 주요 기능 및 통계 표시
- 시스템 시작 버튼

### 2. Lot 화면
- **Lot History**: 팹별 Lot 처리 이력, AI 분석, 검색/필터링
- **Lot Status**: 실시간 Lot 상태, 진행률, AI 인사이트

### 3. Equipment 화면  
- **Equipment History**: 설비 작업 이력, 성능 분석
- **Equipment Status**: 실시간 설비 상태, 알람, 예측 정비

### 4. 반송 화면
- **Return History**: 반송 이력, 원인 분석, 품질 개선 제안

## 🤖 AI Agent 구조

### Lot Agent
- Lot 상태 및 진행 상황 분석
- 생산 스케줄 최적화
- 병목 구간 식별

### Equipment Agent  
- 설비 성능 모니터링
- 예측 정비 계획
- 알람 분석 및 조치 방안

### Return Agent
- 반송 패턴 분석
- 품질 문제 근본 원인 규명
- 재발 방지 대책 수립

## 📊 데이터 흐름

```
사용자 요청 → Next.js → Spring Boot API → FastAPI AI Service
              ↓              ↓              ↓
        UI 업데이트 ← 응답 데이터 ← AI 분석 결과
                            ↓
                       Oracle DB (M14/M15/M16)
```

## 🔧 개발 모드

현재 개발 단계에서는 Mock 데이터를 사용합니다:
- Backend: 서비스 레이어에서 Mock 데이터 제공
- AI Service: Tools에서 샘플 데이터 사용
- 실제 DB 연동 시 MyBatis Mapper 구현 필요

## 📝 API 문서

### Backend API
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI Spec: http://localhost:8080/v3/api-docs

### AI Service API
- Interactive Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🛡 보안 설정

### JWT 인증
- Backend에서 JWT 토큰 발급
- Frontend에서 API 호출 시 Authorization 헤더 사용
- 개발 모드에서는 기본 사용자(admin/admin) 제공

### CORS 설정
- Frontend(localhost:3000) ↔ Backend(localhost:8080)
- Backend ↔ AI Service(localhost:8000)

## 🔄 확장 계획

1. **실제 DB 연동**: MyBatis Mapper 구현
2. **Vector Store 구축**: 제조 데이터 기반 RAG 시스템
3. **실시간 모니터링**: WebSocket 기반 실시간 업데이트
4. **모바일 지원**: React Native 또는 PWA
5. **고급 AI 기능**: 예측 분석, 이상 탐지, 자동 최적화

## 📞 지원

프로젝트 관련 문의나 기술 지원이 필요한 경우 이슈를 등록해 주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.