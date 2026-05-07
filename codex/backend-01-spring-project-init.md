# Backend 01. Spring 프로젝트 시작 준비

## 목표

이번 단계의 목표는 `backend/` 프로젝트를 실제로 만들고, 로컬에서 Spring Boot와 PostgreSQL이 서로 붙는 기본 실행 기준점을 만드는 것입니다.

이 단계가 끝나면 아래가 분명해져야 합니다.

- 어떤 백엔드 기술 조합으로 시작할지
- 로컬에서 무엇을 먼저 설치해야 하는지
- 첫 DB 테이블을 어떻게 나눌지
- 첫 API를 어디까지 만들지

## 이번 단계에서 실제로 한 것

확인 및 설치 결과:

- Java 17 이미 설치되어 있었음
- Apache Maven 3.9.15 설치 완료
- PostgreSQL 16 설치 완료
- PostgreSQL 서비스 `postgresql-x64-16` 실행 확인
- 로컬 개확인
- `backend/` Spring Boot 프로젝트 생발용 데이터베이스 `winwin` 생성 성 완료
- PostgreSQL 연결 설정 추가 완료
- `/api/health` 확인용 엔드포인트 추가 완료
- `users` 테이블 자동 생성 확인
- 회원가입 / 로그인 / 내 정보 auth API 1차 구현 완료
- JWT 기반 인증 흐름 추가 완료
- `mvnw.cmd test` 통과 확인
- 서버 실행 후 `GET /api/health` 응답 확인
- 서버 실행 후 `signup -> login -> users/me` 흐름 확인

즉 이제 로컬에서 Spring Boot 프로젝트를 실행하고, 다음 단계인 auth 구현으로 바로 넘어갈 수 있는 상태입니다.

## 추천 시작 조합

이 프로젝트의 첫 백엔드 조합은 아래로 고정하는 것이 좋습니다.

- Java 17
- Spring Boot 3.x
- Maven
- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL Driver
- Validation
- JWT

이 조합이면 현재 RN 앱의 `mock auth -> post -> chat` 전환 순서와 잘 맞습니다.

## 폴더 구조

추천 구조:

```text
WinWin/
  src/
  assets/
  codex/
  backend/
```

`backend/`는 RN 앱과 같은 workspace 안에 두는 편이 지금 단계에서는 가장 관리하기 쉽습니다.

## 설치 상태

### 1. Maven

Maven은 설치 완료했습니다.

역할:

- Spring Boot 프로젝트 생성 후 빌드/실행
- 의존성 설치
- 테스트 실행

설치 확인:

```powershell
mvn -version
```

설치 위치:

```text
C:\Users\zentropy\Tools\apache-maven-3.9.15
```

### 2. PostgreSQL

PostgreSQL도 설치 완료했습니다.

설치 확인:

```powershell
psql --version
```

서비스 확인:

```powershell
Get-Service postgresql-x64-16
```

기본 확인 상태:

- PostgreSQL 버전: `16.13`
- 서비스 이름: `postgresql-x64-16`
- 생성한 DB 이름: `winwin`

## 생성한 백엔드 프로젝트

생성 위치:

```text
WinWin/backend
```

기본 조합:

- Spring Boot `3.5.6`
- Java `17`
- Maven Wrapper 포함
- Spring Web
- Spring Data JPA
- Spring Security
- Validation
- PostgreSQL Driver

패키지 기준:

```text
com.winwin.backend
```

## 이번 단계에서 추가한 기본 코드

### 1. DB 연결 설정

`application.properties` 대신 `application.yml`로 바꾸고 PostgreSQL 연결 기본값을 넣었습니다.

바꾼 이유는 설정이 많아질수록 `yml`이 계층 구조를 보기 더 편하기 때문입니다.

예를 들어:

- `application.properties`는 `spring.datasource.url=...`처럼 한 줄씩 길게 적습니다.
- `application.yml`은 `spring -> datasource -> url`처럼 묶음 구조가 보여서 초보가 읽기 쉽습니다.

같은 내용을 예시로 쓰면 아래처럼 보입니다.

