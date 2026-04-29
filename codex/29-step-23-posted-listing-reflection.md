# 29. Step 23 등록 공고 목록 반영

## 목표

샵이 등록한 공고가 등록 완료 화면에서 끝나지 않고 실제 목록에도 반영되도록 만듭니다.

## 수정한 파일

```text
src/data/matchings.ts
src/app/(tabs)/index.tsx
src/app/matching/[id].tsx
src/components/winwin/ChatScreen.tsx
src/app/shop/index.tsx
src/app/shop/post/new.tsx
```

## 핵심 변경

### 1. 등록 공고용 메모리 저장 추가

`src/data/matchings.ts`에 아래 helper를 추가했습니다.

- `addPostedMatching(...)`
- `getAllMatchings()`
- `getPostedMatchings()`

즉, 기본 mock 공고와 사용자가 등록한 공고를 같이 다룰 수 있게 했습니다.

### 2. 공고 등록 시 실제 데이터 추가

`/shop/post/new`에서 폼 제출 시 `addPostedMatching(...)`을 호출하도록 바꿨습니다.

이제 등록 버튼을 누르면 입력값이 실제 공고 데이터 배열에 추가됩니다.

### 3. 홈 목록 반영

메인 홈 화면은 더 이상 `mockMatchings`만 보지 않고 `getAllMatchings()`를 사용합니다.

그래서 새로 등록한 공고도 홈 목록에 바로 나타납니다.

### 4. 상세 / 채팅 화면도 새 공고 대응

매칭 상세 화면과 채팅 화면도 `getAllMatchings()` 기준으로 찾도록 바꿨습니다.

즉, 새로 만든 공고도 상세와 채팅 흐름으로 자연스럽게 이어집니다.

### 5. 샵 화면에 내가 등록한 공고 표시

샵 상담 목록 화면에는 `내가 등록한 공고` 섹션을 추가했습니다.

여기서:

- 방금 등록한 공고 개수
- 공고 제목과 서비스
- 날짜 수와 보증금

를 확인할 수 있고, 눌러서 상세 화면으로도 갈 수 있습니다.

## 왜 이 단계가 중요한지

이제 공고 등록 흐름이 단순 mock 폼이 아니라:

```text
등록
-> 목록 반영
-> 상세 진입
-> 채팅 연결 가능
```

한 흐름으로 이어집니다.

이건 나중에 실제 서버 저장을 붙일 때도 매우 좋은 중간 단계입니다.

## React 개발자 기준으로 보면

- 이 단계는 컴포넌트 로컬 state가 아니라, 여러 화면에서 같이 읽는 module-level mock store를 만든 것입니다.
- 웹 React에서도 `posts.ts` 파일에 배열과 helper 함수를 두고 여러 페이지가 import해서 쓰면 비슷하게 동작합니다.
- `useState`와 달리 컴포넌트 밖에 있는 값이라서, 같은 앱 실행 중 라우트 이동을 해도 유지됩니다.

## 핵심 로직

- `addPostedMatching(...)`이 새 공고를 `userPostedMatchings` 배열에 추가합니다.
- `getAllMatchings()`는 기본 mock 공고와 새로 등록한 공고를 합쳐서 반환합니다.
- 홈, 상세, 채팅, 샵 화면이 이 helper를 사용하도록 바뀌면서 새 공고가 여러 화면에 함께 나타나게 됐습니다.

## 핵심 코드

```ts
const userPostedMatchings: Matching[] = [];

export function addPostedMatching(draft: MatchingPostDraft) {
  userPostedMatchings.unshift(newMatching);
}
```

새 공고를 컴포넌트 state가 아니라 파일 바깥의 module-level 배열에 넣어서 여러 화면이 같이 읽게 했습니다.

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

- 날짜 입력을 더 구조화된 선택 UI로 바꾸기
- 지원 조건 입력을 칩 형태 UI로 바꾸기
- 샵 공고 관리 목록 화면을 따로 분리하기
