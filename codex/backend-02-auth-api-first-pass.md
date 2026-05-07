# Backend 02. Auth API 첫 구현 요약

## 이번 단계에서 한 작업 한 줄 요약

이번 단계에서는 `HealthController`만 추가한 것이 아니라,

- Spring Boot 서버를 실제로 띄울 수 있게 만들고
- PostgreSQL과 연결하고
- `users` 테이블을 만들고
- 회원가입 / 로그인 / 내 정보 조회 API를
- `JWT` 기반 인증 방식으로 처음 연결했습니다.

즉 지금 상태는:

```text
RN mock auth만 있던 상태
-> Java/Spring 백엔드에 실제 auth API가 생긴 상태
```

입니다.

## 왜 파일이 많이 늘어났나

처음 Java 백엔드를 보면 파일이 갑자기 많아져서 부담스럽게 느껴질 수 있습니다.

그 이유는 Spring 백엔드는 보통 역할을 나눠서 작성하기 때문입니다.

예를 들면:

- 요청을 받는 파일
- DB와 연결되는 파일
- 토큰을 만드는 파일
- 보안 규칙을 정하는 파일
- 요청/응답 모양만 담당하는 파일

을 분리합니다.

## 역할별로 보면

Spring 백엔드에서 자주 보는 이름들은 대충 아래 의미입니다.

### Controller

`Controller`는 HTTP 요청을 직접 받는 입구입니다.

예를 들면:

- 어떤 URL인지
- `GET`인지 `POST`인지
- 요청 body를 어떤 형식으로 받을지

를 연결하고, 실제 로직은 보통 `Service`에 넘깁니다.

지금 프로젝트 예시:

- [AuthController.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/AuthController.java)
  회원가입 / 로그인 요청 받는 역할

- [UserController.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/user/UserController.java)
  로그인된 사용자의 내 정보 조회 요청 받는 역할

- [HealthController.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/api/HealthController.java)
  서버가 살아 있는지 확인하는 요청 받는 역할

짧게 말하면:

```text
Controller = API 입구
```

Express/Next API 기준으로 보면:

- Express의 `router.get(...)`, `router.post(...)`가 들어 있는 route 파일과 비슷합니다.
- Next App Router 기준으로는 `app/api/.../route.ts` 안의 `GET`, `POST` handler와 비슷합니다.

### Service

`Service`는 실제 비즈니스 로직을 처리하는 곳입니다.

예를 들면:

- 회원가입 할 때 이메일 중복 확인
- 비밀번호 암호화
- 로그인 검증
- 토큰 발급

같은 “진짜 일”을 합니다.

지금 프로젝트 예시:

- [AuthService.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/AuthService.java)
  회원가입 / 로그인 / 내 정보 조회 로직 처리

짧게 말하면:

```text
Service = 실제 핵심 로직
```

Express/Next API 기준으로 보면:

- route 파일 안에 직접 적기 시작하면 길어지는 비즈니스 로직을 따로 뺀 helper/service 파일과 비슷합니다.
- 예를 들면 `auth.service.ts`, `user.service.ts` 같은 파일 역할과 가깝습니다.

### Repository

`Repository`는 DB 접근 전용 창구입니다.

예를 들면:

- 사용자 저장
- 이메일로 사용자 찾기
- ID로 사용자 찾기

같은 DB 작업을 담당합니다.

지금 프로젝트 예시:

- [UserRepository.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/user/UserRepository.java)
  `users` 테이블 조회/저장 역할

짧게 말하면:

```text
Repository = DB 접근 담당
```

Express/Next API 기준으로 보면:

- Prisma, Drizzle, Sequelize 호출을 모아둔 `user.repository.ts` 같은 파일과 비슷합니다.
- 또는 route/service 안에서 하던 DB 쿼리를 분리한 data access layer와 비슷합니다.

### Entity

`Entity`는 DB 테이블과 연결된 Java 클래스입니다.

즉 “DB 한 행을 Java 객체로 표현한 것”이라고 보면 됩니다.

지금 프로젝트 예시:

