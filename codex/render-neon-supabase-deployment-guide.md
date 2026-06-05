# Render + Neon + Supabase Deployment Guide

WinWin을 거의 무료에 가깝게 시작하기 위한 권장 조합입니다.

## 조합

- Backend API: Render free web service
- PostgreSQL: Neon free
- Image storage: Supabase Storage free

## 1. Neon

Neon에서 PostgreSQL 프로젝트를 만든 뒤 connection string을 복사합니다.

백엔드 env:

```text
DB_URL=jdbc:postgresql://<host>/<db>?sslmode=require
DB_USERNAME=<user>
DB_PASSWORD=<password>
```

주의:

- JDBC URL 형식으로 넣기
- `sslmode=require`를 붙이는 편이 안전합니다.

## 2. Supabase

Supabase 프로젝트 생성 후:

- public bucket 이름: `consultation-images`
- project URL 확인
- service role key 확인

백엔드 env:

```text
APP_STORAGE_MODE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_STORAGE_BUCKET=consultation-images
```

## 3. Render

Render에서 새 Web Service 생성:

- Runtime: Docker
- Dockerfile: repo root `Dockerfile`
- Docker Command: 비워두기

## 4. Render 환경변수

```text
APP_ENV=production
SERVER_PORT=10000
JWT_SECRET=<long-random-secret>
DB_URL=<jdbc-url>
DB_USERNAME=<db-user>
DB_PASSWORD=<db-password>
APP_STORAGE_MODE=supabase
SUPABASE_URL=<supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_STORAGE_BUCKET=consultation-images
```

## 5. 프론트 앱 빌드

Render 배포 후 생성된 백엔드 URL 예:

```text
https://winwin-api.onrender.com
```

이 값을 앱 빌드 전 넣습니다.

```powershell
$env:EXPO_PUBLIC_API_BASE_URL="https://winwin-api.onrender.com"
```

## 6. 주의

- Render free는 idle 이후 첫 요청이 느릴 수 있습니다.
- 현재 채팅은 websocket이 아니라 REST 기반이라 무료 환경에도 잘 맞습니다.
- 이미지 저장은 이제 로컬 폴더가 아니라 Supabase Storage로 업로드됩니다.
