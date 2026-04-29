# RN 태그 정리 for React 개발자

## 왜 이 문서가 필요한지

웹 React를 하다가 RN을 보면 가장 먼저 헷갈리는 게:

- `div`가 없네?
- `button`이 없네?
- `input`도 그냥 없네?

같은 부분입니다.

RN은 웹처럼 HTML 태그를 쓰는 것이 아니라, RN이 제공하는 컴포넌트를 조합해서 화면을 만듭니다.

즉:

- 웹 React = JSX + HTML 태그
- RN = JSX + RN 컴포넌트

구조입니다.

## 먼저 큰 차이

웹은 태그 종류가 많습니다.

- `div`
- `span`
- `button`
- `input`
- `textarea`
- `img`
- `ul`, `li`
- `section`, `article`
- `form`

등이 기본으로 있습니다.

RN은 훨씬 적은 기본 컴포넌트를 조합해서 같은 역할을 만듭니다.

대표적으로 자주 보는 건:

- `View`
- `Text`
- `Pressable`
- `TextInput`
- `ScrollView`
- `Image`
- `FlatList`
- `SectionList`
- `SafeAreaView`

정도입니다.

즉, 질문한 것처럼 기본 "태그 느낌의 컴포넌트" 수는 RN이 더 적다고 보면 맞습니다.

## 핵심 대응표

### 1. `View`

- 웹에서 비슷한 것: `div`
- 역할: 레이아웃 박스, 컨테이너, 카드, 행/열 묶음

```tsx
<View style={styles.card}>
  <Text>내용</Text>
</View>
```

언제 쓰나:

- 섹션 박스 만들 때
- 카드 wrapper 만들 때
- flex row/column 레이아웃 만들 때

React 개발자 포인트:

- 거의 `div`처럼 생각하면 됩니다.
- 다만 웹처럼 semantic 태그 개념은 약하고, 대부분 `View`로 레이아웃을 잡습니다.

### 2. `Text`

- 웹에서 비슷한 것: `span`, `p`, `h1`~`h6`
- 역할: 문자열 렌더링

```tsx
<Text style={styles.title}>공고 등록</Text>
```

언제 쓰나:

- 제목
- 본문
- 버튼 텍스트
- 안내 문구

React 개발자 포인트:

- RN에서는 텍스트를 그냥 `View` 안에 바로 쓰지 않고 반드시 `Text`로 감싸는 것이 기본입니다.
- 웹처럼 `<div>Hello</div>` 감각으로 쓰면 안 됩니다.
- 예를 들어 아래 코드는 RN에서 보통 에러가 납니다.

```tsx
<View>Hello</View>
```

- 대표적으로 `Text strings must be rendered within a <Text> component` 같은 에러를 보게 됩니다.
- 이유는 `View`가 글자를 그리는 컴포넌트가 아니라 레이아웃 박스 역할만 하기 때문입니다.

### 3. `Pressable`

- 웹에서 비슷한 것: `button`, 클릭 가능한 `div`
- 역할: 터치/클릭 인터랙션

```tsx
<Pressable onPress={handleSubmit}>
  <Text>저장</Text>
</Pressable>
```

언제 쓰나:

- 버튼
- 카드 클릭
- 칩 선택
- 리스트 항목 클릭

React 개발자 포인트:

- 웹에서는 `button`, `a`, clickable `div`가 역할을 나눠 가지지만,
- RN에서는 `Pressable` 하나로 다양한 클릭 인터랙션을 처리하는 경우가 많습니다.
- `Pressable` 안에도 문자열을 바로 쓰기보다 보통 `Text`를 넣습니다.

```tsx
<Pressable onPress={handleSubmit}>
  저장
</Pressable>
```

- 이런 식으로 문자열을 바로 넣으면, 결국 `Text` 없이 텍스트를 렌더링하려는 것이어서 RN에서 에러가 날 수 있습니다.
- 그래서 버튼 라벨도 아래처럼 쓰는 것이 기본입니다.

