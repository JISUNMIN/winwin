import { useLocalSearchParams } from 'expo-router';

import { ChatScreen } from '@/components/winwin/ChatScreen';
import { ProtectedRoleScreen } from '@/components/winwin/ProtectedRoleScreen';

export default function CustomerChatRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <ProtectedRoleScreen
      requiredRole="customer"
      redirectTo={id ? `/chat/${id}` : '/'}
      loadingTitle="고객 상태 불러오는 중"
      loadingDescription="저장된 로그인 상태를 확인한 뒤 채팅 화면으로 이어갈게요."
      deniedTitle="고객 로그인 확인 중"
      deniedDescription="고객 권한으로 로그인하면 상담과 예약 흐름을 이어서 볼 수 있어요.">
      <ChatScreen initialViewerRole="customer" />
    </ProtectedRoleScreen>
  );
}
