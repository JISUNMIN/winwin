# Backend 15. 예약 요청과 결제 완료 API 연결

이번 단계에서는 상담 예약 플로우의 남은 기본 액션 두 개를 실제 API로 연결했습니다.

이제 API 세션에서는:

- 파트너가 고객 희망 일정 중 하나를 골라 예약 요청을 보내고
- 고객이 보증금 결제를 완료해 예약을 확정하는 흐름이

프론트 mock 상태가 아니라 서버 상담 데이터에 저장됩니다.

## 이번에 바꾼 것

- 백엔드에 파트너 예약 요청 API `POST /api/partner/consultations/{postId}/booking-request`를 추가했습니다.
- 백엔드에 고객 결제 완료 API `POST /api/customer/consultations/{postId}/payment-complete`를 추가했습니다.
- 예약 요청 request DTO `SendBookingRequest`를 추가했습니다.
- `ConsultationService`에 예약 요청 메시지 저장과 결제 완료 메시지 저장 로직을 추가했습니다.
- 예약 요청 시 상담 상태가 `booking-request-sent`로, 결제 완료 시 `payment-completed`로 바뀌도록 연결했습니다.
- 프론트 `src/api/consultations.ts`에 예약 요청/결제 완료 API 함수를 추가했습니다.
- `ChatScreen`은 API 세션이면 파트너 일정 선택과 고객 결제 완료를 서버 응답 기준으로 다시 렌더링합니다.
- 파트너 화면에서는 이제 `desired-schedule` 메시지 카드 자체에서 바로 일정 선택이 가능해서, 별도 mock 전용 리뷰 카드 메시지에 덜 의존하게 됐습니다.

## 왜 이렇게 했는지

희망 일정까지만 서버에 저장되고, 그 다음 예약 요청과 결제 완료가 다시 프론트 임시 상태로 돌아가면 실제 예약 플로우가 끝까지 이어지지 않습니다.

그 상태에서는:

- 파트너가 골라 보낸 예약 요청이 새로고침 후 사라지고
- 고객 결제 완료가 상담 목록 상태에 반영되지 않으며
- 상담 요약 상태가 `검토중`에 머물러 다음 액션 판단이 어려워집니다.

그래서 이번 단계에서는 기본적인 예약 상태 전환을 끝까지 서버에 맡기도록 정리했습니다.

## 바뀐 파일

- `backend/src/main/java/com/winwin/backend/consultation/PartnerConsultationController.java`
- `backend/src/main/java/com/winwin/backend/consultation/CustomerConsultationController.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationService.java`
- `backend/src/main/java/com/winwin/backend/consultation/dto/SendBookingRequest.java`
- `src/api/consultations.ts`
- `src/components/winwin/ChatScreen.tsx`

## 핵심 로직

파트너가 예약 요청을 보내면 선택한 날짜/시간/보증금을 `selectedBooking`과 `BOOKING_REQUEST` 메시지로 같이 저장합니다.

```java
ConsultationBookingSelection selection =
    new ConsultationBookingSelection(request.date(), request.time().trim(), request.deposit());

consultation.setBookingStatus(ConsultationBookingStatus.BOOKING_REQUEST_SENT);
consultation.setSelectedBooking(selection);
```

고객이 결제 완료를 누르면 현재 상담의 `selectedBooking`을 기준으로 확정 메시지를 추가하고 상태를 `PAYMENT_COMPLETED`로 바꿉니다.

```java
message.setContent(
    selection.getDate() + " " + selection.getTime() + " 예약을 확정했어요. 보증금 결제도 완료했습니다.");
consultation.setBookingStatus(ConsultationBookingStatus.PAYMENT_COMPLETED);
```

프론트는 API 세션에서 선택/결제 후 로컬 배열을 직접 조작하지 않고, 서버 응답을 다시 상담 상태로 매핑합니다.

```ts
sendPartnerBookingRequest(accessToken, Number(id), bookingData).then((response) => {
  setConsultation(mapConsultationResponseToPartnerConsultation(response));
});
```

## React 개발자 기준으로 보면

이번 단계는 채팅의 카드형 액션도 이제 거의 전부 `mutation -> server truth -> replace state` 패턴으로 맞춘 단계입니다.

웹 React 기준으로 보면 optimistic card append보다, 서버가 최종적으로 계산한 예약 상태를 다시 받아 그리는 안전한 구조를 먼저 완성한 셈입니다.

이렇게 해두면 나중에 unread 규칙이나 상태 라벨만 바꿔도 화면 로직을 크게 흔들지 않고 고칠 수 있습니다.

## Express/Next API 개발자 기준으로 보면

이번 단계는 상담 도메인에 `state transition endpoint`를 붙인 것입니다.

즉 단순히 메시지 row만 추가하는 것이 아니라:

- 예약 요청 시 `reviewing -> payment`
- 결제 완료 시 `payment -> confirmed`

같은 상담 aggregate 상태도 함께 변경하는 구조로 넘어갔습니다.

채팅 메시지 스트림과 상담 요약 상태를 한 transaction 안에서 같이 바꾼다는 점이 핵심입니다.

## 확인한 것

- `.\node_modules\.bin\tsc.cmd --noEmit`
- `backend\.\mvnw.cmd test`

둘 다 통과했습니다.

## 다음 단계

이제 상담/예약 플로우의 기본 골격은 꽤 갖춰졌습니다.

다음 우선순위는 이 순서가 좋습니다.

1. 파트너 상담 종료/상태 변경 API
2. unreadCount 규칙과 목록 상태 표현 정교화
3. 이미지 메시지나 기타 부가 액션은 마지막에 붙이기
4. 필요하면 고객용 상담 목록 API 추가
