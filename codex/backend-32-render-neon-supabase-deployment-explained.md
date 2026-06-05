# Backend 32. Render + Neon + Supabase 배포 개념 정리

WinWin을 `거의 무료에 가깝게` 먼저 배포해보기 위해 고른 조합과, 배포하면서 나온 개념 질문들을 한 번에 정리한 문서입니다.

## 왜 이 조합을 골랐는가

- `Render`는 백엔드 서버를 인터넷에 올리기 쉬운 호스팅 플랫폼입니다.
- `Neon`은 PostgreSQL 운영 DB를 무료 플랜으로 빠르게 붙이기 좋습니다.
- `Supabase Storage`는 이미지 파일 저장소를 무료 플랜으로 분리하기 좋습니다.
- AWS보다 초기 진입이 쉽고, MVP를 빨리 띄우기에 부담이 적었습니다.

즉 이번 선택은 `운영비 최소화 + 설정 난이도 낮추기 + 앱 배포 우선` 쪽 판단입니다.

## 각각 뭐 하는 서비스인가

### Render

- Render는 `백엔드 서버를 실행할 장소`입니다.
- Spring Boot 앱 코드를 GitHub에서 받아서 빌드하고 실행합니다.
- 배포가 끝나면 `https://...onrender.com` 같은 운영 API 주소를 줍니다.

쉽게 말하면:
`Render = 서버를 빌려주는 플랫폼`

### Neon

- Neon은 `PostgreSQL 데이터베이스 서비스`입니다.
- 사용자, 공고, 상담, 메시지 같은 데이터를 저장합니다.
- 지금 프로젝트의 JPA/Hibernate 구조와 잘 맞습니다.

쉽게 말하면:
`Neon = 운영용 Postgres DB`

### Supabase Storage

- Supabase Storage는 `파일 저장소`입니다.
- 채팅 이미지 파일을 저장합니다.
- Render 무료 환경의 로컬 디스크에 파일을 오래 맡기기 불안해서 분리했습니다.

쉽게 말하면:
`Supabase Storage = 이미지 같은 파일 저장소`

## 왜 Render만으로 안 끝나지?

Render는 서버 실행 플랫폼이고, DB와 파일 저장소까지 전부 대신하는 건 아닙니다.

그래서 역할을 나누면:

- Render: 백엔드 API 실행
- Neon: 데이터 저장
- Supabase Storage: 이미지 파일 저장

즉 `서버`, `DB`, `파일 저장소`를 각각 맡긴 구조입니다.

## 배포가 정확히 무슨 뜻인가

로컬에서는:

- 백엔드가 `localhost:8080`
- DB가 네 컴퓨터 또는 로컬 개발 DB

이 상태라서 다른 사람 폰에서는 접근할 수 없습니다.

배포는:

- 백엔드를 인터넷에서 접근 가능한 서버에 올리고
- 운영 DB에 연결하고
- 앱이 그 주소를 호출하게 바꾸는 것

즉:
`배포 = 내 컴퓨터 안에서만 돌던 프로그램을 인터넷에서 쓰게 만드는 작업`

## Dockerfile은 뭐고 왜 필요했나

`Dockerfile`은 서버가 이 프로젝트를 어떻게 빌드하고 실행할지 적어놓은 파일입니다.

`.env`처럼 값을 저장하는 파일은 아니고, 실행 방법을 적는 파일입니다.

역할 예시:

- 어떤 Java 버전을 쓸지
- Maven 빌드를 어떻게 할지
- 최종 jar를 어떤 명령으로 실행할지

이번 프로젝트에서는 Render 화면에 `Java` 런타임이 바로 안 보여서 `Docker` 방식으로 배포하게 됐고, 그래서 `Dockerfile`이 필요해졌습니다.

쉽게 말하면:

- `.env` = 값 모음
- `Dockerfile` = 실행 레시피

## 이번 프로젝트는 소켓 채팅인가?

아닙니다. 현재 채팅은 `WebSocket`이 아니라 `REST API` 기반입니다.

지금 구조는:

- 상담 상세 열기: `GET`
- 메시지 보내기: `POST`
- 이미지 보내기: `POST`
- 일정 전송/예약 요청/입금 알림/확정: 전부 `POST`

즉 `카톡처럼 실시간 소켓 연결`이 아니라, `HTTP 요청/응답` 기반 상담 흐름입니다.

왜 이렇게 갔는가:

- MVP를 빠르게 완성하기 쉬움
- Render 무료 환경에서 운영 복잡도가 낮음
- 인증/예외처리/테스트가 단순함

## 왜 AWS 대신 이 조합을 썼나

AWS도 가능하지만, 이번에는 우선순위가 `거의 무료로 시작`이었습니다.

AWS로 가면 보통:

- App Runner
- RDS
- S3

같은 조합을 쓰게 되는데, 처음 세팅 난이도와 과금 신경 쓸 포인트가 더 많습니다.

이번 단계에서는:

- Render free web service
- Neon free Postgres
- Supabase Storage free

가 훨씬 빠르고 가볍습니다.

## 운영에서 실제로 어떻게 연결되나

