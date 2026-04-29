# 44. Step 38 마지막 진입 화면 복구

## 목표

Step 37에서 역할 자체는 `AsyncStorage`에 유지되게 만들었지만, 앱을 다시 열면 항상 홈부터 다시 시작했습니다.

이번 단계에서는:

- 마지막으로 보던 화면 경로 저장
- 앱 재실행 시 현재 역할로 접근 가능한 마지막 화면 복구
- `/auth` 같은 중간 화면은 복구 대상에서 제외

까지 반영했습니다.

## 수정한 파일

```text
src/auth/auth-route-persistence.tsx
src/app/_layout.tsx
codex/README.md
codex/progress-and-next-steps.md
```

## 1. 마지막 화면 경로를 따로 저장

이제 현재 역할과 별개로, 사용자가 마지막으로 보고 있던 화면 경로도 로컬 저장소에 같이 저장합니다.

예를 들면:

```text
/matching/matching-1
/chat/matching-1
/partner/post
```

같은 실제 경로를 기억해 둡니다.

## 2. 앱 시작 시 홈 대신 마지막 화면으로 복구

앱이 다시 시작되면:

```text
저장된 역할 복원
-> 저장된 마지막 경로 확인
-> 현재 역할로 접근 가능한 경로면 그 화면으로 이동
```

흐름으로 동작합니다.

그래서 고객이 채팅 화면을 보다가 앱을 껐다 켜면, 다시 홈이 아니라 마지막 채팅 화면으로 돌아갈 수 있습니다.

## 3. 권한이 안 맞는 경로는 복구하지 않음

마지막 경로가 파트너 화면이어도, 현재 역할이 `guest`나 `customer`이면 그 화면은 자동 복구하지 않습니다.

즉:

- `partner`만 `/partner...` 복구 가능
- `customer`만 `/chat...` 복구 가능
- 홈과 상세 같은 공개 화면은 누구나 복구 가능

으로 정리했습니다.

이렇게 해야 저장된 이전 경로 때문에 앱 시작 직후 권한 충돌이 나지 않습니다.

## 4. `/auth` 화면은 복구 대상에서 제외

`/auth`는 실제 목적 화면이 아니라 중간 진입 화면이므로 마지막 화면으로 저장하지 않게 했습니다.

그래서 로그인 선택 화면을 보다가 앱을 다시 켜도, 또 `/auth`로 복귀하는 대신 실제 마지막 사용 화면 중심으로 복구됩니다.

## React 개발자 기준으로 보면

이번 단계는 웹에서:

- 마지막 페이지 URL을 `localStorage`에 저장해 두고
- 앱 시작 시 auth hydration이 끝난 뒤
- 접근 가능한 경우에만 `router.replace(...)`로 복원

하는 패턴과 비슷합니다.

차이는 브라우저의 `localStorage` 대신 RN의 `AsyncStorage`를 쓴다는 점입니다.

즉 느낌상:

- 역할 복원: auth state hydration
- 마지막 경로 복원: last visited route restore
- 권한 체크 후 복원: protected route와 충돌하지 않게 복구

로 이해하면 됩니다.

## 핵심 코드

```ts
const savedPath = await AsyncStorage.getItem(LAST_ROUTE_STORAGE_KEY);
```

앱 시작 시 마지막으로 보던 경로를 읽습니다.

```ts
if (storedPath && canAccessRoute(role, storedPath)) {
  router.replace(storedPath as never);
}
```

현재 역할로 접근 가능한 화면일 때만 마지막 경로로 복구합니다.

## 검증

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```