- [UserAccount.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/user/UserAccount.java)
  `users` 테이블 구조를 표현하는 클래스

짧게 말하면:

```text
Entity = DB 테이블 모델
```

Express/Next API 기준으로 보면:

- Prisma의 `schema.prisma` 모델
- Sequelize/TypeORM의 model 정의
- Drizzle의 table schema

같은 ORM 모델 정의와 비슷합니다.

### DTO

`DTO`는 요청/응답 전용 데이터 구조입니다.

Entity를 그대로 밖으로 내보내지 않고,
API에서 주고받는 모양만 따로 분리할 때 씁니다.

지금 프로젝트 예시:

- [SignupRequest.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/dto/SignupRequest.java)
  회원가입 요청 body 모양

- [LoginRequest.java](/abs/path/C:/Users\\zentropy\\Music\\WinWin\\WinWin\\backend\\src\\main\\java\\com\\winwin\\backend\\auth\\dto\\LoginRequest.java)
  로그인 요청 body 모양

- [AuthTokenResponse.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/dto/AuthTokenResponse.java)
  로그인/회원가입 응답 모양

- [MeResponse.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/dto/MeResponse.java)
  내 정보 조회 응답 모양

짧게 말하면:

```text
DTO = 요청/응답 데이터 모양
```

Express/Next API 기준으로 보면:

- `zod` schema
- TypeScript `type` / `interface`
- request body validator + response shape type

와 비슷합니다.

### Security / Filter

보안 관련 파일들은 인증 규칙과 토큰 검사를 담당합니다.

지금 프로젝트 예시:

- [SecurityConfig.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/config/SecurityConfig.java)
  어떤 API를 열고 어떤 API를 보호할지 정하는 파일

- [JwtAuthenticationFilter.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/security/JwtAuthenticationFilter.java)
  요청마다 JWT 토큰을 검사하는 파일

- [JwtTokenProvider.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/security/JwtTokenProvider.java)
  JWT 토큰 생성/해석하는 파일

- [AuthenticatedUser.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/security/AuthenticatedUser.java)
  토큰에서 꺼낸 현재 로그인 사용자 정보 객체

짧게 말하면:

```text
Security = 인증/인가 규칙
Filter = 요청 중간에서 검사하는 장치
```

Express/Next API 기준으로 보면:

- `SecurityConfig`는 어떤 route를 공개하고 보호할지 정하는 전역 auth 규칙과 비슷합니다.
- `JwtAuthenticationFilter`는 Express middleware나 Next middleware에서 토큰 검사하는 코드와 비슷합니다.
- `JwtTokenProvider`는 `jwt.sign`, `jwt.verify`를 모아둔 util 파일과 비슷합니다.

### Enum

`Enum`은 미리 정해진 값 목록입니다.

지금 프로젝트 예시:

- [UserRole.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/user/UserRole.java)
  사용자 역할이 `CUSTOMER`, `PARTNER` 중 하나만 되게 하는 역할

짧게 말하면:

```text
Enum = 정해진 선택지 목록
```

Express/Next API 기준으로 보면:

- TypeScript의 string union 타입
- `const USER_ROLES = ['CUSTOMER', 'PARTNER'] as const`
- Prisma enum

같은 제한된 값 목록과 비슷합니다.

Express/Next API 기준으로 보면 하나의 route 파일에 다 넣기보다:

- route handler
- service
- db model
- validation schema
- auth middleware

를 나눠 놓는 느낌과 비슷합니다.

## 이번에 추가된 핵심 흐름

이번 auth API의 실제 흐름은 아래입니다.

```text
회원가입 요청
-> Controller가 요청 받음
-> Service가 비즈니스 로직 수행
-> Repository가 DB 저장
-> JWT 발급
-> 응답 반환
```

로그인도 거의 같은 흐름입니다.

```text
로그인 요청
-> Controller
-> Service
-> Repository로 이메일 조회
-> 비밀번호 확인
-> JWT 발급
-> 응답 반환
```

`/api/users/me`는 조금 다릅니다.

