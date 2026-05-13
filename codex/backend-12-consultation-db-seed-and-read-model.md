# Backend 12. 상담 DB 시드와 읽기 모델 전환

이번 단계에서는 지난 단계의 `seed 응답 직접 반환` 방식에서 한 걸음 더 나아가, 상담 API가 실제 DB 엔티티와 리포지토리를 읽도록 바꿨습니다.

즉 이제 파트너 상담 목록/상세 API는 더 이상 서비스 안에서 하드코딩된 배열을 조립하지 않고, `consultation / consultation_message` 테이블에 들어간 데이터를 읽어서 응답합니다.

## 이번에 바꾼 것

- 상담 상태 톤, 예약 상태, 메시지 타입, 발신자 역할 enum을 추가했습니다.
- `Consultation`, `ConsultationMessage` 엔티티를 만들었습니다.
- 메시지 안의 희망 일정 옵션과 예약 선택 정보도 DB에 저장할 수 있게 embeddable 모델을 추가했습니다.
- `ConsultationRepository`, `ConsultationMessageRepository`를 추가했습니다.
- `ConsultationService`가 이제 하드코딩 응답 대신 JPA 조회 결과를 DTO로 매핑합니다.
- 앱 시작 시 개발용 사용자/공고/상담/메시지를 넣는 `DevelopmentDataInitializer`를 추가했습니다.

## 왜 이렇게 했는지

이전 단계의 상담 API는 프론트 입장에서는 “서버에서 온 데이터”처럼 보였지만, 실제로는 백엔드 서비스 안에 mock 배열이 들어 있는 상태였습니다.

그 상태도 프론트 연동을 시작하기에는 충분했지만, 다음 단계인:

- 상담 상태 변경
- 메시지 추가
- 희망 일정 저장
- 예약 요청/결제 완료 반영

같은 쓰기 작업으로 넘어가려면 결국 DB에 저장되는 모델이 먼저 있어야 합니다.

그래서 이번 단계에서는 읽기 API의 데이터 원천을 먼저 진짜 엔티티 기반으로 바꿨습니다.

## 바뀐 파일

- `backend/src/main/java/com/winwin/backend/consultation/Consultation.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationMessage.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationRepository.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationMessageRepository.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationStatusTone.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationBookingStatus.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationSenderRole.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationMessageType.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationScheduleOption.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationBookingSelection.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationService.java`
- `backend/src/main/java/com/winwin/backend/config/DevelopmentDataInitializer.java`

## 핵심 로직

상담 본문과 메시지를 분리해서 저장합니다.

```java
public class Consultation {
  private MatchingPost post;
  private UserAccount customer;
  private ConsultationBookingStatus bookingStatus;
  private ConsultationBookingSelection selectedBooking;
}
```

메시지는 상담에 속하고, 일정 옵션이나 예약 선택 정보를 메시지별로 가질 수 있습니다.

```java
public class ConsultationMessage {
  private Consultation consultation;
  private ConsultationMessageType type;
  private List<ConsultationScheduleOption> desiredScheduleOptions;
  private ConsultationBookingSelection bookingData;
}
```

서비스는 이제 리포지토리 조회 결과를 DTO로 바꿔서 응답합니다.

```java
return consultationRepository.findByPostOwnerIdOrderByUpdatedAtDesc(authenticatedUser.userId())
    .stream()
    .map(this::toResponse)
    .toList();
```

## React 개발자 기준으로 보면

이번 단계는 프론트에서 보던 mock 상태를 백엔드 쪽에서도 “진짜 데이터 모델”로 승격한 작업입니다.

웹 React 기준으로 보면, API가 더 이상 `const mock = [...]`를 그대로 리턴하는 수준이 아니라 `DB row -> DTO -> JSON` 흐름을 타기 시작한 셈입니다.

이렇게 되면 다음부터는 프론트가 같은 컴포넌트를 유지한 채, 실제 저장된 상담 상태를 읽고 갱신하는 방향으로 넘어갈 수 있습니다.

## Express/Next API 개발자 기준으로 보면

이 단계는 `route handler 안 mock 배열`에서 `ORM model + repository query`로 넘어간 전환점입니다.

즉 `GET /partner/consultations`와 `GET /partner/consultations/:postId`의 계약은 유지하면서, 내부 구현만 `seed service`에서 `DB read model`로 바뀐 것입니다.

또 `DevelopmentDataInitializer`는 Next/Express 쪽으로 비유하면 개발환경에서 샘플 fixture를 자동 삽입하는 bootstrap script 역할에 가깝습니다.

## 확인한 것

- `.\node_modules\.bin\tsc.cmd --noEmit`
- `backend\.\mvnw.cmd test`

둘 다 통과했습니다.

## 다음 단계

이제 남은 큰 작업은 읽기가 아니라 쓰기입니다.

다음 우선순위는 이 순서가 자연스럽습니다.

1. 고객/파트너 메시지 전송 API 만들기
2. 희망 일정 전송과 예약 요청 메시지 저장 API 만들기
3. 상담 상태와 결제 완료 상태를 DB에 반영하는 API 만들기
4. 고객용 상담 목록/상세 API도 별도로 열기