`application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/winwin
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
jwt.access-token-expiration-ms=86400000
server.port=8080
```

`application.yml`

```yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/winwin
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update

jwt:
  access-token-expiration-ms: 86400000

server:
  port: 8080
```

기본값:

- DB URL: `jdbc:postgresql://localhost:5432/winwin`
- DB USERNAME: `postgres`
- DB PASSWORD: 로컬 개발용 기본값

환경변수로 나중에 쉽게 바꿀 수 있도록 아래 형태로 넣었습니다.

```text
${DB_URL:...}
${DB_USERNAME:...}
${DB_PASSWORD:...}
```

### 2. 초기 Security 설정

지금은 auth 구현 전 단계라 기본 Spring Security 때문에 API가 막히지 않도록 모든 요청을 일단 열어두는 `SecurityConfig`를 추가했습니다.

나중에 JWT auth를 붙일 때 여기서 실제 보안 정책으로 교체하면 됩니다.

지금 `SecurityConfig`에 추가한 핵심은 아래입니다.

- `/api/health`, `/api/auth/**` 는 로그인 없이 허용
- 그 외 요청은 로그인 필요
- 세션 로그인 대신 JWT 방식 사용
- `JwtAuthenticationFilter`를 보안 필터 체인에 연결
- 비밀번호 암호화용 `PasswordEncoder` 등록

즉 이 파일은:

```text
어떤 API를 열어둘지
어떤 API는 토큰이 필요한지
JWT 인증을 어디에 연결할지
```

를 정하는 보안 규칙 파일입니다.

### 3. 실행 확인용 API

서버가 정말 뜨는지 바로 확인할 수 있도록 아래 엔드포인트를 추가했습니다.

```text
GET /api/health
```

응답 예시:

```json
{
  "status": "ok",
  "service": "winwin-backend"
}
```

### 4. Auth 1차 구현

현재 구현한 API:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/users/me`

현재 구현한 내용:

- `users` 테이블용 JPA 엔티티 추가
- `CUSTOMER / PARTNER` 역할 enum 추가
- 비밀번호 `BCrypt` 암호화
- JWT access token 발급
- `Authorization: Bearer <token>` 기반 인증
- `/api/users/me` 인증 사용자 조회

개발 초기 단계라 `users` 테이블은 JPA `ddl-auto: update`로 자동 생성되게 두었습니다.

이 설정의 뜻은:

- JPA가 `UserAccount` 같은 엔티티 클래스를 보고
- DB 테이블이 없으면 만들고
- 컬럼이 부족하면 어느 정도 맞춰준다는 뜻입니다.

왜 지금은 이렇게 두냐면:

- 개발 시작 속도가 빠르고
- 테이블을 손으로 먼저 만들지 않아도 되고
- auth 같은 첫 기능을 빨리 확인할 수 있기 때문입니다.

주의할 점:

- 개발 초기에는 편하지만
- 운영/실서비스에서는 보통 위험할 수 있어서
- 나중에는 Flyway, Liquibase 같은 migration 방식으로 바꾸는 편이 더 안전합니다.

## 이번 단계 검증

실제로 확인한 명령:

```powershell
mvn -version
psql --version
psql -U postgres -h localhost -d postgres -tAc "SELECT datname FROM pg_database WHERE datname='winwin'"
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

확인 결과:

- `mvn` 정상 동작
- `psql` 정상 동작
- `winwin` 데이터베이스 존재 확인
- Spring Boot 테스트 통과
- 서버 실행 후 `/api/health`에서 `200 OK` 응답 확인
- 회원가입 응답 확인
- 로그인 응답 확인
- JWT 포함 `GET /api/users/me` 응답 확인

검증 예시:

```text
SIGNUP -> userId 1, role PARTNER
LOGIN  -> accessToken 발급
ME     -> id 1, email partner@example.com, role PARTNER
```

## 백엔드 1차 도메인 범위

프론트 mock 구조를 기준으로 보면, 지금 바로 필요한 핵심 도메인은 아래입니다.

### 1. User