흐름은 이렇게 됩니다.

1. 사용자 앱이 Render 주소로 API 호출
2. Render에서 Spring Boot 백엔드 실행
3. 백엔드가 Neon DB에 데이터 저장/조회
4. 이미지 파일은 Supabase Storage에 업로드

즉 앱 입장에서는 그냥 `운영 API 주소 하나`만 알면 되고, 그 뒤에서 DB와 파일 저장소가 나뉘어 동작합니다.

## 이번에 실제로 넣어야 하는 환경변수

### Render 백엔드 env

```text
APP_ENV=production
SERVER_PORT=10000
JWT_SECRET=<긴 랜덤 문자열>
DB_URL=jdbc:postgresql://<neon-host>/<db>?sslmode=require&channel_binding=require
DB_USERNAME=<neon-user>
DB_PASSWORD=<neon-password>
APP_STORAGE_MODE=supabase
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role>
SUPABASE_STORAGE_BUCKET=consultation-images
```

### 앱 빌드용 프론트 env

```text
EXPO_PUBLIC_API_BASE_URL=https://<render-service>.onrender.com
```

## Render에서 왜 Deploy 버튼을 눌러야 하나

Render는 계정과 설정만 만든다고 서버가 자동으로 실행되지 않습니다.

`Deploy Web Service`를 누르면 Render가:

1. GitHub에서 코드 가져오기
2. Dockerfile 읽기
3. 백엔드 빌드
4. 서버 실행
5. 운영 URL 발급

즉 `Deploy`는 실제로 백엔드 서버를 인터넷에 올리는 단계입니다.

## Neon에서 왜 password를 조심해야 하나

Neon connection string에는 DB 비밀번호가 들어갑니다.

예:

```text
postgresql://user:password@host/db?sslmode=require
```

이 문자열을 공개 채널에 그대로 올리면 비밀번호가 노출됩니다.

그래서:

- 비밀번호는 Render env에만 넣기
- 채팅/문서/깃에는 절대 그대로 올리지 않기
- 한 번 노출됐으면 즉시 `Reset password`

## Supabase에서는 어떤 키를 써야 하나

이번 구조에서는 `service_role`을 씁니다.

이유:

- `anon`이나 `publishable`은 공개 클라이언트용
- 우리는 백엔드 서버가 Storage에 직접 업로드해야 함
- 그래서 서버 권한이 있는 `service_role`이 맞음

주의:

- `service_role`은 절대 프론트 앱에 넣으면 안 됨
- Render 백엔드 env에만 넣어야 함

## 버킷 이름은 왜 consultation-images인가

필수 이름은 아닙니다.

그냥:

- 용도가 바로 보이고
- 상담 이미지 저장소라는 의미가 분명해서

`consultation-images`를 추천한 것입니다.

다른 이름도 가능하지만, 그 경우 `SUPABASE_STORAGE_BUCKET` 값도 같이 맞춰야 합니다.

## 지금까지 배포하면서 자주 헷갈렸던 포인트

### 1. Render가 서버 자체인가?

네. 정확히는 `서버를 실행할 수 있게 해주는 플랫폼`입니다.

하지만 Render 계정만 있다고 서버가 자동으로 뜨는 건 아니고, 우리 코드를 `Deploy`해야 실제 서버가 됩니다.

### 2. Dockerfile은 Render가 제공하는가?

아닙니다. `우리가 프로젝트에 넣는 파일`입니다.

Render는 그 파일을 읽어서 빌드할 뿐입니다.

### 3. Dockerfile이 로컬에만 있으면 되나?

아닙니다.

Render는 GitHub 저장소를 clone해서 빌드하므로, `Dockerfile`도 반드시 commit/push 되어 있어야 합니다.

### 4. 왜 Render 빌드에서 Dockerfile not found가 났나?

로컬에는 파일이 있었지만, GitHub에 push되지 않은 상태였기 때문입니다.

즉:

- 로컬 파일 존재
- GitHub에는 없음
- Render는 GitHub만 봄

## 지금 이 프로젝트에서 배포 순서

1. Neon DB 생성
2. Supabase 프로젝트와 Storage bucket 생성
3. Render Web Service 생성
4. Render env 입력
5. GitHub에 Dockerfile 포함 코드 push
6. Render deploy
7. `/api/health` 확인
8. 프론트에 `EXPO_PUBLIC_API_BASE_URL` 넣기
9. Android production 빌드
10. Play Console 업로드

## Express/Next API 개발자 기준으로 보면

이번 구조는 `Vercel + managed Postgres + S3 비슷한 스토리지`를 Spring Boot 쪽으로 옮긴 느낌입니다.
`Render`는 API 서버를 실행하는 플랫폼, `Neon`은 managed Postgres, `Supabase Storage`는 파일 버킷 역할입니다.
`Dockerfile`은 Next custom server나 container 배포에서의 실행 정의와 비슷하고, `.env`는 런타임 비밀값을 넣는 점에서 동일합니다.
차이는 이번 프로젝트가 Node 서버가 아니라 `Spring Boot jar`를 Docker 컨테이너로 띄운다는 점입니다.
