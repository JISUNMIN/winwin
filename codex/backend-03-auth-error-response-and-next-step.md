# Backend 03. Auth 에러 응답 정리와 다음 단계

## 이번 단계 한 줄 요약

이번 단계에서는 auth API의 실패 응답을 프론트에서 다루기 쉬운 공통 JSON 형태로 정리하고,
인증 실패와 검증 실패를 테스트로 확인했습니다.

즉 지금 상태는:

```text
성공 응답만 먼저 있던 auth API
-> 실패 응답도 일정한 모양으로 내려오는 auth API
```

입니다.

## 왜 이 작업이 필요했나

처음 auth API를 만들 때는 회원가입/로그인/내 정보 조회 같은 성공 흐름을 먼저 붙이는 것이 자연스럽습니다.

그런데 프론트에서 실제 API를 붙이기 시작하면 성공보다 먼저 부딪히는 것이 실패 케이스입니다.

예를 들면:

- 이메일 형식이 잘못된 경우
- 비밀번호 길이가 부족한 경우
- 이미 존재하는 이메일인 경우
- 로그인하지 않고 보호 API에 접근한 경우

이런 경우 응답 모양이 제각각이면 RN 앱에서 분기 처리가 불편해집니다.

그래서 이번 단계에서는:

- validation 에러
- 잘못된 요청 body
- service에서 던진 `ResponseStatusException`
- 인증되지 않은 접근

을 공통 JSON 형식으로 정리했습니다.

## 이번에 추가한 것

### 1. 공통 에러 응답 DTO

추가 파일:

- [ApiErrorResponse.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/api/ApiErrorResponse.java)

이 파일은 auth API 실패 응답의 공통 모양입니다.

핵심 필드:

- `status`
- `error`
- `code`
- `message`
- `path`
- `fieldErrors`

예를 들어 validation 에러가 나면 대충 이런 모양으로 내려가게 됩니다.

```json
{
  "status": 400,
  "error": "Bad Request",
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "path": "/api/auth/signup",
  "fieldErrors": [
    { "field": "email", "message": "must be a well-formed email address" }
  ]
}
```

즉 프론트는 이제:

```text
message는 어디에 있는지
fieldErrors는 어떤 형식인지
```

를 고정된 기준으로 기대할 수 있습니다.

### 2. 전역 예외 처리

추가 파일:

- [ApiExceptionHandler.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/api/ApiExceptionHandler.java)

이 파일은 `@RestControllerAdvice`로 전역 예외를 처리합니다.

이번에 처리한 대표 케이스:

- `MethodArgumentNotValidException`
  DTO 검증 실패

- `HttpMessageNotReadableException`
  요청 body 누락/파싱 실패

- `ResponseStatusException`
  service에서 의도적으로 던진 상태 코드 예외

즉 controller마다 `try/catch`를 넣지 않고,
한 군데에서 실패 응답 형식을 통일하는 방식입니다.

### 3. 인증 실패용 JSON 응답

추가 파일:

- [RestAuthenticationEntryPoint.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/security/RestAuthenticationEntryPoint.java)

이 파일은 로그인하지 않은 사용자가 보호 API에 접근했을 때
Spring Security 기본 HTML/빈 응답 대신 JSON 에러를 내려주기 위해 추가했습니다.

예:

```text
GET /api/users/me
Authorization 헤더 없음
-> 401 Unauthorized
-> JSON 에러 응답
```

### 4. SecurityConfig 연결

수정 파일:

- [SecurityConfig.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/config/SecurityConfig.java)

이번 단계에서는 `exceptionHandling(...).authenticationEntryPoint(...)`를 연결해서
보호 API의 인증 실패도 공통 JSON 형식으로 맞췄습니다.

## 이번 단계에서 실제로 보장한 것

이제 auth 쪽 실패 응답은 아래처럼 이해하면 됩니다.

### 회원가입 요청 검증 실패

예:

- 이메일 형식 오류
- 비밀번호 8자 미만
- 이름 공백
- role 누락

응답:

```text
400 Bad Request
code = VALIDATION_ERROR
fieldErrors 포함
```