현재 mock auth의 `guest / customer / partner` 구조를 실제 사용자/권한 구조로 바꾸기 위한 기준입니다.

필수 컬럼 후보:

- `id`
- `email`
- `password_hash`
- `role`
- `name`
- `created_at`
- `updated_at`

### 2. Post

현재 `src/data/matchings.ts`의 공고 데이터를 실제 DB로 옮기는 핵심 테이블입니다.

필수 컬럼 후보:

- `id`
- `partner_user_id`
- `category`
- `shop_name`
- `service_name`
- `description`
- `location_summary`
- `location_detail`
- `location_visibility`
- `latitude`
- `longitude`
- `detail_latitude`
- `detail_longitude`
- `deposit_amount`
- `deadline_date`
- `post_status`
- `is_premium`
- `created_at`
- `updated_at`

### 3. PostRequirement

현재 공고의 `requirements: string[]`는 배열 그대로 두기보다 별도 테이블이 관리하기 쉽습니다.

필수 컬럼 후보:

- `id`
- `post_id`
- `content`
- `sort_order`

### 4. PostAvailableDate

현재 `availableDates: string[]`도 별도 테이블이 더 자연스럽습니다.

필수 컬럼 후보:

- `id`
- `post_id`
- `available_date`
- `start_time`

처음에는 시간 없이 날짜만 저장해도 되고, 나중에 예약 시간 단위가 필요해지면 확장하면 됩니다.

### 5. Consultation

현재 `src/data/consultations.ts`의 상담 단위를 옮길 최소 단위입니다.

필수 컬럼 후보:

- `id`
- `post_id`
- `customer_user_id`
- `partner_user_id`
- `status`
- `last_message_at`
- `created_at`
- `updated_at`

### 6. Message

상담 안의 텍스트/예약 요청/희망 일정 메시지를 저장할 기본 테이블입니다.

필수 컬럼 후보:

- `id`
- `consultation_id`
- `sender_user_id`
- `message_type`
- `content`
- `created_at`

### 7. Booking

현재 mock의 `bookingFlow`와 `booking-request` 메시지를 실제 예약 상태로 관리하기 위한 테이블입니다.

필수 컬럼 후보:

- `id`
- `consultation_id`
- `selected_date`
- `selected_time`
- `deposit_amount`
- `booking_status`
- `paid_at`
- `created_at`
- `updated_at`

## 첫 번째 API 범위

처음부터 채팅까지 다 만들지 말고 아래 순서로 좁혀서 시작하는 것이 좋습니다.

