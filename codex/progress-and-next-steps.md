# 진행 기록과 다음 할 일

## 지금까지 한 것

### 1. Expo 프로젝트 생성

`WinWin` 이름으로 Expo React Native 프로젝트를 생성했습니다.

프로젝트 위치:

```powershell
C:\Users\zentropy\Music\WinWin\WinWin
```

### 2. 프로젝트 기본 구조 확인

중요한 파일과 폴더를 확인했습니다.

- `src/app`: Expo Router 화면 파일 위치
- `src/app/index.tsx`: 첫 화면
- `src/app/_layout.tsx`: 앱 전체 레이아웃과 네비게이션 뼈대
- `src/app/explore.tsx`: 기본 예제의 두 번째 화면
- `src/components`: 재사용 컴포넌트
- `assets`: 이미지, 아이콘, 스플래시 이미지
- `app.json`: Expo 앱 설정
- `package.json`: 실행 명령어와 의존성

자세한 설명은 `01-basic-run-and-folders.md`에 정리했습니다.

### 3. Codex 노트 폴더 생성

설명과 진행 기록을 남기기 위해 `codex/` 폴더를 만들었습니다.

`codex/`는 Git에 올라가지 않도록 `.gitignore`에 추가했습니다.

### 4. 기본 실행 방법 정리

Windows PowerShell에서는 `npm` 대신 `npm.cmd`를 쓰는 편이 안전하다는 점을 정리했습니다.

기본 실행 명령:

```powershell
cd C:\Users\zentropy\Music\WinWin\WinWin
npm.cmd start
```

Expo 터미널에서 `w`를 누르면 웹 브라우저로 기본 앱을 볼 수 있습니다.

### 5. VS Code JSX 에러 원인 확인

`app-tabs.tsx` 등에서 `Cannot use JSX unless the '--jsx' flag is provided` 에러가 보이는 문제를 확인했습니다.

터미널에서 아래 명령을 실행했을 때 TypeScript 컴파일 에러가 없었습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

따라서 코드나 `tsconfig.json` 자체 문제라기보다, VS Code TypeScript 서버가 프로젝트 설정을 제대로 못 읽은 상태일 가능성이 큽니다.

자세한 내용은 `02-vscode-jsx-error.md`에 정리했습니다.

### 6. Expo Go 버전 호환 문제 확인

Expo Go에서 아래 에러가 보였습니다.

```text
Project is incompatible with this version of Expo Go
This project requires a newer version of Expo Go.
```

현재 프로젝트는 `expo: ~55.0.17`을 사용합니다.

따라서 휴대폰의 Expo Go 앱이 SDK 55를 지원하지 않는 오래된 버전이면 연결할 수 없습니다.

자세한 해결 순서는 `03-expo-go-and-web-troubleshooting.md`에 정리했습니다.

### 7. `npx expo start -c`로 실행 성공

기본 실행이 잘 안 되던 상태에서 아래 명령으로 실행에 성공했습니다.

```powershell
npx expo start -c
```

`-c`는 Metro Bundler 캐시를 지우고 다시 시작하는 옵션입니다.

자세한 설명은 `04-metro-bundler-and-cache.md`에 정리했습니다.

### 8. Expo Starter Explore 화면 확인

Expo 기본 템플릿의 `Explore` 탭을 확인했습니다.

이 화면은 실제 WinWin 앱 기능이 아니라, 기본 템플릿이 제공하는 예제와 학습 안내 화면입니다.

자세한 설명은 `05-expo-starter-explore-screen.md`에 정리했습니다.

### 9. WinWin 디자인 적용 시작점 결정

다운로드 폴더의 `WinWin Matching App Design.zip` 안에 있는 디자인 코드를 다시 확인했습니다.

현재 디자인의 핵심 화면:

- `HomePage`
- `MatchingDetailPage`
- `ChatPage`

첫 구현은 `HomePage`를 RN의 `src/app/index.tsx`로 옮기는 방향이 가장 좋습니다.

자세한 계획은 `06-winwin-design-porting-plan.md`에 정리했습니다.

### 10. 디자인 참고 폴더 준비 완료

다운로드 폴더의 `WinWin Matching App Design.zip`을 프로젝트 안의 `design-reference/` 폴더로 풀었습니다.

`design-reference/`는 참고용 원본 코드이므로 Git에 올라가지 않도록 `.gitignore`에 추가했습니다.

자세한 기록은 `07-step-01-design-reference.md`에 정리했습니다.

### 11. 데이터 모델 옮기기 완료

