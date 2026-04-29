# 34. Step 28 공고 수정 화면

## 목표

샵이 등록한 공고를 다시 수정할 수 있는 화면을 추가합니다.

이번 단계에서는:

- 공고 관리 화면에서 `수정` 버튼 추가
- `/shop/post/[id]/edit` 수정 라우트 추가
- 등록 폼과 수정 폼 공용화

까지 연결했습니다.

## 수정한 파일

```text
src/components/winwin/ShopPostForm.tsx
src/app/shop/post/new.tsx
src/app/shop/post/[id]/edit.tsx
src/app/shop/post/index.tsx
src/data/matchings.ts
codex/README.md
codex/progress-and-next-steps.md
```

## 1. 등록/수정 폼 공용화

기존 `new.tsx` 안에 있던 긴 입력 폼 로직을 `ShopPostForm` 컴포넌트로 뺐습니다.

이제:

- 새 공고 등록
- 기존 공고 수정

이 같은 입력 UI를 공유합니다.

## 2. 수정 라우트 추가

새 화면:

```text
/shop/post/[id]/edit
```

를 추가했습니다.

공고 관리 카드의 `수정` 버튼을 누르면 해당 공고 id로 수정 화면에 들어갑니다.

## 3. 수정 저장 로직 추가

`src/data/matchings.ts`에:

- `getPostedMatchingById(...)`
- `updatePostedMatching(...)`

helper를 추가했습니다.

즉, 메모리 배열에 들어 있는 등록 공고를 찾아서 같은 id의 데이터를 수정할 수 있게 됐습니다.

## React 개발자 기준으로 보면

- 이 단계는 `CreateForm`과 `EditForm`을 따로 복붙하지 않고, 하나의 공용 form component로 추출한 패턴입니다.
- 웹 React에서도 `initialValues`와 `onSubmit`을 props로 받아 create/edit를 같이 처리하는 방식과 같습니다.
- 동적 라우트의 `id`를 읽어와 기존 데이터를 채우는 흐름도 React Router에서 edit page 만드는 방식과 거의 같습니다.

## 핵심 로직

- 수정 화면은 라우트 params의 `id`로 기존 공고를 찾습니다.
- 찾은 공고를 `initialMatching`으로 넘겨 폼 기본값을 채웁니다.
- 저장 버튼을 누르면 `updatePostedMatching(...)`이 같은 id의 데이터를 덮어쓰고, 이후 공고 관리 목록으로 돌아갑니다.

## 핵심 코드

```ts
<ShopPostForm
  mode="edit"
  initialMatching={matching}
  onSubmit={(draft) => {
    updatePostedMatching(params.id!, draft);
    router.replace('/shop/post' as never);
  }}
/>
```

공용 폼에 초기값과 저장 함수만 다르게 넘겨서 수정 화면을 구성했습니다.

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

- 공고 관리 목록 정렬 추가
- 공고 상태를 홈 목록 노출 방식과 연결
- 수정 완료 안내 UI 추가