### 1단계: Auth API

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/users/me`

이 단계에서 해야 할 것:

- 회원가입
- 로그인
- JWT 발급
- 인증 사용자 조회

### 2단계: Post API

- `GET /api/posts`
- `GET /api/posts/{id}`
- `POST /api/partner/posts`
- `PUT /api/partner/posts/{id}`
- `PATCH /api/partner/posts/{id}/status`

이 단계가 되면 RN의 mock 공고 데이터를 실제 API로 교체하기 쉬워집니다.

### 3단계: Consultation API

이 단계는 auth/post 연결 후에 가는 것이 안전합니다.

- 상담 목록
- 상담 상세
- 메시지 전송
- 예약 요청

## DB는 어떻게 잡으면 되나

처음부터 너무 복잡하게 만들 필요는 없습니다.

권장 방식:

1. `users`
2. `posts`
3. `post_requirements`
4. `post_available_dates`
5. `consultations`
6. `messages`
7. `bookings`

핵심은 `posts`와 `consultations`를 중심으로 나누는 것입니다.

- `posts`는 공고 도메인
- `consultations`는 고객과 파트너의 1:1 상담 도메인
- `messages`는 상담 내부 이벤트 로그
- `bookings`는 예약/결제 상태 도메인

이렇게 나누면 나중에 채팅과 결제를 확장해도 구조가 덜 흔들립니다.

## Express/Next API 개발자 기준으로 보면

지금 단계는 UI가 아니라 API 서버의 시작점을 만든 단계입니다.

Express나 Next API 기준으로 보면:

- `Spring Boot 프로젝트 생성` = Node 서버 프로젝트 초기 생성
- `application.yml` DB 설정 = `.env` + DB 연결 설정
- `SecurityConfig` = auth middleware / protected route 규칙
- `JPA Entity` = ORM model 정의
- `Repository` = DB access layer
- `Controller` = route handler

즉 느낌상:

- 이전: RN mock 데이터 중심
- 이번 단계: Spring 서버와 PostgreSQL 실행 기반 만들기
- 다음: auth/post API를 실제 route처럼 붙여 나가기

## 바로 다음 작업

다음 작업은 아래 순서가 가장 좋습니다.

1. `backend/` Spring Boot 프로젝트 생성
2. auth 에러 응답 형식 정리
3. RN mock auth를 실제 auth API 호출로 바꾸기 위한 client 함수 만들기
4. post 도메인 엔티티와 목록/상세 API 시작
5. partner 공고 등록 API로 확장

여기서 말하는 `RN mock auth를 실제 auth API 호출로 바꾸기 위한 client 함수`는
프론트에서 서버 API를 호출하는 함수라는 뜻입니다.

지금은 RN 앱 안에서 mock 로그인 함수를 직접 돌리지만,
나중에는 이런 식으로 바뀝니다.

```ts
async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return response.json();
}
```

즉:

- 지금: 프론트 내부 mock 함수
- 나중: 백엔드에 실제 요청 보내는 client 함수

## 개발 도구 메모

자바/Spring 백엔드는 VS Code에서도 개발할 수 있습니다.

즉:

- VS Code로 해도 됨
- 지금처럼 계속 진행 가능

다만 Java/Spring을 오래 할수록 IntelliJ가 더 편하게 느껴질 수 있습니다.

이유는:

- 자동완성
- 구조 탐색
- Spring 관련 인식
- 에러 파악

이 보통 더 강한 편이기 때문입니다.

그래도 지금 단계에서는 VS Code만으로도 충분히 학습하고 개발할 수 있습니다.

## 백엔드 폴더 초보 가이드

처음 보는 백엔드 폴더는 크게 4종류로 보면 됩니다.

```text
1. 프로젝트 실행/빌드 파일
2. 서버 설정 파일
3. 실제 Java 코드
4. 실행 확인용 로그 파일
```

즉:

- `pom.xml`, `mvnw.cmd` = 프로젝트를 실행하고 의존성을 관리하는 파일
- `application.yml` = 서버 설정
- `src/main/java/...` = 실제 백엔드 코드
- `spring-boot-*.log` = 실행 확인 중 생긴 로그

### pom.xml은 뭐 하는 파일인가

`pom.xml`은 Maven 프로젝트의 중심 파일입니다.

Node 기준으로 보면 거의 `package.json`과 비슷합니다.

여기서 정하는 것:

- 프로젝트 이름
- Java 버전
- Spring Boot 버전
- 사용할 라이브러리
- 빌드 플러그인

예를 들면:

- `spring-boot-starter-web` = API 서버 기능
- `spring-boot-starter-data-jpa` = DB/JPA 기능
- `spring-boot-starter-security` = 보안 기능
- `postgresql` = PostgreSQL 드라이버
- `jjwt-*` = JWT 토큰 처리 라이브러리

### mvnw.cmd는 뭐 하는 파일인가

`mvnw.cmd`는 Maven Wrapper의 Windows 실행 파일입니다.

쉽게 말하면:

```text
이 프로젝트 전용 Maven 실행기
```

입니다.

왜 좋냐면:

- PC에 Maven이 없어도 실행 가능
- 프로젝트가 원하는 Maven 버전을 자동으로 맞출 수 있음
- 팀원이 같은 방식으로 실행 가능

보통 이렇게 씁니다.

```powershell
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

### .mvn/wrapper/maven-wrapper.properties는 뭐 하는 파일인가

이 파일은 Wrapper가 어떤 Maven 버전을 받아서 쓸지 적어둔 설정 파일입니다.

핵심은 이런 줄입니다.

