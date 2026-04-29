# 38. Step 32 공고 관리 목록 검색

## 목표

공고 관리 화면에서 원하는 공고를 더 빨리 찾을 수 있도록 검색을 추가합니다.

이번 단계에서는:

- 검색 입력창 추가
- 상태 필터와 함께 검색 적용
- 검색 결과가 없을 때 안내 카드 표시

까지 반영했습니다.

## 수정한 파일

```text
src/app/shop/post/index.tsx
codex/README.md
codex/progress-and-next-steps.md
```

## 1. 검색 상태 추가

공고 관리 화면에 `searchQuery` 상태를 추가했습니다.

입력창에서 검색어를 바꾸면 목록이 바로 다시 계산됩니다.

## 2. 검색 대상

이번 검색은 아래 내용을 한 번에 찾습니다.

- 샵 이름
- 서비스명
- 공개 위치
- 지원 조건

즉, 웹 React 리스트 화면에서 여러 필드를 합쳐 문자열 검색하는 방식과 비슷합니다.

## 3. 필터와 검색 같이 적용

순서는:

```text
상태 필터 적용
-> 검색어 포함 여부 확인
-> 정렬 적용
```

입니다.

그래서 `모집중`만 본 상태에서 검색하거나, `마감` 공고만 따로 찾아보는 흐름도 자연스럽게 됩니다.

## 4. 검색 결과 없음 UI

등록한 공고는 있지만 현재 검색/필터 조합에 맞는 결과가 없으면, 빈 목록 대신 안내 카드를 보여줍니다.

이렇게 하면:

- 아직 공고가 아예 없는 상태
- 공고는 있지만 검색 결과가 없는 상태

를 구분해서 볼 수 있습니다.

## React 개발자 기준으로 보면

- 웹에서 `query`, `selectedFilter`, `selectedSort`를 state로 두고 리스트를 파생시키는 패턴과 같습니다.
- 여기서도 원본 배열을 직접 바꾸지 않고, `useMemo` 안에서 필터와 검색 결과를 계산해서 렌더링합니다.

## 핵심 코드

```ts
const searchableText = [
  matching.shopName,
  matching.service,
  matching.location,
  ...matching.requirements,
]
  .join(' ')
  .toLowerCase();
```

검색 대상 텍스트를 하나로 합친 뒤 `includes(...)`로 포함 여부를 확인했습니다.

## 검증

아래 명령으로 TypeScript 검사를 했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```

## 나중에 할 것

- 등록 완료 화면도 같은 feedback 패턴으로 정리
- 고객 상세 화면에서 마감 공고 안내 흐름 보강
