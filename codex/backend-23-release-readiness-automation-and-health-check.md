# Backend 23. 배포 자동 점검과 health 응답 확장

이번 단계에서는 배포 직전에 사람이 놓치기 쉬운 항목을 자동으로 다시 확인하는 쪽을 정리했습니다.

## 무엇을 했는지

- `/api/health` 응답에 단순 `ok`만이 아니라 운영 점검에 필요한 정보를 같이 담았습니다.
- 루트에 `scripts/check-release-readiness.ps1`를 추가해서 프론트 타입 검사, 백엔드 테스트, health 응답 확인을 한 번에 돌릴 수 있게 했습니다.
- 루트 `package.json`에 `npm run release:check` 스크립트를 연결했습니다.
- `.env.example`, `README.md`, `deployment-readiness-checklist.md`도 새 체크 흐름에 맞게 갱신했습니다.

## 핵심 로직

- `HealthStatusService`가 현재 환경명과 업로드 디렉터리 준비 상태를 계산해서 health 응답으로 내립니다.
- `check-release-readiness.ps1`는 먼저 타입 검사와 테스트를 통과시킨 뒤, 실제 떠 있는 백엔드의 `/api/health`를 호출합니다.
- health 응답에서 `service === "winwin-backend"` 와 `uploadDirectoryReady === true`를 강하게 확인해서, 배포 직전에 업로드 경로가 비정상인 상태를 놓치지 않게 했습니다.

## 핵심 코드

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
.\mvnw.cmd test
$health = Invoke-RestMethod -Uri $healthUrl -Method Get
```

```powershell
if (-not $health.uploadDirectoryReady) {
  throw "Upload directory is not ready: $($health.uploadDirectory)"
}
```

## 왜 이렇게 했는지

- 지금 WinWin의 큰 남은 리스크는 새 기능 추가보다 `배포 환경에서 설정이 빠지는 실수`입니다.
- 특히 채팅 이미지 업로드가 들어가면서 `APP_UPLOAD_DIR`가 실제로 준비됐는지 확인하는 것이 중요해졌습니다.
- 그래서 테스트 통과만 보는 대신 `실행 중 백엔드 상태`도 같이 확인하도록 바꿨습니다.

## Express/Next API 개발자 기준으로 보면

- Spring의 `HealthStatusService`는 Express에서 health route가 환경 정보와 storage readiness를 계산해 JSON으로 내려주는 helper와 비슷합니다.
- `DeploymentGuard`는 Next.js custom server나 Node bootstrap 단계에서 production env를 검사하고 잘못된 secret이면 프로세스를 죽이는 startup assertion에 가깝습니다.
- `check-release-readiness.ps1`는 `npm run typecheck && npm test && curl /api/health`를 묶어둔 release smoke script와 같은 역할입니다.
- 즉 이번 단계는 새 business API 추가보다 `운영 전 smoke test 자동화`에 초점이 있습니다.

## 확인 명령

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
backend\.\mvnw.cmd test
npm.cmd run release:check
```

Windows PowerShell에서는 `npm` 대신 `npm.cmd`를 쓰는 편이 안전합니다.

`npm.cmd run release:check`는 실행 중인 백엔드가 필요하고, 기본 주소는 `http://localhost:8080`입니다.