```properties
distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.14/apache-maven-3.9.14-bin.zip
```

뜻은:

```text
필요하면 Maven 3.9.14를 내려받아서 써라
```

입니다.

즉:

- `mvnw.cmd` = 실행기
- `maven-wrapper.properties` = 어떤 Maven 버전을 쓸지 적은 파일

이라고 이해하면 됩니다.

### spring-boot-*.log 파일은 뭔가

`spring-boot-run.out.log`, `spring-boot-live.out.log`, `spring-boot-auth-check.out.log` 같은 파일들은
Spring Boot가 원래 필수로 만드는 핵심 소스 파일이 아닙니다.

이건 실행 검증할 때:

- 서버가 제대로 뜨는지
- health 체크가 되는지
- auth API가 동작하는지

확인하려고 출력 내용을 저장한 로그입니다.

즉:

- `*.out.log` = 일반 실행 로그
- `*.err.log` = 에러 로그

입니다.

### 파일 이름만 보고 빠르게 뜻 찾기

처음엔 아래 정도로 짧게 기억해도 충분합니다.

- `pom.xml`
  백엔드 프로젝트 설정 파일

- `mvnw`
  Mac/Linux용 Maven Wrapper 실행기

- `mvnw.cmd`
  Windows용 Maven Wrapper 실행기

- `.mvn/wrapper/maven-wrapper.properties`
  Wrapper가 어떤 Maven 버전을 쓸지 적은 설정 파일

- `.gitattributes`
  Git이 파일을 어떻게 다룰지 정하는 설정 파일

- `spring-boot-*.out.log`
  실행 확인용 일반 로그 파일

- `spring-boot-*.err.log`
  실행 확인용 에러 로그 파일

## DB는 어디서 어떻게 열어보나

처음에는:

```text
PostgreSQL을 설치했다는 건 알겠는데
그 DBMS를 실제로 어디서 열고 어떻게 보나?
```

가 헷갈릴 수 있습니다.

지금 프로젝트는 PostgreSQL을 로컬 PC에 설치해두고,
Spring Boot가 그 로컬 DB에 접속하는 구조입니다.

즉 구조는:

```text
내 PC에 PostgreSQL 서버가 실행 중
-> Spring Boot가 localhost:5432로 접속
-> winwin 데이터베이스 사용
```

입니다.

### 1. 터미널에서 직접 접속할 수 있다

PostgreSQL은 PowerShell 같은 터미널에서 직접 들어갈 수 있습니다.

예:

```powershell
psql -U postgres -h localhost -d winwin
```

들어가면 SQL을 직접 칠 수 있습니다.

예:

```sql
\dt
select * from users;
\q
```

실제로는 아래처럼 보일 수 있습니다.

```text
$ psql -U postgres -h localhost -d winwin
Password for user postgres:

psql (16.13)
Type "help" for help.

winwin=# select * from users;
 id |         created_at         |        email        |    name     |                        password_hash                         |  role   |         updated_at
----+----------------------------+---------------------+-------------+--------------------------------------------------------------+---------+----------------------------
  1 | 2026-04-30 14:35:12.458344 | partner@example.com | Partner One | $2a$10$i4rrRhdofdpzgkbuAO2oO.ayeh6klYIThM7YLpW.p7pCT6mlLGF0O | PARTNER | 2026-04-30 14:35:12.458344
(1 row)
```

이 예시는 뜻이 대충 이렇습니다.

- `users` 테이블에 현재 사용자 1명이 들어 있다
- 이메일은 `partner@example.com`
- 이름은 `Partner One`
- 역할은 `PARTNER`
- 비밀번호는 원문이 아니라 해시값으로 저장된다

즉:

- `\dt`
  테이블 목록 보기

- `select * from users;`
  `users` 테이블 데이터 보기

- `\q`
  종료

### 2. GUI 프로그램으로도 볼 수 있다

터미널 말고 화면으로 보고 싶으면 GUI 도구를 쓸 수 있습니다.

PostgreSQL에서는 보통 아래를 많이 씁니다.

