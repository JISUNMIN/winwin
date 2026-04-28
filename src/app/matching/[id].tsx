import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  formatKoreanDate,
  getCategoryLabel,
  getDaysUntil,
  mockMatchings,
} from '@/data/matchings';

export default function MatchingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const matching = mockMatchings.find((item) => item.id === id);

  if (!matching) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>매칭 정보를 찾을 수 없습니다</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>돌아가기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const daysLeft = getDaysUntil(matching.deadline);
  const isUrgent = daysLeft === '오늘 마감' || daysLeft === '내일 마감';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#15181D" />
        </Pressable>
        <Text style={styles.headerTitle}>매칭 상세</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image
            source={{ uri: matching.image }}
            style={styles.heroImage}
            contentFit="cover"
            transition={120}
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{getCategoryLabel(matching.category)}</Text>
          </View>
          {matching.premium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>프리미엄</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.shopName}>{matching.shopName}</Text>
          <Text style={styles.service}>{matching.service}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={16} color="#747B87" />
            <Text style={styles.metaText}>{matching.location}</Text>
          </View>

          <View style={[styles.deadlineBadge, isUrgent && styles.deadlineBadgeUrgent]}>
            <Ionicons
              name="time-outline"
              size={15}
              color={isUrgent ? '#D33A2C' : '#747B87'}
            />
            <Text style={[styles.deadlineText, isUrgent && styles.deadlineTextUrgent]}>
              {daysLeft}
            </Text>
          </View>
        </View>

        {matching.description && (
          <View style={styles.infoBox}>
            <Text style={styles.sectionTitle}>상세 설명</Text>
            <Text style={styles.description}>{matching.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>지원 조건</Text>
          <View style={styles.requirements}>
            {matching.requirements.map((requirement) => (
              <View key={requirement} style={styles.requirementChip}>
                <Text style={styles.requirementText}>{requirement}</Text>
              </View>
            ))}
          </View>
        </View>

        {matching.availableDates && matching.availableDates.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="calendar-outline" size={18} color="#15181D" />
              <Text style={styles.sectionTitle}>예약 가능 날짜</Text>
            </View>

            <View style={styles.dateGrid}>
              {matching.availableDates.map((date) => (
                <View key={date} style={styles.dateBox}>
                  <Text style={styles.dateText}>{formatKoreanDate(date)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {matching.deposit && (
          <View style={styles.depositBox}>
            <View style={styles.depositIcon}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#2563EB" />
            </View>
            <View style={styles.depositContent}>
              <Text style={styles.depositTitle}>노쇼 방지 보증금</Text>
              <Text style={styles.depositValue}>{matching.deposit.toLocaleString()}원</Text>
              <Text style={styles.depositDescription}>
                예약 시 보증금을 결제하며, 시술 완료 후 전액 환불됩니다.
              </Text>
            </View>
          </View>
        )}

        {matching.portfolio && matching.portfolio.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>포트폴리오</Text>
            <View style={styles.portfolioGrid}>
              {matching.portfolio.map((image, index) => (
                <Image
                  key={`${image}-${index}`}
                  source={{ uri: image }}
                  style={styles.portfolioImage}
                  contentFit="cover"
                  transition={120}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: '/shop/chat/[id]',
              params: { id: matching.id },
            })
          }
          style={styles.secondaryActionButton}>
          <Text style={styles.secondaryActionButtonText}>샵 화면 미리보기</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: '/chat/[id]',
              params: { id: matching.id },
            })
          }
          style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>지원하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    minHeight: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBF0',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#15181D',
    fontSize: 17,
    fontWeight: '800',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingBottom: 112,
  },
  hero: {
    position: 'relative',
    backgroundColor: '#E8EBF0',
  },
  heroImage: {
    width: '100%',
    height: 300,
  },
  categoryBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    borderRadius: 999,
    backgroundColor: '#6D5DFB',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  premiumBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    borderRadius: 999,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  section: {
    marginTop: 14,
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  shopName: {
    color: '#15181D',
    fontSize: 24,
    fontWeight: '900',
  },
  service: {
    marginTop: 8,
    color: '#555B66',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
  },
  metaRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: '#747B87',
    fontSize: 14,
    fontWeight: '700',
  },
  deadlineBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    borderRadius: 999,
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  deadlineBadgeUrgent: {
    backgroundColor: '#FDEDEC',
  },
  deadlineText: {
    color: '#747B87',
    fontSize: 13,
    fontWeight: '800',
  },
  deadlineTextUrgent: {
    color: '#D33A2C',
  },
  infoBox: {
    marginTop: 14,
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#EEF0FF',
    padding: 16,
  },
  sectionTitle: {
    color: '#15181D',
    fontSize: 16,
    fontWeight: '900',
  },
  description: {
    marginTop: 9,
    color: '#555B66',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  requirements: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  requirementChip: {
    borderRadius: 999,
    backgroundColor: '#F1F3F6',
    borderWidth: 1,
    borderColor: '#E8EBF0',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  requirementText: {
    color: '#555B66',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dateGrid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateBox: {
    width: '48%',
    borderRadius: 12,
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dateText: {
    color: '#333842',
    fontSize: 13,
    fontWeight: '800',
  },
  depositBox: {
    marginTop: 14,
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  depositIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositContent: {
    flex: 1,
  },
  depositTitle: {
    color: '#15181D',
    fontSize: 15,
    fontWeight: '900',
  },
  depositValue: {
    marginTop: 5,
    color: '#2563EB',
    fontSize: 24,
    fontWeight: '900',
  },
  depositDescription: {
    marginTop: 7,
    color: '#555B66',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  portfolioGrid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  portfolioImage: {
    width: '48%',
    height: 150,
    borderRadius: 12,
    backgroundColor: '#E8EBF0',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EBF0',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 10,
  },
  secondaryActionButton: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D7DCE4',
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionButtonText: {
    color: '#333842',
    fontSize: 14,
    fontWeight: '900',
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
    fontSize: 16,
    fontWeight: '900',
  },
  notFound: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundTitle: {
    color: '#15181D',
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  secondaryButton: {
    marginTop: 16,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: '#15181D',
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
