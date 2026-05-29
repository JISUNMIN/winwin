# Backend 14. 고객 희망 일정 저장 API 연결

이번 단계에서는 고객이 채팅에서 보내는 `희망 일정 카드`를 실제 서버 DB에 저장하도록 연결했습니다.

이제 API 세션에서는 고객이 날짜/시간 옵션 여러 개를 보내면, 그 카드가 프론트 mock 상태에만 잠깐 추가되는 것이 아니라 `consultation_messages`와 상담 요약 상태에 반영됩니다.

## 이번에 바꾼 것

- 백엔드에 고객 희망 일정 전송 API `POST /api/customer/consultations/{postId}/desired-schedules`를 추가했습니다.
- 희망 일정 전송 request DTO `SendDesiredSchedulesRequest`와 일정 항목 DTO `ConsultationScheduleOptionRequest`를 추가했습니다.
- `ConsultationService`에 고객 희망 일정 메시지 저장 로직을 추가했습니다.
- 희망 일정 전송 시 상담 상태가 `reviewing-schedules`로 바뀌고, `desiredScheduleCount`와 요약 문구도 함께 갱신되게 했습니다.
- 프론트 `src/api/consultations.ts`에 고객 희망 일정 전송 함수를 추가했습니다.
- `ChatScreen`은 API 세션에서 캘린더 선택 완료 후 로컬 mock append 대신 서버 응답으로 상담 상태를 다시 맞춥니다.

## 왜 이렇게 했는지

텍스트 메시지만 서버에 저장되고, 희망 일정 카드는 아직 프론트 임시 상태로만 남아 있으면 상담 흐름이 다시 어긋납니다.

그 상태에서는:

- 앱을 다시 열면 방금 보낸 희망 일정이 사라지고
- 파트너가 목록/상세에서 실제 검토중 상태를 보지 못하며
- 다음 단계인 예약 요청 API도 자연스럽게 이어지지 않습니다.

그래서 텍스트 다음 단계로 가장 중요한 구조화 메시지인 `desired-schedule`부터 실제 저장 흐름으로 옮겼습니다.

## 바뀐 파일

- `backend/src/main/java/com/winwin/backend/consultation/CustomerConsultationController.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationService.java`
- `backend/src/main/java/com/winwin/backend/consultation/dto/ConsultationScheduleOptionRequest.java`
- `backend/src/main/java/com/winwin/backend/consultation/dto/SendDesiredSchedulesRequest.java`
- `src/api/consultations.ts`
- `src/components/winwin/ChatScreen.tsx`

## 핵심 로직

고객이 보낸 여러 일정 옵션은 request DTO에서 받아 embeddable 일정 옵션 리스트로 바꿔 저장합니다.

```java
List<ConsultationScheduleOption> options =
    request.options().stream().map(this::toScheduleOption).toList();
```

메시지는 `DESIRED_SCHEDULE` 타입으로 저장하고, 상담 상단 상태도 같이 갱신합니다.

```java
message.setType(ConsultationMessageType.DESIRED_SCHEDULE);
message.setDesiredScheduleOptions(options);

consultation.setBookingStatus(ConsultationBookingStatus.REVIEWING_SCHEDULES);
consultation.setDesiredScheduleCount(options.size());
```

프론트는 API 세션이면 로컬 메시지 배열에 직접 카드 추가를 하지 않고, 서버 응답으로 상담 상태를 통째로 다시 반영합니다.

```ts
sendCustomerDesiredSchedules(accessToken, Number(id), options).then((response) => {
  setConsultation(mapConsultationResponseToPartnerConsultation(response));
});
```

## React 개발자 기준으로 보면

이번 단계는 텍스트 입력에 이어, 카드형 구조화 입력도 `local state push`에서 `server mutation -> state replace`로 옮긴 작업입니다.

웹 React 기준으로 보면 폼 제출 결과를 `setMessages([...])`로 직접 조립하는 대신, 서버가 계산한 최신 상담 상태를 다시 렌더링하는 패턴을 늘린 셈입니다.

이렇게 하면 나중에 파트너 예약 요청 카드나 결제 완료 상태도 같은 방식으로 확장하기 쉬워집니다.

## Express/Next API 개발자 기준으로 보면

이번 단계는 단순 text mutation 다음으로, 배열 payload를 받는 구조화 mutation route를 붙인 것입니다.

`desired schedule`은 별도 테이블을 새로 만들기보다 message row 아래 `@ElementCollection`으로 저장하고 있어서, 메시지 타입만 바꾸면 같은 consultation stream 안에서 계속 읽을 수 있습니다.

즉 `consultation_messages`를 이벤트 스트림처럼 유지하면서, 텍스트와 카드형 메시지를 함께 저장하기 시작한 단계라고 보면 됩니다.

## 확인한 것

- `.\node_modules\.bin\tsc.cmd --noEmit`
- `backend\.\mvnw.cmd test`

둘 다 통과했습니다.

## 다음 단계

다음으로 가장 자연스러운 건 파트너 쪽 구조화 쓰기입니다.

우선순위는 이 순서가 좋습니다.

1. 파트너 예약 요청 메시지 저장 API
2. 결제 완료/상담 상태 변경 API
3. unreadCount와 상태 라벨 규칙 정교화
4. 필요하면 파트너 일정 검토용 보조 메시지 저장 여부 정리