- `pgAdmin 4`
- DBeaver
- DataGrip

이런 도구로 접속하면:

- 서버 목록 보기
- 데이터베이스 목록 보기
- 테이블 클릭해서 데이터 보기
- SQL 에디터에서 쿼리 실행

같은 작업을 더 편하게 할 수 있습니다.

예를 들어 PostgreSQL 연결 정보는 보통 이런 식입니다.

- host: `localhost`
- port: `5432`
- username: `postgres`
- password: 로컬 설치 때 정한 값
- database: `winwin`

### 3. VS Code에서도 DB에 접속할 수 있다

중요한 점은:

```text
VS Code 안에 PostgreSQL이나 MySQL이 설치되는 것은 아니고
보통 DB 서버는 PC에 따로 설치하고
VS Code는 그 DB에 접속하는 클라이언트 역할을 한다
```

는 것입니다.

즉:

- DB 서버는 Windows에 설치
- VS Code는 접속/조회/쿼리 실행 도구

라고 보면 됩니다.

VS Code에서는 보통 이런 확장을 많이 씁니다.

- `SQLTools`
- `Database Client`
- PostgreSQL / MySQL 관련 확장

이런 확장을 쓰면 VS Code 안에서:

- DB 연결 생성
- 테이블 목록 확인
- SQL 파일 작성
- 쿼리 실행

이 가능합니다.

### 4. MySQL도 거의 같은 방식으로 쓸 수 있다

MySQL도 방식은 거의 같습니다.

구조:

```text
내 PC에 MySQL 서버 설치
-> 서버 실행
-> VS Code나 터미널에서 접속
-> SQL 실행
```

터미널 예:

```powershell
mysql -u root -p
```

들어간 뒤에는:

```sql
SHOW DATABASES;
USE mydb;
SHOW TABLES;
SELECT * FROM users;
```

같이 사용할 수 있습니다.

즉 PostgreSQL이든 MySQL이든 공통 개념은 같습니다.

```text
1. DB 서버를 내 PC에 설치
2. 서버를 실행
3. 터미널 또는 GUI 또는 VS Code로 접속
4. SQL을 실행
```

### 5. 지금 WinWin 프로젝트 기준으로 기억할 것

지금 프로젝트에서는 PostgreSQL을 쓰고 있으니
우선 아래만 기억해도 충분합니다.

- Spring Boot는 PostgreSQL에 연결되어 있다
- DB는 터미널 `psql`로 들어갈 수 있다
- GUI로는 `pgAdmin 4` 같은 도구를 쓸 수 있다
- VS Code도 DB 접속 도구 역할을 할 수 있다

즉:

```text
DB는 백엔드 코드 안에만 있는 것이 아니라,
별도 프로그램(서버)로 실행되고 있고
우리는 터미널/GUI/VS Code로 그 DB에 접속해서 볼 수 있다
```

라고 이해하면 됩니다.

### application.yml은 뭐 하는 파일인가

`application.yml`은 Spring Boot 설정 파일입니다.

Node 기준으로 보면:

- `.env`
- 서버 설정 객체
- DB 연결 설정

을 한 군데에 모아둔 느낌입니다.

지금 중요한 건:

1. 앱 이름
2. DB 연결
3. JPA 설정
4. JWT 설정

### 현재 Java 파일들은 각각 무슨 역할인가

지금 `src/main/java` 아래에는 아래 역할들이 있습니다.

- `BackendApplication`
  앱 시작점

- `HealthController`
  서버 상태 확인 API

- `AuthController`
  회원가입/로그인 요청 입구

- `AuthService`
  회원가입/로그인/내 정보 핵심 로직

- `AuthTokenResponse`, `LoginRequest`, `MeResponse`, `SignupRequest`
  요청/응답 DTO

- `SecurityConfig`
  보안 규칙 설정

- `AuthenticatedUser`
  현재 로그인 사용자 정보 객체

- `JwtAuthenticationFilter`
  요청마다 JWT 헤더 검사

- `JwtTokenProvider`
  JWT 생성/해석

