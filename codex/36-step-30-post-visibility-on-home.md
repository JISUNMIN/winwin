# 36. Step 30 공고 상태와 홈 노출 연결

## 목표

샵이 `마감` 처리한 공고가 고객용 홈 목록에는 보이지 않도록 연결합니다.

이번 단계에서는:

- 홈 화면 전용 공고 helper 추가
- `마감` 공고를 홈 목록에서 제외

까지 반영했습니다.

## 수정한 파일

```text
src/data/matchings.ts
src/app/(tabs)/index.tsx
codex/README.md
codex/progress-and-next-steps.md
```

## 1. 홈 화면 전용 helper 추가

기존 `getAllMatchings()`는 샵이 등록한 공고와 기본 mock 공고를 모두 그대로 돌려줬습니다.

이번에는 고객이 탐색하는 홈 화면에서는 `open` 상태만 보이도록 `getDiscoverableMatchings()`를 추가했습니다.

## 2. 홈 화면 데이터 소스 교체

`src/app/(tabs)/index.tsx`는 이제 `getAllMatchings()` 대신 `getDiscoverableMatchings()`를 사용합니다.

그래서 샵 공고 관리 화면에서 `모집 마감`을 누르면, 홈 화면으로 돌아왔을 때 그 공고가 목록에서 빠집니다.

## React 개발자 기준으로 보면

- 웹 React에서도 `관리용 전체 목록 API`와 `고객 노출용 공개 목록 API`를 분리하는 패턴과 비슷합니다.
- 같은 데이터라도 화면 목적이 다르면, UI에서 if 문을 많이 넣기보다 data helper를 나누는 쪽이 읽기 쉽습니다.

## 핵심 로직

- 전체 공고는 그대로 `getAllMatchings()`가 관리합니다.
- 고객용 홈 목록은 `postStatus`가 `open`인 공고만 필터링합니다.
- 홈 화면 포커스가 돌아올 때도 같은 helper로 다시 읽어서 최신 상태를 반영합니다.

## 핵심 코드

```ts
export function getDiscoverableMatchings() {
  return getAllMatchings().filter((matching) => (matching.postStatus ?? 'open') === 'open');
}
```

공고 상태가 없으면 기존 mock 데이터와 호환되도록 기본값을 `open`으로 봤습니다.

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

- 수정 완료 안내 UI 추가
- 공고 관리 목록에 검색 추가
- 고객 상세 화면도 `마감 공고` 안내 흐름으로 분리할지 결정
