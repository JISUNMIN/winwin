# Backend 07. 웹 auth 요청 CORS 허용

## 이번 단계 한 줄 요약

웹에서 `/auth` 화면은 열리지만 로그인/회원가입 요청 시 `failed to fetch`가 뜨는 문제를 막기 위해,
Spring Security에 로컬 개발용 CORS 설정을 추가했습니다.

즉 지금 상태는:

```text
브라우저에서 auth 요청이 막힐 수 있던 상태
-> 웹 개발 서버에서 localhost 백엔드로 auth 요청 가능한 상태
```

입니다.

## 원인

웹에서는 Expo 개발 서버 주소와 Spring 백엔드 주소가 서로 다릅니다.

예:

- 프론트: `http://localhost:8081`
- 백엔드: `http://localhost:8080`

브라우저 입장에서는 이 둘이 서로 다른 origin이라서,
백엔드가 명시적으로 허용하지 않으면 요청을 막을 수 있습니다.

이때 프론트에서는 보통:

```text
failed to fetch
```

같이 보일 수 있습니다.

## 수정한 파일

```text
backend/src/main/java/com/winwin/backend/config/SecurityConfig.java
```

## 바꾼 점

### 1. Spring Security에 `cors()` 활성화

이제 보안 체인에 CORS 처리가 포함됩니다.

### 2. 로컬 개발용 origin 허용

현재는 아래 계열을 허용했습니다.

- `http://localhost:*`
- `http://127.0.0.1:*`
- `http://192.168.*:*`
- `http://10.0.2.2:*`

즉:

- 웹 개발 서버
- 같은 와이파이 실기기
- Android 에뮬레이터

기준의 로컬 개발 요청을 함께 받도록 정리했습니다.

## Express/Next API 개발자 기준으로 보면

이번 수정은 Express에서 `cors()` 미들웨어를 붙여
로컬 프론트 개발 서버 origin을 허용하는 것과 비슷합니다.

즉 느낌상:

- Spring `cors()` 활성화 = Express `app.use(cors(...))`
- `CorsConfigurationSource` = 허용 origin/method/header 설정 객체

라고 이해하면 됩니다.

## 핵심 코드

```java
.cors(Customizer.withDefaults())
```

Security filter chain에 CORS 처리를 켰습니다.

```java
configuration.setAllowedOriginPatterns(
    List.of(
        "http://localhost:*",
        "http://127.0.0.1:*",
        "http://192.168.*:*",
        "http://10.0.2.2:*"));
```

로컬 개발 환경에서 자주 쓰는 origin들을 허용했습니다.

## 검증

```powershell
cd backend
.\mvnw.cmd test
```

결과:

```text
BUILD SUCCESS
```

추가로 프론트 타입 검사도 통과했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```
