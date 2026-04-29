# 45. Step 39 보호 화면 공용화와 역할 변경 경로 정리

## 목표

Step 38까지는 마지막 화면 복구가 동작했지만, 보호 화면마다 `isReady / canAccess` 분기가 반복되고 있었고, 역할을 바꾼 뒤 이전 역할 전용 화면에 잠깐 남는 흐름도 있었습니다.

이번 단계에서는:

- 보호 화면의 로딩/권한 없음 UI를 공용 wrapper로 정리
- 역할 변경 후 현재 경로가 접근 불가면 기본 진입 화면으로 자동 정리
- 마지막 저장 경로도 새 역할 기준으로 안전하게 덮어쓰기

까지 반영했습니다.

## 수정한 파일

```text
src/components/winwin/ProtectedRoleScreen.tsx
src/auth/auth-route-persistence.tsx
src/auth/mock-auth.tsx
src/app/chat/[id].tsx
src/app/partner/index.tsx
src/app/partner/chat/[id].tsx
src/app/partner/post/index.tsx
src/app/partner/post/new.tsx
src/app/partner/post/created.tsx
src/app/partner/post/[id]/edit.tsx
codex/README.md
codex/progress-and-next-steps.md
```

## 1. 보호 화면 분기를 `ProtectedRoleScreen`으로 공용화

이전에는 각 화면마다:

```text
auth 준비 전인가?
권한이 맞는가?
아니면 안내 화면 보여주기
```

분기를 직접 반복해서 적고 있었습니다.

이제는 `ProtectedRoleScreen`이 이 역할을 대신 맡아서,

- 복원 중이면 `상태 불러오는 중`
- 준비 완료 후 권한이 없으면 `로그인 확인 중`
- 권한이 맞으면 실제 화면 렌더

흐름을 공통으로 처리합니다.

## 2. 역할이 바뀌면 접근 불가 경로를 바로 정리

예를 들어 파트너가 `/partner/post`를 보고 있다가 홈에서 `고객`으로 역할을 바꾸면, 그 경로는 더 이상 접근 가능한 화면이 아닙니다.

이제는 이런 경우:

```text
현재 역할 변경
-> 현재 pathname 접근 가능 여부 확인
-> 불가능하면 새 역할의 기본 화면으로 replace
```

로 동작합니다.

현재 정책은:

- `guest` -> `/`
- `customer` -> `/`
- `partner` -> `/partner`

기준으로 정리했습니다.

## 3. 마지막 저장 경로도 새 역할 기준으로 덮어씀

역할이 바뀌었는데 이전 역할 전용 경로가 저장소에 그대로 남아 있으면, 앱을 다시 시작할 때도 헷갈릴 수 있습니다.

그래서 접근 불가 경로를 정리할 때는 화면 이동만 하는 것이 아니라, 저장된 마지막 경로도 같이 기본 화면으로 덮어씁니다.

이렇게 하면:

- 파트너 화면 보다가 로그아웃
- 저장 경로도 `/`로 갱신
- 다음 재실행 때 홈 기준으로 시작

흐름으로 더 자연스럽게 이어집니다.

## React 개발자 기준으로 보면

이번 단계는 웹에서:

- `ProtectedRoute` 같은 wrapper 컴포넌트를 만들어 auth 분기를 공용화하고
- 로그인 역할이 바뀌면 현재 URL 접근 가능 여부를 다시 검사해서
- 막힌 URL이면 안전한 기본 페이지로 `replace`

하는 패턴과 비슷합니다.

즉 느낌상:

- `ProtectedRoleScreen`: 공용 protected route wrapper
- 경로 정리 effect: role change redirect policy
- 저장 경로 덮어쓰기: stale last-route cleanup

로 이해하면 됩니다.

## 핵심 코드

```ts
if (!canAccessRoute(role, pathname)) {
  router.replace(fallbackPath as never);
}
```

현재 역할로 접근할 수 없는 경로면 기본 진입 화면으로 바로 정리합니다.

```tsx
<ProtectedRoleScreen requiredRole="partner" redirectTo="/partner/post">
```

개별 화면은 공용 wrapper에 필요한 역할과 복귀 경로만 넘기면 됩니다.

## 검증

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```
