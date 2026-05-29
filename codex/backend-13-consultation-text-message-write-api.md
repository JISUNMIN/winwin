# Backend 13. 상담 텍스트 메시지 쓰기 API 연결

이번 단계에서는 상담/채팅 영역의 첫 번째 실제 쓰기 API를 붙였습니다.

이제 API 세션에서 고객이나 파트너가 채팅 입력창으로 텍스트 메시지를 보내면, 그 메시지가 더 이상 프론트 mock 상태에만 추가되지 않고 서버 DB에 저장됩니다.

## 이번에 바꾼 것

- 백엔드에 고객 상담 조회 API `GET /api/customer/consultations/{postId}`를 추가했습니다.
- 백엔드에 고객 텍스트 메시지 전송 API `POST /api/customer/consultations/{postId}/messages`를 추가했습니다.
- 백엔드에 파트너 텍스트 메시지 전송 API `POST /api/partner/consultations/{postId}/messages`를 추가했습니다.
- 상담 메시지 전송 request DTO `SendConsultationMessageRequest`를 추가했습니다.
- 고객이 아직 상담을 시작하지 않은 공고에 첫 메시지를 보낼 때는 상담 레코드를 자동 생성하게 했습니다.
- 프론트 `src/api/consultations.ts`에 고객/파트너 조회 및 텍스트 전송 함수를 추가했습니다.
- `ChatScreen`은 API 세션이면 메시지 전송 후 로컬 mock append 대신 서버 응답으로 상담 상태 전체를 다시 반영합니다.

## 왜 이렇게 했는지

이전까지는 상담 읽기 API는 DB를 보게 됐지만, 텍스트 메시지를 보내는 순간 다시 프론트 임시 상태로만 돌아가는 상태였습니다.

그렇게 되면:

- 앱 재진입 시 방금 보낸 메시지가 사라지고
- 파트너/고객이 같은 상담을 봐도 서로 다른 상태를 볼 수 있으며
- 다음 단계인 예약 요청/희망 일정 저장도 연결하기 어려워집니다.

그래서 가장 기본 단위인 `plain text message`부터 서버 저장으로 옮겼습니다.

## 바뀐 파일

- `backend/src/main/java/com/winwin/backend/consultation/CustomerConsultationController.java`
- `backend/src/main/java/com/winwin/backend/consultation/PartnerConsultationController.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationRepository.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationService.java`
- `backend/src/main/java/com/winwin/backend/consultation/dto/SendConsultationMessageRequest.java`
- `src/api/consultations.ts`
- `src/components/winwin/ChatScreen.tsx`

## 핵심 로직

고객이 아직 상담이 없는 공고에 첫 메시지를 보내면 상담을 자동 생성합니다.

```java
consultationRepository
    .findByPostIdAndCustomerId(postId, authenticatedUser.userId())
    .orElseGet(() -> createConsultationForCustomer(postId, authenticatedUser));
```

메시지는 텍스트 타입으로 DB에 저장하고, 상담 요약과 업데이트 시각도 함께 갱신합니다.

```java
message.setType(ConsultationMessageType.TEXT);
message.setContent(content.trim());
consultationMessageRepository.save(message);

consultation.setSummary(content.trim());
consultation.setUpdatedAt(message.getCreatedAt());
```

프론트는 API 세션이면 로컬 배열에 push 하지 않고, 서버에서 돌아온 상담 응답으로 상태를 통째로 다시 맞춥니다.

```ts
request.then((response) => {
  setConsultation(mapConsultationResponseToPartnerConsultation(response));
  setInputMessage('');
});
```

## React 개발자 기준으로 보면

이번 단계는 `setMessages([...])` 중심 mock UI에서 `mutation -> refetch-like state replace` 구조로 넘어가는 첫 단계입니다.

웹 React 기준으로 보면 optimistic UI는 아직 하지 않고, 먼저 서버 성공 응답을 기준으로 채팅 스레드를 다시 맞추는 안전한 흐름을 넣은 셈입니다.

이렇게 해두면 나중에 희망 일정 카드나 예약 요청 카드도 같은 패턴으로 확장하기 쉽습니다.

## Express/Next API 개발자 기준으로 보면

이번 단계는 읽기 전용 상담 API에 `send message` mutation route를 붙인 것입니다.

또 고객 쪽은 상담이 아직 없을 수 있기 때문에, 첫 메시지 전송 시 consultation row를 자동 생성하는 `create-or-append` 패턴을 썼습니다.

이건 채팅 도메인 초기 진입에서 자주 쓰는 패턴이고, 이후에는 상담 시작 시점을 더 명시적으로 분리할 수도 있습니다.

## 확인한 것

- `.\node_modules\.bin\tsc.cmd --noEmit`
- `backend\.\mvnw.cmd test`

둘 다 통과했습니다.

## 다음 단계

다음으로 가장 자연스러운 건 텍스트 다음 단계인 구조화 메시지 저장입니다.

우선순위는 이 순서가 좋습니다.

1. 고객 희망 일정 전송 API
2. 파트너 예약 요청 메시지 저장 API
3. 결제 완료/상담 상태 변경 API
4. unreadCount와 상태 라벨을 더 실제 규칙에 맞게 정교화
