import { router } from 'expo-router';

import { ShopPostForm } from '@/components/winwin/ShopPostForm';
import { addPostedMatching, categoryLabels } from '@/data/matchings';

export default function PartnerPostNewScreen() {
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
