# 41. Step 35 Mock 인증과 역할 가드

## 목표

이제 앱에 `guest / customer / partner` 기준의 mock 인증 상태를 붙여서,

- 게스트는 홈/상세만 보기
- 고객만 `지원하기`, 고객 채팅, 예약/결제 진행
- 파트너만 `/partner` 화면 진입

흐름으로 정리합니다.

이번 단계에서는:

- 전역 mock auth provider 추가
- `/auth` mock 로그인 화면 추가
- `partner` 라우트 전체 가드 추가
- 고객 채팅 라우트 가드 추가
- `지원하기`와 고객 채팅 액션을 로그인 기반으로 잠금
- 홈 화면에 현재 역할 표시와 로그인/로그아웃 진입점 추가

까지 반영했습니다.

## 수정한 파일

```text
src/app/_layout.tsx
src/app/(tabs)/index.tsx
src/app/auth/index.tsx
src/app/chat/[id].tsx
src/app/matching/[id].tsx
src/app/partner/index.tsx
src/app/partner/chat/[id].tsx
src/app/partner/post/index.tsx
src/app/partner/post/new.tsx
src/app/partner/post/created.tsx
src/app/partner/post/[id]/edit.tsx
src/components/winwin/AccessGuardScreen.tsx
src/components/winwin/ChatScreen.tsx
src/auth/mock-auth.tsx
src/hooks/use-role-guard.ts
codex/README.md
codex/progress-and-next-steps.md
```

## 1. 전역 mock auth 상태 추가

`src/app/_layout.tsx`에서 앱 전체를 `MockAuthProvider`로 감쌌습니다.

이제 어디서든 현재 역할을:

- `guest`
- `customer`
- `partner`

중 하나로 읽을 수 있습니다.

웹 React 기준으로 보면 전역 로그인 context를 가장 얇게 붙인 상태와 비슷합니다.

## 2. 권한이 필요한 화면은 `/auth`로 이동

새 `/auth` 화면에서 고객/파트너 역할을 바로 선택할 수 있게 했습니다.

필요한 권한이 있는 화면으로 들어가려다 막히면:

```text
원래 가려던 경로 저장
-> /auth 이동
-> 역할 선택
-> 원래 경로로 복귀
```

흐름으로 이어집니다.

즉, 단순히 막기만 하는 것이 아니라 "로그인 후 이어서 보기" 흐름까지 같이 넣었습니다.

## 3. 파트너 라우트 전체 가드

이제 아래 화면은 파트너 로그인 상태여야만 접근할 수 있습니다.

```text
/partner
/partner/chat/[id]
/partner/post
/partner/post/new
/partner/post/created
/partner/post/[id]/edit
```

게스트나 고객이 들어오면 잠깐 안내 화면이 보인 뒤 `/auth`로 이동합니다.

## 4. 고객 액션도 로그인 기준으로 잠금

고객 쪽에서는 아래 동작을 `customer` 로그인 상태에서만 진행할 수 있게 했습니다.

- `지원하기`
- 고객 채팅 진입
- 고객 메시지 전송
- 사진 첨부
- 희망 일정 보내기
- 예약 확정 및 결제

그래서 게스트는 상세 공고까지는 볼 수 있어도, 실제 상담과 예약 단계부터는 로그인 흐름을 거치게 됩니다.

## 핵심 코드

```ts
const canAccess = useRoleGuard('partner', '/partner');
```

라우트별로 필요한 역할을 명시해서 파트너 화면 접근을 막았습니다.

```ts
if (viewerRole === 'customer' && !canUseCustomerActions) {
  openCustomerAuth();
  return;
}
```

고객 채팅 안에서도 액션 단위로 한 번 더 막아서, 고객 전용 동작이 게스트 상태로 실행되지 않게 했습니다.

## 다음에 이어서 하기 좋은 것

- auth 상태를 앱 재시작 후에도 유지할지 결정
- 고객/파트너 프로필 mock 데이터 추가
- 홈/상세 상단에 역할별 CTA를 조금 더 자연스럽게 다듬기
- 나중에 실제 로그인 API가 붙을 때 현재 context 구조를 교체하기 쉽게 분리 유지

## 검증

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```