```tsx
<Pressable onPress={handleSubmit}>
  <Text>저장</Text>
</Pressable>
```

- 즉 `Pressable`은 클릭 영역이고, 실제 글자는 `Text`가 그린다고 생각하면 이해가 쉽습니다.

### 4. `TextInput`

- 웹에서 비슷한 것: `input`, `textarea`
- 역할: 문자열 입력

```tsx
<TextInput
  value={shopName}
  onChangeText={setShopName}
  placeholder="샵 이름 입력"
/>
```

언제 쓰나:

- 한 줄 입력
- 여러 줄 입력
- 숫자 입력
- 검색 입력

React 개발자 포인트:

- 웹의 `onChange={(e) => setValue(e.target.value)}` 대신
- RN은 `onChangeText={(value) => ...}` 형태를 많이 씁니다.
- 여러 줄 입력은 `multiline` prop으로 처리합니다.
- 이유는 RN의 `TextInput`이 DOM의 `input`이 아니라 네이티브 입력 컴포넌트이기 때문입니다.
- 그래서 웹처럼 `e.target.value`를 기대하면 안 되고, RN은 바뀐 문자열을 바로 넘겨주는 `onChangeText`를 더 많이 씁니다.

```tsx
<TextInput onChangeText={(value) => setValue(value)} />
```

- 만약 RN에서 굳이 `onChange`를 쓰면 보통 값은 `e.target.value`가 아니라 `e.nativeEvent.text` 쪽에 있습니다.

```tsx
<TextInput onChange={(e) => setValue(e.nativeEvent.text)} />
```

- 즉, 웹의 DOM 이벤트 패턴과 RN의 네이티브 이벤트 패턴이 다르기 때문에 `onChangeText`가 더 자연스럽고 자주 쓰입니다.

### 5. `ScrollView`

- 웹에서 비슷한 것: `overflow: auto`가 있는 스크롤 영역 `div`
- 역할: 내용이 길 때 스크롤 가능하게 만들기

```tsx
<ScrollView contentContainerStyle={styles.content}>
  <View style={styles.card}>
    <Text>스크롤 안의 내용</Text>
  </View>
</ScrollView>
```

언제 쓰나:

- 폼 화면
- 긴 상세 화면
- 카드가 세로로 긴 페이지

React 개발자 포인트:

- RN 화면은 자동으로 웹처럼 스크롤되지 않는 경우가 많아서, 긴 화면이면 `ScrollView`를 직접 감싸는 경우가 많습니다.
- `style`과 `contentContainerStyle` 역할 차이도 자주 보게 됩니다.
- 참고로 `<View />`처럼 self-closing 문법 자체는 가능하지만, 자식도 스타일도 없으면 그냥 빈 박스라서 의미가 거의 없습니다.

### 6. `Image`

- 웹에서 비슷한 것: `img`
- 역할: 이미지 출력

```tsx
<Image source={{ uri: imageUrl }} style={styles.image} />
```

언제 쓰나:

- 썸네일
- 프로필
- 배너

React 개발자 포인트:

- `src`가 아니라 `source`
- 원격 이미지는 `{ uri: '...' }`
- 스타일 크기를 직접 주는 경우가 많음

원격 이미지 뜻:

- 내 프로젝트 폴더 안의 로컬 파일이 아니라
- 인터넷 주소로 불러오는 이미지

예:

```tsx
<Image source={{ uri: 'https://example.com/banner.png' }} style={styles.image} />
```

여기서 `https://...` 주소에 있는 이미지를 가져오는 것이 원격 이미지입니다.

반대로 로컬 이미지는 보통 이런 느낌입니다.

```tsx
<Image source={require('../../assets/logo.png')} style={styles.logo} />
```

왜 `require(...)`를 쓰나:

