# 08. Step 2 데이터 모델 옮기기

## 목표

WinWin 디자인 원본에 있던 `Matching` 타입과 mock 데이터를 RN 프로젝트에서 사용할 수 있게 분리합니다.

이번 단계에서는 화면 UI를 바꾸지 않습니다.

## 왜 데이터부터 옮기나?

화면을 만들기 전에 데이터 구조를 먼저 정리하면 다음 작업이 쉬워집니다.

React 개발자 관점에서는 API response type이나 mock fixture를 먼저 잡아두는 것과 같습니다.

Home 화면, 상세 화면, 채팅 화면은 모두 같은 매칭 데이터를 기준으로 연결될 예정입니다.

## 만든 파일

```text
src/data/matchings.ts
```

이 파일 안에 아래 내용을 넣었습니다.

- `Category`
- `MatchingCategory`
- `Matching`
- `mockMatchings`

## 원본과 달라진 점

디자인 원본에서는 데이터가 아래 파일 안에 같이 있었습니다.

```text
design-reference/src/app/App.tsx
```

RN 프로젝트에서는 데이터를 별도 파일로 분리했습니다.

```text
src/data/matchings.ts
```

이렇게 하면 화면 컴포넌트가 데이터 정의까지 들고 있지 않아도 됩니다.

## `Category`와 `MatchingCategory`

필터에는 `all`이 필요합니다.

```ts
export type Category = 'all' | 'hair' | 'nail' | 'eyelash' | 'food' | 'accommodation';
```

하지만 실제 매칭 공고의 카테고리는 `all`일 수 없습니다.

그래서 실제 매칭 데이터에는 아래 타입을 사용했습니다.

```ts
export type MatchingCategory = Exclude<Category, 'all'>;
```

의미:

```text
Category에서 'all'만 빼라
```

결과적으로 `MatchingCategory`는 아래와 같습니다.

```ts
'hair' | 'nail' | 'eyelash' | 'food' | 'accommodation'
```

## 이름을 `mockMatchings`로 바꾼 이유

원본 이름은 `mockData`였습니다.

RN 프로젝트에서는 조금 더 의미가 분명하게 보이도록 `mockMatchings`라고 이름을 바꿨습니다.

나중에 Home 화면에서 이렇게 사용할 수 있습니다.

```ts
import { mockMatchings } from '@/data/matchings';
```

## TypeScript 검사에서 생긴 일

처음 타입 검사를 실행했을 때 `design-reference/` 폴더까지 TypeScript가 검사하면서 에러가 많이 났습니다.

이유:

- `design-reference/`는 React 웹 코드입니다.
- RN 프로젝트에는 `react-router`, `lucide-react`, Radix UI 같은 웹 의존성이 설치되어 있지 않습니다.
- `.gitignore`에 들어간 폴더라도 TypeScript의 `include`에 걸리면 검사될 수 있습니다.

## 해결한 방법

`tsconfig.json`에 `exclude`를 추가했습니다.

```json
{
  "exclude": ["node_modules", "design-reference", "codex", "ios", "android"]
}
```

중요한 점:

```text
.gitignore는 Git이 무시할 파일을 정한다.
tsconfig exclude는 TypeScript가 검사하지 않을 파일을 정한다.
```

둘은 서로 다른 설정입니다.

## 검증

아래 명령으로 타입 검사를 실행했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```

## 다음 단계

다음에는 Home 화면의 가장 작은 버전을 만듭니다.

추천 작업:

1. `src/app/index.tsx`에서 기본 Expo 홈 화면 제거
2. `mockMatchings`를 import
3. `WinWin` 제목과 검색 입력 추가
4. 매칭 개수만 먼저 화면에 표시

이렇게 하면 RN 화면 수정 흐름을 작게 경험할 수 있습니다.
