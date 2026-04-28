# 13. Step 7 지원하기 버튼 상세 이동 문제 해결

## 문제

Home 화면의 매칭 카드에서 `지원하기` 버튼을 눌러도 상세 화면이 열리지 않았습니다.

상세 화면 파일 자체는 이미 있었습니다.

```text
src/app/matching/[id].tsx
```

Home 화면에서도 아래처럼 이동 코드를 연결해 둔 상태였습니다.

```tsx
router.push({
  pathname: '/matching/[id]',
  params: { id: matching.id },
})
```

## 원인

원인은 버튼이 아니라 라우터 구조였습니다.

기존 구조는 앱 최상단 `_layout.tsx`에서 바로 탭 네비게이션을 렌더링하는 구조였습니다.

이러면 앱이 `index`, `explore` 같은 탭 화면 중심으로만 움직이고, 탭 밖에 있는 상세 화면을 자연스럽게 열기 어렵습니다.

React 웹으로 비유하면:

```text
탭 라우터 안에 Home, Explore만 등록되어 있는데
갑자기 /matching/1 페이지를 열려고 한 상황
```

## 바꾼 구조

앱 최상단은 `Stack`으로 바꿨습니다.

```text
src/app/_layout.tsx
```

그리고 탭 화면은 `(tabs)` 폴더 안으로 옮겼습니다.

```text
src/app/(tabs)/_layout.tsx
src/app/(tabs)/index.tsx
src/app/(tabs)/explore.tsx
src/app/matching/[id].tsx
```

Expo Router에서 괄호 폴더인 `(tabs)`는 URL에 보이지 않는 그룹입니다.

즉 파일은 아래에 있어도:

```text
src/app/(tabs)/index.tsx
```

실제 주소는 여전히:

```text
/
```

입니다.

## 지금 라우터 그림

```text
Root Stack
  ├─ (tabs)
  │   ├─ index
  │   └─ explore
  └─ matching/[id]
```

이제 Home 탭에서 `지원하기`를 누르면 같은 Root Stack 안의 상세 화면으로 이동할 수 있습니다.

## 수정한 파일

```text
src/app/_layout.tsx
src/app/(tabs)/_layout.tsx
src/app/(tabs)/index.tsx
src/app/(tabs)/explore.tsx
src/components/app-tabs.web.tsx
```

웹 전용 탭 파일에서는 Home 탭 이름을 실제 라우트 이름인 `index`로 맞췄습니다.

## 다시 실행할 때 중요한 점

라우트 파일 위치를 바꿨기 때문에 Expo가 예전 라우트 캐시를 들고 있을 수 있습니다.

실행 중인 터미널에서 `Ctrl+C`로 끈 뒤 아래 명령으로 다시 켜는 것이 좋습니다.

```powershell
npx expo start -c
```

`-c`는 Metro/Expo Router 캐시를 지우고 새 라우트 구조를 다시 읽게 합니다.

## 검증

아래 명령으로 TypeScript 검사를 했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```
