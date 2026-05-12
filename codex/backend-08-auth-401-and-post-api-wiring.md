# Backend 08. auth 401 공통 처리와 post API 1차 연동

## 이번 단계 한 줄 요약

이번 단계에서는:

- 일반 API 요청 중 `401 Unauthorized`가 나면 세션을 공통으로 정리하고 `/auth`로 보내는 흐름을 붙였고
- 파트너 공고(post)용 Spring API를 새로 만들고
- RN 파트너 공고 등록/목록/수정 화면이 API 세션일 때 실제 서버를 우선 사용하도록 연결했습니다.

즉 지금 상태는:

```text
auth 화면만 실제 API를 쓰던 상태
-> auth 만료 처리 + partner post 흐름도 실제 API를 쓰기 시작한 상태
```

입니다.

## 수정한 파일

```text
backend/src/main/java/com/winwin/backend/config/SecurityConfig.java
backend/src/main/java/com/winwin/backend/post/PostCategory.java
backend/src/main/java/com/winwin/backend/post/PostStatus.java
backend/src/main/java/com/winwin/backend/post/PostLocationVisibility.java
backend/src/main/java/com/winwin/backend/post/MatchingPost.java
backend/src/main/java/com/winwin/backend/post/MatchingPostRepository.java
backend/src/main/java/com/winwin/backend/post/PostController.java
backend/src/main/java/com/winwin/backend/post/PartnerPostController.java
backend/src/main/java/com/winwin/backend/post/PostService.java
backend/src/main/java/com/winwin/backend/post/dto/CreatePostRequest.java
backend/src/main/java/com/winwin/backend/post/dto/PostResponse.java
backend/src/main/java/com/winwin/backend/post/dto/UpdatePostStatusRequest.java
src/api/http.ts
src/api/auth.ts
src/api/posts.ts
src/auth/mock-auth.tsx
src/app/partner/post/new.tsx
src/app/partner/post/index.tsx
src/app/partner/post/[id]/edit.tsx
src/app/partner/post/created.tsx
```

## 왜 이 작업이 필요했나

### 1. auth는 붙었는데 일반 API 만료 처리가 흩어져 있었음

이전까지는 앱 시작 시 세션 복원에서만 `401`을 특별 취급했습니다.

하지만 실제 앱에서는:

- 목록 조회
- 수정 저장
- 상태 변경

같은 일반 요청 중에도 토큰 만료가 날 수 있습니다.

그래서 `401`이 나면:

```text
세션 제거
-> 로그인 화면 이동
```

정책이 공통으로 필요했습니다.

### 2. partner 공고 화면은 아직 mock 저장소 의존이 컸음

파트너 공고 등록/관리/수정 UI는 이미 있었지만,
실제 DB와 API를 아직 통하지 않고 로컬 mock 배열을 직접 바꾸고 있었습니다.

그래서 auth 다음 축인 `post`도
이제 서버 기준 흐름으로 옮길 준비가 필요했습니다.

## 바꾼 점

### 1. 프론트 공통 `401` 처리 추가

`src/api/http.ts`에 전역 unauthorized handler를 등록할 수 있게 만들었습니다.

이제 요청마다:

- 그냥 에러만 던질지
- `401`이면 auth provider에도 알릴지

를 정할 수 있습니다.

`src/auth/mock-auth.tsx`에서는 이 handler를 등록해서,
API 세션 상태에서 `401`이 발생하면:

- `AsyncStorage` 세션 제거
- 메모리 세션 제거
- `/auth` 이동

이 공통으로 실행되게 했습니다.

### 2. 백엔드에 partner post API 추가

이번에 새로 들어간 API는 아래입니다.

```text
GET /api/posts
GET /api/partner/posts
GET /api/partner/posts/{postId}
POST /api/partner/posts
PUT /api/partner/posts/{postId}
PATCH /api/partner/posts/{postId}/status
```

구조는:

- `MatchingPost` 엔티티
- `MatchingPostRepository`
- `PostService`
- `PostController`
- `PartnerPostController`

로 분리했습니다.

공개 공고 목록 `GET /api/posts`만 비로그인 허용이고,
파트너 전용 경로는 JWT 인증 뒤 `PARTNER` 역할을 검사합니다.

### 3. RN 파트너 공고 화면을 API 우선으로 전환

`src/api/posts.ts`에 post API client와
RN matching 타입으로 바꾸는 mapper를 추가했습니다.

그 다음:

- `partner/post/new`
- `partner/post/index`
- `partner/post/[id]/edit`

는 `authSource === 'api'`이면 실제 API를 우선 사용하고,
개발용 mock 세션이면 기존 mock 로직으로 fallback 되게 했습니다.

즉 지금은:

```text
실제 로그인 계정 -> 서버 post 사용
mock 전환 계정 -> 기존 로컬 mock 사용
```

전략입니다.

## 핵심 로직

### auth 401 공통 처리

```ts
if (error.status === 401 && unauthorizedBehavior === 'notify') {
  await unauthorizedHandler?.(error);
}
```

`requestJson(...)`에서 요청 옵션에 따라 전역 `401` 처리로 연결할 수 있게 했습니다.

```ts
setUnauthorizedHandler(async () => {
  setSession(null);
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  router.replace('/auth' as never);
});
```

API 세션이 만료되면 앱 전체 기준으로 세션 정리와 로그인 화면 이동을 맞췄습니다.

### partner post API 예시

```java
@PostMapping
public PostResponse createPartnerPost(
    @Valid @RequestBody CreatePostRequest request,
    @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
  return postService.createPartnerPost(request, authenticatedUser);
}
```

파트너 인증 사용자 기준으로 공고를 생성합니다.

```java
@PatchMapping("/{postId}/status")
public PostResponse updatePartnerPostStatus(...)
```

등록한 공고의 모집중/마감 상태를 바꿀 수 있게 했습니다.

## Express/Next API 개발자 기준으로 보면

이번 단계는 Express/Next 기준으로 보면:

- `fetch wrapper`에 전역 `401` interceptor를 넣고
- `posts` 리소스용 route/controller/service/repository를 새로 만들고
- 프론트의 mock store를 API client 호출로 점진 교체한 작업

과 비슷합니다.

즉 느낌상:

- `requestJson + unauthorizedHandler` = axios interceptor 비슷한 공통 인증 처리
- `PartnerPostController + PostService + MatchingPostRepository` = route/service/repository 분리
- RN 파트너 공고 화면의 API 우선 + mock fallback = 점진 migration 전략

입니다.

## 검증

프론트 타입 체크:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
```

결과:

```text
통과
```

백엔드 테스트:

```powershell
cd backend
.\mvnw.cmd test
```

결과:

```text
BUILD SUCCESS
```

## 이번 단계에서 아직 남은 것

이번 단계는 partner post 화면을 API 우선으로 바꾼 1차 연결입니다.

아직 남아 있는 건:

- 홈 공개 목록을 `GET /api/posts` 기준으로 전환
- matching 상세 화면도 실제 post 응답 기준으로 연결
- post 생성/수정 성공 후 더 안정적인 성공/에러 UI 정리
- backend post API용 WebMvc 테스트 추가

입니다.

## 다음 단계

가장 자연스러운 다음 단계는:

```text
홈/상세 공고 목록을 mockMatchings 대신 실제 /api/posts 기준으로 바꾸기
```

입니다.

그러면 `auth -> post` 흐름이 훨씬 실제 앱 구조에 가까워집니다.
