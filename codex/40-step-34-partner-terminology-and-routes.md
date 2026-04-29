# 40. Step 34 파트너 용어와 라우트 정리

## 목표

기존의 `shop` 표현을 더 넓은 서비스 범위에 맞게 `partner` 기준으로 정리합니다.

이번 단계에서는:

- `/shop` 라우트를 `/partner`로 변경
- 채팅 역할값을 `shopOwner` 대신 `partner`로 변경
- 파트너 전용 화면 문구를 `파트너` 기준으로 정리

까지 반영했습니다.

## 수정한 파일

```text
src/app/partner/index.tsx
src/app/partner/chat/[id].tsx
src/app/partner/post/index.tsx
src/app/partner/post/new.tsx
src/app/partner/post/created.tsx
src/app/partner/post/[id]/edit.tsx
src/app/matching/[id].tsx
src/components/winwin/ChatScreen.tsx
src/data/consultations.ts
codex/README.md
codex/progress-and-next-steps.md
```

## 1. 라우트 이름 변경

기존 파트너 전용 경로:

```text
/shop
/shop/chat/[id]
/shop/post
```

를 아래처럼 바꿨습니다.

```text
/partner
/partner/chat/[id]
/partner/post
```

## 2. 역할 이름 변경

채팅과 상담 mock에서 쓰던 역할 이름도:

```text
shopOwner -> partner
```

로 바꿨습니다.

## 3. 사용자 문구 변경

앱 화면에서 보이는 문구도:

- `샵 상담 목록` -> `파트너 상담 목록`
- `샵 보기` -> `파트너 보기`
- `샵 메시지` -> `파트너 메시지`

처럼 정리했습니다.

## 왜 지금 바꾸는지

- 현재 서비스가 미용실만이 아니라 카페, 호텔, 숙박까지 포함합니다.
- 그래서 `shop`은 의미가 너무 좁고, `partner`가 더 확장 가능한 표현입니다.
- 지금 단계에서 바꾸면 나중에 API, 회원가입, 권한 설계까지 이어질 때 더 자연스럽습니다.

## 검증

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```
