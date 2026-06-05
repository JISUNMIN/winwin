# Android Play Store Release Guide

WinWin Android 앱을 Play Console에 올릴 때 쓰는 최소 가이드입니다.

## 1. 먼저 정해야 할 것

- Android 패키지명
  - 현재 값: `com.winwin.app`
  - 첫 업로드 이후에는 바꾸기 어렵기 때문에, 회사/브랜드 기준으로 최종 확인 후 진행하는 편이 안전합니다.
- Expo 계정 / EAS 프로젝트 연결
- Play Console 개발자 계정

## 2. 현재 프로젝트 설정

- `eas.json` 추가됨
  - `development`: 개발용 client
  - `preview`: 내부 배포용 APK
  - `production`: Play 업로드용 AAB
- Android 식별자/버전값은 `android/gradle.properties`에서 관리
  - `WINWIN_ANDROID_APPLICATION_ID`
  - `WINWIN_ANDROID_VERSION_CODE`
  - `WINWIN_ANDROID_VERSION_NAME`
- production/profile에서는 개발용 role switch와 fallback data를 끕니다.
- Android `targetSdkVersion`은 현재 Play 요구사항을 넘는 수준으로 설정되어 있습니다.

## 3. 빌드 전에 채울 것

EAS secret 또는 로컬 env 기준:

```text
EXPO_PUBLIC_API_BASE_URL=https://your-api-host
```

백엔드는 기존 운영 env가 모두 채워져 있어야 합니다.

## 4. 권장 순서

1. Expo 로그인

```powershell
npx eas-cli login
```

2. 프로젝트 연결

```powershell
npx eas-cli project:init
```

3. 내부 테스트용 APK 빌드

```powershell
npm.cmd run android:release:check
npm.cmd run android:build:preview
```

4. Play 업로드용 AAB 빌드

```powershell
npm.cmd run android:build:production
```

5. 첫 업로드

- Play Console에서 앱 생성
- `production` 빌드 산출물 `.aab` 수동 업로드
- 이후 필요하면 `submit` 자동화 사용

## 5. 업로드 직전 확인

- `npm.cmd run release:check`
- `npm.cmd run android:release:check`
- 고객/파트너 실계정 수동 QA 1회
- 예약금 계좌이체 흐름, 이미지 업로드, 상담 종료 확인
- 운영 `APP_UPLOAD_DIR` 영속 경로 확인

## 6. 민감 정보

- `.jks`, 서비스 계정 키 파일은 git에 올리지 않기
- Play Console 서비스 계정 JSON을 쓸 경우 별도 보관

## 7. 현재 남은 사람 확인 작업

- Play Console 앱 생성
- 앱 이름/설명/아이콘/스크린샷 입력
- 개인정보처리방침, 앱 콘텐츠 설문, 데이터 세이프티 작성
- 테스트 트랙 또는 production 공개 판단
