# Codex Notes

이 폴더는 Codex와 함께 RN/Expo를 배우면서 정리하는 로컬 노트 공간입니다.

Git에는 올리지 않기 위해 `.gitignore`에 `codex/`를 추가했습니다.

## 진행 원칙

- 코드를 바로 바꾸기 전에 먼저 설명합니다.
- RN/Expo 개념, 폴더 역할, 실행 방법을 이곳에 Markdown으로 정리합니다.
- 커밋 메시지는 항상 한글로 추천합니다.
- 커밋 메시지를 추천할 때는 현재 변경 감지된 파일과 관련 작업 Markdown을 함께 보고 판단합니다.
- RN/앱 구현 문서는 기존 번호 step 시리즈를 유지합니다.
- 백엔드 구현 문서는 별도 시리즈로 분리하고 `backend-01-...` 형식으로 기록합니다.
- 디자인 적용은 기본 예제를 띄워보고 구조를 이해한 뒤에 진행합니다.
- Step 문서에는 React 개발자가 RN을 이해하기 쉬운 설명을 짧게 적습니다.
  예: `View = div 비슷한 레이아웃 박스`, `Pressable = button 비슷한 인터랙션 컴포넌트`
- Step 문서에는 반드시 `## React 개발자 기준으로 보면` 섹션을 넣습니다.
  여기에는 이번 단계가 웹 React 기준으로 어떤 패턴과 비슷한지 3~6줄 정도로 적습니다.
  예: `AuthProvider`, `protected route`, `localStorage`, `debounce 없는 submit 검색`, `optimistic UI` 같은 비교
- 백엔드 문서에는 `## Express/Next API 개발자 기준으로 보면` 섹션을 넣습니다.
  여기에는 이번 단계가 `Express route`, `middleware`, `service layer`, `ORM model`, `request validation`, `JWT auth` 같은 기준에서 어떻게 대응되는지 3~6줄 정도로 적습니다.
  프론트 Step 문서처럼 React UI 관점으로 비교하지 않고, API 서버 구현 관점으로 비교합니다.
- Step 문서에는 핵심 로직을 2~4줄 정도로라도 적습니다.
  예: 어떤 상태가 어디에 저장되는지, 어떤 함수가 화면을 갱신하는지
- 구현 기록만 적지 않고, 왜 그렇게 동작하는지도 한 줄씩 설명합니다.
- 설명 중에 실제 코드가 있으면 이해가 빨라지는 부분만 `핵심 코드`로 짧게 넣습니다.
  예: 상태 선언, `filter(...)`, `map(...)`, `router.push(...)`, `geocodeAsync(...)`
- 코드블록은 길게 붙이지 않고 3~8줄 정도만 넣고, 방금 설명한 흐름과 직접 연결되는 부분만 고릅니다.

## 현재 단계

1. Expo 기본 예제 앱 생성 완료
2. 기본 앱 실행 확인 중
3. 폴더 구조와 중요한 파일 설명 예정

## 문서 목록