디자인 원본의 `Matching` 타입과 매칭 mock 데이터를 RN 프로젝트의 데이터 파일로 옮겼습니다.

새 파일:

```text
src/data/matchings.ts
```

추가로 `design-reference/`는 참고용 웹 코드라 TypeScript 검사 대상에서 제외했습니다.

수정 파일:

```text
tsconfig.json
```

검증:

```powershell
npx.cmd tsc --noEmit --pretty false
```

타입 검사는 통과했습니다.

자세한 기록은 `08-step-02-data-model.md`에 정리했습니다.

### 12. 작은 WinWin Home 화면 만들기 완료

Expo 기본 Home 화면을 작은 WinWin 홈 화면으로 바꿨습니다.

수정 파일:

```text
src/app/index.tsx
```

현재 화면에는 아래 요소가 들어갑니다.

- `WinWin` 제목
- 검색 입력창
- 현재 위치
- 전체 매칭/검색 결과 개수
- 프리미엄 매칭 개수

검증:

```powershell
npx.cmd tsc --noEmit --pretty false
```

타입 검사는 통과했습니다.

자세한 기록은 `09-step-03-minimal-home-screen.md`에 정리했습니다.

### 13. CategoryFilter 만들기 완료

디자인 원본의 카테고리 필터를 RN 컴포넌트로 옮겼습니다.

새 파일:

```text
src/components/winwin/CategoryFilter.tsx
```

수정 파일:

```text
src/app/index.tsx
```

Home 화면에 `selectedCategory` 상태를 추가했고, 검색어와 카테고리를 함께 적용해서 `filteredMatchings`를 계산하게 만들었습니다.

검증:

```powershell
npx.cmd tsc --noEmit --pretty false
```

타입 검사는 통과했습니다.

자세한 기록은 `10-step-04-category-filter.md`에 정리했습니다.

### 14. MatchingCard 리스트 만들기 완료

디자인 원본의 매칭 카드 구조를 RN 컴포넌트로 옮겼습니다.

새 파일:

```text
src/components/winwin/MatchingCard.tsx
```

수정 파일:

```text
src/app/index.tsx
```

Home 화면에서 `filteredMatchings.map(...)`으로 매칭 카드 리스트를 렌더링하게 만들었습니다.

검증:

```powershell
npx.cmd tsc --noEmit --pretty false
```

타입 검사는 통과했습니다.

자세한 기록은 `11-step-05-matching-card-list.md`에 정리했습니다.

### 15. 매칭 상세 화면 연결 완료

Expo Router의 동적 라우트로 매칭 상세 화면을 만들었습니다.

새 파일:

```text
src/app/matching/[id].tsx
```

수정 파일:

```text
src/app/index.tsx
src/data/matchings.ts
src/components/winwin/MatchingCard.tsx
```

Home 카드의 `지원하기` 버튼을 누르면 `/matching/[id]` 상세 화면으로 이동합니다.

카테고리 라벨, 날짜 포맷, 마감일 계산은 여러 화면에서 같이 쓰기 위해 `src/data/matchings.ts`의 공용 helper로 옮겼습니다.

검증:

```powershell
npx.cmd tsc --noEmit --pretty false
```

타입 검사는 통과했습니다.

자세한 기록은 `12-step-06-matching-detail-route.md`에 정리했습니다.

### 16. 지원하기 버튼 상세 이동 문제 해결

`지원하기` 버튼을 눌러도 상세 화면이 열리지 않는 문제를 확인했습니다.

원인은 버튼 코드가 아니라 라우터 구조였습니다. 앱 최상단이 바로 탭 네비게이션이라서, 탭 밖에 있는 `/matching/[id]` 화면을 자연스럽게 열기 어려운 상태였습니다.

수정한 구조:

```text
Root Stack
  ├─ (tabs)
  │   ├─ index
  │   └─ explore
  └─ matching/[id]
```

수정 파일:

```text
src/app/_layout.tsx
src/app/(tabs)/_layout.tsx
src/app/(tabs)/index.tsx
src/app/(tabs)/explore.tsx
src/components/app-tabs.web.tsx
```

라우트 구조가 바뀌었기 때문에 Expo는 아래 명령으로 다시 켜는 것이 좋습니다.

```powershell
npx expo start -c
```

검증:

```powershell
npx.cmd tsc --noEmit --pretty false
```

타입 검사는 통과했습니다.

자세한 기록은 `13-step-07-router-layout-fix.md`에 정리했습니다.

### 17. 채팅 화면 만들기 완료

상세 화면의 하단 `지원하기` 버튼을 채팅 화면으로 연결했습니다.

새 파일:

