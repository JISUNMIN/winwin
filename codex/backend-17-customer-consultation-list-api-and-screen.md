# Backend 17. 고객 상담 목록 API와 화면 연결

이번 단계에서는 고객 쪽에도 최소 상담 목록 흐름을 붙였습니다.

이제 고객은 홈에서 `내 상담`으로 들어가서, 진행 중인 상담 목록을 보고 각 채팅으로 바로 이동할 수 있습니다.

## 이번에 바꾼 것

- 백엔드에 고객 상담 목록 API `GET /api/customer/consultations`를 추가했습니다.
- `ConsultationRepository`에 고객 기준 정렬 조회 메서드를 추가했습니다.
- `ConsultationService`에 고객 상담 목록 조회 로직을 추가했습니다.
- 프론트 `src/api/consultations.ts`에 고객 상담 목록 API 함수를 추가했습니다.
- 새 고객 상담 목록 화면 `src/app/chat/index.tsx`를 추가했습니다.
- 홈 상단 고객 역할 빠른 버튼에 `내 상담` 진입을 추가했습니다.

## 왜 이렇게 했는지

이전까지는 고객이:

- 공고 상세에서 채팅으로 들어가고
- 특정 상담 상세는 볼 수 있었지만
- 자기 상담들을 한 번에 보는 목록 화면은 없는 상태였습니다.

기본 기능 기준으로는 고객도 최소한:

- 내 상담 목록 보기
- 상담 하나 열기
- 예약 상태 이어서 보기

정도는 가능해야 전체 플로우가 자연스럽습니다.

## 바뀐 파일

- `backend/src/main/java/com/winwin/backend/consultation/ConsultationRepository.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationService.java`
- `backend/src/main/java/com/winwin/backend/consultation/CustomerConsultationController.java`
- `src/api/consultations.ts`
- `src/app/chat/index.tsx`
- `src/app/(tabs)/index.tsx`

## 핵심 로직

고객 기준 상담 목록은 `updatedAt` 내림차순으로 가져옵니다.

```java
return consultationRepository.findByCustomerIdOrderByUpdatedAtDesc(authenticatedUser.userId())
    .stream()
    .map(this::toResponse)
    .toList();
```

프론트에서는 같은 `ConsultationResponse -> PartnerConsultation` 매핑을 재사용해서 고객 목록 화면도 빠르게 붙였습니다.

```ts
const response = await getCustomerConsultations(accessToken);
setConsultations(response.map(mapConsultationResponseToPartnerConsultation));
```

고객 홈 진입 버튼은 `내 상담`으로 바로 `/chat` 목록으로 이동합니다.

```ts
router.push('/chat' as never);
```

## React 개발자 기준으로 보면

이번 단계는 새 도메인 모델을 만들기보다, 이미 있는 상담 응답 모델을 목록 화면 하나 더 붙이는 방향으로 재사용한 작업입니다.

웹 React 기준으로 보면 `partner dashboard list`를 축소 복제해서 `customer dashboard list`를 기본형으로 하나 더 만든 셈입니다.

즉 “새 아키텍처”보다 “기본 제품 동선 닫기”에 집중한 단계입니다.

## Express/Next API 개발자 기준으로 보면

이번 단계는 기존 `GET /customer/consultations/:postId` 단건 조회에 컬렉션 endpoint를 추가한 것입니다.

REST 관점에서 보면, 이제 customer consultation resource가:

- collection: `GET /api/customer/consultations`
- item: `GET /api/customer/consultations/{postId}`

둘 다 있는 기본형이 됐습니다.

## 확인한 것

- `.\node_modules\.bin\tsc.cmd --noEmit`
- `backend\.\mvnw.cmd test`

둘 다 통과했습니다.

## 다음 단계

기본 기능 완성 기준으로 남은 우선순위는 대략 이 순서입니다.

1. 고객/파트너 목록 상태 표현 마지막 정리
2. 채팅 이미지 메시지의 실제 서버 저장 여부 결정
3. 전체 핵심 동선 수동 점검
4. 빠진 예외 처리만 메우기
