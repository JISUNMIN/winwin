# backend-30-supabase-storage-for-low-cost-deploy

## 이번에 한 일

- 상담 이미지 저장 구조를 interface 기반으로 분리했다.
- 로컬 저장 구현 `LocalConsultationImageStorage`를 추가했다.
- Supabase Storage 업로드 구현 `SupabaseConsultationImageStorage`를 추가했다.
- `APP_STORAGE_MODE`로 `local / supabase`를 전환할 수 있게 했다.
- local 모드일 때만 `/uploads/**` 정적 핸들러를 등록하도록 바꿨다.
- production 가드에 Supabase 필수 env 검증을 추가했다.
- health endpoint가 storage mode에 맞는 readiness를 보여주도록 바꿨다.
- Render + Neon + Supabase 배포 가이드를 문서화했다.

## 왜 필요한가

Render free web service는 서버 로컬 디스크를 영속 업로드 저장소처럼 믿기 어렵다.

그래서:

- DB는 Neon free
- API는 Render free
- 파일은 Supabase Storage free

로 분리하는 편이 초기 비용과 운영 안정성의 균형이 가장 좋다.

## 새 환경변수

- `APP_STORAGE_MODE`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