```text
src/app/chat/[id].tsx
```

수정 파일:

```text
src/app/matching/[id].tsx
```

현재 채팅 화면에는 아래 기능이 들어갑니다.

- 매장 정보 헤더
- 기본 상담 메시지
- 메시지 입력창
- 전송 버튼
- 사용자 메시지 추가
- 간단한 매장 자동 답장

검증:

```powershell
npx.cmd tsc --noEmit --pretty false
```

타입 검사는 통과했습니다.

자세한 기록은 `14-step-08-chat-route.md`에 정리했습니다.

### 18. 개발 서버와 빌드 차이 정리

웹에서 새 라우트가 바로 반영되지 않아 브라우저 새로고침 후 정상 동작하는 상황을 확인했습니다.

개발 중에는 보통 배포용 빌드를 다시 하는 것이 아니라 아래 순서로 확인합니다.

```text
1. 코드 저장
2. 브라우저 새로고침
3. Expo 터미널에서 r
4. Ctrl+C 후 npx expo start
5. 그래도 이상하면 Ctrl+C 후 npx expo start -c
```

자세한 기록은 `dev-server-refresh-build.md`에 정리했습니다.

### 19. 희망 일정과 예약 확정 요청 만들기 완료

채팅 화면에서 캘린더 버튼을 누르면 날짜/시간 선택 UI가 열리도록 만들었습니다.

처음에는 고객이 선택한 일정이 샵 메시지처럼 왼쪽에 뜨는 문제가 있었습니다. 고객 관점 채팅에서는 고객이 보낸 메시지가 오른쪽에 떠야 하므로 흐름을 다시 정리했습니다.

이후 고객이 희망 일정을 여러 개 선택할 수 있도록 수정했습니다.

새 파일:

```text
src/components/winwin/BookingPicker.tsx
src/components/winwin/DesiredScheduleCard.tsx
src/components/winwin/BookingRequestCard.tsx
```

수정 파일:

```text
src/app/chat/[id].tsx
```

현재 동작:

```text
채팅 화면 캘린더 버튼
-> 날짜 선택
-> 시간 여러 개 선택
-> 다른 날짜의 시간도 추가 선택 가능
-> 고객 희망 일정 카드가 오른쪽에 추가
-> 샵 확인 메시지가 왼쪽에 추가
-> 샵 예약 확정 요청 카드가 왼쪽에 추가
-> 예약 확정 및 결제하기 클릭
-> 사용자 확정 메시지 추가
```

현재 mock 흐름에서는 고객이 보낸 여러 희망 일정 중 첫 번째 일정을 샵이 선택한 것으로 처리합니다.

검증:

```powershell
npx.cmd tsc --noEmit --pretty false
```

타입 검사는 통과했습니다.

자세한 기록은 `15-step-09-booking-picker.md`에 정리했습니다.

### 20. 보증금 결제 모달 만들기 완료

샵이 보낸 예약 확정 요청 카드에서 `예약 확정 및 결제하기`를 누르면 보증금 결제 모달이 열리도록 만들었습니다.

새 파일:

```text
src/components/winwin/PaymentModal.tsx
```

수정 파일:

```text
src/app/chat/[id].tsx
```

현재 동작:

```text
예약 확정 및 결제하기 클릭
-> 보증금 결제 모달 열림
-> 결제 수단 선택
-> 결제하기 클릭
-> 결제 처리 중 표시
-> 결제 완료 표시
-> 채팅에 예약 확정 메시지 추가
```

아직 실제 결제 API나 서버 저장은 연결하지 않았습니다.

검증:

```powershell
npx.cmd tsc --noEmit --pretty false
```

타입 검사는 통과했습니다.

자세한 기록은 `16-step-10-payment-modal.md`에 정리했습니다.

### 21. 채팅 사진 메시지 만들기 완료

채팅 입력창의 사진 버튼이 동작하도록 만들었습니다.

설치한 패키지:

```text
expo-image-picker
```

새 파일:

```text
src/components/winwin/ImageMessageCard.tsx
```

수정 파일:

```text
src/app/chat/[id].tsx
package.json
package-lock.json
```

현재 동작:

```text
사진 버튼 클릭
-> 앨범 권한 확인
-> 앨범 또는 파일 선택 창 열림
-> 실제 사진 선택
-> 고객 이미지 메시지가 오른쪽에 추가
-> 샵 자동 답장 추가
```

현재는 이미지 1개 선택 흐름만 연결했습니다. 여러 장 선택, 카메라 촬영, 서버 업로드는 아직 하지 않았습니다.

검증:

