# Backend 22. 배포 가드와 실제 README 정리

이번 단계에서는 기능 추가보다 `배포 실수 방지`에 집중했습니다.

## 이번에 한 것

### 1. 프론트 production base URL 가드

`src/api/http.ts`에서 production 빌드(`__DEV__ === false`)인데
`EXPO_PUBLIC_API_BASE_URL`이 비어 있으면 바로 에러를 던지도록 수정했습니다.

이전에는 웹에서 설정이 없어도 `http://localhost:8080`으로 흘러갈 수 있었는데,
운영 빌드 기준으로는 위험한 기본값이라 막았습니다.

## 2. 백엔드 production startup guard

`DeploymentGuard`를 추가했습니다.

`APP_ENV=production` 또는 `APP_ENV=prod`일 때:

- `JWT_SECRET`가 개발 기본값이면 서버 시작 차단
- `APP_UPLOAD_DIR`가 기본 `uploads` 그대로면 서버 시작 차단

즉 운영 환경에서

- 개발용 secret
- 임시 로컬 업로드 경로

로 잘못 뜨는 걸 시작 시점에 막습니다.

## 3. README를 실제 프로젝트 기준으로 교체

기존 Expo 기본 템플릿 README를 지우고,
현재 WinWin 프로젝트 기준 README로 다시 작성했습니다.

이제 README에는:

- 스택
- 로컬 실행
- 필수 환경변수
- production guard
- 검증 명령
- 배포 체크리스트 링크

가 들어 있습니다.

## 바뀐 핵심 파일

- `src/api/http.ts`
- `backend/src/main/java/com/winwin/backend/config/DeploymentGuard.java`
- `backend/src/main/resources/application.yml`
- `README.md`

## 확인

- `.\node_modules\.bin\tsc.cmd --noEmit`
- `backend\.\mvnw.cmd test`

## 현재 기준 의미

이 단계로 인해 배포 준비 상태는 더 좋아졌지만,
여전히 실제 운영 배포 전에는:

- 운영 env 실제 값 채우기
- 고객/파트너 끝까지 수동 QA
- uploads 경로 지속성 확인

이 마지막으로 필요합니다.
