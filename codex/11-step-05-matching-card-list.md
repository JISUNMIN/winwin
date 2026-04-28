# 11. Step 5 매칭 카드 리스트 만들기

## 목표

디자인 원본의 `MatchingCard`를 RN 컴포넌트로 옮기고, Home 화면에서 필터 결과를 카드 리스트로 보여줍니다.

## 참고한 원본 파일

```text
design-reference/src/app/components/MatchingCard.tsx
```

원본은 React 웹 코드라서 아래 요소를 사용합니다.

```tsx
<div>
<span>
<button>
className
lucide-react
react-router
```

RN에서는 아래 방식으로 바꿨습니다.

```tsx
<View>
<Text>
<Pressable>
StyleSheet
@expo/vector-icons
expo-image
```

## 만든 파일

```text
src/components/winwin/MatchingCard.tsx
```

이 컴포넌트는 매칭 데이터 하나를 받아 카드로 보여줍니다.

```ts
interface MatchingCardProps {
  matching: Matching;
  onPress?: () => void;
}
```

현재 `onPress`는 optional입니다.

상세 화면을 아직 만들지 않았기 때문에, 버튼 이동은 다음 단계에서 연결합니다.

## 카드에 표시하는 내용

카드에는 아래 정보가 들어갑니다.

- 프리미엄 매칭 배지
- 대표 이미지
- 카테고리 라벨
- 매장 이름
- 서비스 이름
- 위치
- 마감 상태
- 요구 조건 칩
- 지원 버튼 자리

## 이미지 처리

이미지는 `expo-image`의 `Image` 컴포넌트를 사용했습니다.

```tsx
import { Image } from 'expo-image';
```

기본 RN `Image`도 쓸 수 있지만, Expo 프로젝트에서는 `expo-image`가 캐싱과 로딩 처리에 유리합니다.

## 날짜 처리

마감일 계산은 `getDaysUntil()` 함수로 처리했습니다.

결과 예시:

- `오늘 마감`
- `내일 마감`
- `마감`
- `3일 남음`

날짜 문자열은 `YYYY-MM-DD` 형태라서 로컬 날짜로 직접 파싱했습니다.

```ts
function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}
```

이렇게 하면 브라우저나 런타임이 UTC로 해석해서 날짜가 하루 밀리는 문제를 줄일 수 있습니다.

## Home 화면 변경

`src/app/index.tsx`에서 `MatchingCard`를 import했습니다.

```ts
import { MatchingCard } from '@/components/winwin/MatchingCard';
```

그리고 필터링된 배열을 카드로 렌더링합니다.

```tsx
{filteredMatchings.map((matching) => (
  <MatchingCard key={matching.id} matching={matching} />
))}
```

검색/카테고리 결과가 없을 때는 empty state를 보여줍니다.

## 이번 단계에서 아직 하지 않은 것

`지원하기` 버튼을 눌렀을 때 상세 화면으로 이동하는 기능은 아직 연결하지 않았습니다.

이유:

상세 화면 파일이 아직 없기 때문입니다.

다음 단계에서 아래 파일을 만들고 연결하는 것이 좋습니다.

```text
src/app/matching/[id].tsx
```

## 검증

아래 명령으로 타입 검사를 했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```

## 다음 단계

다음에는 상세 화면 라우트의 가장 작은 버전을 만듭니다.

추천 작업:

1. `src/app/matching/[id].tsx` 생성
2. URL의 `id` 읽기
3. `mockMatchings`에서 해당 매칭 찾기
4. Home 카드의 `onPress`에서 `router.push(...)` 연결