- 웹의 `img src="/logo.png"`처럼 브라우저가 문자열 경로를 읽어 바로 가져오는 구조가 아니기 때문입니다.
- RN에서는 로컬 이미지를 앱 번들에 포함해야 해서, 번들러가 이 파일을 미리 알 수 있도록 `require(...)`를 많이 씁니다.
- 즉 `require('../../assets/logo.png')`는 "이 로컬 이미지를 앱 asset으로 포함해줘"에 가까운 표현입니다.

웹과 비교하면:

```tsx
<img src="/logo.png" />
```

또는

```tsx
import logo from './logo.png';

<img src={logo} />
```

같은 방식이 더 자연스럽습니다.

즉:

- 웹 로컬 이미지 = 브라우저가 경로 기반으로 읽음
- RN 로컬 이미지 = 번들러가 asset으로 포함해야 해서 `require(...)`를 자주 씀

`스타일 크기를 직접 준다`는 뜻:

- 웹의 `img`는 원본 크기나 CSS 흐름에 따라 어느 정도 보일 수 있지만
- RN의 `Image`는 `width`, `height` 같은 크기를 명시하지 않으면 기대한 대로 안 보이거나 크기 계산이 애매할 수 있습니다.

예:

```tsx
<Image
  source={{ uri: 'https://example.com/banner.png' }}
  style={{ width: 120, height: 120, borderRadius: 16 }}
/>
```

즉, RN에서는 이미지를 넣을 때:

- 어떤 이미지를 쓸지 `source`
- 화면에서 어느 크기로 보일지 `style.width`, `style.height`

를 같이 정하는 경우가 많습니다.

### 7. `FlatList`

- 웹에서 비슷한 것: `items.map(...)`으로 리스트 렌더링 + 가상화
- 역할: 긴 리스트를 효율적으로 렌더링
- 이름 뜻: `flat`은 그룹 없이 평평한 1차원 목록이라는 뜻입니다.

```tsx
<FlatList
  data={items}
  renderItem={({ item }) => <Text>{item.title}</Text>}
/>
```

언제 쓰나:

- 공고 목록
- 채팅 목록
- 카드 리스트

React 개발자 포인트:

- 단순히 `map(...)`으로 다 그리는 것보다 성능상 유리합니다.
- 웹의 virtualization 라이브러리 느낌에 가깝습니다.
- 다만 아주 짧고 단순한 리스트라면 굳이 `FlatList`를 쓰지 않고 `items.map(...)` + `View`/`Text`로도 충분한 경우가 많습니다.

웹 React에서 비슷한 예시:

- 아이템이 적을 때는 보통 그냥 `items.map(...)`으로 다 그립니다.

```tsx
{items.map((item) => (
  <Card key={item.id} item={item} />
))}
```

- 그런데 아이템이 몇백 개, 몇천 개로 길어지면 `react-window` 같은 가상화 라이브러리를 쓰기도 합니다.

```tsx
<List height={600} itemCount={items.length} itemSize={80} width="100%">
  {({ index, style }) => <div style={style}>{items[index].title}</div>}
</List>
```

- RN의 `FlatList`는 이런 "긴 목록을 효율적으로 렌더링하는 기본 도구"라고 생각하면 됩니다.

이름 감각으로 보면:

```text
FlatList
공고1
공고2
공고3
```

처럼 섹션 구분 없이 아이템이 한 줄로 이어지는 리스트에 가깝습니다.

### 8. `SectionList`

- 웹에서 비슷한 것: 그룹 헤더가 있는 리스트
- 역할: 섹션별 리스트
- 이름 뜻: `section`은 제목/그룹으로 나뉜 목록이라는 뜻입니다.

```tsx
<SectionList
  sections={sections}
  keyExtractor={(item) => item.id}
  renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
  renderItem={({ item }) => <Text>{item.name}</Text>}
/>
```

여기서 각 prop 뜻:

- `sections={sections}`
  - 섹션별 데이터 배열을 넘깁니다.
  - 보통 `{ title: '헤어', data: [...] }` 같은 구조를 씁니다.