```text
요청 헤더에 Bearer 토큰 포함
-> JwtAuthenticationFilter가 토큰 해석
-> Spring Security에 "현재 로그인 사용자" 등록
-> Controller에서 현재 사용자 정보 사용
-> Service가 DB 조회 후 응답 반환
```

## 요청 흐름을 파일 이름으로 보면

처음엔 파일을 따로따로 보지 말고,
“요청 1개가 어떤 파일들을 지나가는지”로 보면 이해가 더 쉽습니다.

### 회원가입 요청 흐름

```text
AuthController
-> 요청 받음
AuthService
-> 이메일 중복 확인, 비밀번호 암호화, 저장 준비
UserRepository
-> DB 저장/조회
UserAccount
-> DB 테이블 모양
JwtTokenProvider
-> 토큰 생성
```

즉 회원가입은:

- Controller가 요청을 받고
- Service가 실제 로직을 처리하고
- Repository가 DB에 접근하고
- Entity가 DB 구조를 나타내고
- TokenProvider가 JWT를 만듭니다.

### 로그인 요청 흐름

```text
AuthController
-> 요청 받음
AuthService
-> 이메일로 사용자 찾기, 비밀번호 비교
UserRepository
-> DB 조회
JwtTokenProvider
-> 토큰 생성
```

### 로그인 후 `me` 조회 흐름

```text
JwtAuthenticationFilter
-> 토큰 검사
UserController
-> 요청 받음
AuthService
-> 사용자 조회
UserRepository
-> DB 조회
```

즉 `me` 조회는 auth API와 조금 다르게
맨 앞에 토큰 검사 필터가 하나 더 붙습니다.

## 이름이 완전히 똑같지 않은 이유

처음 보면 이런 생각이 들 수 있습니다.

```text
AuthController
AuthService
AuthRepository
```

처럼 전부 똑같이 맞아야 하는 것 아닌가?

그런데 실제로는 꼭 그렇지 않습니다.

왜냐하면 이름을 맞출 때 기준이 두 가지가 있기 때문입니다.

### 1. 기능 이름으로 묶는 경우

예:

- `AuthController`
- `AuthService`

이건 “인증 기능”을 처리하는 파일들이라 `Auth`로 묶입니다.

### 2. 데이터 주체 이름으로 묶는 경우

예:

- `UserRepository`
- `UserAccount`
- `UserRole`

이건 실제로 저장되는 데이터가 “사용자”라서 `User`로 묶입니다.

즉:

```text
Auth = 로그인/회원가입/토큰 같은 기능 이름
User = 실제 DB에 저장되는 사용자 데이터 이름
```

입니다.

그래서 지금 구조는:

- `AuthController`, `AuthService`
  인증 기능 담당

- `UserRepository`, `UserAccount`
  사용자 데이터 담당

으로 나뉘는 것이 자연스럽습니다.

## 보통 어떤 것끼리 이름이 같나

보통은 앞부분 도메인 이름을 맞추고,
뒤에는 역할 이름을 붙입니다.

예:

```text
PostController
PostService
PostRepository
Post
```

```text
OrderController
OrderService
OrderRepository
Order
```

이런 경우는 기능 이름과 DB 주체 이름이 같아서 전부 통일됩니다.

그런데 auth는 조금 다릅니다.

`Auth`는 기능 이름이고,
실제 DB에 저장되는 대상은 `User`라서
완전히 다 똑같이 맞지 않아도 이상한 게 아닙니다.

짧게 정리하면:

```text
같은 요청 흐름 안에서도
기능 이름(Auth)으로 묶이는 파일이 있고
데이터 이름(User)으로 묶이는 파일이 있다.
```

## 파일별로 왜 추가됐는지

### 1. [HealthController.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/api/HealthController.java)

이 파일은 서버가 정말 살아 있는지 가장 빠르게 확인하려고 추가했습니다.

처음 백엔드에서는:

- DB 문제인지
- Security 문제인지
- 라우팅 문제인지

구분이 잘 안 되는 경우가 많습니다.

그래서 제일 단순한 `/api/health`를 하나 두면
“서버는 떴다”를 먼저 확인할 수 있습니다.

핵심은 이겁니다.

