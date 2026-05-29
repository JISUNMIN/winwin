# Backend 16. 파트너 상담 종료와 unread 초기화

이번 단계에서는 상담 플로우의 마지막 기본 관리 액션을 붙였습니다.

이제 파트너가 상담 상세를 열면 미확인 수가 기본적으로 0으로 정리되고, 헤더의 `상담 종료` 버튼도 실제 API를 통해 상담 상태를 종료로 바꿉니다.

## 이번에 바꾼 것

- 백엔드에 파트너 상담 종료 API `POST /api/partner/consultations/{postId}/close`를 추가했습니다.
- 파트너가 상담 상세 `GET /api/partner/consultations/{postId}`를 열면 unread count를 0으로 정리하도록 바꿨습니다.
- 프론트 `src/api/consultations.ts`에 상담 종료 API 함수를 추가했습니다.
- `ChatScreen`의 파트너 헤더 `상담 종료` 버튼을 실제 API 호출로 연결했습니다.

## 왜 이렇게 했는지

예약 플로우가 거의 다 붙어도, 상담 목록의 unread와 종료 상태가 계속 mock이면 파트너 관리 화면이 어색합니다.

기본 기능 기준으로는:

- 고객이 보낸 새 메시지가 unread로 쌓이고
- 파트너가 채팅을 열면 unread가 사라지고
- 필요하면 상담을 종료 상태로 바꿀 수 있어야

관리 흐름이 자연스럽습니다.

## 바뀐 파일

- `backend/src/main/java/com/winwin/backend/consultation/PartnerConsultationController.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationService.java`
- `src/api/consultations.ts`
- `src/components/winwin/ChatScreen.tsx`

## 핵심 로직

파트너가 상세를 열면 unread를 읽음 처리합니다.

```java
markConsultationAsReadForPartner(consultation);
return toResponse(consultation);
```

상담 종료는 별도 메시지를 추가하지 않고, 상담 요약 상태를 종료 중심으로 바꿉니다.

```java
consultation.setStatusLabel("종료");
consultation.setUnreadCount(0);
consultation.setSummary("상담이 종료되었어요. 필요하면 다시 메시지를 이어갈 수 있습니다.");
```

프론트는 헤더 버튼에서 종료 확인 후 서버 응답으로 다시 상태를 맞춥니다.

```ts
closePartnerConsultation(accessToken, Number(id)).then((response) => {
  setConsultation(mapConsultationResponseToPartnerConsultation(response));
});
```

## React 개발자 기준으로 보면

이번 단계는 화면 액션 하나를 더 서버 상태 중심으로 바꾼 작업입니다.

웹 React 기준으로 보면 `open detail -> mark as read`와 `status transition button -> refetch-like replace`를 붙인 셈입니다.

즉 목록 배지와 상세 상태가 같은 서버 truth를 보게 만드는 정리 단계입니다.

## Express/Next API 개발자 기준으로 보면

이 단계는 상담 aggregate에 관리용 transition endpoint를 하나 더 붙인 것입니다.

또 상세 조회 시 unread를 읽음 처리하는 것은, 채팅 도메인에서 흔히 쓰는 `read side effect on open` 패턴의 아주 기본형입니다.

정교한 read-receipt 테이블까지는 아니지만, 기본 제품 동작으로는 충분한 1차 구현입니다.

## 확인한 것

- `.\node_modules\.bin\tsc.cmd --noEmit`
- `backend\.\mvnw.cmd test`

둘 다 통과했습니다.

## 다음 단계

기본 기능 완성 기준으로 남은 우선순위는 대략 이 순서입니다.

1. 고객용 상담 목록 API
2. 파트너/고객 상태 표현 마지막 정리
3. 필요하면 이미지 메시지 업로드를 실제 API로 옮기기
4. 전체 흐름 수동 점검 후 빈 구멍 메우기
