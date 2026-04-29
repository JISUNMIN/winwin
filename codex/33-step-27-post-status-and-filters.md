# 33. Step 27 공고 상태값과 관리 필터

## 목표

공고 관리 화면이 단순 목록을 넘어서 실제 관리 화면처럼 보이도록 공고 상태값을 붙입니다.

이번 단계에서는:

- 등록 공고에 `모집중 / 마감` 상태 추가
- 공고 관리 화면에 상태 필터 추가
- 카드에서 바로 `모집 마감 / 다시 모집` 전환

까지 연결했습니다.

## 수정한 파일

```text
src/data/matchings.ts
src/app/shop/post/index.tsx
codex/README.md
codex/progress-and-next-steps.md
```

## 1. 등록 공고 상태값 추가

`src/data/matchings.ts`에:

- `MatchingPostStatus`
- `postStatus`
- `updatePostedMatchingStatus(...)`

를 추가했습니다.

새로 등록한 공고는 기본적으로 `open`, 즉 `모집중` 상태로 시작합니다.

## 2. 공고 관리 화면에서 상태 필터

`/shop/post` 화면에서:

- 전체
- 모집중
- 마감

필터로 공고를 나눠 볼 수 있게 했습니다.

상단 요약 카드에도:

- 전체 공고 수
- 모집중 수
- 마감 수

를 같이 보여줍니다.

## 3. 카드에서 바로 상태 변경

각 공고 카드 아래에:

- `상세 보기`
- `모집 마감` 또는 `다시 모집`

버튼을 붙였습니다.

즉, 수정 화면 없이도 기본적인 운영 액션을 바로 시험해볼 수 있습니다.

## React 개발자 기준으로 보면

- 이 단계는 게시물 관리 페이지에 status field와 filter를 붙인 것과 비슷합니다.
- 웹 React에서도 `posts.filter(...)`로 현재 탭에 맞는 아이템만 보여주고, 버튼 클릭으로 `status`를 바꿔 다시 렌더링하는 패턴을 자주 씁니다.
- RN에서도 본질은 같고, 버튼이 `Pressable`, 리스트 카드가 `View`/`Text` 조합일 뿐입니다.

## 핵심 로직

- 등록 공고 데이터에 `postStatus` 필드를 추가하고, 새 공고는 기본적으로 `open`으로 시작합니다.
- 관리 화면은 `selectedFilter` 상태에 따라 `postedMatchings` 배열을 필터링해 보여줍니다.
- `모집 마감` 또는 `다시 모집` 버튼은 `updatePostedMatchingStatus(...)`를 호출하고, 그 뒤 목록을 다시 읽어와 화면을 갱신합니다.

## 핵심 코드

```ts
const filteredMatchings = postedMatchings.filter((matching) =>
  selectedFilter === 'all' ? true : (matching.postStatus ?? 'open') === selectedFilter,
);
```

현재 선택한 탭에 맞는 공고만 화면에 보이게 만드는 핵심 필터 로직입니다.

## 검증

아래 명령으로 TypeScript 검사를 했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```

## 다음에 이어서 할 만한 것

- 공고 수정 화면 추가
- 공고 카드 정렬 추가
- 공고 상태를 홈 목록 노출 방식과 연결
