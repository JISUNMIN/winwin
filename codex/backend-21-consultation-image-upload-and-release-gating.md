# Backend 21. 상담 이미지 업로드와 운영 빌드 개발 기능 가리기

이번 단계에서는 배포를 막고 있던 두 가지를 줄였습니다.

- 채팅 이미지가 실제 API 세션에서도 서버에 저장되도록 전환
- 운영 빌드에서는 개발용 빠른 역할 전환 UI가 기본 노출되지 않도록 분리

## 이번에 한 것

### 1. 상담 이미지 업로드 API 추가

고객/파트너 모두 상담 채팅에서 이미지를 서버로 업로드할 수 있게 했습니다.

추가 엔드포인트:

- `POST /api/customer/consultations/{postId}/images`
- `POST /api/partner/consultations/{postId}/images`

방식:

- `multipart/form-data`
- `file` 파라미터로 이미지 파일 전송
- `content`는 선택 텍스트

## 2. 백엔드 파일 저장 구조

새 `ConsultationImageStorage` 서비스에서 이미지를 로컬 파일로 저장합니다.

저장 경로 기본값:

```text
uploads/consultations/{year}/{month}/...
```

응답 메시지에는 `/uploads/...` 상대 경로를 넣고,
프론트에서 API base URL을 붙여 실제 이미지 URL로 사용하도록 했습니다.

## 3. 업로드 정적 공개 경로 추가

`UploadResourceConfig`를 추가해서 `/uploads/**`를 로컬 파일 경로와 연결했습니다.

또 `SecurityConfig`에서 `/uploads/**`를 인증 없이 읽을 수 있게 열었습니다.

즉 업로드 후 채팅 이미지 카드는 바로 같은 서버 URL로 다시 볼 수 있습니다.

## 4. 채팅 프론트 실제 업로드 전환

이전 단계에서는 API 세션에서 이미지 버튼을 막고 안내만 띄웠습니다.

이번에는:

- `requestMultipart(...)` 추가
- `sendCustomerConsultationImage(...)`
- `sendPartnerConsultationImage(...)`

를 통해 실제 업로드 후 상담 응답 전체를 다시 받아서 채팅 상태를 갱신합니다.

## 5. 운영 빌드에서 개발용 빠른 전환 숨기기

`src/config/app-flags.ts`를 추가하고:

- `EXPO_PUBLIC_ENABLE_DEV_ROLE_SWITCH=true`
- 또는 `__DEV__`

일 때만 auth 화면과 홈 화면의 개발용 빠른 전환 UI가 보이게 했습니다.

따라서 기본 운영 빌드에서는 고객/파트너 mock 전환 버튼이 노출되지 않습니다.

## 바뀐 핵심 파일

- `backend/src/main/java/com/winwin/backend/consultation/ConsultationImageStorage.java`
- `backend/src/main/java/com/winwin/backend/config/UploadResourceConfig.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationService.java`
- `backend/src/main/java/com/winwin/backend/consultation/CustomerConsultationController.java`
- `backend/src/main/java/com/winwin/backend/consultation/PartnerConsultationController.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationMessage.java`
- `backend/src/main/java/com/winwin/backend/consultation/ConsultationMessageType.java`
- `backend/src/main/resources/application.yml`
- `src/api/http.ts`
- `src/api/consultations.ts`
- `src/components/winwin/ChatScreen.tsx`
- `src/app/auth/index.tsx`
- `src/app/(tabs)/index.tsx`
- `src/config/app-flags.ts`
- `.env.example`
- `.gitignore`

## 확인

- `.\node_modules\.bin\tsc.cmd --noEmit`
- `backend\.\mvnw.cmd test`

## 지금 기준 남은 큰 배포 작업

- 운영 환경변수 값을 실제 배포 환경 기준으로 채우기
- 핵심 동선 수동 QA
- mock fallback 데이터를 운영 빌드에서 더 줄일지 결정
