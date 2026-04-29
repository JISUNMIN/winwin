# 37. Step 31 공고 수정 완료 안내 UI

## 목표

공고 수정 저장 후, 공고 관리 화면으로 돌아왔을 때 결과가 바로 보이도록 가벼운 안내 UI를 추가합니다.

이번 단계에서는:

- 수정 저장 직후 성공 메시지 기록
- 공고 관리 화면 상단 배너 표시
- 잠깐 보여준 뒤 자동 숨김

까지 연결했습니다.

## 수정한 파일

```text
src/data/post-feedback.ts
src/app/shop/post/[id]/edit.tsx
src/app/shop/post/index.tsx
codex/README.md
codex/progress-and-next-steps.md
```

## 1. 한 번만 쓰는 feedback 저장소 추가

`src/data/post-feedback.ts`를 만들어 아주 짧은 메모리 상태를 두었습니다.

- `setPostFeedbackMessage(...)`
- `consumePostFeedbackMessage(...)`

형태로 만들었기 때문에, 수정 화면에서 메시지를 저장하고 목록 화면에서 한 번 읽으면 바로 비워집니다.

## 2. 수정 저장 후 메시지 남기기

`/shop/post/[id]/edit`에서 저장이 끝나면:

```text
updatePostedMatching(...)
-> 성공 메시지 저장
-> /shop/post 로 이동
```

순서로 처리합니다.

## 3. 목록 상단 배너 표시

공고 관리 화면은 포커스를 다시 받을 때 feedback 메시지를 읽습니다.

메시지가 있으면 제목 아래에 초록색 완료 배너를 보여주고, 약 2.4초 뒤 자동으로 숨깁니다.

## React 개발자 기준으로 보면

- 웹 React에서도 edit page 저장 후 list page에 toast나 flash message를 띄우는 패턴과 같습니다.
- 이번 구현은 전역 상태 라이브러리 없이, 아주 작은 메모리 helper만 써서 화면 간 1회성 메시지를 전달한 구조입니다.

## 핵심 로직

- 수정 화면은 성공 메시지를 세팅합니다.
- 공고 관리 화면은 `consume...` helper로 메시지를 읽습니다.
- 읽은 메시지는 다시 사라지기 때문에 새로 들어왔을 때 중복 표시되지 않습니다.

## 핵심 코드

```ts
setPostFeedbackMessage('공고 수정이 완료됐어요.');
router.replace('/shop/post' as never);
```

저장 직후 성공 메시지를 남긴 다음 목록으로 돌아갑니다.

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

- 공고 관리 목록에 검색 추가
- 등록 완료 화면도 같은 feedback 패턴으로 정리
- 고객 상세 화면에서 마감 공고 안내 흐름 보강
