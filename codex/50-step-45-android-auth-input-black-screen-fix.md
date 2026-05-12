# 50. Step 45 Android 로그인 input 검정 화면 수정

## 목표

Android 앱에서 `/auth` 화면의 이메일이나 비밀번호 input을 누르면
키보드가 올라오는 순간 검정 화면처럼 보이는 문제가 있었습니다.

웹에서는 같은 화면이 정상인데 앱에서만 달랐기 때문에,
이번 단계에서는:

- Android 키보드 리사이즈 시 auth 레이아웃이 안정적으로 유지되게 만들고
- 앱 전용 splash overlay가 input 포커스 순간 다시 비쳐 보일 가능성도 제거하고
- 실제 에뮬레이터 재빌드로 반영 여부까지 확인

했습니다.

## 수정한 파일

```text
src/app/auth/index.tsx
src/components/animated-icon.tsx
```

## 원인

이번 문제는 Android에서만 있는 두 가지 조건이 겹칠 가능성이 컸습니다.

### 1. 키보드가 올라올 때 화면 높이가 다시 계산됨

Android는 키보드가 올라오면 현재 화면 높이를 다시 줄여서 layout을 잡습니다.

그런데 `/auth` 화면은 `SafeAreaView + ScrollView` 중심 구조였고,
`ScrollView`가 전체 높이와 배경을 충분히 고정하지 않아서
키보드 등장 순간 뒤쪽 검정 영역이 드러날 수 있었습니다.

### 2. 앱에서만 splash overlay가 전역으로 렌더링됨

`AnimatedSplashOverlay`는 앱에서는 absolute 전체화면 레이어로 렌더되고,
웹에서는 아예 `null`이었습니다.

즉 웹에서는 없는 레이어가 앱에만 있었고,
포커스나 리레이아웃 순간 이 레이어가 잠깐 다시 보이면
사용자 입장에서는 검정 화면처럼 느껴질 수 있었습니다.

## 바꾼 점

### 1. auth 화면을 Android 키보드 변화에 더 안전하게 변경

`src/app/auth/index.tsx`에:

- `KeyboardAvoidingView`
- `ScrollView style`
- `contentContainerStyle.flexGrow`
- 공통 배경색

을 넣었습니다.

이제 키보드가 올라와도 화면이 갑자기 줄어들면서
빈 검정 영역이 노출될 가능성을 줄였습니다.

### 2. Android에서는 splash overlay를 렌더하지 않게 변경

`src/components/animated-icon.tsx`에서
Android일 때는 `AnimatedSplashOverlay()`가 바로 `null`을 반환하게 바꿨습니다.

즉 앱 시작 연출용 전역 레이어가
로그인 input 포커스 시점에 다시 끼어들지 않게 정리했습니다.

## React 개발자 기준으로 보면

이번 수정은 웹 React에서:

- modal backdrop이나 fixed overlay가 의도치 않게 남아 있고
- mobile viewport 변화 때 scroll container 높이가 어긋나는 문제

를 같이 잡는 작업과 비슷합니다.

즉 느낌상:

- `100vh` 비슷한 레이아웃 불안정성 보정
- 모바일 키보드 등장 시 컨테이너 높이 안전화
- 전역 overlay가 화면 전환 후에도 남는 문제 제거

를 한 번에 정리한 단계입니다.

## 핵심 코드

```tsx
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  style={styles.keyboardArea}>
  <ScrollView
    style={styles.scrollView}
    contentContainerStyle={styles.content}
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode="on-drag">
```

키보드가 올라오는 동안 auth 화면 컨테이너가 더 안정적으로 유지되도록 했습니다.

```tsx
export function AnimatedSplashOverlay() {
  if (Platform.OS === 'android') {
    return null;
  }
```

Android에서 앱 전역 splash overlay를 끄도록 했습니다.

## 검증

타입 체크:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
```

결과:

```text
통과
```

앱 반영 확인:

```powershell
npm run android
```

결과:

```text
BUILD SUCCESSFUL
app-debug.apk 재설치
```

## 같이 기억할 것

이번 수정은 `TSX` 변경이라 원칙적으로는 항상 네이티브 재빌드가 필수는 아닙니다.

하지만 Android 앱에서 계속 예전 화면이 보이면:

- Metro 캐시가 남아 있거나
- 이미 떠 있는 dev server가 이전 번들을 계속 주고 있거나
- 디버그 앱이 새 번들을 다시 읽지 못한 상태

일 수 있습니다.

그래서 이런 류 문제는 필요하면:

```powershell
npm run start -- --clear
npm run android
```

순서로 다시 확인하는 것이 가장 안전합니다.
