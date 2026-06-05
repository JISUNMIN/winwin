# WinWin

WinWin is a React Native + Expo client with a Spring Boot backend for customer/partner matching, consultation chat, schedule coordination, and booking confirmation.

## Stack

- Frontend: Expo, React Native, Expo Router, TypeScript
- Backend: Spring Boot, Spring Security, Spring Data JPA, PostgreSQL
- Media: local file upload storage served from `/uploads/**`

## Local Run

### Frontend

1. Install packages

```powershell
npm.cmd install
```

2. Create an env file from `.env.example`

3. Start Expo

```powershell
npm.cmd run start
```

### Backend

1. Start PostgreSQL
2. Run Spring Boot

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

## Required Environment Variables

### Frontend

```text
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

Optional development flags:

```text
EXPO_PUBLIC_ENABLE_DEV_ROLE_SWITCH=true
EXPO_PUBLIC_ENABLE_DEV_FALLBACK_DATA=true
```

Production builds should leave both development flags unset or set them to `false`.

### Backend

```text
DB_URL=jdbc:postgresql://localhost:5432/winwin
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=replace-with-a-long-random-secret
SERVER_PORT=8080
APP_ENV=development
APP_UPLOAD_DIR=uploads
```

Production recommendations:

```text
APP_ENV=production
APP_UPLOAD_DIR=/managed/persistent/path
```

Health endpoint response now includes:

- `service`
- `environment`
- `uploadDirectoryReady`
- `uploadDirectory`

## Production Guards

The project now blocks a few dangerous deployment mistakes:

- Frontend production build fails early when `EXPO_PUBLIC_API_BASE_URL` is missing
- Backend production startup fails when `JWT_SECRET` still uses the development default
- Backend production startup fails when `APP_UPLOAD_DIR` is left at the default local `uploads` path

## Verification

Frontend typecheck:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
```

Backend tests:

```powershell
cd backend
.\mvnw.cmd test
```

Release readiness sweep:

```powershell
npm.cmd run release:check
```

In Windows PowerShell, prefer `npm.cmd` instead of `npm`.

This command expects a live backend at `http://localhost:8080` by default.
If needed, override it with `WINWIN_BACKEND_URL`.

Android Gradle config check:

```powershell
cd android
.\gradlew.bat help
```

## Android Play Store

This repo now includes an `eas.json` for Expo Application Services.

Useful commands:

```powershell
npm.cmd run android:release:check
npm.cmd run android:build:preview
npm.cmd run android:build:production
npm.cmd run android:submit:production
```

Recommended flow:

1. `npx eas-cli login`
2. `npx eas-cli project:init`
3. Set `EXPO_PUBLIC_API_BASE_URL` to the real API host
4. If needed, update `android/gradle.properties`
5. Run `npm.cmd run android:release:check`
6. Run `npm.cmd run android:build:production`
7. Upload the generated `.aab` to Play Console

See:

- [codex/android-play-store-release-guide.md](./codex/android-play-store-release-guide.md)

## Deployment Checklist

See:

- [codex/deployment-readiness-checklist.md](./codex/deployment-readiness-checklist.md)

## Project Notes

Detailed work logs and architectural notes are tracked in:

- [codex/README.md](./codex/README.md)
