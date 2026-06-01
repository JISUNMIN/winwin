# 진행 기록과 다음 할 일

## 현재 배포 준비도

- `개발/스테이징 배포` 기준으로는 가능한 수준까지 올라왔습니다.
- `운영 배포` 기준으로는 마지막 환경변수 세팅과 수동 QA가 아직 필요합니다.
- 큰 기능축인 `auth`, `post`, `consultation/chat`은 MVP 기준 핵심 흐름이 연결됐습니다.

## 지금 되는 것

- 회원가입/로그인과 토큰 기반 API 호출
- 고객 홈 공고 조회, 상세 진입, 채팅 시작
- 파트너 공고 등록/수정/마감과 파트너 공고 관리
- 고객/파트너 상담 목록 조회
- 상담 상세 읽기와 unread 초기화
- 텍스트 메시지 전송
- 이미지 메시지 업로드와 `/uploads/**` 정적 제공
- 고객 희망 일정 전송
- 파트너 예약 요청 전송
- 고객 결제 완료 처리
- 파트너 상담 종료
- API 예외 응답의 실제 HTTP status 정리
- 운영 빌드에서 개발용 역할 전환/예시 데이터 fallback 기본 숨김
- 운영 가드
  - 프론트 production에서 `EXPO_PUBLIC_API_BASE_URL` 미설정 시 실패
  - 백엔드 production에서 dev `JWT_SECRET` 또는 기본 `APP_UPLOAD_DIR` 사용 시 실패

## 최근에 추가한 것

- 상담 이미지 업로드 API와 로컬 저장소 연결
- `/api/health` 응답에 `service`, `environment`, `uploadDirectoryReady`, `uploadDirectory` 추가
- 배포 전 자동 점검 스크립트 `scripts/check-release-readiness.ps1` 추가
- 루트 명령 `npm run release:check` 추가
- README와 배포 체크리스트를 실제 운영 기준으로 재정리

## 아직 남은 것

- 실제 운영 환경 변수 값 채우기
- 운영 서버에서 `APP_UPLOAD_DIR` 영속 경로 확인
- 고객/파트너 실계정으로 핵심 동선 수동 QA
- 실제 PG 결제 연동 여부 결정

## 배포 직전 체크 순서

1. 프론트 env 설정
   `EXPO_PUBLIC_API_BASE_URL`
2. 백엔드 env 설정
   `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `APP_ENV=production`, `APP_UPLOAD_DIR`
3. 자동 검증
   `.\node_modules\.bin\tsc.cmd --noEmit`
   `backend\.\mvnw.cmd test`
   `android\gradlew.bat help`
   `npm.cmd run release:check`
4. 수동 QA
   고객과 파트너 계정으로 채팅, 이미지, 일정, 예약 요청, 결제 완료, 상담 종료 확인

## 지금 판단

- 코드 기준으로는 `배포 직전 마감 단계`입니다.
- 하지만 실제 운영 배포 여부는 `env`와 `수동 QA`를 통과해야 판단할 수 있습니다.
- 특히 결제는 아직 실제 PG가 아니라 내부 상태 처리 수준입니다.
