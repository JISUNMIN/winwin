# 21. Step 15 샵 채팅 상태 요약

## 목표

샵 전용 채팅 화면에서만 보이는 상태 요약 영역을 추가합니다.

이전에는 샵 라우트가 생겨도 고객용과 거의 같은 화면이었습니다.

이번에는 샵이 상담을 볼 때 바로 확인하면 좋은 정보를 위쪽에 따로 보여주도록 만들었습니다.

## 만든 파일

```text
src/components/winwin/ShopChatStatusCard.tsx
```

## 수정한 파일

```text
src/components/winwin/ChatScreen.tsx
```

## 추가한 내용

샵 보기일 때만 채팅 상단에 `ShopChatStatusCard`를 렌더링합니다.

이 카드에는 아래 정보가 들어갑니다.

- 고객 메시지 개수
- 고객이 보낸 희망 일정 개수
- 예약 요청 진행 상태
- 지금 샵이 해야 할 다음 액션 안내

## 상태 계산 방식

현재는 mock 채팅 메시지 목록에서 간단히 계산합니다.

예를 들면:

```text
customerMessageCount
desiredScheduleCount
hasPendingBookingRequest
```

같은 값을 `messages` 배열에서 바로 뽑아 사용합니다.

## 다음 액션 문구

상태에 따라 안내 문구도 달라지게 했습니다.

예시:

- 아직 예약 요청이 없으면: 희망 일정 중 가능한 시간을 고르라는 안내
- 예약 요청이 있으면: 고객 결제 완료 여부를 확인하라는 안내
- 희망 일정도 없으면: 먼저 상담을 진행하라는 안내

## 왜 이 단계가 중요한지

지금은 아직 mock 데이터지만, 샵 화면에서는 단순 채팅창보다:

- 지금 예약이 어느 단계인지
- 샵이 다음에 무엇을 해야 하는지

를 바로 보여주는 것이 더 중요합니다.

이번 요약 카드는 나중에 실제 예약 상태값이나 관리자 기능을 붙일 때 좋은 시작점이 됩니다.

## React 개발자 기준으로 보면

- `ShopChatStatusCard`는 웹에서 보면 작은 요약 위젯 컴포넌트 하나를 추가한 것과 비슷합니다.
- RN의 `View`는 웹의 `div`처럼 레이아웃 박스 역할을 합니다.
- RN의 `Text`는 문자열을 감싸는 전용 태그라서, 웹처럼 `div` 안에 텍스트를 바로 쓰지 않습니다.

## 핵심 로직

- `ChatScreen`이 가지고 있는 `messages` 배열을 기반으로 요약 카드에 필요한 값을 계산합니다.
- 즉, 채팅 UI를 그리는 데이터에서 `고객 메시지 수`, `희망 일정 수`, `예약 요청 존재 여부`를 파생 상태처럼 뽑아 씁니다.
- 웹 React로 보면 렌더링 중에 `derived state`를 계산해서 하위 컴포넌트 props로 넘기는 구조에 가깝습니다.

## 핵심 코드

```ts
const customerMessageCount = messages.filter((message) => message.sender === 'customer').length;
const desiredScheduleCount = messages.filter(
  (message) => message.type === 'desired-schedule',
).length;
```

위처럼 `messages` 배열에서 필요한 숫자를 바로 계산해서 상태 요약 카드에 넘깁니다.

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

- 샵 전용 헤더 액션 버튼 추가
- 예약 상태를 메시지 배열이 아니라 별도 상태값으로 분리
- 샵 홈 또는 상담 리스트에서 요약 정보와 함께 채팅 진입 연결
