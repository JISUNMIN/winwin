import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PartnerPostCreatedScreen() {
  const params = useLocalSearchParams<{
    category?: string;
    shopName?: string;
    service?: string;
    location?: string;
    detailLocation?: string;
    locationVisibility?: string;
    requirementCount?: string;
    dateCount?: string;
    deposit?: string;
  }>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconBox}>
          <Ionicons name="checkmark-circle" size={46} color="#16A34A" />
        </View>

        <Text style={styles.title}>공고 등록 완료</Text>
        <Text style={styles.subtitle}>
          기본 공고 등록 mock 흐름이 완료되었습니다. 나중에는 실제 목록 데이터와 연결할 수 있어요.
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{params.shopName ?? '샵 이름 미정'}</Text>
          <Text style={styles.summaryItem}>카테고리: {params.category ?? '-'}</Text>
          <Text style={styles.summaryItem}>서비스: {params.service ?? '-'}</Text>
          <Text style={styles.summaryItem}>공개 위치: {params.location ?? '-'}</Text>
          <Text style={styles.summaryItem}>상세 위치: {params.detailLocation ?? '-'}</Text>
          <Text style={styles.summaryItem}>위치 공개 방식: {params.locationVisibility ?? '-'}</Text>
          <Text style={styles.summaryItem}>지원 조건 수: {params.requirementCount ?? '0'}개</Text>
          <Text style={styles.summaryItem}>가능 날짜 수: {params.dateCount ?? '0'}개</Text>
          <Text style={styles.summaryItem}>보증금: {(params.deposit ?? '0').toString()}원</Text>
        </View>

        <View style={styles.buttonGroup}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/partner' as never)}
            style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>파트너 상담 목록으로 이동</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/partner/post/new' as never)}
            style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>새 공고 다시 등록</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 18,
    color: '#15181D',
    fontSize: 26,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 10,
    color: '#555B66',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    textAlign: 'center',
  },
  summaryCard: {
    width: '100%',
    marginTop: 20,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  summaryTitle: {
    color: '#15181D',
    fontSize: 18,
    fontWeight: '900',
  },
  summaryItem: {
    marginTop: 8,
    color: '#555B66',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonGroup: {
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#6D5DFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7DCE4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#333842',
    fontSize: 14,
    fontWeight: '900',
  },
});
