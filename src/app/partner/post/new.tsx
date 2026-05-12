import { router } from 'expo-router';

import { createPartnerPost, mapPostDraftToCreatePayload } from '@/api/posts';
import { useAuth } from '@/auth/mock-auth';
import { ProtectedRoleScreen } from '@/components/winwin/ProtectedRoleScreen';
import { ShopPostForm } from '@/components/winwin/ShopPostForm';
import { addPostedMatching, categoryLabels } from '@/data/matchings';

export default function PartnerPostNewScreen() {
  const { accessToken, authSource } = useAuth();

  return (
    <ProtectedRoleScreen
      requiredRole="partner"
      redirectTo="/partner/post/new"
      loadingTitle="파트너 상태 불러오는 중"
      loadingDescription="저장된 로그인 상태를 확인한 뒤 새 공고 등록 화면으로 이어갈게요."
      deniedTitle="파트너 로그인 확인 중"
      deniedDescription="파트너 권한으로 로그인하면 새 공고를 등록할 수 있어요.">
      <ShopPostForm
        mode="create"
        onBack={() => router.back()}
        onSubmit={async (draft) => {
          const usesApi = authSource === 'api' && !!accessToken;

          if (usesApi && accessToken) {
            await createPartnerPost(accessToken, mapPostDraftToCreatePayload(draft));
          } else {
            addPostedMatching(draft);
          }

          router.push({
            pathname: '/partner/post/created',
            params: {
              category: categoryLabels[draft.category],
              shopName: draft.shopName,
              service: draft.service,
              location: draft.location,
              detailLocation: draft.locationDetail ?? '',
              locationVisibility:
                draft.locationVisibility === 'summary-only'
                  ? '예약 후 상세 위치 안내'
                  : '처음부터 상세 위치 공개',
              requirementCount: String(draft.requirements.length),
              dateCount: String(draft.availableDates.length),
              deposit: String(draft.deposit),
              source: usesApi ? 'api' : 'mock',
            },
          });
        }}
      />
    </ProtectedRoleScreen>
  );
}
