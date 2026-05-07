# Backend 05. Auth 세션 구조와 앱 시작 복원 준비

## 이번 단계 한 줄 요약

이번 단계에서는 RN의 mock auth 경계는 유지한 채,
안쪽 상태를 실제 세션 구조로 확장하고 앱 시작 시 세션 복원을 준비했습니다.

즉 지금 상태는:

```text
role 문자열만 저장하던 mock auth
-> token / user / auth source까지 담을 수 있는 auth provider
```

입니다.

## 왜 이 단계가 필요했나

이전 단계 `backend-04`에서 auth API를 호출하는 client 함수는 만들었지만,
프론트 auth 상태 자체는 아직:

```text
guest / customer / partner
```

문자열만 기억하는 mock 구조였습니다.

이 상태로는 나중에 실제 로그인 API를 붙일 때 아래가 부족합니다.

- access token 저장
- 사용자 정보 저장
- 앱 시작 시 로그인 복원
- `GET /api/users/me`로 세션 유효성 확인

그래서 이번 단계에서는 화면을 크게 흔들지 않고,
현재 `useAuth` 경계 안쪽만 실제 세션 구조에 가깝게 바꿨습니다.

## 이번에 바꾼 핵심

수정 파일:

- [src/auth/mock-auth.tsx](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/src/auth/mock-auth.tsx)

이번 변경의 핵심은 아래 4가지입니다.

### 1. role만 아니라 session 전체를 다룰 수 있게 확장

이제 auth provider는 단순 role 문자열 대신
아래 정보를 담을 수 있습니다.

- `source`
  `mock` 또는 `api`

- `role`
  `guest / customer / partner`

- `accessToken`
  실제 API 로그인 시 저장할 토큰

- `user`
  `id / email / name / role`

즉 앞으로는:

```text
단순 역할 상태
-> 실제 인증 세션 상태
```

로 확장할 수 있는 기반이 생겼습니다.

### 2. 저장 포맷을 세션 JSON 기준으로 변경

기존에는 `AsyncStorage`에 role 문자열만 저장했습니다.

이번에는 저장 키를:

```text
winwin.auth.session
```

형태의 세션 JSON 기준으로 바꿨습니다.

예:

```json
{ "source": "mock", "role": "partner" }
```

또는:

```json
{
  "source": "api",
  "accessToken": "...",
  "user": {
    "id": 1,
    "email": "partner@example.com",
    "name": "Partner One",
    "role": "partner"
  }
}
```

형태를 저장할 수 있습니다.

### 3. 앱 시작 시 API 세션 복원 흐름 추가

저장된 세션이 `api` 타입이면,
앱 시작 시:

```text
GET /api/users/me
```

를 호출해서 토큰이 아직 유효한지 확인하도록 준비했습니다.

흐름은 대충 이렇습니다.

```text
AsyncStorage에서 세션 읽기
-> source가 api면 accessToken 확인
-> /api/users/me 호출
-> 성공하면 최신 user 정보로 세션 갱신
-> 401이면 세션 삭제
```

즉:

```text
토큰만 저장해두는 것
-> 앱 시작 시 실제로 유효한 로그인인지 다시 확인하는 것
```

으로 한 단계 올라간 상태입니다.

### 4. 네트워크 문제와 실제 만료를 구분

이번 단계에서는 세션 복원 중
정말 `401 Unauthorized`가 난 경우에만 세션을 지우도록 했습니다.

반대로:

- 서버가 잠깐 안 켜졌거나
- 로컬 네트워크가 불안정하거나
- 개발 중 백엔드 연결이 잠깐 실패한 경우

에는 저장된 세션 정보를 임시로 유지하도록 했습니다.

이렇게 하면 개발 중에:

```text
백엔드 잠깐 안 떠 있음
-> 앱을 켰더니 무조건 로그아웃됨
```

같은 불편을 줄일 수 있습니다.

## 이번에 추가된 provider 기능

현재 `useAuth` 쪽에는 기존 것 외에 아래 정보가 추가됐습니다.

- `authSource`
- `accessToken`
- `user`
- `completeAuthSession(...)`

특히 `completeAuthSession(...)`은
나중에 로그인/회원가입 화면에서 auth API 성공 응답을 받은 뒤
세션을 저장 완료할 때 쓰게 될 함수입니다.

즉 다음 단계에서 대충 이런 흐름으로 연결할 수 있습니다.

```text
login()
-> AuthTokenResponse 받기
-> completeAuthSession(response)
-> provider에 token/user 저장
-> 화면 이동
```

## 이번 단계에서 유지한 것

중요한 점은 현재 UI 흐름을 갑자기 깨지 않게
기존 mock 빠른 전환은 그대로 유지했다는 점입니다.

즉 아직도:

- `signInAs('customer')`
- `signInAs('partner')`
- `signOut()`

는 동작합니다.

그래서 현재 홈 상단 역할 전환 버튼이나
기존 보호 라우트 흐름은 계속 사용할 수 있습니다.

즉 이번 단계는:

```text
mock auth를 지운 것이 아니라
mock auth 바깥 모양은 유지하고
안쪽 상태 구조만 실제 auth에 맞게 바꾼 단계
```

입니다.

## 다음 단계

다음 작업은 아래 순서가 자연스럽습니다.

### 1. `/auth` 화면에 실제 로그인/회원가입 폼 추가

현재 `/auth`는 역할 선택 mock 화면입니다.

다음에는:

- 이메일
- 비밀번호
- 이름
- 고객/파트너 선택

같은 입력 UI를 붙이고,
`login()` / `signup()` 호출과 연결할 수 있습니다.

### 2. 로그인 성공 시 `completeAuthSession()` 연결

폼에서 로그인/회원가입이 성공하면
그 응답을 provider에 넘겨 실제 세션 저장을 마무리하면 됩니다.

### 3. 홈 상단 mock 빠른 전환 버튼은 개발용으로 분리 검토

실제 auth가 들어오기 시작하면
현재 홈 상단의 `게스트 / 고객 / 파트너` 버튼은
개발용 도구로 남길지, 숨길지, 별도 라벨을 붙일지 정해야 합니다.

### 4. `401` 공통 처리 정리

현재는 앱 시작 복원 시 `401`을 구분합니다.

나중에는 일반 API 요청 중 `401`이 났을 때도:

- 세션 정리
- `/auth` 이동
- 안내 메시지 표시

같은 정책을 같이 정리하면 좋습니다.

## 핵심 기준

```text
이번 단계는 로그인 화면을 완성한 것이 아니라,
실제 로그인 결과를 담고 복원할 수 있는 auth provider 뼈대를 만든 단계다.
```

```text
다음 단계부터는 useAuth 경계를 유지한 채
UI 입력과 실제 login/signup API 호출만 차례로 붙이면 된다.
```
