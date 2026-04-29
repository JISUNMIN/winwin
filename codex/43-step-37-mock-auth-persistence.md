# 43. Step 37 Mock 인증 상태 유지

## 목표

Step 36까지는 역할 전환 UI와 권한 진입 동선을 다듬었지만, 앱을 다시 시작하면 항상 `guest`로 돌아갔습니다.

이번 단계에서는:

- 마지막으로 선택한 `guest / customer / partner` 역할을 저장
- 앱 재실행 후에도 이전 역할 복원
- 저장값을 읽기 전 권한 가드가 성급히 `/auth`로 이동하지 않게 조정

까지 반영했습니다.

## AsyncStorage가 뭔가요?

`AsyncStorage`는 RN 앱 안에서 작은 문자열 데이터를 기기 로컬 저장소에 보관할 때 많이 쓰는 도구입니다.

React 웹으로 비교하면 느낌상:

- `useState`: 새로고침하거나 앱을 껐다 켜면 사라지는 메모리 상태
- `localStorage`: 브라우저에 남겨두는 간단한 저장소
- `AsyncStorage`: RN에서 비슷한 역할을 하는 로컬 저장소

정확히 똑같지는 않지만, 지금 단계에서는 `localStorage 비슷한 것`으로 이해하면 충분합니다.

이름에 `Async`가 붙은 이유는 값을 읽고 쓰는 동작이 바로 끝나는 것이 아니라 `Promise` 기반 비동기로 동작하기 때문입니다.

예를 들면:

```ts
await AsyncStorage.setItem('key', 'value');
const savedValue = await AsyncStorage.getItem('key');
```

처럼 `await`로 저장/조회합니다.

이번 단계에서는 여기에 마지막 역할인 `guest / customer / partner`를 저장해서, 앱을 다시 열어도 이전 선택을 복원하게 만들었습니다.

## 수정한 파일

```text
src/auth/mock-auth.tsx
src/hooks/use-role-guard.ts
package.json
package-lock.json
codex/README.md
codex/progress-and-next-steps.md
```

## 1. mock auth 역할을 AsyncStorage에 저장

이제 `MockAuthProvider`는 현재 역할을 메모리 상태로만 들고 있지 않고, `AsyncStorage`에도 같이 저장합니다.

그래서 홈 상단에서 `고객`이나 `파트너`를 선택한 뒤 앱을 다시 열어도 마지막 역할이 그대로 복원됩니다.

## 2. 앱 시작 시 저장된 역할 먼저 복원

Provider가 마운트되면 저장소에서 이전 역할을 읽고,

```text
저장된 값 확인
-> guest/customer/partner 중 하나면 상태 복원
-> 없으면 guest 유지
```

흐름으로 초기 상태를 정리합니다.

즉, 이제 mock auth도 "한 번 고른 역할을 잠깐 유지하는 로그인"처럼 동작합니다.

## 3. 권한 가드는 auth 복원 완료 후에만 실행

저장값을 아직 읽기 전에는 기본값이 `guest`라서, 파트너 화면 진입 시 잘못 막힐 수 있습니다.

그래서 `useRoleGuard`는 이제 auth context의 준비 상태가 끝난 뒤에만 redirect를 실행합니다.

이렇게 하면:

```text
앱 시작
-> 저장된 partner 역할 복원 중
-> 아직 /auth 로 보내지 않음
-> 복원 완료 후 정상 진입
```

흐름으로 안정적으로 동작합니다.

## React 개발자 기준으로 보면

이번 단계는 웹에서 auth 상태를 `localStorage`에 저장해서 새로고침 후에도 로그인 상태를 복원하는 패턴과 거의 비슷합니다.

차이는 브라우저의 `localStorage` 대신 RN의 `AsyncStorage`를 쓴다는 점입니다.

즉 느낌상:

- `useState(role)`: 지금 메모리에 올라와 있는 현재 역할
- `AsyncStorage`: 앱을 껐다 켜도 남는 로컬 저장소
- `isReady`: 저장된 auth 값을 읽어오는 동안 잠깐 기다리는 hydration 상태

로 보면 이해가 쉽습니다.

## 핵심 코드

```ts
const storedRole = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
```

앱 시작 시 마지막 역할을 읽어서 복원합니다.

```ts
if (!isReady) {
  return;
}
```

role guard는 auth 복원 완료 전에는 redirect를 미뤄서 초기 오판을 막습니다.

## 검증

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```
