# 10. Step 4 카테고리 필터 만들기

## 목표

디자인 원본의 `CategoryFilter`를 RN 컴포넌트로 옮기고, Home 화면에서 카테고리별 필터링이 되게 만듭니다.

## 참고한 원본 파일

```text
design-reference/src/app/components/CategoryFilter.tsx
```

원본은 React 웹 코드라서 아래 요소를 사용합니다.

```tsx
<div>
<button>
className
lucide-react
```

RN에서는 그대로 사용할 수 없어서 아래 방식으로 바꿨습니다.

```tsx
<View>
<Pressable>
StyleSheet
@expo/vector-icons
```

## 만든 파일

```text
src/components/winwin/CategoryFilter.tsx
```

이 컴포넌트는 두 가지 props를 받습니다.

```ts
interface CategoryFilterProps {
  selected: Category;
  onSelect: (category: Category) => void;
}
```

의미:

- `selected`: 현재 선택된 카테고리
- `onSelect`: 사용자가 카테고리를 눌렀을 때 실행할 함수

## Home 화면에서 추가한 상태

`src/app/index.tsx`에 아래 상태를 추가했습니다.

```ts
const [selectedCategory, setSelectedCategory] = useState<Category>('all');
```

처음에는 전체 카테고리를 보여줘야 하므로 초기값은 `'all'`입니다.

## 검색 + 카테고리 필터링

기존에는 검색어만 필터링했습니다.

이제는 아래 두 조건을 같이 봅니다.

1. 선택된 카테고리와 일치하는가?
2. 검색어와 일치하는가?

핵심 흐름:

```ts
const matchesCategory =
  selectedCategory === 'all' || matching.category === selectedCategory;
```

`selectedCategory`가 `'all'`이면 모든 매칭을 보여주고, 아니면 해당 카테고리만 보여줍니다.

## RN에서 가로 스크롤 만들기

카테고리 버튼은 화면보다 길어질 수 있어서 가로 스크롤로 만들었습니다.

```tsx
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
  ...
</ScrollView>
```

웹의 `overflow-x-auto`와 비슷한 역할입니다.

## RN에서 버튼 만들기

RN에서는 웹의 `button` 대신 `Pressable`을 썼습니다.

```tsx
<Pressable onPress={() => onSelect(category.id)}>
  ...
</Pressable>
```

`Pressable`은 눌림 상태를 스타일에 반영할 수 있어서 버튼 UI에 자주 사용합니다.

## 아이콘

카테고리 버튼에는 `@expo/vector-icons`의 `Ionicons`를 사용했습니다.

예:

```tsx
<Ionicons name={category.icon} size={16} color={iconColor} />
```

디자인 원본의 `lucide-react`는 웹용 라이브러리라 RN에서 그대로 사용하지 않았습니다.

## 접근성

`Pressable`에 접근성 정보를 추가했습니다.

```tsx
accessibilityRole="button"
accessibilityState={{ selected: isSelected }}
```

스크린 리더가 이 요소를 버튼으로 이해하고, 선택 상태도 알 수 있게 합니다.

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

다음에는 `MatchingCard`를 RN 컴포넌트로 만듭니다.

추천 파일:

```text
src/components/winwin/MatchingCard.tsx
```

그 다음 Home 화면에서 `filteredMatchings.map(...)`으로 카드 리스트를 렌더링합니다.