- `keyExtractor={(item) => item.id}`
  - 각 아이템의 고유 key를 어떻게 뽑을지 정합니다.
  - 웹 React의 `key={item.id}` 감각과 같습니다.
- `renderSectionHeader={({ section }) => ...}`
  - 각 섹션의 제목 부분을 어떻게 그릴지 정합니다.
  - 예: `헤어`, `네일`, `2026-04-29`
- `renderItem={({ item }) => ...}`
  - 각 섹션 안의 실제 아이템 한 줄을 어떻게 그릴지 정합니다.
  - 예: 공고 카드, 메시지 항목, 리스트 row

`section`, `item`은 어디서 오나:

- 둘 다 `sections`에 넘긴 데이터에서 `SectionList`가 자동으로 꺼내서 콜백 인자로 넣어줍니다.
- `section`은 섹션 객체 하나이고,
- `item`은 그 섹션 안의 `data` 배열 원소 하나입니다.

예를 들면:

```tsx
const sections = [
  {
    title: '헤어',
    data: [{ id: '1', name: '공고1' }],
  },
];
```

이 구조라면:

- `section.title` -> `헤어`
- `item.name` -> `공고1`

처럼 읽히게 됩니다.

언제 쓰나:

- 날짜별 채팅
- 카테고리별 묶음
- 상태별 그룹 목록

웹 React에서 비슷한 예시:

- 웹에서는 보통 데이터를 먼저 그룹으로 묶고, 섹션 제목과 아이템 리스트를 같이 렌더링합니다.

```tsx
{sections.map((section) => (
  <div key={section.title}>
    <h3>{section.title}</h3>
    {section.items.map((item) => (
      <Card key={item.id} item={item} />
    ))}
  </div>
))}
```

- `SectionList`는 이런 grouped list를 RN에서 조금 더 구조적으로 다루는 기본 컴포넌트입니다.
- 즉 `FlatList`가 "한 줄짜리 긴 목록"이라면, `SectionList`는 "그룹 헤더가 있는 긴 목록"에 가깝습니다.

이름 감각으로 보면:

```text
SectionList
헤어
- 공고1
- 공고2

네일
- 공고3
- 공고4
```

즉:

- `FlatList` = 그룹 없는 평평한 목록
- `SectionList` = 그룹 헤더가 있는 목록

### 9. `SafeAreaView`

- 웹에서 비슷한 것: 없지만, 모바일 notch/padding 보정 wrapper 느낌
- 역할: 상태바, 노치 영역과 겹치지 않게 안전 영역 확보

```tsx
<SafeAreaView style={styles.safeArea}>
  <ScrollView />
</SafeAreaView>
```

언제 쓰나:

- 전체 화면 wrapper
- 상단 헤더가 있는 모바일 화면

React 개발자 포인트:

- 웹에는 없는 개념이라 초반에 낯섭니다.
- RN 화면 최상단 wrapper로 자주 씁니다.

웹 React에서 비슷한 예시:

- 웹에는 완전히 같은 태그는 없지만, 모바일 레이아웃에서 상단 fixed header와 겹치지 않게 wrapper에 padding을 주는 느낌과 비슷합니다.

```tsx
<div style={{ paddingTop: 24, paddingLeft: 16, paddingRight: 16 }}>
  <PageContent />
</div>
```

- 또는 iPhone notch 같은 기기를 고려해서 CSS env 값을 쓰는 경우와 감각이 비슷합니다.

```tsx
<div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
  <PageContent />
</div>
```

- RN의 `SafeAreaView`는 이런 보정을 매번 직접 계산하지 않도록 도와주는 화면 바깥 wrapper라고 보면 됩니다.

항상 써야 하나:

- 모든 컴포넌트에 붙이는 것은 아니고, 보통 "화면 최상단 wrapper"에 자주 씁니다.
- 즉 카드, 버튼, 작은 조각 컴포넌트마다 쓰는 것이 아니라 페이지 루트에서 쓰는 경우가 많습니다.

