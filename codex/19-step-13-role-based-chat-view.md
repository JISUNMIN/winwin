# 19. Step 13 역할 기반 채팅 보기

## 목표

같은 채팅 내용을 고객과 샵이 각자 다른 방향으로 보도록 채팅 정렬 기준을 바꿉니다.

이전에는 단순히:

```text
user -> 오른쪽
shop -> 왼쪽
```

으로만 처리했습니다.

이번에는:

```text
message.senderRole === currentViewerRole
```

기준으로 바꿔서, 누가 보고 있느냐에 따라 같은 메시지의 위치가 달라지도록 만들었습니다.

## 수정한 파일

```text
src/app/chat/[id].tsx
src/app/matching/[id].tsx
src/components/winwin/BookingRequestCard.tsx
src/components/winwin/ShopScheduleReviewCard.tsx
```

## 핵심 변경

### 1. 메시지 보낸 사람 기준 변경

채팅 메시지 타입의 `sender`를 `senderRole`로 바꿨습니다.

```ts
type ViewerRole = 'customer' | 'shopOwner';
```

이제 메시지가 고객이 보낸 것인지, 샵이 보낸 것인지 더 명확하게 표현합니다.

### 2. 현재 보는 역할 상태 추가

채팅 화면에 `viewerRole` 상태를 추가했습니다.

헤더 오른쪽의 `고객` / `샵` 버튼을 누르면 같은 채팅을 다른 관점으로 볼 수 있습니다.

## 역할별로 달라지는 것

### 고객 보기

- 고객이 보낸 메시지는 오른쪽
- 샵 메시지는 왼쪽
- 캘린더 버튼으로 희망 일정 전송 가능
- 예약 요청 카드에서 결제 버튼 표시

### 샵 보기

- 샵이 보낸 메시지는 오른쪽
- 고객 메시지는 왼쪽
- 일정 선택 카드에서 `이 일정 선택` 가능
- 예약 요청 카드는 읽기 전용 안내로 표시

## 상세 화면에서 바로 샵 보기 열기

매칭 상세 하단에 `샵 화면 미리보기` 버튼도 추가했습니다.

이 버튼은 아래처럼 `viewerRole: 'shopOwner'` 파라미터를 넣어 채팅 화면을 엽니다.

```ts
router.push({
  pathname: '/chat/[id]',
  params: { id: matching.id, viewerRole: 'shopOwner' },
});
```

## 왜 이 단계가 중요한지

이 작업을 해두면 나중에:

- 샵 사장님 전용 채팅 화면 분리
- 로그인한 사용자 role 연결
- 같은 메시지 데이터 재사용
- 고객/샵 액션 권한 분리

같은 작업을 훨씬 자연스럽게 이어갈 수 있습니다.

## 검증

아래 명령으로 TypeScript 검사를 했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```

## 다음에 이어서 할 만한 것

- 샵 전용 라우트를 따로 만들기
- 역할별 초기 메시지/상태를 더 현실적으로 나누기
- 예약 상태를 메시지와 별도 데이터로 관리하기
