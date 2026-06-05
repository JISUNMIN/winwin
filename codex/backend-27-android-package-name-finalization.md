# backend-27-android-package-name-finalization

## 이번에 한 일

- Android 패키지명을 `com.zentropy_dev.WinWin`에서 `com.winwin.app`으로 변경했다.
- `app.json`과 `android/gradle.properties`를 같은 값으로 맞췄다.
- `android/app/build.gradle`의 기본 fallback 값도 새 패키지명으로 변경했다.
- Play Store 업로드 가이드와 체크리스트 문서도 새 패키지명 기준으로 갱신했다.

## 이유

기존 패키지명은 개발자 개인/임시 네이밍 느낌이 강했고, Play Store 첫 업로드 이후에는 패키지명을 바꾸기 어렵다.

그래서 지금 시점에서 더 중립적이고 서비스 기준에 맞는:

- `com.winwin.app`

으로 맞춰 두는 편이 이후 운영에 유리하다.

## 현재 의미

- Expo 설정의 Android package
- native Android applicationId / namespace 기준값
- release metadata check 기준값

이 모두 동일하게 `com.winwin.app`으로 통일됐다.
