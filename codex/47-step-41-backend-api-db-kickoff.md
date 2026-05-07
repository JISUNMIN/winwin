# 47. 백엔드 API와 DB 시작 순서

## 목표

이제부터는 프론트 화면 확장보다 `실제 데이터가 흐르는 구조`를 먼저 만들기 위해, 백엔드와 DB 세팅을 시작합니다.

이번 단계의 목표는:

- 무엇부터 시작해야 하는지 순서를 고정하고
- Spring 백엔드의 최소 범위를 정하고
- 로그인/회원가입과 공고 API를 먼저 붙일 준비를 하는 것

입니다.

## 문서 정리 규칙

이 문서는 RN 중심 step 기록에서 백엔드 작업으로 넘어가는 전환점 문서로 유지합니다.

정리 규칙은 아래처럼 가져갑니다.

- 기존 `01 ~ 47` 문서는 RN/앱 구현 흐름 문서로 유지
- 이 문서인 `47`은 백엔드 시작 방향을 정리하는 연결 문서로 유지
- 실제 백엔드 작업 기록은 다음부터 별도 시리즈로 분리
- 백엔드 문서 파일명은 `backend-01-...`, `backend-02-...` 형식 사용

예:

```text
backend-01-spring-project-init.md
backend-02-postgresql-setup.md
backend-03-jpa-user-entity.md
```

이렇게 구분하면:

- RN/프론트 작업과 백엔드 작업이 섞이지 않고
- 나중에 찾기 쉽고
- 포트폴리오 설명할 때도 흐름을 나눠 보여주기 쉽습니다.

## 결론부터: 무엇부터 시작하나

가장 먼저 시작할 것은 `Spring Boot 백엔드 프로젝트 생성`입니다.

이유는:

- API를 만들 서버 뼈대가 먼저 있어야 하고
- DB 연결도 백엔드 프로젝트 위에서 진행하는 것이 자연스럽고
- 이후 RN에서 mock을 실제 API로 바꿀 때 기준점이 생기기 때문입니다.

즉 순서는 아래처럼 가는 것이 가장 안정적입니다.

```text
1. Spring Boot 프로젝트 생성
2. PostgreSQL 로컬 DB 준비
3. Spring과 DB 연결
4. 회원/인증 테이블과 엔티티 설계
5. 로그인/회원가입 API 구현
6. 공고 API 구현
7. RN 앱에서 mock auth, mock post를 API로 교체
8. 상담/채팅 API로 확장
```

그리고 구현 방식은 `기능 단위 API 구현 -> 바로 RN에 연결` 방식으로 진행합니다.

즉:

```text
auth API 구현 -> auth 연동
post API 구현 -> post 연동
chat API 구현 -> chat 연동
```

처럼 한 덩어리씩 실제화합니다.

## 왜 DB부터 바로 시작하지 않나

DB를 먼저 설치할 수는 있지만, 지금은 백엔드 프로젝트가 기준이 되는 편이 더 좋습니다.

왜냐하면:

- 어떤 테이블이 필요한지 서버 도메인 구조를 보면서 정하는 편이 좋고
- DB 연결 정보도 Spring 설정과 함께 잡아야 하고
- 결국 실제 작업은 `서버 코드 + DB`가 같이 맞물려 돌아가야 하기 때문입니다.

그래서 `DB 단독 시작`보다 `Spring 서버 생성 -> DB 연결` 순서가 더 자연스럽습니다.

## 지금 단계에서 만들 최소 백엔드 범위

처음부터 모든 기능을 다 만들 필요는 없습니다.

1차 범위는 아래 정도가 적당합니다.

### 1. 인증

- 회원가입
- 로그인
- 내 정보 조회
- JWT 발급/검증

### 2. 공고

- 공고 목록 조회
- 공고 상세 조회
- 파트너 공고 등록
- 파트너 공고 수정
- 파트너 공고 마감 처리

이 두 축만 먼저 만들면:

- mock auth 제거 시작 가능
- 메모리 공고 데이터 제거 시작 가능
- 프론트에서 실제 API 기준으로 다시 맞추기 가능

상담/채팅은 그 다음 단계로 넘기는 편이 좋습니다.

## 추천 기술 조합

현재 프로젝트 기준 추천 조합은 아래입니다.

