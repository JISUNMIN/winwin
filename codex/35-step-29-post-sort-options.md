# 35. Step 29 공고 관리 목록 정렬

## 목표

공고 관리 목록에서 원하는 기준으로 공고를 빠르게 정렬할 수 있게 합니다.

이번 단계에서는:

- `최신 등록순`
- `가까운 날짜순`
- `보증금 높은순`

정렬을 추가했습니다.

## 수정한 파일

```text
src/app/shop/post/index.tsx
codex/README.md
codex/progress-and-next-steps.md
```

## 1. 정렬 상태 추가

공고 관리 화면에 `selectedSort` 상태를 추가해서 현재 정렬 기준을 들고 있게 했습니다.

기본값은 `최신 등록순`입니다.

## 2. 정렬 칩 UI 추가

상태 필터 아래에 정렬 칩을 추가했습니다.

- 최신 등록순
- 가까운 날짜순
- 보증금 높은순

필터와 정렬을 같이 써서 원하는 공고만 빠르게 볼 수 있습니다.

## 3. 정렬 로직

- `최신 등록순`: 지금 메모리 배열에 들어간 순서를 그대로 사용
- `가까운 날짜순`: 첫 가능 날짜 또는 deadline 기준 오름차순
- `보증금 높은순`: deposit 기준 내림차순

## React 개발자 기준으로 보면

- 웹 React의 리스트 페이지에서 `selectedSort` state를 두고 `items.sort(...)` 결과를 렌더링하는 패턴과 같습니다.
- 여기서도 필터 결과 배열을 먼저 만들고, 그 다음 정렬된 배열을 `useMemo`로 파생시키는 구조를 썼습니다.

## 핵심 로직

- 먼저 `selectedFilter`로 공고를 걸러냅니다.
- 그 다음 `selectedSort` 값에 따라 새로운 배열을 만들어 정렬합니다.
- 최종적으로는 `sortedMatchings.map(...)`으로 화면에 렌더링합니다.

## 핵심 코드

```ts
const sortedMatchings = useMemo(() => {
  if (selectedSort === 'deposit') {
    return [...filteredMatchings].sort((left, right) => (right.deposit ?? 0) - (left.deposit ?? 0));
  }

  return [...filteredMatchings];
}, [filteredMatchings, selectedSort]);
```

필터된 배열을 복사한 뒤, 정렬 기준에 맞게 sort해서 최종 목록으로 씁니다.

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

- 공고 상태를 홈 목록 노출 방식과 연결
- 수정 완료 안내 UI 추가
- 공고 관리 목록에 검색 추가
