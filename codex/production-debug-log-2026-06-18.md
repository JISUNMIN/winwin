# Production Debug Log - 2026-06-18

## User Report

- Matching detail page did not open.
- Signup and login-related flows showed `Failed to fetch`.
- User requested real testing by case and a single markdown log under `codex/`.

## Reproduced Issues

### 1. Dynamic detail routes returned 404 on Vercel

- Reproduced with:
  - `curl -I https://winwin-azure.vercel.app/matching/1`
- Observed result:
  - `HTTP/1.1 404 Not Found`
  - `X-Vercel-Error: NOT_FOUND`
- Root cause:
  - Expo static export generated dynamic route files such as `dist/matching/[id].html`
  - Vercel did not know how to map `/matching/1` to that static artifact

### 2. Signup failed from web because backend CORS rejected Vercel origin

- Reproduced with:
  - preflight request to `https://winwin-api.onrender.com/api/auth/signup`
  - `Origin: https://winwin-azure.vercel.app`
- Observed result:
  - `HTTP/1.1 403 Forbidden`
  - response body: `Invalid CORS request`
- Root cause:
  - backend CORS config only allowed localhost and LAN development origins
  - production web origin on `*.vercel.app` was not allowed

## Fixes Applied

### Frontend / Web deploy

- Updated `vercel.json`
  - changed web build API base to `/api-proxy`
  - added Vercel proxy rewrite from `/api-proxy/*` to `https://winwin-api.onrender.com/*`
  - added SPA-style rewrites for dynamic routes so Vercel serves the app entry instead of returning `404`:
    - `/matching/:id`
    - `/chat/:id`
    - `/partner/chat/:id`
    - `/partner/post/:id/edit`
  - disabled production fallback data by setting `EXPO_PUBLIC_ENABLE_DEV_FALLBACK_DATA=false`

### Backend / API

- Updated `backend/src/main/java/com/winwin/backend/config/SecurityConfig.java`
  - added production-friendly allowed origin patterns:
    - `https://*.vercel.app`
    - `https://winwin-azure.vercel.app`

### UX hardening

- Updated `src/api/http.ts`
  - network-level fetch failures no longer leak raw browser text such as `Failed to fetch`
  - users now get a localized retry message:
    - `서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.`

### Home screen data binding fix

- Updated `src/app/(tabs)/index.tsx`
  - fixed `filteredMatchings` memo dependencies so the home list actually refreshes when API-loaded `matchings` change
  - this resolved the deployed web case where `/api/posts` returned data but the UI still showed `0개`
  - removed the early `!isFocused` guard for the initial home fetch so web can load posts on first render instead of waiting on a navigation focus state

### Production data cleanup

- Updated `backend/src/main/java/com/winwin/backend/config/DevelopmentDataInitializer.java`
  - development seed now only runs when `app.environment=development`
  - this change is code-complete locally, but needs a fresh Render backend deploy to take effect in production

### Posts API timeout hardening

- Updated `backend/src/main/java/com/winwin/backend/post/MatchingPostRepository.java`
  - removed the list/detail `EntityGraph` that was joining owner plus both element collections in one query path
- Updated `backend/src/main/java/com/winwin/backend/post/PostService.java`
  - switched post loading to explicit initialization inside the transaction before mapping the response
- Updated `backend/src/main/java/com/winwin/backend/post/MatchingPost.java`
  - changed the two `@ElementCollection` fields to Hibernate `SUBSELECT` fetch mode
- Updated `backend/src/main/resources/application.yml`
  - added `hibernate.default_batch_fetch_size: 50` for safer lazy loading in list/detail flows
- Updated `backend/src/main/java/com/winwin/backend/consultation/ConsultationService.java`
  - aligned consultation post lookup with the repository change
- Added `backend/src/test/java/com/winwin/backend/post/PostServiceTest.java`
  - verifies discoverable post mapping and closed-post rejection

### Web interaction fix

- Updated `src/components/app-tabs.web.tsx`
  - reduced the web tab bar hit area
  - switched the outer floating tab wrapper to `pointerEvents=\"box-none\"`
  - fixed the top navigation overlay intercepting clicks on account actions such as `로그아웃`

### Regression test added

- Added `backend/src/test/java/com/winwin/backend/auth/AuthControllerWebMvcTest.java`
  - verifies CORS preflight for `https://winwin-azure.vercel.app` is accepted on `/api/auth/signup`

## Test Cases Run

### Before fix

1. Direct route test
   - `https://winwin-azure.vercel.app/matching/1`
   - result: `404`

2. Signup CORS preflight test
   - `OPTIONS https://winwin-api.onrender.com/api/auth/signup`
   - origin: `https://winwin-azure.vercel.app`
   - result: `403 Invalid CORS request`

### After code change

1. Backend tests
   - command: `cmd /c .\mvnw.cmd test`
   - result: passed

2. Static web export
   - command: `cmd /c npm.cmd run web:export:portfolio`
   - result: passed

3. Live health check through Vercel proxy
   - `GET https://winwin-azure.vercel.app/api-proxy/api/health`
   - result: `200 OK`

4. Live signup API check through Vercel proxy
   - `POST https://winwin-azure.vercel.app/api-proxy/api/auth/signup`
   - result: success

5. Live login API check through Vercel proxy
   - `POST https://winwin-azure.vercel.app/api-proxy/api/auth/login`
   - result: success

6. Live posts list check through Vercel proxy
   - `GET https://winwin-azure.vercel.app/api-proxy/api/posts`
   - result: `200 OK`

7. Dynamic detail route direct access
   - `GET https://winwin-azure.vercel.app/matching/1`
   - result after redeploy: `200 OK`

8. Browser-rendered customer signup flow
   - result:
     - no `Failed to fetch`
     - redirected to `/`
     - logged-in state visible on screen

9. Browser-rendered partner signup flow
   - result:
     - redirected to `/partner`
     - `/partner/post` opened successfully
     - `내 공고 관리` rendered

10. Web logout click regression check
   - result:
     - after signup/login, `로그아웃` action returned the screen to guest state
     - overlay interception from the floating web tab bar was removed

11. Production fallback removal check
   - result:
     - home screen no longer shows bundled mock cards when API data is unavailable
     - current production behavior is `real API only`, which means an API timeout now shows an empty list instead of fake cards

12. Local production-like `/api/posts` smoke test against Neon
   - backend started locally with:
     - `APP_ENV=production`
     - Neon DB credentials
     - Supabase storage config
   - result:
     - `/api/posts` responded successfully
     - SQL log confirmed the fetch plan changed from one large multi-join query to:
       - base `matching_posts` query
       - owner lookup
       - `requirements` subselect fetch
       - `availableDates` subselect fetch

13. Backend regression tests after timeout hardening
   - command: `cmd /c .\\mvnw.cmd test`
   - result: passed

14. Frontend regression checks after home list fix
   - command: `cmd /c npx.cmd tsc --noEmit`
   - result: passed
   - command: `cmd /c npm.cmd run web:export:portfolio`
   - result: passed

## Next Verification Targets

1. Rebuild Android APK if the latest web/API error-handling changes should also be reflected in the installable mobile build
2. Redeploy Render backend so the production-only seed guard in `DevelopmentDataInitializer.java` is actually applied live
3. Verify the fresh Vercel deployment renders real posts on the home screen after the `filteredMatchings` dependency fix
4. If Render backend will be called directly from other web domains later, deploy the backend CORS change from `SecurityConfig.java`
5. Decide whether previously inserted sample seed rows in production Neon should be cleaned up one time