보통 쓰는 경우:

- 전체 화면 페이지
- 상단 헤더가 있는 화면
- 뒤로가기 버튼이나 제목이 화면 맨 위에 붙는 화면
- 하단 버튼이 시스템 홈 인디케이터와 겹칠 수 있는 화면

굳이 안 쓸 수도 있는 경우:

- 이미 네비게이션 라이브러리가 안전 영역 처리를 해주는 경우
- 전체 배경 이미지를 화면 끝까지 깔고 싶어서 일부만 따로 inset 처리하는 경우
- 작은 재사용 컴포넌트

즉 감각적으로는:

- `SafeAreaView` = 화면 루트에서 자주 쓰는 wrapper
- `View` = 일반 레이아웃 박스

라고 이해하면 됩니다.

## 웹 태그와 1:1 대응되지 않는 것들

### `form`

RN에는 웹의 `form` 같은 태그가 없습니다.

보통은:

- `View`
- `TextInput`
- `Pressable`
- `useState`

조합으로 폼을 만듭니다.

즉, 제출도 브라우저 기본 submit 이벤트가 아니라 직접 `onPress={handleSubmit}`로 처리합니다.

### `ul`, `li`

RN에는 리스트 전용 태그가 없고,

- `View`로 감싸고
- `map(...)`
- 또는 `FlatList`

를 씁니다.

### `a`

RN에는 웹 링크 태그처럼 기본 `a`가 없고, 보통:

- `Pressable`
- `router.push(...)`
- `Link` 컴포넌트

같은 방식으로 이동합니다.

여기서 `Link`는 직접 만든 컴포넌트가 아니라, 보통 라우팅 라이브러리가 제공하는 링크 컴포넌트입니다.

예를 들면 이 프로젝트의 `expo-router`에서는:

```tsx
import { Link } from 'expo-router';

<Link href="/shop/post">
  <Text>공고 관리로 이동</Text>
</Link>
```

처럼 쓸 수 있습니다.

`router.push(...)`는 태그가 아니라 "이동시키는 함수"입니다.

그래서 보통은 클릭 가능한 컴포넌트와 같이 씁니다.

```tsx
import { router } from 'expo-router';

<Pressable onPress={() => router.push('/shop/post')}>
  <Text>공고 관리로 이동</Text>
</Pressable>
```

즉 감각적으로는:

- `Link` = 웹의 `<a>`에 더 가까움
- `Pressable + router.push(...)` = 버튼 클릭 후 `navigate()` 호출에 가까움

둘 중 뭘 더 많이 쓰나:

- 둘 다 많이 쓰지만, 앱 화면 UI에서는 `Pressable + router.push(...)`를 더 자주 보는 편입니다.

이유:

- RN에서는 카드 전체 클릭, 버튼 클릭, 칩 클릭처럼 "링크처럼 보이지 않는 클릭 UI"가 많습니다.
- 이런 경우엔 클릭 영역을 직접 만들고 `onPress` 안에서 이동시키는 방식이 더 자연스럽습니다.

예:

```tsx
<Pressable onPress={() => router.push('/shop/post')}>
  <Text>공고 관리</Text>
</Pressable>
```

반대로 `Link`가 더 잘 맞는 경우:

- 텍스트 링크처럼 보이는 이동
- declarative하게 `href`를 바로 적고 싶은 경우
- 웹의 `<a>` 감각으로 간단히 이동만 처리하고 싶은 경우

여기서 `텍스트 링크처럼 보이는 이동`이라는 말은:

- 큰 버튼이 아니라
- 문장 안에 있는 작은 이동 텍스트
- 웹의 `<a>` 태그처럼 글자 자체를 눌러서 이동하는 느낌

을 말합니다.

예:

```tsx
<Link href="/shop/post">
  <Text>공고 관리로 이동</Text>
</Link>
```

핵심 차이:

- `Link`
  - 선언형
  - "이 요소는 이 경로로 이동한다"를 JSX에서 바로 표현