```powershell
npx.cmd tsc --noEmit --pretty false
```

타입 검사는 통과했습니다.

자세한 기록은 `17-step-11-chat-photo-message.md`에 정리했습니다.

## 현재 상태

Expo 기본 예제 앱 실행에 성공했습니다.

WinWin 디자인의 데이터 모델은 RN 프로젝트로 옮겼습니다.

Home UI는 아주 작은 WinWin 버전으로 바뀌었습니다.

카테고리 필터는 Home 화면에 연결했습니다.

매칭 카드 리스트도 Home 화면에 연결했습니다.

`지원하기` 버튼의 매칭 상세 화면 이동도 연결했습니다.

탭 밖 상세 화면이 열리도록 Root Stack과 `(tabs)` 그룹 구조도 정리했습니다.

상세 화면 하단 `지원하기` 버튼은 채팅 화면으로 이동합니다.

채팅 화면에서 고객 희망 일정 여러 개 전송과 샵 예약 확정 요청 흐름을 확인할 수 있습니다.

예약 확정 요청에서 보증금 결제 모달까지 확인할 수 있습니다.

채팅 화면에서 앨범 이미지를 이미지 메시지로 보낼 수 있습니다.

고객이 여러 희망 일정을 보내면 샵이 그중 하나를 골라 예약 요청을 보내는 mock 흐름도 추가했습니다.

같은 채팅을 고객 보기 / 샵 보기로 전환할 수 있도록 역할 기반 정렬과 액션 분리도 추가했습니다.

고객용 `/chat/[id]`와 샵용 `/shop/chat/[id]` 라우트도 분리했고, 공용 채팅 화면 컴포넌트로 재사용 구조를 정리했습니다.

샵용 채팅 화면에서는 상담 상태를 빠르게 볼 수 있도록 상단 요약 카드도 추가했습니다.

샵용 채팅 화면에서는 희망 일정 카드와 예약 요청 카드로 바로 이동하는 빠른 액션 버튼도 추가했습니다.

예약 진행 상태는 이제 메시지 배열과 분리된 별도 상태 모델로 관리하도록 정리했습니다.

샵 전용 채팅 헤더에는 예약 상태 배지와 고객 정보/상담 종료 액션도 추가했습니다.

샵 입장에서 여러 상담을 볼 수 있도록 `/shop` 상담 목록 화면도 추가했고, 여기서 각 샵 채팅으로 진입할 수 있게 했습니다.

샵 목록과 채팅 화면이 같은 상담 mock 데이터를 보도록 정리했고, 상태 필터와 미확인 메시지/최근 업데이트 표시도 추가했습니다.

메인 화면의 현재 위치는 `expo-location`을 이용해 실제 권한/위치 기반으로 표시되도록 연결했습니다.

샵 상담 목록 화면에는 뒤로가기 버튼도 추가해서 상세 화면이나 이전 흐름에서 자연스럽게 돌아갈 수 있게 했습니다.

샵 상담 목록에서 새 공고 등록 화면으로 들어가고, 입력 후 등록 완료 화면까지 가는 기본 공고 등록 흐름도 만들었습니다.

등록한 공고는 이제 실제 메모리 목록 데이터에 반영되고, 홈 목록/상세/채팅/샵 화면에서 같이 보이도록 연결했습니다.

공고 등록 화면의 날짜와 지원 조건 입력도 구조화된 선택 UI로 바꿨고, 위치는 공개 위치/상세 위치/공개 방식으로 나눠 받도록 정리했습니다.

디자인 원본은 `design-reference/`에서 참고할 수 있습니다.

현재 목표는 먼저 Expo 기본 예제 앱을 제대로 띄우고, RN/Expo 프로젝트 구조를 이해하는 것입니다.

## 앞으로 해야 할 것

### 1. 기본 예제 앱 실행 확인

먼저 기본 Expo 앱이 브라우저 또는 휴대폰에서 뜨는지 확인합니다.

확인할 것:

- `npm.cmd start`가 정상 실행되는지
- Expo 터미널에서 QR 코드 또는 메뉴가 뜨는지
- `w`를 눌렀을 때 웹 브라우저에서 앱이 열리는지
- 필요하면 휴대폰 Expo Go에서도 열리는지

### 2. `src/app/index.tsx` 읽기

첫 화면 코드를 React 개발자 관점에서 읽습니다.

배울 포인트:

- `View`가 웹의 `div`와 어떤 점이 비슷한지
- `Text`를 왜 꼭 써야 하는지
- `StyleSheet`가 CSS와 어떻게 다른지
- `SafeAreaView`가 왜 필요한지

