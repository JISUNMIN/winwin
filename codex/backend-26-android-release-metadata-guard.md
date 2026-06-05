# backend-26-android-release-metadata-guard

## 이번에 한 일

- Android 패키지명과 버전 정보를 `android/gradle.properties`로 분리했다.
- `android/app/build.gradle`이 이 값을 읽도록 바꿨다.
- `scripts/check-android-release-readiness.ps1`를 추가했다.
- 루트 명령 `npm run android:release:check`를 추가했다.
- README와 Play Store 가이드에 새 점검 순서를 반영했다.

## 이유

Play Store 업로드 직전에 가장 자주 실수하는 항목이 패키지명, versionCode, versionName 같은 release metadata다.

이 값을 한 파일에서 관리하게 만들고, 빌드 전에 자동 점검하게 하면:

- `app.json`과 native Android 설정이 어긋나는 문제
- production 빌드 전에 `EXPO_PUBLIC_API_BASE_URL` 누락을 못 보고 지나가는 문제
- 첫 업로드 후 바꾸기 어려운 패키지명을 무심코 밀어넣는 문제

를 줄일 수 있다.

## 현재 점검 항목

- `app.json` package와 Gradle applicationId 일치 여부
- `WINWIN_ANDROID_VERSION_CODE` 정수 여부
- `WINWIN_ANDROID_VERSION_NAME` 존재 여부
- `eas.json` production build/submit profile 존재 여부
- 현재 shell의 `EXPO_PUBLIC_API_BASE_URL` 존재 여부 경고

## 남은 것

- 실제 Play Console 앱 생성
- 운영 API 주소를 넣고 production `.aab` 생성
- 첫 업로드 후 내부 테스트 또는 공개 트랙 진행