- `UserAccount`
  `users` 테이블 엔티티

- `UserController`
  `/api/users/me` 요청 입구

- `UserRepository`
  `users` 테이블 DB 접근

- `UserRole`
  `CUSTOMER`, `PARTNER` 역할 enum

### 처음엔 어디부터 보면 좋나

초보 기준 추천 순서:

1. `application.yml`
2. `BackendApplication`
3. `HealthController`
4. `AuthController`
5. `AuthService`
6. `UserAccount`
7. `UserRepository`
8. `JwtTokenProvider`
9. `JwtAuthenticationFilter`
10. `SecurityConfig`

그리고 처음엔 아래 파일들은 존재만 알아도 충분합니다.

- `mvnw.cmd`
- `.mvn/wrapper/maven-wrapper.properties`
- `BackendApplicationTests.java`
- `spring-boot-*.log`

## 자주 보는 어노테이션 메모

처음 Java/Spring을 볼 때는 `@`가 너무 많아서 부담스러울 수 있습니다.

처음엔 아래 정도만 익혀도 충분합니다.

### `@RestController`

이 클래스가 HTTP 요청을 받는 컨트롤러라는 뜻입니다.

보통:

- API 요청 받기
- JSON 응답 내려주기

에 사용합니다.

예시 파일:

- `AuthController`
- `UserController`
- `HealthController`

### `@RequestMapping`

컨트롤러의 기본 URL 경로를 묶어주는 어노테이션입니다.

예:

```java
@RequestMapping("/api/auth")
```

이면 이 컨트롤러 아래 메서드들은 `/api/auth/...` 기준으로 붙습니다.

### `@GetMapping`

`GET` 요청을 받는다는 뜻입니다.

예:

- `/api/health`
- `/api/users/me`

같은 조회성 API에 자주 씁니다.

### `@PostMapping`

`POST` 요청을 받는다는 뜻입니다.

예:

- 회원가입
- 로그인

같이 새 데이터를 보내는 요청에 자주 씁니다.

### `@RequestBody`

요청 body(JSON)를 Java 객체로 받는다는 뜻입니다.

예:

```java
public AuthTokenResponse login(@RequestBody LoginRequest request)
```

이면 프론트가 보낸 JSON이 `LoginRequest`로 들어옵니다.

### `@Valid`

요청값 검증을 켜는 어노테이션입니다.

즉 DTO 안에 적어둔:

- `@Email`
- `@NotBlank`
- `@Size`

같은 검증 규칙을 실제로 동작하게 해줍니다.

### `@Service`

이 클래스가 비즈니스 로직 담당이라는 뜻입니다.

예시 파일:

- `AuthService`

### `@Entity`

이 클래스가 DB 테이블과 연결된다는 뜻입니다.

예시 파일:

- `UserAccount`

즉 `UserAccount`는 `users` 테이블과 연결됩니다.

### `@Table`

엔티티가 어떤 테이블 이름과 연결되는지 정합니다.

예:

```java
@Table(name = "users")
```

### `@Id`

기본키(primary key) 컬럼이라는 뜻입니다.

보통 `id` 필드에 붙습니다.

### `@Column`

컬럼 옵션을 정합니다.

예:

- `nullable = false`
- `unique = true`
- `length = 120`

### `@Bean`

Spring이 관리할 객체를 직접 등록할 때 씁니다.

예시:

- `PasswordEncoder`
- `SecurityFilterChain`

### `@Configuration`

설정 클래스라는 뜻입니다.

보통 `@Bean` 메서드들을 모아두는 파일에 붙습니다.

예시 파일:

- `SecurityConfig`

### `@Component`

Spring이 자동으로 관리하게 할 공용 객체에 붙입니다.

예시 파일:

- `JwtAuthenticationFilter`
- `JwtTokenProvider`

### `@Transactional`

이 메서드를 DB 작업 단위로 묶는다는 뜻입니다.

지금은 `AuthService`에서 사용하고 있습니다.

처음엔:

```text
회원가입/저장 같은 DB 작업을 안전하게 묶어주는 표시
```