### 3. `src/app/_layout.tsx` 읽기

Expo Router의 레이아웃 구조를 이해합니다.

배울 포인트:

- `_layout.tsx`의 역할
- 탭 네비게이션이 어디에서 연결되는지
- React 웹 라우터와 어떤 점이 다른지

### 4. 기본 예제 화면을 아주 작게 수정해보기

바로 디자인을 적용하기 전에, 기본 화면에서 텍스트 하나 정도만 바꾸면서 RN 수정 흐름을 익힙니다.

예시:

- `Welcome to Expo`를 `Welcome to WinWin`으로 변경
- 저장하면 화면이 자동으로 바뀌는지 확인

### 5. WinWin 디자인 참고 코드 다시 확인

다운로드 받은 `WinWin Matching App Design.zip` 또는 `design-reference` 코드를 참고합니다.

볼 화면:

- HomePage
- MatchingDetailPage
- ChatPage

### 6. RN 화면으로 하나씩 옮기기

디자인 적용은 한 번에 다 하지 않고, 화면 단위로 진행합니다.

추천 순서:

1. 홈 화면
2. 매칭 카드 컴포넌트
3. 상세 화면
4. 채팅 화면
5. 예약/결제 관련 UI

### 7. 샵 전용 채팅 화면 디테일 분리하기

라우트 분리와 공용 컴포넌트 추출은 끝났습니다.

샵용 상태 요약 카드는 추가했지만, 아직 고객용과 샵용이 대부분 같은 공용 UI를 재사용하고 있습니다.

예를 들면:

```text
샵 전용 안내 문구
샵 전용 헤더 액션 버튼
샵 기준 예약 상태 상세
```

### 8. 메인 화면 현재 위치 연결

기본 위치 연결은 끝났습니다.

나중에는:

```text
위치 기준 공고 탐색 연결
권한 거부 시 대체 지역 선택
가까운 공고 정렬
```

같은 보완 작업을 붙일 수 있습니다.

### 9. 샵/사장님 공고 등록 흐름 만들기

기본 등록 화면과 완료 화면은 만들었고, 등록한 공고가 실제 목록에도 반영되도록 연결했습니다.

다음에는:

```text
공고 상태를 홈 목록 노출 방식과 연결
수정 완료 안내 UI 추가
공고 관리 목록에 검색 추가
```

같은 기본 등록 흐름을 먼저 만드는 것이 자연스럽습니다.

### 10. 샵 화면 전용 헤더 버튼 추가

상단 요약 카드, 빠른 이동 버튼, 기본 헤더 액션은 만들었습니다.

나중에는:

```text
예약 상태 변경
상담 종료
고객 정보 보기
```

같은 샵 전용 헤더 액션을 붙일 수 있습니다.

다음에는 이 버튼들을 실제 상태 변경이나 상세 화면 이동과 연결하면 됩니다.

### 11. 샵 상담 목록 고도화

기본 상담 목록 화면은 만들었고, 상태 필터와 최근 업데이트/미확인 표시도 붙였습니다.

다음에는:

```text
최근 메시지 시간
정렬
고객용 목록과 샵용 목록 상태 표현 분리
상담 상태 변경 시 목록과 채팅 동시 갱신
```

같은 관리 기능을 붙일 수 있습니다.

### 12. 실제 결제 연동 붙이기

현재 보증금 결제는 UI 흐름만 구현되어 있습니다.

나중에는 실제 결제 기능을 붙여야 합니다.

후보 작업:

```text
결제 제공사 선택
카카오페이/토스/카드 결제 SDK 또는 API 검토
결제 요청 생성
결제 성공/실패 처리
서버에 결제 결과 저장
예약 상태 업데이트
환불 정책과 환불 처리 연결
```

지금 단계에서는 RN 화면 흐름을 먼저 익히는 중이므로 실제 결제 연동은 미뤄둡니다.

### 13. 사진 첨부 고도화하기

현재 채팅 사진 첨부는 `expo-image-picker`로 앨범에서 이미지 1개를 선택하는 흐름까지 연결했습니다.

나중에 추가할 수 있는 것:

```text
여러 장 선택
카메라 촬영
이미지 업로드 서버 연결
이미지 압축/리사이징
전송 실패 처리
```

## 진행 원칙

- 코드를 바꾸기 전에 먼저 설명합니다.
- 한 번에 많이 바꾸지 않습니다.
- React 웹과 RN의 차이를 비교하면서 진행합니다.
- 완료한 내용은 이 파일이나 별도 md 파일에 계속 정리합니다.
