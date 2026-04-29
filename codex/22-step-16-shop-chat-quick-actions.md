# 22. Step 16 샵 채팅 빠른 이동 액션

## 목표

샵 전용 채팅 화면에서 중요한 메시지 위치로 바로 이동할 수 있는 상단 액션 버튼을 추가합니다.

샵은 상담 중에 희망 일정 카드나 예약 요청 카드를 자주 다시 확인해야 하므로, 위에서 바로 점프할 수 있으면 훨씬 편합니다.

## 만든 파일

```text
src/components/winwin/ShopChatActionBar.tsx
```

## 수정한 파일

```text
src/components/winwin/ChatScreen.tsx
```

## 추가한 액션

샵 보기에서만 아래 버튼이 보입니다.

- `희망 일정으로 이동`
- `예약 요청으로 이동`

해당 메시지가 아직 없으면 버튼은 비활성화됩니다.

## 동작 방식

각 메시지 행의 `onLayout`에서 세로 위치를 저장해두고, 버튼을 누르면 그 위치로 `ScrollView`를 이동합니다.

즉 흐름은 아래와 같습니다.

```text
메시지 렌더링
-> 각 메시지 y 위치 저장
-> 상단 액션 버튼 클릭
-> 저장된 y 위치로 스크롤 이동
```

## 왜 이 단계가 중요한지

지금은 mock 채팅이 길지 않지만, 실제 상담이 길어지면 샵은:

- 고객이 보낸 희망 일정
- 이미 보낸 예약 요청

을 자주 다시 확인하게 됩니다.

빠른 이동 버튼은 이런 반복 확인을 줄여주는 작은 관리자 UX 개선입니다.

## React 개발자 기준으로 보면

- 상단 액션 바는 웹의 `sticky` 도구 버튼이나 "섹션으로 점프" 버튼과 비슷한 역할입니다.
- RN의 `Pressable`은 웹의 `button`에 가장 가깝고, 눌림 인터랙션을 처리하는 기본 컴포넌트입니다.
- RN의 `ScrollView`는 웹의 스크롤 가능한 `div`와 비슷하지만, DOM API 대신 ref 메서드로 스크롤을 제어합니다.

## 핵심 로직

- 각 메시지 카드가 렌더링될 때 `onLayout`으로 자기 자신의 y 좌표를 부모 쪽에 알려줍니다.
- 상단 버튼은 그 저장된 좌표를 읽어서 `ScrollView.scrollTo(...)`를 호출합니다.
- 웹 React에서 `ref + scrollTo`로 특정 섹션으로 이동시키는 패턴과 비슷합니다.

## 핵심 코드

```ts
onLayout={(event) => {
  desiredScheduleY.current = event.nativeEvent.layout.y;
}}

scrollViewRef.current?.scrollTo({ y: desiredScheduleY.current, animated: true });
```

메시지 위치를 저장해뒀다가, 버튼 클릭 시 그 좌표로 바로 스크롤합니다.

## 검증

아래 명령으로 TypeScript 검사를 했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```

## 다음에 이어서 할 만한 것

- 예약 상태를 별도 상태 모델로 분리
- 샵 화면 전용 헤더 버튼 추가
- 상담 리스트 화면에서 바로 특정 상태 메시지로 진입 연결
