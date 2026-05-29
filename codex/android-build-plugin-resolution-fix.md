# Android 빌드 플러그인 해석 오류 수정

이번에는 Android 쪽에서 아래 오류가 나던 문제를 먼저 고쳤습니다.

```text
Plugin [id: 'com.android.library'] was not found in any of the following sources
```

## 원인

현재 `android/settings.gradle`에는 `pluginManagement` 블록이 있었지만, 플러그인 저장소(`google`, `mavenCentral`, `gradlePluginPortal`)가 빠져 있었습니다.

또 `android/build.gradle`의 Android Gradle Plugin classpath가 버전 없이 선언되어 있어서, Gradle이 `com.android.library` 플러그인을 안정적으로 해석하지 못하는 상태였습니다.

즉 문제의 핵심은:

- 플러그인 저장소 정보 부족
- AGP 버전 정보 누락

두 가지가 겹친 설정 문제였습니다.

## 이번에 바꾼 것

- `android/settings.gradle`의 `pluginManagement`에 아래 저장소를 추가했습니다.
  - `gradlePluginPortal()`
  - `google()`
  - `mavenCentral()`
- `android/build.gradle`에 Android/RN 0.83 기준 공용 버전을 명시했습니다.
  - `buildToolsVersion = 36.0.0`
  - `minSdkVersion = 24`
  - `compileSdkVersion = 36`
  - `targetSdkVersion = 36`
  - `kotlinVersion = 2.1.20`
  - `ndkVersion = 27.1.12297006`
- `com.android.tools.build:gradle` classpath에 `8.12.0` 버전을 명시했습니다.
- Kotlin Gradle Plugin도 위 공용 `kotlinVersion`을 사용하도록 맞췄습니다.

## 핵심 로직

`settings.gradle`에서 플러그인 저장소를 잡아줬습니다.

```gradle
pluginManagement {
  repositories {
    gradlePluginPortal()
    google()
    mavenCentral()
  }
}
```

루트 `build.gradle`에서는 AGP/Kotlin/SDK 버전을 명시했습니다.

```gradle
classpath('com.android.tools.build:gradle:8.12.0')
classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
```

## React 개발자 기준으로 보면

이건 UI 코드 문제라기보다, 웹으로 치면 bundler와 framework plugin 버전 연결이 어긋난 상태를 바로잡은 작업입니다.

예를 들어 Vite나 Next plugin이 설치돼 있어도, plugin registry 설정이나 peer version 연결이 빠지면 빌드가 시작도 못 하는 것과 비슷합니다.

앱 코드 자체보다 “Android 빌드 시스템이 프로젝트를 읽을 수 있게 만드는” 바닥 정리 단계라고 보면 됩니다.

## 확인한 것

- `android\\gradlew.bat help --stacktrace`
- `android\\gradlew.bat help`

둘 다 성공했고, Expo/React Native/Expo Modules 설정 단계가 정상 통과하는 것을 확인했습니다.

## 다음 참고

Android 쪽에서 다시 비슷한 플러그인 해석 오류가 나면 먼저 이 두 파일을 봅니다.

- `android/settings.gradle`
- `android/build.gradle`
