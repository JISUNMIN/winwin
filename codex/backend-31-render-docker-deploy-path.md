# backend-31-render-docker-deploy-path

## 이번에 한 일

- Render가 Java를 native runtime으로 제공하지 않는 현재 기준에 맞춰 Docker 배포 경로를 추가했다.
- 루트에 `Dockerfile`을 추가해서 Spring Boot backend를 멀티 스테이지 빌드로 패키징하게 했다.
- 루트에 `.dockerignore`를 추가해서 불필요한 프론트 산출물과 로컬 로그가 Docker build context에 포함되지 않게 했다.

## 왜 필요한가

Render 공식 문서 기준으로 JVM 언어(Java/Kotlin/Scala)는 Docker 이미지로 배포하는 것이 권장 경로다.

그래서:

- Render `Language = Docker`
- repo 루트 `Dockerfile`

조합으로 바로 배포할 수 있게 맞췄다.

## Render에서 쓰는 값

- Language: `Docker`
- Dockerfile Path: 기본값(루트 `Dockerfile`)
- Docker Command: 비워둬도 됨

환경변수는 기존 Render + Neon + Supabase 조합 그대로 사용한다.

## Render env에 왜 Neon / Supabase 값을 넣는가

Render는 `백엔드 서버를 실행하는 장소`이고, 실제 데이터와 파일은 다른 서비스에 저장된다.

즉 배포된 Spring Boot 서버가 실행되더라도:

- 어떤 DB에 붙어야 하는지
- 어떤 스토리지 버킷에 파일을 올려야 하는지
- 어떤 비밀키로 접근해야 하는지

를 모르면 아무것도 못 한다.

그래서 Render의 Environment Variables에 외부 서비스 연결값을 넣는다.

## 이번 배포에서 실제로 넣는 종류

### 1. DB 연결값

Neon에서 만든 PostgreSQL 정보다.

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

이 값이 있어야 Render 위에서 실행된 백엔드가 Neon DB에 접속해서:

- 회원 정보
- 공고
- 상담/메시지
- 예약 상태

같은 데이터를 저장하고 읽을 수 있다.

즉:
`Neon = 운영 데이터 저장소`

### 2. 스토리지 연결값

Supabase에서 만든 Storage bucket 정보와 서버용 권한 키다.

- `APP_STORAGE_MODE=supabase`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`

이 값이 있어야 백엔드가 채팅 이미지 파일을 Supabase Storage에 업로드할 수 있다.

즉:
`Supabase Storage = 운영 파일 저장소`

### 3. 서버 자체 설정값

Render에서 돌아가는 백엔드 자체에 필요한 값이다.

- `APP_ENV=production`
- `SERVER_PORT=10000`
- `JWT_SECRET`

이 값은:

- production 모드로 실행하고
- Render가 열어준 포트로 서버를 띄우고
- 로그인 토큰(JWT)을 안전하게 서명하는 데 필요하다.

즉:
`Render = 서버 실행 장소`

## 결국 왜 이 세 종류가 다 필요한가

배포는 그냥 코드를 올리는 것으로 끝나지 않는다.

운영 서버가 실제로 일하려면 최소 세 가지가 필요하다.

1. 서버가 실행될 장소
   Render
2. 저장할 운영 DB
   Neon
3. 이미지 같은 파일 저장소
   Supabase Storage

그래서 Render 배포 시 env에:

- DB 값
- 스토리지 값
- 서버 실행 값

을 모두 넣어야 한다.

없으면 어떤 문제가 생기나:

- DB 값 없음: 로그인/공고/상담 저장 불가
- 스토리지 값 없음: 이미지 업로드 불가
- 서버 설정 값 없음: production 실행 실패 또는 JWT 인증 불가

## 이번 프로젝트 기준으로 보면

Render는 `서버`,
Neon은 `DB`,
Supabase는 `파일 저장소` 역할을 맡는다.

프론트 앱은 결국 Render 주소 하나만 보지만, 그 Render 안의 백엔드는 뒤에서 Neon과 Supabase에 각각 연결되어 동작한다.