### 잘못된 요청 body

예:

- JSON 형식 오류
- body 자체 누락

응답:

```text
400 Bad Request
code = INVALID_REQUEST_BODY
```

### service에서 의도적으로 막은 경우

예:

- 이메일 중복
- 잘못된 로그인 정보
- 사용자를 찾을 수 없음

응답:

```text
409 / 401 / 404 등
code = HTTP 상태 이름
message = service에서 넣은 reason
```

### 로그인 없이 보호 API 접근

예:

- `/api/users/me` 무토큰 접근

응답:

```text
401 Unauthorized
code = UNAUTHORIZED
message = Authentication is required to access this resource
```

## 테스트

이번 단계에서 확인한 테스트:

- [ApiExceptionHandlerTest.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/test/java/com/winwin/backend/api/ApiExceptionHandlerTest.java)
  validation / conflict 에러 응답 구조 확인

- [UserControllerWebMvcTest.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/test/java/com/winwin/backend/user/UserControllerWebMvcTest.java)
  `/api/users/me` 무토큰 접근 시 `401` JSON 응답 확인

실행한 명령:

```powershell
.\mvnw.cmd test
```

결과:

```text
BUILD SUCCESS
```

## 프론트 연결 관점에서 왜 좋아졌나

RN 앱에서 실제 auth API를 붙일 때는 실패 케이스를 사용자 문구로 바꾸는 작업이 필요합니다.

이번 정리 이후에는 프론트가 대충 이렇게 처리하기 쉬워집니다.

```text
code가 VALIDATION_ERROR면 fieldErrors를 폼 입력 아래에 표시
code가 CONFLICT면 "이미 가입된 이메일" 문구 표시
code가 UNAUTHORIZED면 로그인 상태 해제 또는 재로그인 유도
```

즉:

```text
백엔드 실패 응답 모양이 고정되면
프론트 에러 처리 로직도 안정적으로 만들기 쉬워진다
```

## 바로 다음 작업

다음 작업은 아래 순서가 가장 자연스럽습니다.

### 1. RN용 auth API client 함수 만들기

현재 RN 쪽은 mock auth 기반입니다.

다음에는:

- `signup`
- `login`
- `me`

를 호출하는 client 함수를 만들고,
기본 base URL과 JSON parsing, 에러 변환을 한 군데에 모으는 것이 좋습니다.

예를 들면:

```text
src/api/auth.ts
src/api/http.ts
```

같은 구조가 자연스럽습니다.

### 2. mock auth 경계 유지한 채 실제 API로 교체 시작

지금 있는 `useAuth` 경계를 유지하면서 내부 구현만 점진적으로 바꾸는 것이 좋습니다.

즉:

- 화면 컴포넌트는 크게 안 흔들고
- 내부에서 mock 대신 실제 API 호출
- 토큰 저장/복원
- `me` 조회로 로그인 상태 복원

순서로 가는 편이 안전합니다.

### 3. 토큰 저장 정책 정하기

RN에서 실제 auth를 붙일 때는 아래를 정해야 합니다.

- access token을 어디에 저장할지
- 앱 시작 시 언제 복원할지
- `401`이 나면 어떻게 로그아웃 처리할지

지금 프로젝트 흐름상 `AsyncStorage`를 이용한 복원 구조와 잘 맞습니다.

### 4. auth 화면 문구와 에러 표시 연결

현재 `/auth` 화면은 mock 전환 중심입니다.

실제 API를 붙이기 시작하면:

- validation 에러를 입력 필드 근처에 보여주기
- 로그인 실패 메시지 표시
- 중복 이메일 메시지 표시
- 로딩 상태 표시

를 같이 붙이면 자연스럽습니다.

## 핵심 기준

```text
이번 단계는 새로운 auth 기능을 만든 것보다,
기존 auth API를 프론트에서 실제로 붙일 수 있게 실패 응답 계약을 고정한 단계다.
```

```text
다음 단계의 중심은 mock auth를 한 번에 지우는 것이 아니라,
현재 useAuth 경계를 유지한 채 실제 auth API client를 안쪽에 넣는 것이다.
```
