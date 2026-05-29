# Backend 19. 상담 요약 카운트와 고객 fallback 정리

이번 단계에서는 새 API를 크게 추가하기보다, 목록 화면이 더 제품처럼 보이도록 요약 숫자와 fallback 데이터를 정리했습니다.

## 이번에 바꾼 것

- 파트너 상담 목록의 `진행 중 상담` 카운트는 이제 `종료`를 제외한 건수만 보여줍니다.
- 파트너 상담 목록에 `종료됨` 요약 카드도 추가했습니다.
- 고객 상담 목록에도 `현재 상담`, `결제 대기` 요약 카드를 추가했습니다.
- 고객 mock fallback 목록은 이제 `closed` 상태를 제외한 상담만 보여주도록 정리했습니다.

## 왜 이렇게 했는지

기본 기능은 돌아가더라도, 요약 숫자가 상태 의미와 어긋나면 화면 신뢰도가 떨어집니다.

예를 들면 종료된 상담까지 `진행 중 상담` 숫자에 같이 들어가면, 필터와 카드 수는 맞는데 요약만 어색해집니다.

또 고객 fallback 목록에 종료 상담까지 그대로 섞여 있으면, 실제 고객이 보는 느낌보다 더 혼란스럽게 보일 수 있습니다.

## 바뀐 파일

- `src/data/consultations.ts`
- `src/app/partner/index.tsx`
- `src/app/chat/index.tsx`

## 핵심 로직

파트너 목록은 종료된 상담을 따로 세고, 진행 중 상담 수에서는 제외합니다.

```ts
const activeConsultationCount =
  consultationItems.filter((item) => item.statusTone !== 'closed').length;
```

고객 mock fallback은 종료 상담을 뺀 목록을 씁니다.

```ts
export function getMockCustomerConsultations() {
  return mockPartnerConsultations.filter((item) => item.statusTone !== 'closed');
}
```

## React 개발자 기준으로 보면

이번 단계는 새로운 상태나 API보다, 파생값 계산을 화면 의미에 맞게 다듬은 작업입니다.

웹 React 기준으로 보면 `raw list.length`를 그대로 쓰지 않고, 실제 제품 정의에 맞는 `derived metrics`를 따로 계산한 셈입니다.

이런 정리는 작은 수정이지만 대시보드 느낌을 확실히 좋아지게 만듭니다.

## 확인한 것

- `.\node_modules\.bin\tsc.cmd --noEmit`
- `backend\.\mvnw.cmd test`

둘 다 통과했습니다.

## 다음 단계

이제 남은 건 점점 “핵심 기능 추가”보다 “끝단 마감”에 가까워졌습니다.

다음 우선순위는 이 순서가 좋습니다.

1. 핵심 동선 수동 점검
2. 목록/채팅에서 보이는 예외 메시지와 fallback 문구 정리
3. 이미지 메시지 실제 저장 여부 결정
4. 최종적으로 빠진 구멍만 메우기