- [01. 기본 앱 실행과 폴더 구조](./01-basic-run-and-folders.md)
- [02. VS Code JSX 에러 정리](./02-vscode-jsx-error.md)
- [03. Expo Go와 Web 실행 문제](./03-expo-go-and-web-troubleshooting.md)
- [04. Metro Bundler와 캐시](./04-metro-bundler-and-cache.md)
- [05. Expo Starter Explore 화면 설명](./05-expo-starter-explore-screen.md)
- [06. WinWin 디자인 RN 적용 계획](./06-winwin-design-porting-plan.md)
- [07. Step 1 디자인 참고 폴더 준비](./07-step-01-design-reference.md)
- [08. Step 2 데이터 모델 옮기기](./08-step-02-data-model.md)
- [09. Step 3 작은 Home 화면 만들기](./09-step-03-minimal-home-screen.md)
- [10. Step 4 카테고리 필터 만들기](./10-step-04-category-filter.md)
- [11. Step 5 매칭 카드 리스트 만들기](./11-step-05-matching-card-list.md)
- [12. Step 6 매칭 상세 화면 연결](./12-step-06-matching-detail-route.md)
- [13. Step 7 지원하기 버튼 상세 이동 문제 해결](./13-step-07-router-layout-fix.md)
- [14. Step 8 채팅 화면 만들기](./14-step-08-chat-route.md)
- [15. Step 9 희망 일정과 예약 확정 요청](./15-step-09-booking-picker.md)
- [16. Step 10 보증금 결제 모달](./16-step-10-payment-modal.md)
- [17. Step 11 채팅 사진 메시지](./17-step-11-chat-photo-message.md)
- [18. Step 12 샵 일정 선택 흐름](./18-step-12-shop-schedule-selection.md)
- [19. Step 13 역할 기반 채팅 보기](./19-step-13-role-based-chat-view.md)
- [20. Step 14 파트너 채팅 라우트 분리](./20-step-14-shop-chat-route-split.md)
- [21. Step 15 파트너 채팅 상태 요약](./21-step-15-shop-chat-status-summary.md)
- [22. Step 16 파트너 채팅 빠른 이동 액션](./22-step-16-shop-chat-quick-actions.md)
- [23. Step 17 예약 상태 모델 분리](./23-step-17-booking-flow-state.md)
- [24. Step 18 파트너 헤더 액션 추가](./24-step-18-shop-header-actions.md)
- [25. Step 19 파트너 상담 목록 화면](./25-step-19-shop-consultation-list.md)
- [26. Step 20 상담 mock 동기화와 파트너 목록 필터](./26-step-20-consultation-mock-sync-and-shop-filters.md)
- [27. Step 21 메인 화면 현재 위치 연결](./27-step-21-home-current-location.md)
- [28. Step 22 파트너 공고 등록 기본 흐름](./28-step-22-shop-post-create-flow.md)
- [29. Step 23 등록 공고 목록 반영](./29-step-23-posted-listing-reflection.md)
- [30. Step 24 공고 등록 구조화 입력](./30-step-24-post-form-structured-inputs.md)
- [31. Step 25 공고 등록 위치 확인과 좌표 저장](./31-step-25-post-location-verification.md)
- [32. Step 26 파트너 공고 관리 목록](./32-step-26-shop-post-management-list.md)
- [33. Step 27 공고 상태값과 관리 필터](./33-step-27-post-status-and-filters.md)
- [34. Step 28 공고 수정 화면](./34-step-28-post-edit-screen.md)
- [35. Step 29 공고 관리 목록 정렬](./35-step-29-post-sort-options.md)
- [36. Step 30 공고 상태와 홈 노출 연결](./36-step-30-post-visibility-on-home.md)
- [37. Step 31 공고 수정 완료 안내 UI](./37-step-31-post-edit-feedback.md)
- [38. Step 32 공고 관리 목록 검색](./38-step-32-shop-post-search.md)
- [39. Step 33 위치 주소 표시와 검색 실행 방식 정리](./39-step-33-location-text-and-search-submit.md)
- [40. Step 34 파트너 용어와 라우트 정리](./40-step-34-partner-terminology-and-routes.md)
- [41. Step 35 Mock 인증과 역할 가드](./41-step-35-mock-auth-and-role-guards.md)
- [42. Step 36 인증 UI와 파트너 진입 동선 조정](./42-step-36-auth-ui-and-partner-entry-adjustments.md)
- [43. Step 37 Mock 인증 상태 유지](./43-step-37-mock-auth-persistence.md)
- [44. Step 38 마지막 진입 화면 복구](./44-step-38-last-route-restore.md)
- [45. Step 39 보호 화면 공용화와 역할 변경 경로 정리](./45-step-39-protected-screen-and-route-cleanup.md)
- [46. WinWin 프로젝트 목표 정리](./46-step-40-auth-cta-polish.md)
- [47. 백엔드 API와 DB 시작 순서](./47-step-41-backend-api-db-kickoff.md)
- [Backend 01. Spring 프로젝트 시작 준비](./backend-01-spring-project-init.md)
- [Backend 02. Auth API 첫 구현 요약](./backend-02-auth-api-first-pass.md)
- [RN 태그 정리 for React 개발자](./rn-tags-for-react-developers.md)
- [개발 중 저장, 새로고침, 재시작, 빌드 차이](./dev-server-refresh-build.md)
- [진행 기록과 다음 할 일](./progress-and-next-steps.md)

## 백엔드 문서 규칙

- `47-step-41-backend-api-db-kickoff.md`는 백엔드 전환점 문서로 유지합니다.
- 이후 실제 백엔드 작업 기록은 `backend-01-...`, `backend-02-...` 형식으로 분리합니다.
- 예: `backend-01-spring-project-init.md`, `backend-02-postgresql-setup.md`
- 백엔드 문서의 비교 섹션 제목은 `## Express/Next API 개발자 기준으로 보면`으로 통일합니다.
- 백엔드 문서에서는 React 화면 개발 비유보다 `route handler`, `middleware`, `service`, `repository`, `ORM`, `schema validation`, `JWT` 흐름 비교를 우선합니다.
- 다만 작업 중심이 백엔드 API 구현 자체보다 프론트 화면/UX 변경 쪽으로 넘어가면, 그 시점부터는 다시 기존 `48-step-...` 같은 Step 시리즈로 이어갑니다.
- 즉 `backend-xx`는 백엔드 구현이나 auth/post/chat API 연동 축이 메인일 때 쓰고, `step-xx`는 프론트 작업 비중이 더 클 때 사용합니다.

## API 연동 방식

- API는 한 번에 전부 만든 뒤 한꺼번에 붙이지 않습니다.
- 기능 단위로 API를 만들고, 같은 기능 단위로 RN 화면에 바로 연결합니다.
- 기본 순서는 `auth -> post -> chat` 흐름으로 진행합니다.
- 즉 `백엔드 구현` 문서와 `프론트 연동` 문서를 짝처럼 이어가며 진행합니다.

## 앞으로의 정리 방식

- 한 단계가 끝날 때마다 별도 Markdown 파일을 만듭니다.
- `README.md`에는 문서 목록만 짧게 관리합니다.
- 실행 방법, 폴더 설명, RN 개념, 디자인 적용 기록을 주제별로 나눠서 적습니다.
