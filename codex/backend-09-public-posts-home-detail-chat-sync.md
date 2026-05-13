# Backend 09. 공개 공고 홈/상세/채팅 화면 연동

이번 단계에서는 `post` API를 파트너 공고 관리 화면 안에만 쓰지 않고, 실제 사용자가 바로 보는 홈 목록, 매칭 상세, 채팅 화면까지 넓혔습니다.

이제 공개 공고는 `/api/posts` 기준으로 홈에 보이고, 상세는 `/api/posts/{id}` 기준으로 열리며, 채팅 상단에 보이는 매장/서비스/예약 정보도 실제 공고 데이터를 우선 사용합니다.

## 이번에 바꾼 것

- 백엔드에 `GET /api/posts/{id}`를 추가했습니다.
- 공개 공고 상세도 `OPEN` 상태만 내려주도록 서비스 조건을 맞췄습니다.
- 프론트 홈 화면이 `mockMatchings` 대신 `/api/posts`를 우선 사용하게 바꿨습니다.
- 매칭 상세 화면이 `/api/posts/{id}`를 우선 사용하게 바꿨습니다.
- 고객/파트너 채팅 화면 상단 공고 정보도 실제 API를 먼저 보도록 바꿨습니다.
- API 실패 시에는 화면이 아예 깨지지 않도록 기존 mock 데이터로 fallback 하게 유지했습니다.

## 왜 이렇게 했는지

이전에는 파트너가 등록/수정하는 공고만 실제 API를 타고, 정작 고객이 보는 홈/상세/채팅은 mock 데이터를 보는 상태였습니다.

이 상태에서는 "등록은 실제 서버에 됐는데 홈에는 안 보임", "상세/채팅에서 보는 제목과 날짜가 다름" 같은 불일치가 생기기 쉽습니다.

그래서 이번 단계에서는 사용자가 제일 먼저 보는 읽기 화면부터 실제 공고 기준으로 맞췄습니다.

## 바뀐 파일

- `backend/src/main/java/com/winwin/backend/post/PostService.java`
- `backend/src/main/java/com/winwin/backend/post/PostController.java`
- `backend/src/main/java/com/winwin/backend/config/SecurityConfig.java`
- `src/api/posts.ts`
- `src/app/(tabs)/index.tsx`
- `src/app/matching/[id].tsx`
- `src/components/winwin/ChatScreen.tsx`

## 핵심 로직

공개 상세 조회는 목록과 같은 기준으로 `OPEN` 공고만 보여줍니다.

```java
public PostResponse getDiscoverablePost(Long postId) {
    MatchingPost post = repository.findByIdAndStatus(postId, PostStatus.OPEN)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return PostResponse.from(post);
}
```

홈/상세/채팅은 API를 우선 호출하고, 실패하면 기존 mock 으로 되돌립니다.

```ts
try {
  const response = await getDiscoverablePost(Number(id));
  setMatching(mapPostResponseToMatching(response));
} catch {
  setMatching(getAllMatchings().find((item) => item.id === id));
}
```

파트너 채팅은 공개 공고가 아니라 본인 공고도 열 수 있어야 해서, API 세션이면 `getPartnerPost(...)`를 먼저 사용합니다.

```ts
if (initialViewerRole === 'partner' && authSource === 'api' && accessToken) {
  const response = await getPartnerPost(accessToken, Number(id));
  setMatching(mapPostResponseToMatching(response));
  return;
}
```

## React 개발자 기준으로 보면

이번 단계는 `mock JSON import` 중심 화면을 `server fetch + fallback UI` 구조로 바꾸는 작업에 가깝습니다.

웹 React 기준으로 보면 `list page`, `detail page`, `chat header`가 같은 서버 source of truth 를 보도록 맞춘 셈입니다.

또 완전한 서버 전환 전에 `graceful fallback`을 둔 상태라, 개발 중 백엔드가 덜 붙어 있어도 화면을 계속 확인할 수 있습니다.

## Express/Next API 개발자 기준으로 보면

이번 단계는 `GET /posts`만 있던 상태에서 `GET /posts/:id`를 추가하고, 프론트 read path 전체를 그 API에 연결한 것입니다.

패턴으로 보면 `public list route`, `public detail route`, `owner-only detail route`를 나눠 쓰는 구조입니다.

또 프론트에서는 `fetch -> DTO mapping -> UI model` 흐름을 두어서, 서버 응답 모양이 바로 화면 컴포넌트에 박히지 않게 유지했습니다.

## 확인한 것

- `.\node_modules\.bin\tsc.cmd --noEmit`
- `backend\.\mvnw.cmd test`

둘 다 통과했습니다.

## 다음 단계

다음 큰 작업은 `상담/채팅 메시지 자체`를 실제 API로 바꾸는 것입니다.

지금은 채팅 상단 공고 정보만 실데이터이고, 메시지/상담 상태는 아직 mock 시드 데이터를 사용합니다.
