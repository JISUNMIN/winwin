# Backend 04. RN Auth API Client 준비

## 이번 단계 한 줄 요약

이번 단계에서는 RN 앱이 Spring auth API를 호출할 수 있도록
공통 HTTP helper와 auth client 함수를 먼저 분리했습니다.

즉 지금 상태는:

```text
mock auth만 있는 프론트
-> 실제 auth API를 부를 준비가 된 프론트
```

입니다.

## 왜 바로 로그인 UI부터 바꾸지 않았나

현재 RN 앱은 역할 기반 mock auth가 이미 여러 화면에 연결되어 있습니다.

예:

- 홈 상단 역할 표시
- 고객/파트너 보호 화면 가드
- 마지막 경로 복원
- `/auth` 진입 흐름

이 상태에서 바로 실제 로그인 UI까지 한 번에 바꾸면
기존 화면 흐름이 많이 흔들릴 수 있습니다.

그래서 이번 단계에서는 먼저:

1. 백엔드 auth API를 호출하는 함수 만들기
2. 공통 에러 처리 기준 맞추기
3. base URL 설정 방식 정리하기

를 해두고,
그 다음 단계에서 `useAuth` 안쪽 구현을 점진적으로 교체하는 쪽이 더 안전합니다.

## 이번에 추가한 파일

### 1. 공통 HTTP helper

추가 파일:

- [src/api/http.ts](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/src/api/http.ts)

이 파일 역할:

- API base URL 결정
- `fetch` 공통 설정
- JSON 요청/응답 처리
- 백엔드 공통 에러 응답을 `ApiError`로 변환

중요한 포인트:

- 웹에서는 기본값으로 `http://localhost:8080`를 사용
- iOS/Android에서는 `EXPO_PUBLIC_API_BASE_URL` 환경변수가 필요

이렇게 나눈 이유는:

```text
웹 브라우저에서 localhost는 내 PC를 뜻하지만
휴대폰이나 에뮬레이터에서 localhost는 그 기기 자신을 뜻하기 때문
```

입니다.

즉 모바일에서는 보통:

```text
http://내PC의로컬IP:8080
```

형태를 써야 합니다.

예:

```text
http://192.168.0.10:8080
```

### 2. auth 전용 API client

추가 파일:

- [src/api/auth.ts](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/src/api/auth.ts)

이 파일에는 아래 함수가 들어 있습니다.

- `signup(...)`
- `login(...)`
- `getMe(accessToken)`

즉 나중에 RN 화면이나 auth provider는 직접 `fetch(...)`를 쓰지 않고
이 파일의 함수를 호출하면 됩니다.

예를 들면:

```ts
const result = await login({
  email: 'partner@example.com',
  password: 'password123',
});
```

처럼 사용할 수 있습니다.

### 3. 환경변수 예시 파일

추가 파일:

- [.env.example](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/.env.example)

현재 예시는:

```text
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

웹에서는 이 값이 없어도 기본값으로 동작하게 해두었지만,
모바일에서는 실제 기기/에뮬레이터 접속을 위해 이 값을 명시하는 편이 안전합니다.

## 백엔드 에러 응답과 어떻게 맞물리나

이전 단계 `backend-03`에서 백엔드 auth 에러 응답을 공통 JSON 형식으로 정리했습니다.

이번 단계의 `src/api/http.ts`는 그 응답을 받아서 `ApiError` 객체로 바꿉니다.

즉 RN 쪽에서는 나중에 이렇게 처리할 수 있습니다.

```text
VALIDATION_ERROR
-> 입력 필드별 에러 표시

CONFLICT
-> 이미 가입된 이메일 안내

UNAUTHORIZED
-> 로그인 실패 또는 세션 만료 처리
```

즉:

```text
백엔드의 공통 에러 응답 계약
-> 프론트의 공통 에러 처리 코드
```

로 이어질 준비가 된 것입니다.

## 이번 단계에서 아직 하지 않은 것

이번 단계는 어디까지나 “연결 준비” 단계라서,
아직 아래는 바꾸지 않았습니다.

- `useAuth` 내부를 실제 API 기반으로 교체
- `/auth` 화면에 이메일/비밀번호 입력 폼 추가
- access token 저장/복원
- 앱 시작 시 `me` 호출로 로그인 복원
- `401` 시 자동 로그아웃 처리

즉 현재 화면 동작은 아직 mock auth 그대로 유지됩니다.

이건 의도된 상태입니다.

## 다음 단계

다음 작업은 아래 순서가 가장 자연스럽습니다.

### 1. `useAuth`에 실제 세션 개념 추가

지금은 `role`만 저장하지만,
다음에는 아래 정보가 필요합니다.

- access token
- 사용자 id
- email
- name
- role

즉 mock role 상태를:

```text
단순 역할 문자열
-> 실제 인증 세션 객체
```

로 확장해야 합니다.

### 2. AsyncStorage에 토큰/세션 저장

앱 재시작 후에도 로그인 복원을 하려면
토큰이나 세션 정보를 저장해야 합니다.

현재 프로젝트는 이미 `AsyncStorage` 기반 복원 흐름이 있으니,
그 경계를 재사용하는 것이 좋습니다.

### 3. 앱 시작 시 `getMe()`로 세션 복원

토큰만 저장하고 끝내지 말고,
앱 시작 시 백엔드에:

```text
GET /api/users/me
```

를 호출해서 토큰이 아직 유효한지 확인하는 흐름이 필요합니다.

### 4. `/auth` 화면을 실제 로그인/회원가입 화면으로 확장

현재 `/auth`는 역할 선택 mock 화면입니다.

다음에는:

- 고객 로그인
- 파트너 로그인
- 회원가입
- 에러 메시지 표시

를 실제 API 호출과 연결할 수 있습니다.

### 5. React Query 도입은 조회성 API가 늘어날 때 검토

지금 단계에서는 auth 연결 자체가 우선이라
`fetch + 공통 helper + auth client`만으로도 충분합니다.

그래서 React Query는 바로 넣지 않고,
아래 같은 조회성 API가 본격적으로 늘어날 때 검토하는 것이 좋습니다.

- 공고 목록 조회
- 공고 상세 조회
- 파트너 공고 관리 목록
- 상담 목록
- 상담 상세 / 메시지 목록

그 시점에는 아래 이점이 커집니다.

- 캐싱
- refetch
- 로딩/에러 상태 공통화
- mutation 후 invalidate
- 화면 이동 후 서버 데이터 재사용

즉 현재 판단은:

```text
auth 단계는 fetch 기반으로 먼저 진행
post / consultation 같은 조회 데이터가 본격화되면 React Query 도입 검토
```

로 정리할 수 있습니다.

## 핵심 기준

```text
이번 단계는 실제 로그인 화면 구현이 아니라,
프론트가 백엔드 auth API를 호출할 수 있는 최소 기반을 만든 단계다.
```

```text
다음 단계의 핵심은 mock auth를 한 번에 지우는 것이 아니라,
현재 useAuth 경계를 유지하면서 안쪽 세션 구현만 실제 API로 교체하는 것이다.
```
