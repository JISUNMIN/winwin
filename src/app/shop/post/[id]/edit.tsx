import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { ShopPostForm } from '@/components/winwin/ShopPostForm';
import { getPostedMatchingById, updatePostedMatching } from '@/data/matchings';

export default function ShopPostEditScreen() {
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
          onPress={() => router.replace('/shop/post' as never)}
          style={{ marginTop: 12, color: '#6D5DFB', fontSize: 14, fontWeight: '900' }}>
          공고 관리로 돌아가기
        </Text>
      </View>
    );
  }

  return (
    <ShopPostForm
      mode="edit"
      initialMatching={matching}
      onBack={() => router.back()}
      onSubmit={(draft) => {
        updatePostedMatching(params.id!, draft);
        router.replace('/shop/post' as never);
      }}
    />
  );
}
