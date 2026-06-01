# Backend 24. 회원가입 비밀번호 확인과 예약금 계좌이체 흐름 전환

이번 단계에서는 회원가입 UX를 보완하고, 기존 `보증금 결제` 흐름을 `예약금 계좌이체 -> 고객 입금 알림 -> 파트너 입금 확인 후 예약 확정` 구조로 바꿨습니다.

## 무엇을 바꿨는지

- 회원가입 화면에 `비밀번호 확인` 입력을 추가했고, 프론트에서 즉시 일치 여부를 검사합니다.
- 고객 예약 카드와 모달에서 `보증금` 대신 `예약금` 용어를 사용하도록 바꿨습니다.
- 고객은 샵 계좌 정보를 보고 직접 송금한 뒤 `입금했고 확인 요청할게요`를 누르는 흐름으로 바뀌었습니다.
- 파트너는 고객의 입금 알림 이후 `입금 확인 후 예약 확정` 버튼으로 최종 확정합니다.
- 예약 요청 응답에는 이제 `은행`, `계좌번호`, `예금주`가 함께 내려옵니다.

## 핵심 로직

- 프론트 `AuthScreen`은 회원가입 시 `password !== passwordConfirm`이면 API 호출 전에 바로 막습니다.
- 파트너 예약 요청 API는 여전히 `date`, `time`, `deposit`만 받지만, 서버에서 계좌 정보를 생성해 booking selection에 함께 저장합니다.
- 고객이 `/transfer-reported`를 호출하면 상담 상태는 `입금확인중`, booking status는 `transfer-reported`가 됩니다.
- 파트너가 `/confirm-transfer`를 호출하면 상담 상태는 `확정`, booking status는 `confirmed`가 됩니다.

## 핵심 코드

```ts
if (mode === 'signup' && password !== passwordConfirm) {
  setFieldErrors({ passwordConfirm: '비밀번호 확인이 일치하지 않습니다.' });
  return;
}
```

```java
consultation.setStatusLabel("입금확인중");
consultation.setBookingStatus(ConsultationBookingStatus.TRANSFER_REPORTED);
```

```java
consultation.setStatusLabel("확정");
consultation.setBookingStatus(ConsultationBookingStatus.CONFIRMED);
```

## 왜 이렇게 했는지

- 지금 프로젝트는 실제 PG 연동이 없기 때문에, MVP에서는 샵과 고객이 직접 송금하는 구조가 더 솔직하고 구현 비용도 낮습니다.
- 대신 앱 안에서는 `입금 알림`과 `입금 확인` 상태를 명확히 나눠서, 예약 확정 시점이 파트너 확인 이후가 되도록 했습니다.
- 또한 개발용 전환 UI는 이미 `ENABLE_DEV_ROLE_SWITCH`와 `__DEV__` 기준으로 운영 빌드에서 숨겨지게 유지됩니다.

## Express/Next API 개발자 기준으로 보면

- `/transfer-reported`와 `/confirm-transfer`는 checkout success webhook 대신 사람이 직접 상태를 한 단계씩 전이시키는 route handler에 가깝습니다.
- `ConsultationBookingSelection`에 계좌 정보를 넣은 것은 order/booking aggregate에 payment instruction snapshot을 같이 저장하는 패턴과 비슷합니다.
- 이번 변경은 `실제 결제 처리`보다 `상태 전이 명확화`에 초점을 둔 MVP용 예약 플로우 정리입니다.

## 검증

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
backend\.\mvnw.cmd test
```
