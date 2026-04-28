# 16. Step 10 보증금 결제 모달

## 목표

샵이 보낸 `예약 확정 요청` 카드에서 바로 예약 확정 메시지를 추가하지 않고, 보증금 결제 모달을 먼저 띄웁니다.

실제 결제 연동은 아직 하지 않고, RN 화면 흐름만 구현했습니다.

## 만든 파일

```text
src/components/winwin/PaymentModal.tsx
```

## 수정한 파일

```text
src/app/chat/[id].tsx
```

## 현재 동작 흐름

```text
1. 고객이 희망 일정 전송
2. 샵이 예약 확정 요청 카드 전송
3. 고객이 예약 확정 및 결제하기 클릭
4. 보증금 결제 모달 열림
5. 결제 수단 선택
6. 결제하기 클릭
7. 결제 처리 중 표시
8. 결제 완료 표시
9. 채팅에 예약 확정 메시지 추가
```

## PaymentModal 역할

`PaymentModal`은 채팅 화면 위에 뜨는 결제 UI입니다.

표시하는 정보:

- 상호명
- 예약 날짜
- 예약 시간
- 노쇼 방지 보증금
- 결제 수단
- 환불 안내
- 결제하기 버튼
- 결제 완료 상태

## RN에서 사용한 컴포넌트

```text
Modal             -> 화면 위에 뜨는 팝업
ScrollView        -> 결제 내용 스크롤
Pressable         -> 버튼
ActivityIndicator -> 처리 중 로딩 표시
View              -> 레이아웃 박스
Text              -> 텍스트
```

## 채팅 화면 상태 추가

채팅 화면에는 결제 중인 예약 정보를 담는 상태를 추가했습니다.

```ts
const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
```

예약 카드에서 `예약 확정 및 결제하기`를 누르면:

```ts
setSelectedBooking(bookingData);
```

이 값이 있으면 `PaymentModal`이 열립니다.

## 실제 결제와 다른 점

현재는 테스트용 UI입니다.

아래 작업은 아직 하지 않았습니다.

```text
실제 카드 결제 API 연동
카카오페이/토스 결제 SDK 연동
결제 실패 처리
서버에 결제 결과 저장
예약 상태 저장
환불 처리
```

지금은 결제 버튼을 누르면 `setTimeout`으로 결제 처리 중/완료 상태를 흉내냅니다.

## 검증

아래 명령으로 TypeScript 검사를 했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```
