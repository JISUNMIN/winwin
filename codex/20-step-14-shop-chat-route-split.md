# 20. Step 14 샵 채팅 라우트 분리

## 목표

고객용 채팅과 샵용 채팅을 실제 라우트 기준으로 분리합니다.

이전에는 하나의 `/chat/[id]` 화면 안에서 `고객 / 샵` 토글로만 역할을 바꿨습니다.

이번에는:

```text
/chat/[id]
/shop/chat/[id]
```

두 라우트로 나눠서, 각 화면이 자기 역할로 바로 열리도록 만들었습니다.

## 만든 파일

```text
src/app/shop/chat/[id].tsx
src/components/winwin/ChatScreen.tsx
```

## 수정한 파일

```text
src/app/chat/[id].tsx
src/app/matching/[id].tsx
```

## 어떻게 나눴는지

### 1. 공용 채팅 화면 컴포넌트 추출

기존 `src/app/chat/[id].tsx`에 들어 있던 큰 채팅 로직을:

```text
src/components/winwin/ChatScreen.tsx
```

로 옮겼습니다.

이 컴포넌트는 아래 props를 받습니다.

```ts
type ChatScreenProps = {
  initialViewerRole: 'customer' | 'shopOwner';
  allowRoleSwitch?: boolean;
};
```

즉, 같은 UI를 재사용하되 처음 어떤 역할로 열릴지만 라우트가 결정합니다.

### 2. 고객용 라우트 단순화

기존 `src/app/chat/[id].tsx`는 이제 얇은 라우트 파일만 남깁니다.

```ts
return <ChatScreen initialViewerRole="customer" />;
```

### 3. 샵용 라우트 추가

새 파일 `src/app/shop/chat/[id].tsx`는 아래처럼 샵 역할로 공용 화면을 엽니다.

```ts
return <ChatScreen initialViewerRole="shopOwner" />;
```

## 상세 화면 버튼 연결 변경

매칭 상세 화면의 `샵 화면 미리보기` 버튼도 이제 query param 방식이 아니라 실제 샵 라우트로 이동합니다.

이전:

```text
/chat/[id]?viewerRole=shopOwner
```

현재:

```text
/shop/chat/[id]
```

## 왜 이 단계가 좋은지

이제 고객 화면과 샵 화면이 URL 기준으로도 분리됐기 때문에 나중에:

- 샵 전용 헤더/탭 구성
- 샵 관리자 홈에서 바로 채팅 진입
- 고객과 샵의 서로 다른 권한 처리
- 로그인 role과 라우트 연결

같은 작업을 더 자연스럽게 이어갈 수 있습니다.

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

- 샵 전용 채팅 헤더/안내 문구 따로 만들기
- 샵 화면에서만 보이는 예약 상태 요약 추가
- 샵용 홈 또는 리스트 화면에서 `/shop/chat/[id]`로 진입하게 만들기
