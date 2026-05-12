import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import {
  getPartnerPost,
  mapPostDraftToCreatePayload,
  mapPostResponseToMatching,
  updatePartnerPost as updatePartnerPostApi,
} from '@/api/posts';
import { useAuth } from '@/auth/mock-auth';
import { ProtectedRoleScreen } from '@/components/winwin/ProtectedRoleScreen';
import { ShopPostForm } from '@/components/winwin/ShopPostForm';
import { setPostFeedbackMessage } from '@/data/post-feedback';
import { getPostedMatchingById, updatePostedMatching } from '@/data/matchings';

export default function PartnerPostEditScreen() {
  const { accessToken, authSource } = useAuth();
  const params = useLocalSearchParams<{ id?: string }>();
  const [matching, setMatching] = useState(() =>
    params.id && authSource !== 'api' ? getPostedMatchingById(params.id) : null,
  );
  const [isLoading, setIsLoading] = useState(authSource === 'api');

  useEffect(() => {
    if (!params.id) {
      setIsLoading(false);
      return;
    }

    if (authSource !== 'api' || !accessToken) {
      setMatching(getPostedMatchingById(params.id));
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadPost = async () => {
      try {
        const response = await getPartnerPost(accessToken, Number(params.id));

        if (isMounted) {
          setMatching(mapPostResponseToMatching(response));
        }
      } catch {
        if (isMounted) {
          setMatching(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPost();

    return () => {
      isMounted = false;
    };
  }, [accessToken, authSource, params.id]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F7F8FA',
          gap: 12,
        }}>
        <ActivityIndicator size="small" color="#6D5DFB" />
        <Text style={{ color: '#555B66', fontSize: 14, fontWeight: '700' }}>
          수정할 공고를 불러오고 있어요
        </Text>
      </View>
    );
  }

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
        onSubmit={async (draft) => {
          if (authSource === 'api' && accessToken) {
            await updatePartnerPostApi(accessToken, Number(params.id), mapPostDraftToCreatePayload(draft));
          } else {
            updatePostedMatching(params.id!, draft);
          }

          setPostFeedbackMessage('공고 수정이 완료됐어요.');
          router.replace('/partner/post' as never);
        }}
      />
    </ProtectedRoleScreen>
  );
}