- `Pressable + router.push(...)`
  - 명령형
  - 눌렀을 때 어떤 함수를 실행할지 직접 제어

즉 실무 감각으로는:

- 단순 링크성 이동 = `Link`
- 버튼, 카드, 커스텀 인터랙션 = `Pressable + router.push(...)`

## 스타일 차이

웹 React:

```tsx
<div style={{ display: 'flex', gap: 8 }} />
```

RN:

```tsx
<View style={styles.row} />
```

```ts
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
});
```

핵심 차이:

- CSS 클래스 없음
- 대부분 JS 객체 스타일
- 기본 display 개념도 웹이랑 다름
- 레이아웃은 flex 중심

웹처럼 스타일 방식이 여러 개 있나:

- 웹 React는
  - CSS 파일
  - CSS Module
  - styled-components
  - Emotion
  - Tailwind
  - inline style

  등 선택지가 아주 많습니다.

- RN도 생각보다 한 가지 방식만 있는 것은 아닙니다.

자주 보는 방식:

- `style={{ ... }}`
  - 웹 inline style 비슷
- `StyleSheet.create(...)`
  - RN 기본 스타일 방식
- styled-components for React Native
  - RN용 styled-components
- NativeWind
  - RN에서 Tailwind 비슷하게 쓰는 방식

지금 프로젝트에서 쓰는

```tsx
style={styles.row}
```

이 방식은 보통:

- `StyleSheet.create(...)`로 스타일 객체를 만들고
- 그 안의 key를 꺼내서 `style` prop에 넣는

RN 기본 스타일 방식입니다.

예:

```ts
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
});
```

```tsx
<View style={styles.row} />
```

왜 많이 쓰나:

- RN 기본 방식이라 의존성이 없음
- 스타일 이름을 모아서 관리하기 쉬움
- 컴포넌트가 길어질 때 inline 객체보다 읽기 쉬움

즉:

- 웹은 스타일 선택지가 더 많고
- RN도 여러 방식이 있지만
- 가장 기본은 `StyleSheet.create(...) + style={styles.xxx}`

라고 보면 됩니다.

## 자주 헷갈리는 포인트

### 1. 텍스트는 꼭 `Text`

RN에서는 문자열을 직접 `View` 안에 넣는 방식이 웹보다 제한적입니다.

### 2. 클릭은 대부분 `Pressable`

웹처럼 `button`, `a`, `div`가 나뉘는 감각보다,
RN은 클릭 가능한 래퍼를 별도로 감싸는 경우가 많습니다.

### 3. 입력 이벤트 이름이 다름

- 웹: `onChange`
- RN: `onChangeText`

### 4. 긴 화면은 `ScrollView`를 직접 써야 함

웹 페이지처럼 자동으로 다 스크롤된다고 생각하면 헷갈릴 수 있습니다.

## 이 프로젝트 기준으로 자주 보는 예시

- `View`: 카드, 섹션, 상태 요약 박스
- `Text`: 제목, 상태 배지 텍스트, 설명
- `Pressable`: 공고 카드 클릭, 수정 버튼, 필터 칩
- `TextInput`: 공고 등록 폼
- `ScrollView`: 공고 등록 화면, 공고 관리 화면
- `SafeAreaView`: 대부분의 전체 화면 래퍼

## 아주 짧게 요약

- `View` = `div` 비슷한 레이아웃 박스
- `Text` = 텍스트 전용 태그
- `Pressable` = `button` 비슷한 인터랙션 래퍼
- `TextInput` = `input`/`textarea`
- `ScrollView` = 스크롤 영역
- `Image` = `img`
- `FlatList` = 긴 리스트 최적화 렌더링
- `SafeAreaView` = 모바일 안전 영역 wrapper

이 문서를 기준으로 보고, 이후 step md에서 새 RN 컴포넌트가 나오면 같은 방식으로 계속 연결해서 이해하면 됩니다.
