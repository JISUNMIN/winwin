# 06. WinWin 디자인 RN 적용 계획

## 결론

첫 구현은 `HomePage`부터 시작하는 것이 좋습니다.

디자인 원본의 `HomePage`는 RN 프로젝트의 첫 화면인 아래 파일로 옮기는 것이 자연스럽습니다.

```text
src/app/index.tsx
```

## 왜 Home부터 시작하나?

Home 화면은 앱의 중심 기능을 가장 많이 포함합니다.

- 앱 이름과 헤더
- 검색바
- 현재 위치
- 카테고리 필터
- 매칭 카드 리스트
- 상세 화면으로 이동하는 버튼

즉 Home 화면을 만들면 이후 상세 화면, 채팅 화면으로 이어지는 기본 구조를 잡을 수 있습니다.

## 디자인 원본에서 확인한 구조

다운로드 폴더의 ZIP 안에는 아래 코드가 있습니다.

```text
src/app/pages/HomePage.tsx
src/app/pages/MatchingDetailPage.tsx
src/app/pages/ChatPage.tsx
src/app/components/CategoryFilter.tsx
src/app/components/MatchingCard.tsx
src/app/components/CalendarPicker.tsx
src/app/components/PaymentModal.tsx
src/app/App.tsx
```

이 원본은 React 웹 코드입니다.

따라서 그대로 복사하지 않고 RN 방식으로 바꿔야 합니다.

## React 웹 코드와 RN 코드의 대응

웹 디자인 코드:

```tsx
<div>
<header>
<main>
<button>
<input>
```

RN에서는 보통 이렇게 바꿉니다.

```tsx
<View>
<SafeAreaView>
<ScrollView>
<Pressable>
<TextInput>
```

## 라우팅 대응

웹 디자인 코드는 `react-router`를 사용합니다.

예:

```tsx
navigate(`/matching/${matching.id}`)
```

Expo Router에서는 보통 이렇게 이동합니다.

```tsx
router.push(`/matching/${matching.id}`)
```

따라서 상세 화면을 만들 때는 아래 같은 파일 구조가 필요할 수 있습니다.

```text
src/app/matching/[id].tsx
```

## 추천 구현 순서

### 1. 디자인 참고 폴더 준비

ZIP을 프로젝트 안에 `design-reference` 같은 이름으로 풀어두고 참고합니다.

이 폴더는 실제 앱 코드가 아니라 참고용입니다.

### 2. 데이터와 타입 분리

디자인 원본의 `mockData`와 `Matching` 타입을 RN 프로젝트 안으로 옮깁니다.

추천 위치:

```text
src/data/matchings.ts
```

여기까지 하면 UI 없이도 앱에서 사용할 데이터 구조가 생깁니다.

### 3. Home 화면 뼈대 만들기

`src/app/index.tsx`에서 기존 Expo 예제 화면을 WinWin 홈 화면으로 바꿉니다.

처음부터 예쁘게 완성하지 않고, 아래 정도만 먼저 만듭니다.

- `WinWin` 제목
- 검색 입력
- 위치 텍스트
- 카테고리 영역
- 매칭 카드 리스트 자리

### 4. `CategoryFilter` 만들기

웹 디자인의 `CategoryFilter.tsx`를 RN 컴포넌트로 바꿉니다.

추천 위치:

```text
src/components/winwin/CategoryFilter.tsx
```

### 5. `MatchingCard` 만들기

웹 디자인의 `MatchingCard.tsx`를 RN 컴포넌트로 바꿉니다.

추천 위치:

```text
src/components/winwin/MatchingCard.tsx
```

이 컴포넌트가 만들어지면 Home 화면이 실제 앱처럼 보이기 시작합니다.

### 6. 상세 화면 만들기

Home에서 `지원하기`를 누르면 이동할 상세 화면을 만듭니다.

추천 위치:

```text
src/app/matching/[id].tsx
```

### 7. 채팅 화면 만들기

상세 화면 다음 단계로 채팅 화면을 만듭니다.

추천 위치:

```text
src/app/chat/[id].tsx
```

## 지금 당장 할 첫 작업

가장 작은 첫 작업은 아래입니다.

1. `design-reference` 폴더를 참고용으로 준비합니다.
2. `src/data/matchings.ts`에 `Matching` 타입과 `mockData`를 옮깁니다.
3. `src/app/index.tsx`를 아주 단순한 WinWin 홈 화면으로 바꿉니다.

이렇게 하면 디자인 적용을 시작하면서도 한 번에 너무 많은 코드를 바꾸지 않을 수 있습니다.

## 주의할 점

웹 디자인 코드를 그대로 붙여넣으면 안 됩니다.

이유:

- RN에는 `div`, `header`, `main`, `button`, `input`이 없습니다.
- Tailwind className을 그대로 쓸 수 없습니다.
- `react-router` 대신 Expo Router를 씁니다.
- 웹 아이콘 라이브러리인 `lucide-react`는 RN에서 바로 쓸 수 없습니다.

따라서 화면 구조와 디자인 의도는 가져오고, 코드는 RN 방식으로 새로 작성하는 접근이 좋습니다.