```java
@GetMapping("/health")
public Map<String, String> health() {
  return Map.of("status", "ok", "service", "winwin-backend");
}
```

### 2. [SecurityConfig.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/config/SecurityConfig.java)

이 파일은 “어떤 API는 로그인 없이 허용하고, 어떤 API는 로그인해야 하는지”를 정합니다.

왜 필요하냐면 Spring Security를 넣으면 기본적으로 보안 필터 체인이 생기기 때문입니다.

이번 단계에서는:

- `/api/health`
- `/api/auth/**`

는 열어두고,

- 그 외 요청은 로그인 필요

로 설정했습니다.

핵심 코드는 이 부분입니다.

```java
.authorizeHttpRequests(
    auth ->
        auth.requestMatchers("/api/health", "/api/auth/**").permitAll()
            .anyRequest()
            .authenticated())
```

그리고 세션 로그인 방식이 아니라 JWT 방식으로 가려고
`STATELESS`도 같이 넣었습니다.

```java
.sessionManagement(
    session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
```

### 3. [JwtAuthenticationFilter.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/security/JwtAuthenticationFilter.java)

이 파일은 요청마다 `Authorization` 헤더를 확인하는 필터입니다.

브라우저/앱이 이런 헤더를 보내면:

```text
Authorization: Bearer <token>
```

이 필터가 토큰을 읽고, 토큰이 유효하면
“현재 로그인 사용자”를 Spring Security 안에 넣어줍니다.

핵심 코드는 이 부분입니다.

```java
String header = request.getHeader(HttpHeaders.AUTHORIZATION);

if (header != null && header.startsWith("Bearer ")) {
  String token = header.substring(7);
  AuthenticatedUser user = jwtTokenProvider.parse(token);
  SecurityContextHolder.getContext().setAuthentication(authentication);
}
```

React/Node 기준으로 보면 `express middleware`나 `Next middleware` 느낌과 비슷합니다.

### 4. [JwtTokenProvider.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/security/JwtTokenProvider.java)

이 파일은 JWT를 “만드는 일”과 “읽는 일”을 담당합니다.

왜 따로 뺐냐면:

- Service에서 토큰 문자열 세부 구현까지 알 필요 없고
- 나중에 refresh token, claim 추가, 만료 시간 변경이 생겨도
- 여기를 중심으로 바꾸면 되기 때문입니다.

토큰 생성 핵심:

```java
return Jwts.builder()
    .subject(String.valueOf(user.getId()))
    .claim("email", user.getEmail())
    .claim("role", user.getRole().name())
    .issuedAt(now)
    .expiration(expiry)
    .signWith(secretKey)
    .compact();
```

토큰 해석 핵심:

```java
Claims claims =
    Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
```

### 5. [UserAccount.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/user/UserAccount.java)

이 파일은 `users` 테이블과 연결되는 엔티티입니다.

React 프론트에서 타입을 만들듯,
Spring/JPA에서는 DB 테이블과 연결되는 클래스를 만듭니다.

핵심 포인트:

- `@Entity`: DB 테이블과 연결되는 클래스
- `@Table(name = "users")`: 실제 테이블 이름
- `@Id`: 기본키
- `@Column`: 컬럼 제약

핵심 코드:

```java
@Entity
@Table(name = "users")
public class UserAccount {
```

그리고 생성/수정 시간을 자동으로 넣으려고 `@PrePersist`, `@PreUpdate`도 붙였습니다.

### 6. [UserRepository.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/user/UserRepository.java)

이 파일은 DB 조회 전용 창구입니다.

왜 필요하냐면 Service가 SQL을 직접 쓰지 않고도,
기본 CRUD와 간단한 조건 조회를 사용할 수 있게 하기 위해서입니다.

핵심 코드:

```java
public interface UserRepository extends JpaRepository<UserAccount, Long> {
  Optional<UserAccount> findByEmail(String email);
  boolean existsByEmail(String email);
}
```

이 정도만으로도 Spring Data JPA가 구현체를 자동으로 만들어줍니다.

### 7. [AuthController.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/AuthController.java)

