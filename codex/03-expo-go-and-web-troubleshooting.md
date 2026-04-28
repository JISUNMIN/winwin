# 03. Expo Go와 Web 실행 문제

## 증상

Expo Go에서 아래 에러가 보였습니다.

```text
Project is incompatible with this version of Expo Go

This project requires a newer version of Expo Go.

How to fix this error:
Download the latest version of Expo Go from the Play Store.
```

웹에서도 `localhost:8081`이 오래 걸리거나 잘 열리지 않는 상황이 있었습니다.

## 원인 1: Expo Go 앱 버전이 오래됨

현재 프로젝트의 `package.json`에는 아래 버전이 들어있습니다.

```json
{
  "expo": "~55.0.17"
}
```

즉 이 프로젝트는 Expo SDK 55 프로젝트입니다.

휴대폰에 설치된 Expo Go 앱이 SDK 55를 지원하지 않는 오래된 버전이면 연결할 수 없습니다.

## Expo Go 해결 방법

휴대폰에서 아래 순서로 진행합니다.

1. Play Store에서 `Expo Go`를 최신 버전으로 업데이트합니다.
2. 업데이트 버튼이 없으면 Expo Go를 삭제한 뒤 다시 설치합니다.
3. 컴퓨터와 휴대폰이 같은 Wi-Fi에 있는지 확인합니다.
4. Expo 터미널의 QR 코드를 다시 스캔합니다.

## 원인 2: Web은 Expo Go와 별개로 실행해야 함

웹 실행은 Expo Go 앱과 관계가 없습니다.

웹으로 볼 때는 브라우저 주소창에 `localhost:8081`을 직접 치기보다, Expo 터미널에서 `w`를 누르거나 web 전용 명령을 쓰는 편이 좋습니다.

## Web 전용으로 실행하는 명령

먼저 실행 중인 Expo 터미널에서 `Ctrl + C`로 종료합니다.

그 다음 프로젝트 폴더에서 아래 명령을 실행합니다.

```powershell
cd C:\Users\zentropy\Music\WinWin\WinWin
npx.cmd expo start --web --clear --localhost
```

또는 npm script를 사용할 수도 있습니다.

```powershell
npm.cmd run web -- --clear --localhost
```

## 포인트

- Expo Go 문제와 Web 문제는 별개입니다.
- Expo Go 에러는 보통 휴대폰 앱 업데이트로 해결합니다.
- Web은 `w` 키 또는 `expo start --web`으로 여는 것이 안전합니다.
- 계속 꼬이면 실행 중인 Expo 서버를 `Ctrl + C`로 끄고 `--clear`를 붙여 다시 시작합니다.

## 추가 메모

이전에 Codex가 백그라운드 실행 확인용으로 만든 `.expo-start.log`, `.expo-start.err` 파일은 로컬 로그라서 Git에 올릴 필요가 없습니다.

그래서 `.gitignore`에 아래 패턴을 추가했습니다.

```gitignore
.expo-start.*
```
