import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  formatConsultationUpdatedText,
  mockShopConsultations,
  type ConsultationStatusTone,
} from '@/data/consultations';
import { formatKoreanDate, getPostedMatchings, mockMatchings } from '@/data/matchings';

type FilterKey = 'all' | ConsultationStatusTone;

const statusFilterOptions: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'waiting', label: '대기' },
  { key: 'review', label: '검토중' },
  { key: 'payment', label: '결제대기' },
  { key: 'confirmed', label: '확정' },
];

function getStatusStyles(tone: ConsultationStatusTone) {
  if (tone === 'confirmed') {
    return {
      badge: styles.statusBadgeConfirmed,
      text: styles.statusTextConfirmed,
    };
  }

  if (tone === 'payment') {
    return {
      badge: styles.statusBadgePayment,
      text: styles.statusTextPayment,
    };
  }

  if (tone === 'waiting') {
    return {
      badge: styles.statusBadgeWaiting,
      text: styles.statusTextWaiting,
    };
  }

  return {
    badge: styles.statusBadgeReview,
    text: styles.statusTextReview,
  };
}

export default function ShopHomeScreen() {
  const isFocused = useIsFocused();
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('all');
  const [postedMatchings, setPostedMatchings] = useState(() => getPostedMatchings());

  useEffect(() => {
    if (isFocused) {
      setPostedMatchings(getPostedMatchings());
    }
  }, [isFocused]);

  const consultationItems = useMemo(
    () =>
      mockShopConsultations
        .map((status) => {
          const matching = mockMatchings.find((item) => item.id === status.matchingId);

          if (!matching) {
            return null;
          }

          return {
            ...status,
            matching,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [],
  );

  const filteredConsultationItems = consultationItems.filter((item) =>
    selectedFilter === 'all' ? true : item.statusTone === selectedFilter,
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#15181D" />
          </Pressable>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>샵 상담 목록</Text>
          <Text style={styles.subtitle}>진행 중인 상담과 예약 상태를 한 번에 확인하세요.</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/shop/post/new' as never)}
          style={styles.createPostButton}>
          <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.createPostButtonText}>새 공고 등록</Text>
        </Pressable>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>진행 중 상담</Text>
            <Text style={styles.summaryValue}>{consultationItems.length}건</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>결제 대기</Text>
            <Text style={styles.summaryValue}>
              {consultationItems.filter((item) => item.statusTone === 'payment').length}건
            </Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          {statusFilterOptions.map((option) => {
            const isSelected = selectedFilter === option.key;

            return (
              <Pressable
                accessibilityRole="button"
                key={option.key}
                onPress={() => setSelectedFilter(option.key)}
                style={[styles.filterButton, isSelected && styles.filterButtonSelected]}>
                <Text style={[styles.filterButtonText, isSelected && styles.filterButtonTextSelected]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {postedMatchings.length > 0 && (
          <View style={styles.postedSection}>
            <View style={styles.postedSectionHeader}>
              <Text style={styles.postedSectionTitle}>내가 등록한 공고</Text>
              <Text style={styles.postedSectionCount}>{postedMatchings.length}개</Text>
            </View>

            <View style={styles.postedCardList}>
              {postedMatchings.map((matching) => (
                <Pressable
                  accessibilityRole="button"
                  key={matching.id}
                  onPress={() =>
                    router.push({
                      pathname: '/matching/[id]',
                      params: { id: matching.id },
                    })
                  }
                  style={styles.postedCard}>
                  <Text numberOfLines={1} style={styles.postedCardTitle}>
                    {matching.shopName}
                  </Text>
                  <Text numberOfLines={1} style={styles.postedCardService}>
                    {matching.service}
                  </Text>
                  <Text style={styles.postedCardMeta}>
                    가능 날짜 {matching.availableDates?.length ?? 0}개 · 보증금{' '}
                    {(matching.deposit ?? 0).toLocaleString()}원
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View style={styles.list}>
          {filteredConsultationItems.map((item) => {
            const statusStyles = getStatusStyles(item.statusTone);

            return (
              <Pressable
                accessibilityRole="button"
                key={item.matching.id}
                onPress={() =>
                  router.push({
                    pathname: '/shop/chat/[id]',
                    params: { id: item.matching.id },
                  })
                }
                style={styles.card}>
                <Image
                  source={{ uri: item.matching.image }}
                  style={styles.cardImage}
                  contentFit="cover"
                />

                <View style={styles.cardBody}>
                  <View style={styles.cardTopRow}>
                    <Text numberOfLines={1} style={styles.shopName}>
                      {item.matching.shopName}
                    </Text>
                    <View style={[styles.statusBadge, statusStyles.badge]}>
                      <Text style={[styles.statusText, statusStyles.text]}>{item.statusLabel}</Text>
                    </View>
                  </View>

                  <Text numberOfLines={1} style={styles.service}>
                    {item.matching.service}
                  </Text>

                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={15} color="#747B87" />
                    <Text style={styles.infoText}>
                      가능 날짜{' '}
                      {formatKoreanDate(item.matching.availableDates?.[0] ?? item.matching.deadline)}
                    </Text>
                  </View>

                  <View style={styles.metaRow}>
                    <View style={styles.metaChip}>
                      <Ionicons name="time-outline" size={14} color="#747B87" />
                      <Text style={styles.metaText}>
                        최근 업데이트 {formatConsultationUpdatedText(item.updatedAt)}
                      </Text>
                    </View>

                    {item.unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>미확인 {item.unreadCount}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.summaryText}>{item.summary}</Text>

                  <View style={styles.enterRow}>
                    <Text style={styles.enterText}>상담 열기</Text>
                    <Ionicons name="chevron-forward" size={18} color="#6D5DFB" />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  topBar: {
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: '#15181D',
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 8,
    color: '#555B66',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  summaryRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
  },
  createPostButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#6D5DFB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  createPostButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  summaryLabel: {
    color: '#747B87',
    fontSize: 12,
    fontWeight: '800',
  },
  summaryValue: {
    marginTop: 8,
    color: '#15181D',
    fontSize: 24,
    fontWeight: '900',
  },
  filterRow: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    minHeight: 36,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonSelected: {
    backgroundColor: '#15181D',
  },
  filterButtonText: {
    color: '#555B66',
    fontSize: 13,
    fontWeight: '800',
  },
  filterButtonTextSelected: {
    color: '#FFFFFF',
  },
  list: {
    marginTop: 18,
    gap: 14,
  },
  postedSection: {
    marginTop: 18,
  },
  postedSectionHeader: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postedSectionTitle: {
    color: '#15181D',
    fontSize: 17,
    fontWeight: '900',
  },
  postedSectionCount: {
    color: '#747B87',
    fontSize: 12,
    fontWeight: '800',
  },
  postedCardList: {
    gap: 10,
  },
  postedCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 14,
  },
  postedCardTitle: {
    color: '#15181D',
    fontSize: 15,
    fontWeight: '900',
  },
  postedCardService: {
    marginTop: 6,
    color: '#555B66',
    fontSize: 13,
    fontWeight: '700',
  },
  postedCardMeta: {
    marginTop: 8,
    color: '#747B87',
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#E8EBF0',
  },
  cardBody: {
    padding: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shopName: {
    flex: 1,
    color: '#15181D',
    fontSize: 17,
    fontWeight: '900',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusBadgeReview: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgePayment: {
    backgroundColor: '#DBEAFE',
  },
  statusBadgeConfirmed: {
    backgroundColor: '#EDE9FE',
  },
  statusBadgeWaiting: {
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
  },
  statusTextReview: {
    color: '#15803D',
  },
  statusTextPayment: {
    color: '#1D4ED8',
  },
  statusTextConfirmed: {
    color: '#6D5DFB',
  },
  statusTextWaiting: {
    color: '#6B7280',
  },
  service: {
    marginTop: 8,
    color: '#555B66',
    fontSize: 14,
    fontWeight: '700',
  },
  infoRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    color: '#747B87',
    fontSize: 12,
    fontWeight: '700',
  },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  metaChip: {
    borderRadius: 999,
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: '#747B87',
    fontSize: 11,
    fontWeight: '800',
  },
  unreadBadge: {
    borderRadius: 999,
    backgroundColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  unreadBadgeText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '900',
  },
  summaryText: {
    marginTop: 12,
    color: '#333842',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
  },
  enterRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
  },
  enterText: {
    color: '#6D5DFB',
    fontSize: 13,
    fontWeight: '900',
  },
});
