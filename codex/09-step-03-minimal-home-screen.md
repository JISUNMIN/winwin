# 09. Step 3 작은 Home 화면 만들기

## 목표

Expo 기본 Home 화면을 아주 작은 WinWin 홈 화면으로 바꿉니다.

이번 단계에서는 완성 디자인을 만들지 않고, RN 화면 수정 흐름을 익히는 데 집중합니다.

## 수정한 파일

```text
src/app/index.tsx
```

## 화면에 추가한 것

현재 Home 화면에는 아래 요소가 들어갑니다.

- `WinWin` 제목
- 짧은 소개 문구
- 검색 입력창
- 현재 위치
- 전체 매칭 또는 검색 결과 개수
- 프리미엄 매칭 개수
- 다음 단계 안내 박스

## 왜 작게 시작했나?

처음부터 디자인 전체를 옮기면 RN 문법, 라우팅, 스타일, 데이터 연결이 한 번에 섞입니다.

그래서 먼저 아래 흐름만 확인했습니다.

```text
mockMatchings 데이터 -> index.tsx에서 import -> 화면에 개수 표시
```

이 흐름이 잡히면 다음에 카테고리 필터와 매칭 카드 리스트를 붙이기 쉽습니다.

## React 웹과 RN 차이

웹에서는 보통 이렇게 씁니다.

```tsx
<div>
  <h1>WinWin</h1>
  <input />
</div>
```

RN에서는 이렇게 씁니다.

```tsx
<View>
  <Text>WinWin</Text>
  <TextInput />
</View>
```

중요한 차이:

- 텍스트는 반드시 `Text` 안에 있어야 합니다.
- 레이아웃 박스는 `View`를 씁니다.
- 입력창은 `TextInput`을 씁니다.
- 스크롤은 `ScrollView`를 씁니다.
- CSS 파일 대신 `StyleSheet.create()`로 스타일을 정의했습니다.

## 이번 화면에서 쓴 RN 컴포넌트

### `SafeAreaView`

상단 노치나 상태바 영역을 피해서 화면을 배치합니다.

RN 앱에서는 화면 최상단에 자주 사용합니다.

### `ScrollView`

내용이 화면보다 길어질 때 스크롤되도록 합니다.

Home 화면은 나중에 카드 리스트가 길어질 예정이라 처음부터 `ScrollView`로 감쌌습니다.

### `View`

웹의 `div`와 비슷한 레이아웃 박스입니다.

### `Text`

문자를 보여줄 때 사용합니다.

RN에서는 문자열을 `View` 안에 바로 넣으면 안 되고, 반드시 `Text` 안에 넣어야 합니다.

### `TextInput`

사용자가 텍스트를 입력하는 컴포넌트입니다.

웹의 `input`과 비슷합니다.

## 검색 로직

검색어는 `useState`로 관리합니다.

```ts
const [query, setQuery] = useState('');
```

검색 결과는 `useMemo`로 계산했습니다.

```ts
const filteredMatchings = useMemo(() => {
  // query가 바뀔 때만 다시 계산
}, [query]);
```

현재는 아래 필드들을 검색합니다.

- 매장 이름
- 위치
- 서비스 이름
- 요구 조건

## 검증

아래 명령으로 타입 검사를 했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```

## 화면이 바로 안 바뀔 때

Expo 서버가 켜져 있다면 저장 후 자동으로 화면이 바뀌어야 합니다.

안 바뀌면 Expo 터미널에서 아래 키를 누릅니다.

```text
r
```

그래도 이상하면 캐시를 지우고 다시 시작합니다.

```powershell
npx expo start -c
```

## 다음 단계

다음에는 `CategoryFilter`를 RN 컴포넌트로 만듭니다.

추천 파일:

```text
src/components/winwin/CategoryFilter.tsx
```

그 다음 Home 화면에서 카테고리별 필터링을 연결합니다.
