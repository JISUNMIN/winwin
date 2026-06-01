# Backend 20. API 에러 status 수정과 채팅 미완성 기능 가드

이번 단계에서는 새 기능을 크게 더하기보다, 지금 있는 기능이 사용자에게 거짓말하지 않도록 정리하고 API 에러 응답을 실제 HTTP status와 맞췄습니다.

## 이번에 한 것

- `ApiExceptionHandler`가 validation / malformed body / `ResponseStatusException`을 이제 `ResponseEntity`로 반환하도록 수정
- 그래서 에러 JSON 안의 `status` 숫자뿐 아니라 실제 HTTP status도 `400`, `401`, `409` 같은 값으로 내려가게 수정
- `CustomerConsultationControllerWebMvcTest` 추가
- 고객 상담 API에서 `401 Unauthorized`, `400 Validation Error` 경계를 MockMvc로 확인
- `ChatScreen`에서 API 세션일 때 이미지 전송 버튼을 더 이상 mock처럼 동작시키지 않고 안내 후 막음
- 채팅 상단에 `현재 API 세션에서는 무엇이 서버 저장되고 무엇이 아직 준비 중인지` 안내 배너 추가
- auth / 상담 목록 / 공고 등록 완료 화면의 `mock` 문구를 `개발용 빠른 전환`, `개발용 예시 데이터`, `개발용 로컬 저장` 같은 더 명확한 표현으로 정리

## 왜 중요했나

이번 단계에서 테스트를 추가하다가, 예외 핸들러가 에러 바디는 맞게 만들어도 HTTP status는 `200 OK`로 남는 문제를 발견했습니다.

즉 프론트는 JSON의 `status: 400`을 보고 에러처럼 처리할 수 있었지만,
실제 네트워크 레벨에서는 성공 응답처럼 보이는 불일치가 있었습니다.

이 상태는 나중에:

- 모바일 네트워크 레이어 공통 처리
- 운영 모니터링
- 프록시 / API gateway
- QA 도구

에서 오해를 만들 수 있어서, 지금 단계에서 바로 고치는 편이 맞았습니다.

## 바뀐 핵심 파일

- `backend/src/main/java/com/winwin/backend/api/ApiExceptionHandler.java`
- `backend/src/test/java/com/winwin/backend/api/ApiExceptionHandlerTest.java`
- `backend/src/test/java/com/winwin/backend/consultation/CustomerConsultationControllerWebMvcTest.java`
- `src/components/winwin/ChatScreen.tsx`
- `src/app/auth/index.tsx`
- `src/app/chat/index.tsx`
- `src/app/partner/index.tsx`
- `src/app/partner/post/created.tsx`

## 결과

이제 상담/인증 API에서 validation 에러가 나면:

- 응답 body의 `status`도 맞고
- 실제 HTTP status도 맞고
- RN 화면에서도 실패를 더 정확히 감지할 수 있습니다.

또 사용자는 API 세션에서 아직 서버 저장되지 않는 이미지 전송 기능을 실제 기능처럼 오해하지 않게 됐습니다.

## 확인

- `.\node_modules\.bin\tsc.cmd --noEmit`
- `backend\.\mvnw.cmd test`

## 다음으로 보기 좋은 작업

- 이미지 업로드 API를 실제로 붙여서 현재 막아둔 채팅 이미지 기능을 서버 저장형으로 전환
- 배포 전 환경변수 / base URL / 운영 모드 문구 정리
- 핵심 동선 기준 수동 QA 체크리스트 문서화
