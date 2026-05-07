# 49. Step 44 Android auth API base URL 수정

## 목표

Android Studio 에뮬레이터에서 `/auth` 화면은 열리지만,
로그인/회원가입 요청 시 `failed to fetch`가 뜨는 문제가 있었습니다.

이번 단계에서는:

- Android 에뮬레이터 기본 API 주소를 안전하게 보정하고
- 환경변수 예시도 상황별로 정리

했습니다.

## 수정한 파일

```text
src/api/http.ts
.env.example
```

## 원인

웹에서는 `http://localhost:8080`이 내 PC에서 실행 중인 Spring 서버를 뜻합니다.

하지만 Android Studio 에뮬레이터에서는 다릅니다.

에뮬레이터 안에서의:

```text
localhost
```

는 내 PC가 아니라

```text
에뮬레이터 자기 자신
```

을 뜻합니다.

그래서 웹에서는 되던 주소가 Android 에뮬레이터에서는 백엔드로 연결되지 않고,
결과적으로 `failed to fetch`가 발생할 수 있습니다.

## 바꾼 점

### 1. Android 기본 base URL을 `10.0.2.2`로 변경

이제 `src/api/http.ts`에서는:

- 웹: `http://localhost:8080`
- Android: `http://10.0.2.2:8080`

를 기본값으로 사용합니다.

`10.0.2.2`는 Android Studio 에뮬레이터에서
호스트 PC의 `localhost`를 가리키는 특수 주소입니다.

즉:

```text
웹의 localhost
==
Android 에뮬레이터의 10.0.2.2
```

라고 보면 됩니다.

### 2. `.env.example`에 상황별 예시 추가

이제 환경변수 예시 파일에는:

- 웹
- Android Studio 에뮬레이터
- 실제 휴대폰

기준 예시를 같이 적어두었습니다.

즉 이후에는 기기에 따라:

```text
웹: localhost
에뮬레이터: 10.0.2.2
실기기: 내 PC 로컬 IP
```

를 선택하면 됩니다.

## React 개발자 기준으로 보면

이번 수정은 웹에서 API base URL을 환경에 따라 다르게 두는 것과 비슷합니다.

예를 들면:

- 브라우저 개발 서버
- 모바일 에뮬레이터
- 실기기

가 같은 `localhost` 개념을 공유하지 않기 때문에
환경별 endpoint를 다르게 잡아줘야 하는 패턴입니다.

즉 느낌상:

- web dev host
- emulator loopback alias
- device LAN IP

를 구분한 작업입니다.

## 핵심 코드

```ts
if (Platform.OS === 'android') {
  return 'http://10.0.2.2:8080';
}
```

Android Studio 에뮬레이터에서 호스트 PC의 Spring 서버를 향하도록 기본값을 보정했습니다.

## 검증

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```

## 같이 기억할 것

이 수정이 있어도 백엔드 서버가 실제로 떠 있어야 합니다.

즉 Android 로그인 테스트 전에는:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

이 먼저 실행 중이어야 합니다.
