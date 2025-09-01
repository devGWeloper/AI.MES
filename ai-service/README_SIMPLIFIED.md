# 간소화된 AI MES 서비스

복잡한 구조를 제거하고 실용적이고 사내에서 수정하기 쉬운 구조로 개선했습니다.

## 🎯 주요 개선사항

### ✅ 단순화된 구조
- **Tool 시스템 통합**: 복잡한 LotTools, EquipmentTools → 단일 ContextTool
- **Analysis Service 정리**: 300줄 → 100줄 미만으로 축소
- **불필요한 기능 제거**: Vector Store, Database URL 등
- **핵심 기능 집중**: 채팅 기반 분석만 지원

### ✅ 사내 수정 용이성
- **명확한 수정 포인트**: 모든 사내 수정 필요 부분에 🔥 TODO 주석
- **프롬프트 중심 설계**: AI 로직은 프롬프트 수정으로 해결
- **컨텍스트 기반**: 프론트엔드 데이터를 직접 활용

## 📁 단순화된 파일 구조

```
ai-service/
├── app/
│   ├── agents/                    # AI 에이전트 (3개 파일)
│   │   ├── base_agent.py         # 기본 에이전트 (유지)
│   │   ├── lot_agent.py          # LOT 분석 (단순화)
│   │   ├── equipment_agent.py    # 설비 분석 (단순화)
│   │   └── return_agent.py       # 반송 분석 (단순화)
│   ├── tools/
│   │   └── context_tool.py       # 통합 컨텍스트 도구
│   ├── services/
│   │   └── analysis_service.py   # 분석 서비스 (단순화)
│   ├── core/
│   │   └── config.py             # 설정 (정리됨)
│   ├── models/
│   │   └── schemas.py            # 데이터 모델
│   └── main.py                   # FastAPI 앱 (정리됨)
├── requirements.txt              # 의존성 (정리됨)
└── README_SIMPLIFIED.md         # 이 파일
```

## 🔧 사내 환경 적용 가이드

### 1. OpenAI API 키 설정 (필수)

```bash
# 환경변수 설정
export OPENAI_API_KEY="your-actual-openai-api-key"

# 또는 .env 파일 생성
echo "OPENAI_API_KEY=your-actual-openai-api-key" > .env
```

### 2. 프롬프트 수정 (중요!)

각 에이전트의 프롬프트를 사내 정책에 맞게 수정:

#### 📍 LOT 에이전트 (`app/agents/lot_agent.py` 28-57줄)
```python
🔥 TODO: 사내 LOT 관리 정책에 맞게 수정 필요
- 실제 공정 단계명으로 변경 (Step 1-5 → 실제 공정명)
- 사내 품질 기준 추가
- 팀별 담당 영역 명시
- 사내 용어 및 약어 적용
```

#### 📍 설비 에이전트 (`app/agents/equipment_agent.py` 27-50줄)
```python
🔥 TODO: 사내 설비 관리 정책에 맞게 수정 필요
- 실제 설비명과 코드로 변경 (EQP-001 → 실제 설비명)
- 사내 정비 기준 추가 (온도/압력/가동률 임계값)
- 알람 임계값을 실제 값으로 설정
- 정비 담당팀 및 연락처 정보 추가
```

#### 📍 반송 에이전트 (`app/agents/return_agent.py` 27-47줄)
```python
🔥 TODO: 사내 품질 관리 정책에 맞게 수정 필요
- 실제 반송 사유 코드로 변경 (일반적 사유 → 사내 코드)
- 사내 품질 기준 및 임계값 추가
- 책임 부서별 대응 프로세스 명시
- 품질 관련 규정 및 표준 반영
```

### 3. 컨텍스트 데이터 연동 (선택사항)

실제 데이터 소스와 연동하려면 `app/tools/context_tool.py` 수정:

```python
# 🔥 사내 수정 포인트: 실제 데이터 분석 로직으로 변경
def _analyze_lot_context(self) -> str:
    # 여기에 실제 LOT 데이터베이스 조회 로직 추가
    # 예: lot_service.get_lot_analysis(self.context_data)
    pass
```

### 4. CORS 도메인 설정

`app/core/config.py` 12-16줄:
```python
ALLOWED_ORIGINS: List[str] = [
    "http://localhost:3000",
    "https://your-company-domain.com",  # 🔥 사내 도메인 추가
]
```

## 🚀 실행 방법

### 1. 의존성 설치
```bash
pip install -r requirements.txt
```

### 2. 서비스 실행
```bash
# 개발 모드
python -m uvicorn app.main:app --reload --port 8000

# 또는 직접 실행
cd ai-service
python -m app.main
```

### 3. 테스트
```bash
# 헬스 체크
curl http://localhost:8000/health

# AI 분석 테스트
curl -X POST http://localhost:8000/api/analyze/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "현재 LOT 상황을 분석해줘",
    "agentType": "lot",
    "context": {
      "pageType": "lot_history",
      "totalCount": 10
    }
  }'
```

## 📊 주요 변경사항 요약

| 항목 | 기존 (복잡) | 현재 (단순) |
|------|------------|------------|
| **파일 수** | 15+ 파일 | 8개 파일 |
| **Tool 클래스** | 9개 복잡한 Tool | 1개 통합 Tool |
| **Analysis Service** | 300줄 (7개 메서드) | 100줄 (1개 메서드) |
| **의존성** | 15+ 패키지 | 8개 패키지 |
| **DB 연동** | 복잡한 Mock 시스템 | 프론트엔드 Context 활용 |
| **수정 포인트** | 불분명 | 🔥 TODO 주석으로 명확화 |

## ⚠️ 주의사항

1. **OpenAI API 비용**: 사용량에 따라 비용 발생 (모니터링 필요)
2. **API 키 보안**: 환경변수 사용, 코드에 하드코딩 금지
3. **프롬프트 최적화**: 사내 데이터와 업무에 맞게 지속적 개선
4. **컨텍스트 크기**: 너무 큰 데이터는 토큰 제한에 걸릴 수 있음

## 🆚 기존 대비 장점

- ✅ **학습 곡선 단순화**: LangChain 기본 기능만 사용
- ✅ **수정 용이성**: 프롬프트 중심의 명확한 수정 포인트
- ✅ **디버깅 간편**: 단순한 구조로 문제 추적 쉬움
- ✅ **확장성**: 필요시 기능 추가 가능한 구조 유지
- ✅ **실용성**: 실제 사용에 필요한 기능만 집중

이제 사내에서 쉽게 수정하고 운영할 수 있는 구조가 되었습니다! 🎉
