# 17. Step 11 채팅 사진 메시지

## 목표

채팅 입력창의 사진 버튼이 실제로 동작하도록 만듭니다.

사진 버튼을 누르면 실제 앨범 또는 파일 선택 창을 열고, 선택한 이미지를 채팅 메시지로 보냅니다.

## 만든 파일

```text
src/components/winwin/ImageMessageCard.tsx
```

## 수정한 파일

```text
src/app/chat/[id].tsx
package.json
package-lock.json
```

## 설치한 패키지

```powershell
npx.cmd expo install expo-image-picker
```

`expo-image-picker`는 Expo에서 앨범/카메라 이미지 선택을 도와주는 라이브러리입니다.

## 현재 동작 흐름

```text
1. 채팅 화면 진입
2. 입력창 왼쪽 사진 버튼 클릭
3. 앨범 권한 확인
4. 앨범 또는 파일 선택 창 열림
5. 사진 선택
6. 고객 이미지 메시지가 오른쪽에 추가
7. 샵 자동 답장 추가
```

## 권한 확인

사진 버튼을 누르면 먼저 앨범 접근 권한을 확인합니다.

```ts
const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
```

권한이 없으면 안내 메시지를 띄우고 중단합니다.

```ts
Alert.alert('앨범 권한 필요', '사진을 보내려면 앨범 접근 권한이 필요합니다.');
```

## 이미지 선택

앨범은 아래 API로 엽니다.

```ts
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ['images'],
  quality: 0.82,
  allowsEditing: false,
});
```

선택된 이미지의 `uri`를 채팅 메시지의 `imageUri`에 저장합니다.

## Message 타입 확장

채팅 메시지 타입에 `image`를 추가했습니다.

```ts
type Message = {
  id: string;
  sender: 'user' | 'shop';
  type: 'text' | 'image' | 'desired-schedule' | 'booking-request';
  content: string;
  timestamp: Date;
  imageUri?: string;
};
```

메시지 종류에 따라 다른 UI를 렌더링합니다.

```text
text             -> 일반 말풍선
image            -> 이미지 메시지 카드
desired-schedule -> 고객 희망 일정 카드
booking-request  -> 샵 예약 확정 요청 카드
```

## 아직 하지 않은 것

지금은 앨범에서 이미지 1개를 선택하는 흐름입니다.

나중에 추가할 수 있는 것:

```text
여러 장 선택
카메라 촬영
이미지 업로드 서버 연결
이미지 압축/리사이징
전송 실패 처리
```

## 검증

아래 명령으로 TypeScript 검사를 했습니다.

```powershell
npx.cmd tsc --noEmit --pretty false
```

결과:

```text
통과
```