이 파일은 HTTP 요청을 직접 받는 입구입니다.

역할:

- `/api/auth/signup` 요청 받기
- `/api/auth/login` 요청 받기
- 요청 body를 DTO로 받기
- 실제 로직은 Service로 넘기기

핵심 코드:

```java
@PostMapping("/signup")
public AuthTokenResponse signup(@Valid @RequestBody SignupRequest request) {
  return authService.signup(request);
}
```

Controller는 “얇게” 두는 것이 중요합니다.
복잡한 로직은 여기 말고 Service에 두는 편이 좋습니다.

### 8. [AuthService.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/AuthService.java)

이 파일이 이번 단계의 핵심입니다.

왜냐하면 실제 비즈니스 로직이 여기 있기 때문입니다.

회원가입에서 하는 일:

- 이메일 중복 확인
- 비밀번호 암호화
- 사용자 엔티티 생성
- DB 저장
- 토큰 발급

핵심 코드:

```java
if (userRepository.existsByEmail(request.email())) {
  throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
}

user.setPasswordHash(passwordEncoder.encode(request.password()));
UserAccount savedUser = userRepository.save(user);
return toTokenResponse(savedUser);
```

로그인에서 하는 일:

- 이메일로 사용자 조회
- 비밀번호 비교
- 토큰 발급

```java
if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
  throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
}
```

즉 auth 로직을 이해하고 싶으면 가장 먼저 `AuthService`를 읽는 게 좋습니다.

### 9. DTO 파일들

관련 파일:

- [SignupRequest.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/dto/SignupRequest.java)
- [LoginRequest.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/dto/LoginRequest.java)
- [AuthTokenResponse.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/dto/AuthTokenResponse.java)
- [MeResponse.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/dto/MeResponse.java)

이 파일들은 요청/응답 전용 데이터 구조입니다.

왜 따로 두냐면:

- Entity를 그대로 외부에 노출하지 않기 위해
- 요청 검증을 붙이기 위해
- API 스펙을 분리하기 위해

특히 `SignupRequest`의 이런 부분이 중요합니다.

```java
@Email @NotBlank String email,
@NotBlank @Size(min = 8, max = 100) String password,
```

즉 Spring이 요청이 들어왔을 때 기본 검증도 같이 해줍니다.

### 10. [application.yml](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/resources/application.yml)

이 파일은 서버 설정 파일입니다.

이번 단계에서 중요한 건 세 가지입니다.

1. DB 연결
2. JPA 자동 테이블 생성
3. JWT 설정

핵심 코드:

```yml
datasource:
  url: ${DB_URL:jdbc:postgresql://localhost:5432/winwin}
  username: ${DB_USERNAME:postgres}
  password: ${DB_PASSWORD:postgres}
```

```yml
jpa:
  hibernate:
    ddl-auto: update
```

```yml
jwt:
  secret: ${JWT_SECRET:...}
  access-token-expiration-ms: ${JWT_ACCESS_TOKEN_EXPIRATION_MS:86400000}
```

`ddl-auto: update`는 지금 개발 초기라 빠르게 시작하려고 둔 값입니다.
나중에는 migration 도구로 바꾸는 게 더 안전합니다.

## 처음 읽을 때 추천 순서

Java/Spring이 처음이면 아래 순서가 제일 덜 헷갈립니다.

1. [AuthController.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/AuthController.java)
2. [AuthService.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/AuthService.java)
3. [UserAccount.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/user/UserAccount.java)
4. [UserRepository.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/user/UserRepository.java)
5. [JwtTokenProvider.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/security/JwtTokenProvider.java)
6. [JwtAuthenticationFilter.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/security/JwtAuthenticationFilter.java)
7. [SecurityConfig.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/config/SecurityConfig.java)
8. [application.yml](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/resources/application.yml)

이 순서대로 보면:

- “요청이 어디로 들어오는지”
- “실제 로직이 어디 있는지”
- “DB가 어디랑 연결되는지”
- “토큰이 어디서 만들어지고 검사되는지”

가 자연스럽게 이어집니다.

## `import`는 왜 필요한가

