# backend-31-render-docker-deploy-path

## 이번에 한 일

- Render가 Java를 native runtime으로 제공하지 않는 현재 기준에 맞춰 Docker 배포 경로를 추가했다.
- 루트에 `Dockerfile`을 추가해서 Spring Boot backend를 멀티 스테이지 빌드로 패키징하게 했다.
- 루트에 `.dockerignore`를 추가해서 불필요한 프론트 산출물과 로컬 로그가 Docker build context에 포함되지 않게 했다.

## 왜 필요한가

Render 공식 문서 기준으로 JVM 언어(Java/Kotlin/Scala)는 Docker 이미지로 배포하는 것이 권장 경로다.

그래서:

- Render `Language = Docker`
- repo 루트 `Dockerfile`

조합으로 바로 배포할 수 있게 맞췄다.

## Render에서 쓰는 값

- Language: `Docker`
- Dockerfile Path: 기본값(루트 `Dockerfile`)
- Docker Command: 비워둬도 됨

환경변수는 기존 Render + Neon + Supabase 조합 그대로 사용한다.
