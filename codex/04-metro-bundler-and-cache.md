# 04. Metro Bundler와 캐시

## Metro Bundler란?

Metro Bundler는 React Native 앱의 JavaScript/TypeScript 코드를 읽어서, 앱이 실행할 수 있는 하나의 번들로 만들어주는 도구입니다.

React 웹 개발자 관점에서 보면 Vite, Webpack, Turbopack 같은 역할과 비슷합니다.

React 웹:

```text
tsx/js/css/assets -> Vite/Webpack -> browser가 읽는 bundle
```

React Native:

```text
tsx/js/assets -> Metro Bundler -> Expo Go 또는 네이티브 앱이 읽는 JS bundle
```

## 왜 필요한가?

React Native는 브라우저에서 실행되는 앱이 아닙니다.

그래서 `import`, TypeScript, JSX, 이미지 경로 같은 코드를 그대로 실행하지 않고, Metro가 먼저 처리합니다.

Metro가 하는 일:

- `.tsx` 파일의 JSX/TypeScript 변환
- `import` 관계 추적
- 이미지와 폰트 같은 asset 연결
- 앱이 실행할 JavaScript bundle 생성
- 개발 중 코드 변경 감지와 Fast Refresh 지원

## Expo에서 Metro의 역할

Expo 앱을 실행하면 내부적으로 Metro Bundler가 같이 뜹니다.

예:

```powershell
npx expo start
```

이 명령을 실행하면 Expo CLI가 개발 서버를 열고, Metro가 앱 코드를 번들링합니다.

휴대폰 Expo Go나 브라우저는 이 개발 서버에서 번들을 받아 실행합니다.

## `-c` 옵션이란?

아래 명령의 `-c`는 `--clear`와 같은 뜻입니다.

```powershell
npx expo start -c
```

의미:

```powershell
npx expo start --clear
```

Metro가 이전에 저장해둔 캐시를 지우고 처음부터 다시 번들링합니다.

## 캐시는 왜 꼬이나?

개발 중에는 Metro가 속도를 위해 변환 결과를 캐시합니다.

하지만 아래 상황에서는 캐시가 실제 코드 상태와 어긋날 수 있습니다.

- 패키지를 새로 설치하거나 삭제한 경우
- `node_modules`가 바뀐 경우
- Expo/RN 버전이 바뀐 경우
- 실행 중인 Metro 서버가 비정상 종료된 경우
- 파일 경로나 alias 설정이 바뀐 경우

이럴 때 예전 캐시를 계속 쓰면 앱이 안 뜨거나 이상한 에러가 남을 수 있습니다.

## 중요한 표현 정리

`-c`는 꼬인 dependency를 무시하는 옵션은 아닙니다.

정확히는 Metro의 캐시를 지우고 새로 번들링하는 옵션입니다.

진짜 dependency 문제가 있으면 `-c`만으로 해결되지 않을 수 있습니다. 그럴 때는 `npm install`, 버전 확인, `node_modules` 재설치 같은 작업이 필요할 수 있습니다.

## 언제 써야 하나?

아래 상황이면 `-c`를 먼저 시도해볼 만합니다.

- 어제는 되던 앱이 오늘 갑자기 안 뜰 때
- 파일을 고쳤는데 화면이 이상하게 예전 상태처럼 보일 때
- 패키지를 설치한 뒤 이상한 module 에러가 날 때
- Expo 서버가 중간에 멈췄거나 강제 종료된 뒤부터 이상할 때

## 이번 프로젝트에서 배운 점

기본 실행이 잘 안 되다가 아래 명령으로 실행에 성공했습니다.

```powershell
npx expo start -c
```

따라서 이번 문제는 코드 문제라기보다 Metro/Expo 개발 서버 캐시가 꼬인 상태였을 가능성이 큽니다.
