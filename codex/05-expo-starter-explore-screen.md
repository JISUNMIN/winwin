# 05. Expo Starter Explore 화면 설명

## 이 화면은 무엇인가?

지금 보이는 `Explore` 화면은 Expo 기본 템플릿에 포함된 안내 화면입니다.

WinWin 앱의 실제 기능 화면이 아니라, Expo/RN 프로젝트에 들어있는 예제 기능을 보여주는 학습용 화면입니다.

화면 파일은 아래에 있습니다.

```text
src/app/explore.tsx
```

## 상단의 `Explore`

현재 탭의 제목입니다.

이 프로젝트에는 기본적으로 두 개의 탭이 있습니다.

- `Home`
- `Explore`

아래 탭바에서 `Explore`를 누르면 이 화면이 열립니다.

## `This starter app includes example code...`

이 문장은 Expo 기본 앱이 학습용 예제 코드를 포함하고 있다는 뜻입니다.

즉 이 화면은 사용자를 위한 실제 서비스 화면이 아니라 개발자를 위한 예제 설명 화면입니다.

## `File-based routing`

Expo Router의 핵심 개념입니다.

파일을 만들면 그 파일이 화면/라우트가 됩니다.

현재 기본 앱에는 두 화면이 있습니다.

```text
src/app/index.tsx
src/app/explore.tsx
```

React 웹 개발자 관점에서는 Next.js의 `app` 또는 `pages` 라우팅과 비슷하게 생각하면 됩니다.

## `src/app/_layout.tsx`

`_layout.tsx`는 화면들을 감싸는 공통 레이아웃 파일입니다.

현재 프로젝트에서는 이 파일이 탭 네비게이션을 연결합니다.

즉 아래 구조입니다.

```text
src/app/_layout.tsx
  └─ tab navigator
      ├─ src/app/index.tsx
      └─ src/app/explore.tsx
```

## `Android, iOS, and web support`

Expo 프로젝트는 같은 React Native 코드로 Android, iOS, Web에서 실행할 수 있다는 설명입니다.

실행 방식:

- Android 폰: Expo Go로 QR 스캔
- iOS 폰: Expo Go로 QR 스캔
- Web: Expo 터미널에서 `w` 입력

## `Images`

React Native에서 정적 이미지를 다루는 방법에 대한 설명입니다.

`@2x`, `@3x`는 해상도별 이미지 파일입니다.

예:

```text
icon.png
icon@2x.png
icon@3x.png
```

기기 화면 밀도에 따라 React Native가 더 적절한 이미지를 선택합니다.

웹에서 retina 대응 이미지를 준비하는 것과 비슷한 개념입니다.

## `Light and dark mode components`

라이트 모드와 다크 모드를 지원하는 예제입니다.

React Native에서는 아래 훅으로 현재 시스템 테마를 확인할 수 있습니다.

```ts
useColorScheme()
```

예를 들어 사용자의 폰이 다크 모드이면 어두운 배경색을 쓰고, 라이트 모드이면 밝은 배경색을 쓰게 만들 수 있습니다.

## `Animations`

애니메이션 예제 설명입니다.

현재 기본 템플릿에는 `react-native-reanimated`를 사용한 접힘/펼침 애니메이션 예제가 들어 있습니다.

관련 파일:

```text
src/components/ui/collapsible.tsx
```

## `v55.0.17`

현재 Expo SDK 버전을 의미합니다.

프로젝트의 `package.json`에도 아래처럼 들어있습니다.

```json
{
  "expo": "~55.0.17"
}
```

## 하단 탭바

화면 아래에 보이는 탭바는 기본 템플릿의 네비게이션입니다.

현재 탭:

- `Home`
- `Explore`
- `Docs`

이 탭 구조는 아래 파일들에서 연결됩니다.

```text
src/app/_layout.tsx
src/components/app-tabs.tsx
```

## WinWin 앱에서는 어떻게 될까?

나중에 WinWin 디자인을 적용하면 이 기본 안내 화면은 유지하지 않을 가능성이 큽니다.

예상 변경:

- `Explore` 화면 제거 또는 다른 기능 화면으로 변경
- 탭 이름을 WinWin 앱에 맞게 변경
- `Home`을 매칭 리스트 화면으로 변경
- 필요하면 `Chat`, `Profile`, `Bookings` 같은 탭 추가

## 지금 단계에서의 의미

이 화면은 RN/Expo 구조를 배우기 위한 참고 예제입니다.

지금은 이 화면을 보면서 아래 개념을 이해하면 충분합니다.

- `src/app` 파일이 화면이 된다.
- `_layout.tsx`가 화면들을 감싼다.
- `app-tabs.tsx`가 탭 메뉴를 만든다.
- RN에서도 이미지, 다크모드, 애니메이션을 처리하는 방식이 있다.