Java를 처음 보면:

```java
private final AuthService authService;
```

같은 코드가 어떻게 되는지 헷갈릴 수 있습니다.

여기서 먼저 구분할 것은 두 가지입니다.

### 1. `import`

`import`는

```text
이 파일 안에서 이 클래스 이름을 쓰겠다
```

라는 뜻입니다.

예를 들어 다른 패키지에 있는 클래스를 현재 파일에서 쓰려면 보통 `import`가 필요합니다.

예:

```java
import com.winwin.backend.security.JwtAuthenticationFilter;
```

그러면 아래처럼 클래스 이름을 짧게 쓸 수 있습니다.

```java
JwtAuthenticationFilter jwtAuthenticationFilter
```

만약 `import`를 안 쓰면 패키지 이름까지 전부 적어야 합니다.

예:

```java
com.winwin.backend.security.JwtAuthenticationFilter jwtAuthenticationFilter
```

즉 `import`는 “실제 객체를 만드는 기능”이 아니라,
그 클래스 이름을 현재 파일에서 편하게 쓰게 해주는 문법입니다.

### 2. 같은 패키지면 왜 `import`가 없어도 되나

예를 들어 [AuthController.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/AuthController.java)와 [AuthService.java](/abs/path/C:/Users/zentropy/Music/WinWin/WinWin/backend/src/main/java/com/winwin/backend/auth/AuthService.java)는 둘 다:

```text
com.winwin.backend.auth
```

패키지 안에 있습니다.

그래서 같은 패키지끼리는 `import` 없이도 이름을 바로 쓸 수 있습니다.

즉:

- 같은 패키지면 `import` 없이 가능
- 다른 패키지면 보통 `import` 필요
- `String`, `Long`처럼 `java.lang` 안의 클래스는 자동이라 `import` 없이 가능

### 3. `import`와 Spring 주입은 다른 개념

가장 중요한 건 이 부분입니다.

```java
private final AuthService authService;
```

가 동작하는 이유를 두 단계로 나눠서 봐야 합니다.

#### Java 문법 기준

`AuthService`라는 타입 이름을 현재 파일이 알아야 합니다.

- 같은 패키지면 바로 사용 가능
- 다른 패키지면 `import` 필요

즉 이 단계는:

```text
이 이름이 무슨 클래스인지 알게 해주는 단계
```

입니다.

#### Spring 동작 기준

그 다음 생성자에서:

```java
public AuthController(AuthService authService) {
  this.authService = authService;
}
```

처럼 받으면, Spring이 `AuthService` Bean을 찾아 실제 객체를 넣어줍니다.

즉 이 단계는:

```text
실제 객체를 넣어주는 단계
```

입니다.

짧게 정리하면:

```text
import = 이름을 알게 해주는 것
Spring 주입 = 실제 객체를 넣어주는 것
```

입니다.

### 4. 코드를 읽을 때는 무엇을 타고 가면 되나

실제로 코드를 읽을 때는 `import` 줄 자체를 따라가기보다,
아래를 따라가면 더 잘 보입니다.

1. Controller 메서드
2. 그 안에서 호출하는 Service 메서드
3. Service가 쓰는 Repository / TokenProvider / Encoder
4. `@Service`, `@Component`, `@Bean`, `@Configuration` 같은 Spring 연결 지점

예를 들어 회원가입은 대충 이렇게 읽으면 됩니다.

```text
AuthController.signup()
-> AuthService.signup()
-> UserRepository.existsByEmail(), save()
-> JwtTokenProvider.generateAccessToken()
```

즉 Java/Spring에서는:

- `import`는 이름을 보이게 해주는 준비
- 실제 흐름 추적은 메서드 호출과 Spring 연결을 따라가는 방식

으로 이해하면 됩니다.

## Express/Next API 개발자 기준으로 보면

Express나 Next API 기준으로 비유하면 이번 구조는 대충 이렇게 대응됩니다.

- `Controller` = API route handler
- `Service` = 실제 비즈니스 로직 레이어
- `Repository` = DB access layer
- `Entity` = DB model
- `DTO` = request/response schema
- `JwtAuthenticationFilter` = auth middleware
- `SecurityConfig` = protected route 규칙

