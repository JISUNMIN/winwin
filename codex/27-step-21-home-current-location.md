# 27. Step 21 메인 화면 현재 위치 연결

## 목표

메인 화면의 현재 위치를 고정 텍스트가 아니라 실제 위치 권한과 현재 좌표 기반으로 표시하도록 바꿉니다.

## 수정한 파일

```text
src/app/(tabs)/index.tsx
package.json
package-lock.json
```

## 설치한 패키지

```powershell
npx.cmd expo install expo-location
```

## 바뀐 내용

기존:

```text
현재 위치
강남구 역삼동
```

현재:

- 앱 시작 시 위치 권한 요청
- 현재 좌표 가져오기
- 가능하면 주소 역변환
- 위치 문자열 표시
- `새로고침` 버튼으로 다시 확인 가능
- 실패하면 오류 문구 표시

## 구현 흐름

홈 화면에서 `handleFetchLocation()`을 만들어 아래 순서로 동작하게 했습니다.

```text
위치 권한 요청
-> 현재 위치 좌표 가져오기
-> reverseGeocode로 주소 변환
-> 위치 텍스트 표시
```

주소를 못 가져오면 좌표값을 간단한 문자열로 보여주도록 처리했습니다.

## UI 변화

위치 박스에 아래 요소가 추가됐습니다.

- 로딩 인디케이터
- `새로고침` 버튼
- 오류 메시지

즉, 이제 메인 화면의 위치 영역이 단순 텍스트가 아니라 실제 상태가 있는 UI가 됐습니다.

## React 개발자 기준으로 보면

- 이건 웹에서 `navigator.geolocation`으로 위치를 받아오는 컴포넌트를 만든 것과 비슷합니다.
- RN에서는 브라우저 API 대신 `expo-location` 패키지를 사용합니다.
- 로딩/성공/실패 상태를 `useState`로 들고 있고, 버튼을 누르면 다시 비동기 요청을 실행하는 전형적인 React 패턴입니다.

## 핵심 로직

- `handleFetchLocation()`이 위치 권한 요청, 현재 좌표 조회, reverse geocode를 순서대로 처리합니다.
- 성공하면 위치 문자열 상태를 업데이트하고, 실패하면 에러 상태를 업데이트합니다.
- 화면은 이 상태값에 따라 로딩 인디케이터, 위치 텍스트, 에러 문구를 조건부 렌더링합니다.

## 핵심 코드

```ts
const permission = await Location.requestForegroundPermissionsAsync();
const position = await Location.getCurrentPositionAsync();
const addresses = await Location.reverseGeocodeAsync(position.coords);
```

브라우저 geolocation 대신 `expo-location`으로 권한 요청, 좌표 조회, 주소 변환을 순서대로 처리합니다.

## 검증

아래 명령으로 TypeScript 검사를 했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```

## 다음에 이어서 할 만한 것

- 위치 기준으로 가까운 공고 정렬하기
- 위치 권한 거부 시 대체 지역 선택 UI 만들기
- 샵/사장님 공고 등록 화면 만들기
