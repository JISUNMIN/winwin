import { useLocalSearchParams } from 'expo-router';

import { AccessGuardScreen } from '@/components/winwin/AccessGuardScreen';
import { ChatScreen } from '@/components/winwin/ChatScreen';
import { useRoleGuard } from '@/hooks/use-role-guard';

export default function CustomerChatRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const canAccess = useRoleGuard('customer', id ? `/chat/${id}` : '/');

  if (!canAccess) {
    return (
      <AccessGuardScreen
        title="고객 로그인 확인 중"
        description="고객 권한으로 로그인하면 상담과 예약 흐름을 이어서 볼 수 있어요."
      />
    );
  }

  return <ChatScreen initialViewerRole="customer" />;
}
