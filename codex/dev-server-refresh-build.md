# 개발 중 저장, 새로고침, 재시작, 빌드 차이

## 핵심 정리

개발 중에 localhost로 보는 화면은 보통 `빌드`를 다시 하는 것이 아닙니다.

대부분은 아래 흐름입니다.

```text
코드 저장
-> 개발 서버가 변경 감지
-> 브라우저/Expo Go 화면에 반영
```

빌드는 나중에 배포용 결과물을 만들 때 쓰는 말에 가깝습니다.

## 일반 코드 수정

아래 같은 수정은 보통 저장만 하면 바로 반영됩니다.

```text
Text 문구 수정
StyleSheet 수정
컴포넌트 내부 로직 수정
버튼 onPress 수정
```

이럴 때는 개발 서버를 다시 켤 필요가 거의 없습니다.

## 브라우저 새로고침이 필요한 경우

웹으로 볼 때 새 라우트가 바로 안 잡히거나 화면이 꼬여 보이면 브라우저 새로고침을 먼저 해봅니다.

예시:

```text
src/app/chat/[id].tsx 새로 추가
상세 화면에서 /chat/1로 이동
버튼은 눌렀는데 화면이 안 바뀌는 것처럼 보임
브라우저 새로고침 후 정상 동작
```

이번 채팅 화면 문제가 이 경우였습니다.

## 개발 서버 재시작이 필요한 경우

라우터 구조를 크게 바꿨다면 개발 서버를 다시 켜는 편이 안전합니다.

예시:

```text
src/app/_layout.tsx 변경
src/app/(tabs) 폴더 추가
src/app/index.tsx 위치 이동
src/app/matching/[id].tsx 같은 새 화면 추가
```

이럴 때는 실행 중인 Expo 터미널에서 `Ctrl+C`로 끄고 다시 시작합니다.

```powershell
npx expo start
```

## 캐시까지 지우고 재시작하는 경우

라우터나 Metro 캐시가 꼬인 느낌이면 `-c` 옵션을 붙입니다.

```powershell
npx expo start -c
```

`-c`는 캐시를 지우고 다시 시작한다는 뜻입니다.

처음에는 조금 느릴 수 있지만, 예전 라우터 정보나 번들 캐시 때문에 생기는 문제를 줄일 수 있습니다.

## 진짜 빌드가 필요한 경우

배포용 파일을 만들 때가 진짜 빌드입니다.

웹 배포용 예시:

```powershell
npx expo export --platform web
```

지금처럼 localhost에서 개발하고 확인하는 단계에서는 보통 이 명령을 쓰지 않습니다.

## 판단 순서

화면이 이상할 때는 아래 순서로 보면 됩니다.

```text
1. 코드 저장
2. 브라우저 새로고침
3. Expo 터미널에서 r
4. Ctrl+C 후 npx expo start
5. 그래도 이상하면 Ctrl+C 후 npx expo start -c
```

## React 웹과 비교

React 웹 개발과 거의 비슷합니다.

```text
npm run dev 다시 켜기
-> 개발 서버 재시작

npm run build
-> 배포용 빌드
```

Expo에서는:

```text
npx expo start
-> 개발 서버 시작

npx expo start -c
-> 캐시를 지우고 개발 서버 시작

npx expo export --platform web
-> 웹 배포용 빌드
```
