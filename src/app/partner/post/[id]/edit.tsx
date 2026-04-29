import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { ProtectedRoleScreen } from '@/components/winwin/ProtectedRoleScreen';
import { ShopPostForm } from '@/components/winwin/ShopPostForm';
import { setPostFeedbackMessage } from '@/data/post-feedback';
import { getPostedMatchingById, updatePostedMatching } from '@/data/matchings';

export default function PartnerPostEditScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const matching = params.id ? getPostedMatchingById(params.id) : null;

  if (!matching || !params.id) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F7F8FA',
          padding: 24,
        }}>
        <Text style={{ color: '#15181D', fontSize: 18, fontWeight: '900' }}>
          수정할 공고를 찾지 못했어요
        </Text>
        <Text
          onPress={() => router.replace('/partner/post' as never)}
          style={{ marginTop: 12, color: '#6D5DFB', fontSize: 14, fontWeight: '900' }}>
          공고 관리로 돌아가기
        </Text>
      </View>
    );
  }

  return (
    <ProtectedRoleScreen
      requiredRole="partner"
      redirectTo={params.id ? `/partner/post/${params.id}/edit` : '/partner/post'}
      loadingTitle="파트너 상태 불러오는 중"
      loadingDescription="저장된 로그인 상태를 확인한 뒤 공고 수정 화면으로 이어갈게요."
      deniedTitle="파트너 로그인 확인 중"
      deniedDescription="파트너 권한으로 로그인하면 기존 공고를 수정할 수 있어요.">
      <ShopPostForm
        mode="edit"
        initialMatching={matching}
        onBack={() => router.back()}
        onSubmit={(draft) => {
          updatePostedMatching(params.id!, draft);
          setPostFeedbackMessage('공고 수정이 완료됐어요.');
          router.replace('/partner/post' as never);
        }}
      />
    </ProtectedRoleScreen>
  );
}