- Language: Java
- Backend: Spring Boot
- Security: Spring Security
- Auth: JWT
- DB: PostgreSQL
- ORM: JPA
- Build Tool: Maven

## 왜 Maven으로 시작하나

Gradle도 가능하지만, 처음 Spring 기본 구조를 익히는 단계에서는 Maven도 충분히 무난합니다.

지금은 중요한 것이 빌드 도구 취향보다:

- Spring 구조 익히기
- 인증/API/DB 흐름 만들기
- RN 앱과 연결하기

이기 때문에, 기본적인 안정성을 우선해도 괜찮습니다.

나중에 원하면 Gradle로 가도 되지만, 지금은 한 가지를 빨리 고정하는 편이 더 좋습니다.

## 백엔드 폴더 추천

현재 RN 앱 프로젝트와 같은 루트 안에 백엔드 폴더를 두는 것이 관리하기 쉽습니다.

예를 들면:

```text
WinWin/
  src/
  assets/
  codex/
  backend/
```

이 구조면:

- RN 앱과 백엔드를 한 workspace에서 같이 관리 가능
- 포트폴리오 설명도 쉬움
- 문서 기록도 한 흐름으로 이어짐

## 가장 먼저 할 실제 작업

다음 순서로 바로 진행하면 됩니다.

### 1. Spring Boot 프로젝트 생성

먼저 `backend/` 프로젝트를 만듭니다.

처음 포함할 후보 dependency:

- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL Driver
- Validation

JWT는 라이브러리를 나중에 추가해도 되지만, 초반부터 같이 넣어도 됩니다.

### 2. 로컬 PostgreSQL 준비

백엔드 프로젝트가 생기면 그 다음에 로컬 PostgreSQL을 연결합니다.

준비할 것:

- DB 설치 또는 실행 환경 확인
- 새 데이터베이스 생성
- 접속 계정/비밀번호 확인

### 3. DB 연결 테스트

Spring에서:

- `application.yml` 또는 `application.properties`
- datasource
- JPA 설정

을 연결해 서버가 DB에 붙는지 먼저 확인합니다.

### 4. 회원 엔티티부터 설계

첫 엔티티는 `User`부터 시작하는 것이 좋습니다.

필수 후보:

- id
- email
- password
- role
- nickname or name
- createdAt

### 5. 인증 API부터 구현

가장 먼저 만들 API:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/users/me`

이 세 개가 먼저 있어야 RN의 mock auth를 실제 auth로 교체하기 쉽습니다.

## 그 다음 프론트는 어떻게 붙이나

백엔드가 어느 정도 준비되면 바로 프론트를 전부 뜯어고치는 것이 아니라, 작은 단위로 바꿉니다.

권장 순서:

```text
1. mock-auth -> 실제 auth API
2. partner post 목록/등록/수정 -> 실제 공고 API
3. 홈 목록/상세 -> 실제 공고 조회 API
4. 상담/채팅 -> 실제 상담 API
```

이렇게 하면 이미 만든 프론트 뼈대를 최대한 유지하면서 안전하게 전환할 수 있습니다.

## 지금은 하지 않아도 되는 것

지금 바로 하지 않아도 되는 것:

- 채팅 실시간 websocket
- 결제 실연동
- 이미지 업로드 서버화
- AWS 인프라 세팅
- 광고/수익화 연동

이런 것들은 인증과 공고 API가 붙은 뒤에 가는 편이 훨씬 낫습니다.

## React 개발자 기준으로 보면

이번 단계는 UI 구현 step이 아니라, mock 프론트에서 실제 full-stack 구조로 넘어가기 위한 서버 진입점 정리 단계입니다.

웹 React 기준으로 보면:

- 프론트 먼저 만든 뒤
- API 서버를 따로 세우고
- local mock data를 실제 backend API로 치환해 가는

흐름과 비슷합니다.

즉 느낌상:

- 지금까지: frontend-first prototype
- 이번 단계: backend bootstrap
- 다음 단계: auth API first migration

## 핵심 기준

```text
지금은 프론트를 더 크게 확장하는 것보다
Spring 서버와 PostgreSQL 연결을 먼저 만드는 것이 우선이다.
```

```text
첫 구현 범위는 인증과 공고 API까지로 좁히고,
상담/채팅은 그 다음 단계에서 확장한다.
```
