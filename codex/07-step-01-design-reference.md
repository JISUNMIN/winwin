# 07. Step 1 디자인 참고 폴더 준비

## 목표

다운로드 폴더에 있던 WinWin 디자인 ZIP을 프로젝트 안에 참고용으로 풀어둡니다.

이 단계에서는 실제 RN 앱 코드를 수정하지 않습니다.

## 한 일

아래 ZIP 파일을 확인했습니다.

```text
C:\Users\zentropy\Downloads\WinWin Matching App Design.zip
```

그 다음 프로젝트 안에 아래 폴더로 압축을 풀었습니다.

```text
C:\Users\zentropy\Music\WinWin\WinWin\design-reference
```

## 왜 `design-reference`로 두나?

이 폴더는 실제 앱 코드가 아니라 참고용 원본입니다.

현재 ZIP 안의 코드는 React Native 코드가 아니라 React 웹 코드입니다.

따라서 그대로 복사해서 쓰기보다, 화면 구조와 디자인 의도를 참고하면서 RN 방식으로 다시 작성해야 합니다.

## Git 처리

`design-reference/`는 참고용 파일이라 Git에 올리지 않도록 `.gitignore`에 추가했습니다.

추가한 내용:

```gitignore
# Design reference export
design-reference/
```

Git 무시 여부도 확인했습니다.

```text
.gitignore:46:design-reference/ design-reference/src/app/pages/HomePage.tsx
```

## 확인된 핵심 파일

페이지 파일:

```text
design-reference/src/app/pages/HomePage.tsx
design-reference/src/app/pages/MatchingDetailPage.tsx
design-reference/src/app/pages/ChatPage.tsx
```

컴포넌트 파일:

```text
design-reference/src/app/components/CategoryFilter.tsx
design-reference/src/app/components/MatchingCard.tsx
design-reference/src/app/components/BookingRequestCard.tsx
design-reference/src/app/components/CalendarPicker.tsx
design-reference/src/app/components/PaymentModal.tsx
```

## 다음 단계

다음에는 디자인 원본의 `mockData`와 `Matching` 타입을 RN 프로젝트의 데이터 파일로 옮깁니다.

추천 위치:

```text
src/data/matchings.ts
```

이 작업을 먼저 하면 UI를 만들기 전에 앱에서 사용할 데이터 구조가 준비됩니다.
