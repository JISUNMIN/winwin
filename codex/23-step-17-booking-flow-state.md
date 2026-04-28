# 23. Step 17 예약 상태 모델 분리

## 목표

예약 진행 상태를 메시지 배열에서 유추하지 않고, 별도 상태 모델로 관리하도록 바꿉니다.

이전에는:

- 희망 일정 개수
- 예약 요청 진행 여부
- 다음 액션 문구

를 모두 `messages` 배열에서 계산했습니다.

이번에는 예약 흐름용 상태를 따로 두고, 샵 요약 카드와 안내 문구가 그 상태를 직접 보도록 정리했습니다.

## 수정한 파일

```text
src/components/winwin/ChatScreen.tsx
src/components/winwin/ShopChatStatusCard.tsx
```

## 추가한 상태 구조

`ChatScreen` 안에 아래 상태를 추가했습니다.

```ts
type BookingFlowStatus =
  | 'idle'
  | 'reviewing-schedules'
  | 'booking-request-sent'
  | 'payment-completed';
```

그리고 실제 상태값은:

```ts
type BookingFlowState = {
  status: BookingFlowStatus;
  desiredScheduleCount: number;
  selectedBooking: BookingData | null;
};
```

형태로 관리합니다.

## 상태가 바뀌는 시점

- 고객이 희망 일정을 보내면: `reviewing-schedules`
- 샵이 일정 하나를 골라 예약 요청을 보내면: `booking-request-sent`
- 고객이 결제를 완료하면: `payment-completed`

## 바뀐 점

이제 샵 상담 요약 카드의 예약 상태는 단순 `진행중 / 대기`가 아니라:

- `대기`
- `검토중`
- `결제대기`
- `확정`

처럼 더 명확하게 표시됩니다.

또한 다음 액션 문구도 현재 상태에 맞춰 다르게 바뀝니다.

## 왜 이 구조가 좋은지

메시지 배열은 채팅 UI를 그리기 위한 데이터입니다.

예약 상태는 채팅 내용과 연결은 되지만, 본질적으로는 별도 비즈니스 상태에 가깝습니다.

이번처럼 분리해두면 나중에:

- 예약 상태 배지 추가
- 상담 리스트에서 상태별 필터
- 서버 응답 기반 상태 동기화

같은 작업이 훨씬 쉬워집니다.

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

- 샵 화면 전용 헤더 버튼 추가
- 예약 상태를 상단 헤더나 리스트 화면에도 노출
- mock 메시지와 예약 상태 초기값을 역할별로 더 현실적으로 분리
