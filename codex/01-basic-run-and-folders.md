# 01. 기본 앱 실행과 폴더 구조

## 목표

아직 디자인을 적용하지 않고, Expo 기본 예제 앱이 정상적으로 뜨는지 먼저 확인합니다.

## 1단계: 기본 앱 띄우기

VS Code 터미널에서 프로젝트 폴더로 이동합니다.

```powershell
cd C:\Users\zentropy\Music\WinWin\WinWin
```

그 다음 Expo 개발 서버를 실행합니다.

```powershell
npm.cmd start
```

PowerShell에서는 `npm` 실행이 막힐 수 있어서 Windows에서는 `npm.cmd`를 쓰는 편이 안전합니다.

## 실행 후 보이는 것

명령이 잘 실행되면 터미널에 Expo 화면이 뜨고, 보통 이런 선택지가 보입니다.

```text
› Press w │ open web
› Press a │ open Android
› Scan the QR code with Expo Go
```

처음에는 브라우저 또는 실제 휴대폰 중 하나로 확인하면 됩니다.

## 브라우저로 보기

Expo 터미널에서 아래 키를 누릅니다.

```text
w
```

그러면 웹 브라우저에서 기본 Expo 예제 앱이 열립니다.

## 폰으로 보기

휴대폰에 `Expo Go` 앱을 설치한 뒤, 터미널에 뜬 QR 코드를 스캔합니다.

컴퓨터와 휴대폰이 같은 Wi-Fi에 있으면 보통 바로 연결됩니다.

## 지금 프로젝트에서 중요한 폴더와 파일

### `src/app`

가장 중요한 폴더입니다.

이 프로젝트는 `Expo Router`를 사용하기 때문에, `src/app` 안의 파일들이 화면과 라우팅 역할을 합니다. React 웹에서 `pages` 또는 router 설정을 보는 감각과 비슷합니다.

### `src/app/index.tsx`

앱의 첫 화면입니다.

React 웹으로 비유하면 `HomePage` 같은 역할입니다. 앱을 처음 켰을 때 보이는 화면입니다.

### `src/app/_layout.tsx`

앱 전체의 레이아웃과 네비게이션 뼈대입니다.

현재 기본 예제에서는 탭 구조를 이 파일에서 연결합니다.

### `src/app/explore.tsx`

기본 예제에 들어있는 두 번째 탭 화면입니다.

나중에 WinWin 앱으로 바꿀 때는 이 화면을 유지할지, 삭제할지, 다른 화면으로 바꿀지 결정하면 됩니다.

### `src/components`

재사용 컴포넌트 폴더입니다.

React 웹에서 `components/Button.tsx`, `components/Header.tsx` 같은 파일을 두는 것과 비슷합니다.

### `assets`

이미지, 아이콘, 스플래시 이미지 같은 정적 파일을 두는 폴더입니다.

앱 아이콘이나 로딩 화면 이미지도 여기에서 관리됩니다.

### `app.json`

Expo 앱 설정 파일입니다.

앱 이름, 아이콘, 스플래시 화면, Android/iOS 설정 같은 앱 메타 정보가 들어갑니다.

### `package.json`

설치된 라이브러리와 실행 명령어가 들어있는 파일입니다.

현재 중요한 명령어는 아래와 같습니다.

```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "expo lint"
}
```

## React 개발자 관점에서 기억할 점

- React Native는 `div`, `span`, `button` 대신 `View`, `Text`, `Pressable` 같은 컴포넌트를 씁니다.
- CSS 파일 대신 보통 `StyleSheet` 또는 RN 스타일 객체를 씁니다.
- 웹의 URL 라우팅 감각은 Expo Router에서 파일 기반 라우팅으로 이어집니다.
- 브라우저 DOM이 없기 때문에 웹 전용 라이브러리는 그대로 사용할 수 없는 경우가 많습니다.

## 다음 단계

1. 기본 예제 앱이 브라우저 또는 휴대폰에서 뜨는지 확인합니다.
2. `src/app/index.tsx`를 읽으면서 RN 컴포넌트 구조를 이해합니다.
3. 그 다음 WinWin 디자인 코드를 참고해서 하나씩 RN 화면으로 옮깁니다.
