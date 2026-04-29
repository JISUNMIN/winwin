import { useLocalSearchParams } from 'expo-router';

import { ChatScreen } from '@/components/winwin/ChatScreen';
import { ProtectedRoleScreen } from '@/components/winwin/ProtectedRoleScreen';

export default function PartnerChatRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <ProtectedRoleScreen
      requiredRole="partner"
      redirectTo={id ? `/partner/chat/${id}` : '/partner'}
      loadingTitle="파트너 상태 불러오는 중"
      loadingDescription="저장된 로그인 상태를 확인한 뒤 상담 화면으로 이어갈게요."
      deniedTitle="파트너 로그인 확인 중"
      deniedDescription="파트너 권한으로 로그인하면 상담 상태와 예약 진행 현황을 볼 수 있어요.">
      <ChatScreen initialViewerRole="partner" />
    </ProtectedRoleScreen>
  );
}
