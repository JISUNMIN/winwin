# 15. Step 9 희망 일정과 예약 확정 요청

## 목표

고객 관점 채팅 화면에서 희망 일정을 여러 개 보내고, 샵이 그중 하나로 예약 확정 요청을 보내는 흐름을 만듭니다.

## 만든 파일

```text
src/components/winwin/BookingPicker.tsx
src/components/winwin/DesiredScheduleCard.tsx
src/components/winwin/BookingRequestCard.tsx
```

## 수정한 파일

```text
src/app/chat/[id].tsx
```

## 왜 컴포넌트로 나눴는지

채팅 화면 안에 날짜 선택 UI와 예약 요청 카드 UI를 모두 넣으면 파일이 너무 길어집니다.

React 웹에서 `CalendarPicker`, `BookingRequestCard`를 컴포넌트로 분리하듯이 RN에서도 같은 방식으로 나눴습니다.

```text
ChatScreen
  ├─ BookingPicker
  ├─ DesiredScheduleCard
  └─ BookingRequestCard
```

## BookingPicker 역할

`BookingPicker`는 하단에서 올라오는 날짜/시간 선택 UI입니다.

처음에는 날짜 1개와 시간 1개만 고를 수 있었지만, 지금은 여러 날짜/시간 조합을 선택할 수 있습니다.

사용한 RN 컴포넌트:

```text
Modal      -> 화면 위에 뜨는 팝업/바텀시트
Pressable  -> 버튼
ScrollView -> 날짜/시간 목록 스크롤
View       -> 레이아웃 박스
Text       -> 텍스트
```

입력으로 받는 props:

```ts
visible
availableDates
onClose
onConfirm
```

## DesiredScheduleCard 역할

`DesiredScheduleCard`는 고객이 선택한 희망 일정들을 보여주는 카드입니다.

고객이 입력창의 캘린더 버튼을 눌러 여러 날짜/시간을 선택하면 이 카드가 오른쪽에 뜹니다.

고객 관점 채팅 규칙:

```text
고객이 보낸 것 -> 오른쪽
샵이 보낸 것 -> 왼쪽
```

## BookingRequestCard 역할

`BookingRequestCard`는 샵이 고객에게 보내는 예약 확정 요청 카드입니다.

고객이 보낸 희망 일정 중 하나를 샵이 확인한 뒤, 예약 확정과 보증금 결제를 요청하는 카드입니다.

표시하는 정보:

- 예약 날짜
- 예약 시간
- 보증금
- 노쇼 안내 문구
- 예약 확정 및 결제 버튼

## 채팅 메시지 타입 확장

기존에는 채팅 메시지가 모두 텍스트였습니다.

이번에는 메시지 타입을 추가했습니다.

```ts
type Message = {
  id: string;
  sender: 'user' | 'shop';
  type: 'text' | 'desired-schedule' | 'booking-request';
  content: string;
  timestamp: Date;
  bookingData?: BookingData;
  desiredScheduleOptions?: DesiredScheduleOption[];
};
```

이렇게 하면 채팅 목록에서 메시지 종류에 따라 다른 UI를 렌더링할 수 있습니다.

```text
text             -> 일반 말풍선
desired-schedule -> 고객 희망 일정 카드
booking-request  -> 샵 예약 확정 요청 카드
```

## 현재 동작 흐름

```text
1. 채팅 화면 진입
2. 입력창 왼쪽 캘린더 버튼 클릭
3. 날짜 선택
4. 시간 여러 개 선택
5. 다른 날짜로 이동해서 시간 추가 선택 가능
6. 희망 일정 보내기 클릭
7. 고객 희망 일정 카드가 오른쪽에 추가
8. 샵 확인 메시지가 왼쪽에 추가
9. 샵 예약 확정 요청 카드가 왼쪽에 추가
10. 예약 확정 및 결제하기 클릭
11. 사용자 확정 메시지 추가
```

현재 mock 흐름에서는 고객이 보낸 여러 희망 일정 중 첫 번째 일정을 샵이 선택한 것으로 처리합니다.

실제 앱에서는 샵 사장님 화면에서 여러 후보 중 하나를 직접 선택하도록 바꾸는 것이 좋습니다.

```text
고객 -> 희망 일정 여러 개 전송
샵 -> 가능한 일정 하나 선택
고객 -> 예약 확정 및 결제
```

## 이번 단계에서 아직 하지 않은 것

실제 결제 API 연동은 아직 없습니다.

보증금 결제 모달 UI는 다음 Step인 `16-step-10-payment-modal.md`에서 추가했습니다.

샵이 고객의 여러 희망 일정 중 하나를 직접 선택하는 관리자 화면도 아직 없습니다.

## 나중에 role 기반으로 바꿀 점

현재 채팅은 고객 앱 관점만 기준으로 만들었습니다.

그래서 정렬 규칙이 단순합니다.

```text
sender: 'user' -> 오른쪽
sender: 'shop' -> 왼쪽
```

하지만 실제 앱에서 고객 화면과 샵 사장님 화면을 모두 만들면 같은 메시지도 보는 사람에 따라 방향이 달라져야 합니다.

예시:

```text
고객이 보낸 메시지
고객 화면에서는 오른쪽
샵 화면에서는 왼쪽
```

나중에는 아래처럼 현재 보는 사람의 역할을 기준으로 정렬하는 구조가 필요합니다.

```ts
type Role = 'customer' | 'shopOwner';

const isMine = message.senderRole === currentViewerRole;
```

이 작업은 로그인, 계정 역할, 샵 관리자 화면을 만들 때 같이 리팩토링하는 것이 좋습니다.

## 검증

아래 명령으로 TypeScript 검사를 했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```