정도로 이해해도 충분합니다.

## Spring Data JPA가 이름을 보고 자동으로 만들어주는 메서드

`UserRepository`의 `findByEmail(...)` 같은 메서드는
우리가 구현 코드를 직접 쓰지 않아도 Spring Data JPA가 이름을 보고 자동으로 만들어줍니다.

즉:

```java
Optional<UserAccount> findByEmail(String email);
```

를 보면 Spring이:

```text
email 컬럼으로 한 명을 찾아오는 조회 메서드구나
```

라고 이해해서 구현을 대신 만들어줍니다.

### 지금 프로젝트에서 바로 보이는 예시

- `findByEmail(String email)`
  `email` 컬럼으로 사용자 조회

- `existsByEmail(String email)`
  `email`이 이미 있는지 true/false 확인

그리고 `JpaRepository`를 상속해서 기본으로 이미 쓸 수 있는 것도 있습니다.

- `save(entity)`
  저장

- `findById(id)`
  ID로 조회

- `findAll()`
  전체 조회

- `deleteById(id)`
  ID로 삭제

### 자주 보는 이름 규칙 예시

아래 같은 것들을 많이 씁니다.

#### `findBy...`

값을 찾아올 때 씁니다.

예:

```java
findByEmail(String email)
findByName(String name)
findByRole(UserRole role)
```

#### `existsBy...`

존재 여부만 확인할 때 씁니다.

예:

```java
existsByEmail(String email)
existsByName(String name)
```

#### `countBy...`

개수를 셀 때 씁니다.

예:

```java
countByRole(UserRole role)
```

#### `deleteBy...`

조건으로 삭제할 때 씁니다.

예:

```java
deleteByEmail(String email)
```

#### `findAllBy...`

조건에 맞는 여러 개를 가져올 때 씁니다.

예:

```java
findAllByRole(UserRole role)
findAllByPostStatus(String postStatus)
```

### 조건을 더 붙이는 방법

이름을 이어붙이면 조건도 늘릴 수 있습니다.

예:

```java
findByEmailAndRole(String email, UserRole role)
findAllByRoleOrderByCreatedAtDesc(UserRole role)
findByShopNameContaining(String keyword)
```

뜻은 대충 이렇게 읽으면 됩니다.

- `And`
  그리고

- `OrderByCreatedAtDesc`
  createdAt 기준 내림차순 정렬

- `Containing`
  포함 검색

### 초보 기준으로는 어디까지 기억하면 되나

처음엔 아래 정도만 익혀도 충분합니다.

- `findBy...`
- `existsBy...`
- `findAllBy...`
- `countBy...`

그리고 나머지는:

```text
필요할 때 이름 규칙을 찾아가며 쓰면 된다
```

정도로 생각해도 됩니다.

### 언제는 자동 메서드로 부족한가

조건이 너무 복잡해지면 이름만으로 만들기 어려워질 수 있습니다.

예를 들면:

- 조건이 아주 많을 때
- join이 복잡할 때
- 통계/집계 쿼리가 필요할 때

그럴 때는 보통:

- `@Query`
- QueryDSL
- 커스텀 Repository

같은 방식으로 넘어갑니다.

하지만 지금 단계에서는 `findByEmail`, `existsByEmail`처럼
이름 기반 자동 메서드만 알아도 충분합니다.

## 지금 남은 핵심 메모

- Maven과 PostgreSQL은 설치 완료 상태입니다.
- `backend/` 프로젝트 생성도 끝났습니다.
- 지금 가장 중요한 다음 액션은 문서 추가가 아니라 `RN auth 연동` 또는 `post API 구현`입니다.

## 핵심 기준

```text
지금은 백엔드와 DB를 동시에 아주 크게 설계하기보다,
auth와 post를 만들 수 있을 정도의 최소 구조로 먼저 고정하는 편이 좋다.
```

```text
현재 프론트 mock 타입이 이미 있으므로,
DB 설계는 그 타입을 자연스럽게 서버 도메인으로 옮기는 방향으로 잡으면 된다.
```
