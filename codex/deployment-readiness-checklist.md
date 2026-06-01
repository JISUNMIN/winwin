# Deployment Readiness Checklist

현재 기준으로 WinWin을 실제 배포하기 전에 확인할 항목입니다.

## 1. 프론트 환경 변수

최소 필요:

```text
EXPO_PUBLIC_API_BASE_URL=https://your-api-host
```

선택:

```text
EXPO_PUBLIC_ENABLE_DEV_ROLE_SWITCH=false
EXPO_PUBLIC_ENABLE_DEV_FALLBACK_DATA=false
```

운영 빌드에서는 개발용 플래그를 따로 주지 않거나 `false`로 두는 편이 안전합니다.

## 2. 백엔드 환경 변수

최소 필요:

```text
DB_URL=jdbc:postgresql://<host>:5432/<db>
DB_USERNAME=<user>
DB_PASSWORD=<password>
JWT_SECRET=<long-random-secret>
SERVER_PORT=8080
APP_ENV=production
APP_UPLOAD_DIR=<absolute-or-managed-upload-path>
```

권장:

- `JWT_SECRET`는 로컬 기본값을 그대로 쓰지 않기
- `APP_UPLOAD_DIR`는 컨테이너 재배포 후에도 남는 볼륨 경로로 지정하기

## 3. 운영 전 수동 QA

고객 흐름:

1. 회원가입
2. 로그인
3. 홈 공고 조회
4. 공고 상세 진입
5. 채팅 시작
6. 텍스트 전송
7. 이미지 전송
8. 희망 일정 전송
9. 예약 요청 수신 확인
10. 결제 완료 처리

파트너 흐름:

1. 회원가입
2. 로그인
3. 공고 등록
4. 공고 목록/상세 반영 확인
5. 상담 목록 진입
6. 고객 메시지 unread 확인
7. 채팅 열기 후 unread 초기화 확인
8. 텍스트 전송
9. 이미지 전송
10. 예약 요청 전송
11. 상담 종료

공통 확인:

- validation 에러 시 HTTP status가 `200`이 아니라 실제 `400/401/409`로 내려오는지
- 업로드 이미지가 앱 재실행 후에도 보이는지
- `/uploads/...` URL이 외부 기기에서도 열리는지

## 4. 아직 남아 있는 주의점

- 결제는 아직 실제 PG 연동이 아니라 `결제 완료 처리` API 수준입니다.
- 일부 화면은 서버 실패 시 개발용 예시 데이터를 fallback으로 보여줄 수 있습니다.
- 운영 배포 전에는 fallback 정책을 더 줄일지 결정하는 편이 좋습니다.

## 5. 배포 직전 추천 확인 명령

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
backend\.\mvnw.cmd test
android\gradlew.bat help
npm.cmd run release:check
```

`npm run release:check`는 아래를 한 번에 확인합니다.

- 프론트 TypeScript 타입 검사
- 백엔드 테스트
- `/api/health` 응답의 `service`, `environment`, `uploadDirectoryReady`

주의:

- 이 명령은 실행 중인 백엔드가 필요합니다.
- 기본 주소는 `http://localhost:8080`이고, 필요하면 `WINWIN_BACKEND_URL`로 덮어쓸 수 있습니다.
- Windows PowerShell에서는 `npm` 대신 `npm.cmd`를 쓰는 편이 안전합니다.

가능하면 추가로 실제 기기/에뮬레이터에서:

- 고객 1명
- 파트너 1명

계정을 써서 상담 플로우를 끝까지 한 번 돌려보는 것이 좋습니다.
