import { router } from 'expo-router';

import { AccessGuardScreen } from '@/components/winwin/AccessGuardScreen';
import { ShopPostForm } from '@/components/winwin/ShopPostForm';
import { addPostedMatching, categoryLabels } from '@/data/matchings';
import { useRoleGuard } from '@/hooks/use-role-guard';

export default function PartnerPostNewScreen() {
  const canAccess = useRoleGuard('partner', '/partner/post/new');

  if (!canAccess) {
    return (
      <AccessGuardScreen
        title="파트너 로그인 확인 중"
        description="파트너 권한으로 로그인하면 새 공고를 등록할 수 있어요."
      />
    );
  }

  return (
    <ShopPostForm
      mode="create"
      onBack={() => router.back()}
      onSubmit={(draft) => {
        addPostedMatching(draft);

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
          },
        });
      }}
    />
  );
}