즉 Express/Next/Nest에서 하던 개념이 이름만 조금 다르게 쪼개져 있다고 보면 됩니다.

## 읽을 때 같이 보면 좋은 어노테이션

처음 Java/Spring을 볼 때는 "왜 코드가 적은데 동작하지?"가 가장 헷갈립니다.

그 이유는 Spring이 어노테이션을 보고 많은 걸 자동으로 연결하기 때문입니다.

자주 보게 될 것들:

- `@RestController`
  이 클래스가 HTTP 요청을 받는 컨트롤러라는 뜻입니다.
  메서드 return 값을 JSON 응답으로 바로 내려줍니다.

- `@RequestMapping`, `@PostMapping`, `@GetMapping`
  URL과 HTTP 메서드를 연결합니다.
  Express의 `app.get('/path')`, `router.post('/path')`와 비슷합니다.

- `@Service`
  비즈니스 로직 클래스라는 표시입니다.
  Spring이 이 클래스를 Bean으로 등록해서 다른 곳에서 주입할 수 있게 해줍니다.

- `@Component`
  공용 객체를 Spring 관리 대상으로 등록할 때 씁니다.
  `JwtAuthenticationFilter`, `JwtTokenProvider`가 여기에 해당합니다.

- `@Configuration`
  설정용 클래스라는 뜻입니다.
  `SecurityConfig`처럼 Bean 설정을 모아둘 때 씁니다.

- `@Bean`
  Spring 컨테이너가 관리할 객체를 직접 만들어 등록합니다.
  예: `PasswordEncoder`, `SecurityFilterChain`

  쉽게 말하면:

  ```text
  이 객체는 내가 직접 만들어서 Spring한테 맡길게
  ```

  라는 뜻입니다.

  예를 들어 `SecurityConfig` 안의:

  ```java
  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
  ```

  는:

  - `BCryptPasswordEncoder` 객체를 하나 만들고
  - Spring이 기억해두고
  - 나중에 필요한 클래스에 자동으로 넣어주게 하는 코드입니다.

  즉 `AuthService`에서 `PasswordEncoder`를 직접 `new` 하지 않아도
  Spring이 등록된 Bean을 자동으로 연결해줍니다.

- `@Entity`
  이 클래스가 DB 테이블과 연결된다는 뜻입니다.
  JPA가 이 클래스를 보고 `users` 테이블 구조를 이해합니다.

- `@Table`, `@Column`, `@Id`
  테이블 이름, 컬럼 제약, 기본키를 지정합니다.

- `@Valid`
  요청 body 검증을 켭니다.
  Express에서 `zod`나 `yup`으로 검증하는 느낌과 비슷합니다.

- `@Transactional`
  이 메서드를 DB 작업 단위로 묶습니다.
  중간에 실패하면 롤백 기준점이 됩니다.

## Spring이 자동으로 해주는 것

이번 코드에서 Spring이 자동으로 해주는 대표적인 것들:

- `AuthController`를 HTTP 엔드포인트로 등록
- `AuthService`, `JwtTokenProvider`, `JwtAuthenticationFilter` 인스턴스를 생성
- 생성자 파라미터로 필요한 객체 자동 주입
- `UserRepository` 구현체 자동 생성
- `UserAccount`를 보고 `users` 테이블 구조 반영
- `@Valid`와 DTO 어노테이션을 이용한 요청 검증
- Security filter chain에 `JwtAuthenticationFilter` 연결

즉 직접 new 해서 wiring 하지 않아도,
Spring이 어노테이션과 타입을 보고 연결해준다고 이해하면 됩니다.

## 이번 단계 핵심 기준

```text
HealthController는 "서버가 뜨는지 확인"용이고,
실제 중요한 작업은 auth API 전체 뼈대를 만든 것이다.
```

```text
가장 먼저 읽어야 할 파일은 AuthService이고,
그 다음에 SecurityConfig와 JwtAuthenticationFilter를 보면 전체 흐름이 잡힌다.
```
