# 12. Step 6 매칭 상세 화면 연결

## 목표

Home 화면의 매칭 카드에서 `지원하기` 버튼을 누르면 상세 화면으로 이동하게 만듭니다.

## 만든 파일

```text
src/app/matching/[id].tsx
```

Expo Router에서 대괄호 파일명은 동적 라우트를 의미합니다.

즉 아래 파일은:

```text
src/app/matching/[id].tsx
```

아래 주소들을 처리합니다.

```text
/matching/1
/matching/2
/matching/abc
```

여기서 `1`, `2`, `abc`가 `id` 값입니다.

## URL 파라미터 읽기

상세 화면에서는 `useLocalSearchParams()`로 URL의 `id`를 읽었습니다.

```ts
const { id } = useLocalSearchParams<{ id: string }>();
```

그리고 mock 데이터에서 같은 id를 가진 매칭을 찾습니다.

```ts
const matching = mockMatchings.find((item) => item.id === id);
```

## Home에서 상세로 이동

`src/app/index.tsx`에서 `useRouter()`를 사용했습니다.

```ts
const router = useRouter();
```

카드의 `onPress`에는 아래처럼 연결했습니다.

```tsx
<MatchingCard
  matching={matching}
  onPress={() =>
    router.push({
      pathname: '/matching/[id]',
      params: { id: matching.id },
    })
  }
/>
```

React 웹의 `navigate('/matching/1')`와 비슷한 역할입니다.

## 상세 화면에 표시하는 내용

상세 화면에는 아래 정보가 들어갑니다.

- 뒤로가기 버튼
- 대표 이미지
- 카테고리 배지
- 프리미엄 배지
- 매장 이름
- 서비스 이름
- 위치
- 마감 상태
- 상세 설명
- 지원 조건
- 예약 가능 날짜
- 노쇼 방지 보증금
- 포트폴리오 이미지
- 하단 지원하기 버튼

## 공용 helper 정리

카드와 상세 화면에서 같은 로직이 필요해서 `src/data/matchings.ts`에 helper를 추가했습니다.

추가한 함수:

```ts
getCategoryLabel()
getDaysUntil()
formatKoreanDate()
```

이렇게 하면 같은 날짜/카테고리 표시 로직을 여러 파일에 중복해서 쓰지 않아도 됩니다.

## 이번 단계에서 아직 하지 않은 것

상세 화면 하단의 `지원하기` 버튼은 아직 채팅 화면으로 이동하지 않습니다.

다음 단계에서 아래 라우트를 만들고 연결할 예정입니다.

```text
src/app/chat/[id].tsx
```

## 검증

아래 명령으로 타입 검사를 했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```

## 직접 확인 방법

Expo가 켜져 있다면 Home 화면에서 매칭 카드의 `지원하기` 버튼을 누릅니다.

예상 결과:

```text
매칭 상세 화면으로 이동
```

뒤로가기 버튼을 누르면 이전 화면으로 돌아갑니다.
