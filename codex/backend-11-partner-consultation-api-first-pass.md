# Backend 11. 파트너 상담 목록/채팅 API 1차 연결

이번 단계에서는 상담/채팅 영역을 한 번에 완성하려고 하지 않고, 먼저 `파트너가 읽는 상담 목록과 상담 상세`를 서버에서 내려주는 1차 API를 만들었습니다.

즉 아직 메시지 전송, 희망 일정 저장, 예약 상태 변경 같은 쓰기 API는 없지만, 파트너 홈과 파트너 채팅이 `mock 상담 데이터` 대신 `서버 응답`을 우선 읽기 시작한 단계입니다.

## 현재 API 진행률

- 전체 API 전환 기준으로 대략 `65~75%`
- `auth`는 `90%+`
- `post`는 `85~90%`
- `partner dashboard`는 `70~80%`
- `consultation/chat`은 기존 `20~30%` 수준에서, 이번 단계로 `읽기 전용 1차`가 시작됐습니다.

## 이번에 바꾼 것

- 백엔드에 `GET /api/partner/consultations`를 추가했습니다.
- 백엔드에 `GET /api/partner/consultations/{postId}`를 추가했습니다.
- 상담 응답 DTO에 고객 정보, 상태 요약, 예약 흐름, 메시지 배열을 담도록 만들었습니다.
- 현재 백엔드 상담 데이터는 DB 영속화 전 단계라 `seed 응답`으로 제공합니다.
- 프론트에 `src/api/consultations.ts`를 추가했습니다.
- 파트너 홈이 API 세션이면 상담 목록 API를 먼저 보도록 바꿨습니다.
- 파트너 채팅이 API 세션이면 상담 상세 API를 먼저 보도록 바꿨습니다.
- 진행률과 남은 작업도 `progress-and-next-steps.md`에 반영했습니다.

## 왜 이렇게 했는지

이전까지는 공고 정보는 많이 실제 API로 옮겼지만, 상담 목록과 채팅 메시지는 여전히 `mockPartnerConsultations`에 의존하고 있었습니다.

이 상태에서는:

- 파트너 홈의 상담 요약
- 파트너 채팅의 메시지 흐름
- 예약 진행 상태 배지

가 전부 프론트 고정 데이터에 묶여 있어서, 상담 도메인 API로 넘어갈 발판이 없었습니다.

그래서 이번 단계에서는 먼저 `읽기 API`를 열어, 파트너 화면들이 서버 응답 구조를 이해하도록 바꿨습니다.

## 바뀐 파일

- `backend/src/main/java/com/winwin/backend/consultation/PartnerConsultationController.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationService.java`
- `backend/src/main/java/com/winwin/backend/consultation/dto/*`
- `src/api/consultations.ts`
- `src/app/partner/index.tsx`
- `src/components/winwin/ChatScreen.tsx`
- `codex/progress-and-next-steps.md`

## 핵심 로직

파트너 상담 목록/상세는 역할 검사 후 seed 상담 응답을 내려줍니다.

```java
public List<ConsultationResponse> getPartnerConsultations(AuthenticatedUser authenticatedUser) {
  requirePartnerRole(authenticatedUser);
  return buildSeedConsultations();
}
```

프론트는 API 응답을 기존 UI가 이해하는 `PartnerConsultation` 형태로 매핑합니다.

```ts
export function mapConsultationResponseToPartnerConsultation(
  response: ConsultationResponse,
): PartnerConsultation {
  return {
    matchingId: String(response.postId),
    ...
  };
}
```

메시지 시간은 서버의 `createdAt`을 그대로 쓰지 않고, 기존 UI 흐름을 유지하기 위해 `minutesAgo`로 바꿔줍니다.

```ts
function toMinutesAgo(createdAt: string) {
  const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  return Math.max(1, diff);
}
```

## React 개발자 기준으로 보면

이번 단계는 하드코딩된 화면 상태를 `API DTO -> UI view model` 구조로 옮기는 작업입니다.

웹 React 기준으로 보면 `dashboard list query`와 `detail query`를 먼저 만들고, 아직 mutation은 연결하지 않은 상태와 비슷합니다.

또 중요한 점은 기존 UI 타입을 한 번에 갈아엎지 않고, API 응답을 중간에서 매핑해서 기존 컴포넌트를 최대한 그대로 유지했다는 점입니다.

## Express/Next API 개발자 기준으로 보면

이번 단계는 `consultation route`를 DB CRUD까지 다 만드는 대신, 먼저 계약 형태(contract)와 응답 구조를 고정하는 단계입니다.

즉 `GET /partner/consultations`, `GET /partner/consultations/:postId`를 열고, 프론트가 그 DTO를 실제로 소비하게 만든 것입니다.

이렇게 해두면 다음 단계에서 seed 데이터를 JPA 엔티티/리포지토리 기반으로 바꾸더라도, 프론트 쪽 변경 폭은 훨씬 줄어듭니다.

## 확인한 것

- `.\node_modules\.bin\tsc.cmd --noEmit`
- `backend\.\mvnw.cmd test`

둘 다 통과했습니다.

## 다음 단계

다음 큰 작업은 상담 데이터를 진짜 영속 모델로 바꾸는 것입니다.

우선순위는 이 순서가 자연스럽습니다.

1. 상담 엔티티/메시지 엔티티/JPA 저장 구조 만들기
2. 파트너 상담 목록/상세 seed 응답을 DB 조회로 교체하기
3. 희망 일정 전송, 예약 요청, 결제 완료 같은 채팅 액션을 쓰기 API로 연결하기
