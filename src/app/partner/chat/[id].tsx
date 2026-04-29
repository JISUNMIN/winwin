import { useLocalSearchParams } from 'expo-router';

import { AccessGuardScreen } from '@/components/winwin/AccessGuardScreen';
import { ChatScreen } from '@/components/winwin/ChatScreen';
import { useRoleGuard } from '@/hooks/use-role-guard';

export default function PartnerChatRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const canAccess = useRoleGuard('partner', id ? `/partner/chat/${id}` : '/partner');

  if (!canAccess) {
    return (
      <AccessGuardScreen
        title="파트너 로그인 확인 중"
        description="파트너 권한으로 로그인하면 상담 상태와 예약 진행 현황을 볼 수 있어요."
      />
    );
  }

  return <ChatScreen initialViewerRole="partner" />;
}
