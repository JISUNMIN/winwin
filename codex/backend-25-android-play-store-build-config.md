# backend-25-android-play-store-build-config

## 이번에 한 일

- Expo `eas.json`을 추가해서 Android 빌드 프로필을 정리했다.
- `development / preview / production` 빌드 목적을 분리했다.
- production 빌드에서는 개발용 role switch / fallback data가 꺼지도록 env를 고정했다.
- 루트 `package.json`에 EAS Android build / submit 스크립트를 추가했다.
- Play Store 업로드용 가이드를 별도 md로 남겼다.
- `.gitignore`에 Play Console 서비스 계정 키 파일 패턴을 추가했다.

## 이유

지금까지는 앱 기능과 배포 가드 중심으로는 많이 정리됐지만, Android 스토어 업로드를 실제로 누가 어떤 명령으로 해야 하는지가 프로젝트 안에 명확히 적혀 있지 않았다.

이번 단계로 다음이 가능해졌다.

- 내부 테스트 APK 빌드 경로 분리
- Play 업로드용 production AAB 빌드 경로 분리
- 팀 내에서 같은 명령으로 빌드/제출 반복 가능

## 남은 것

- Expo 계정 로그인 및 `eas project:init`
- Play Console 앱 생성
- 실제 `EXPO_PUBLIC_API_BASE_URL` 운영값 주입
- production `.aab` 빌드 후 Play 수동 첫 업로드
