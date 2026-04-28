# 02. VS Code JSX 에러 정리

## 증상

`src/components/app-tabs.tsx` 같은 `.tsx` 파일에서 아래 에러가 보입니다.

```text
Cannot use JSX unless the '--jsx' flag is provided.ts(17004)
```

## 이 에러의 뜻

TypeScript가 JSX 문법을 해석하려면 `tsconfig.json`에 JSX 설정이 필요합니다.

React Native / Expo 프로젝트에서는 보통 Expo 기본 TypeScript 설정이 이 값을 제공합니다.

현재 프로젝트의 `tsconfig.json`은 아래 설정을 사용합니다.

```json
{
  "extends": "expo/tsconfig.base",
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

그리고 Expo의 기본 설정에는 아래 값이 들어있습니다.

```json
{
  "compilerOptions": {
    "jsx": "react-native"
  }
}
```

즉 설정 자체는 정상입니다.

## 확인한 것

아래 명령으로 TypeScript 컴파일 확인을 했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과는 에러 없이 통과했습니다.

따라서 이 문제는 코드 자체가 깨진 것이 아니라, VS Code가 현재 파일을 올바른 TypeScript 프로젝트로 인식하지 못해서 생긴 표시 문제일 가능성이 큽니다.

## 해결 순서

### 1. VS Code에서 프로젝트 루트 폴더 열기

VS Code에서 아래 폴더를 열어야 합니다.

```text
C:\Users\zentropy\Music\WinWin\WinWin
```

중요한 기준은 이 폴더 바로 아래에 `package.json`, `tsconfig.json`, `app.json`이 보여야 한다는 점입니다.

### 2. TypeScript 서버 재시작

VS Code에서 명령 팔레트를 엽니다.

```text
Ctrl + Shift + P
```

그 다음 아래 명령을 실행합니다.

```text
TypeScript: Restart TS Server
```

### 3. 그래도 남아있으면 VS Code 창 새로고침

명령 팔레트에서 아래 명령을 실행합니다.

```text
Developer: Reload Window
```

### 4. Workspace TypeScript 사용 확인

VS Code 오른쪽 아래의 TypeScript 버전을 눌러서 아래 옵션을 선택합니다.

```text
Use Workspace Version
```

프로젝트의 `node_modules` 안에 설치된 TypeScript를 쓰게 만드는 설정입니다.

## 기억할 점

이 에러가 보여도 `npx.cmd tsc --noEmit`이 통과하면 실제 프로젝트 설정은 정상일 가능성이 큽니다.

이 경우에는 코드를 먼저 고치기보다 VS Code의 TypeScript 서버 상태를 의심하는 것이 좋습니다.
