# Backend 10. 파트너 홈 공고 정보 실제 API 동기화

이번 단계에서는 파트너 홈 화면의 `공고 관리 진입부`와 `상담 카드에 붙는 공고 정보`를 실제 API 기준으로 최대한 맞췄습니다.

상담 메시지와 예약 상태 자체는 아직 mock 이지만, 적어도 파트너가 보고 있는 공고 수와 상담 카드의 매장 정보가 서버 공고와 크게 어긋나지 않도록 정리한 단계입니다.

## 이번에 바꾼 것

- `src/app/partner/index.tsx`에서 API 세션이면 `/api/partner/posts`를 먼저 불러오게 했습니다.
- 파트너 홈의 `등록한 공고 N개` 숫자가 실제 공고 목록 기준으로 보이게 했습니다.
- 상담 카드에서 참조하는 공고 정보도 `postedMatchings`를 우선 쓰도록 합쳤습니다.
- 서버 공고 로딩 중에는 공고 관리 버튼에 작은 로딩 인디케이터를 보여줍니다.
- API 실패 시에는 화면이 멈추지 않게 fallback 하고, 상단 경고 배너로 현재 상태를 알려줍니다.

## 왜 이렇게 했는지

이전에는 파트너 홈이 아직 `getPostedMatchings()`와 `mockMatchings`에 기대고 있어서, 실제 API로 공고를 등록하거나 수정해도 홈 요약 숫자와 상담 카드 정보가 바로 맞지 않을 수 있었습니다.

공고 관리 화면은 실제 API를 보고 있는데, 바로 앞 단계인 파트너 홈은 mock 기반이면 화면끼리 신뢰도가 떨어집니다.

그래서 이번 단계에서는 파트너 홈도 최소한 `공고 목록 source`를 공통으로 맞추는 데 집중했습니다.

## 바뀐 파일

- `src/app/partner/index.tsx`

## 핵심 로직

API 세션이면 파트너 공고 목록을 먼저 읽고, 실패하면 기존 mock 목록으로 fallback 합니다.

```ts
if (authSource === 'api' && accessToken) {
  const response = await getPartnerPosts(accessToken);
  setPostedMatchings(response.map(mapPostResponseToMatching));
  return;
}

setPostedMatchings(getPostedMatchings());
```

상담 카드에 붙는 공고 정보는 `postedMatchings`를 포함한 맵으로 합쳐서 우선순위를 맞췄습니다.

```ts
for (const matching of postedMatchings) {
  entries.set(matching.id, matching);
}

const matching = matchingById.get(status.matchingId);
```

즉 상담 상태는 아직 mock 이어도, 그 상담이 가리키는 매장명/서비스/가능 날짜는 가능한 한 최신 공고 정보를 쓰도록 만든 것입니다.

## React 개발자 기준으로 보면

이번 단계는 `dashboard summary`가 별도 mock 상태를 들고 있지 않게 줄이는 작업입니다.

웹 React 기준으로 보면 홈 카드가 `list query result`를 재사용하도록 맞춘 셈이고, 화면마다 다른 임시 배열을 각각 보지 않게 정리한 상태입니다.

또 API 실패 시에는 blank page 대신 `warning banner + fallback data`를 보여주는 패턴을 적용했습니다.

## Express/Next API 개발자 기준으로 보면

새 API를 추가한 단계라기보다, 이미 만든 `/api/partner/posts`를 파트너 홈 대시보드에서도 재사용하게 연결한 단계입니다.

즉 `posts resource`를 한 화면에서만 쓰지 않고 `dashboard summary`와 `consultation card decoration`에도 공통으로 흘려보낸 셈입니다.

이렇게 해두면 다음에 chat/consultation API를 만들 때도 공고 쪽 모델은 다시 손댈 일이 줄어듭니다.

## 확인한 것

- `.\node_modules\.bin\tsc.cmd --noEmit`

타입 체크 통과했습니다.

## 다음 단계

다음 큰 작업은 여전히 `상담/채팅 mock 데이터 API화`입니다.

지금은 공고 정보는 많이 실데이터로 옮겼고, 남은 큰 축은 `consultation summary`, `message thread`, `예약 상태 변경`을 실제 서버 모델로 만드는 일입니다.
