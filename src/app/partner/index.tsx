import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getPartnerConsultations,
  mapConsultationResponseToPartnerConsultation,
} from '@/api/consultations';
import { getPartnerPosts, mapPostResponseToMatching } from '@/api/posts';
import { useAuth } from '@/auth/mock-auth';
import { ProtectedRoleScreen } from '@/components/winwin/ProtectedRoleScreen';
import {
  formatConsultationUpdatedText,
  mockPartnerConsultations,
  type PartnerConsultation,
  type ConsultationStatusTone,
} from '@/data/consultations';
import {
  formatKoreanDate,
  getAllMatchings,
  getPostedMatchings,
  mockMatchings,
  type Matching,
} from '@/data/matchings';

type FilterKey = 'all' | ConsultationStatusTone;

const statusFilterOptions: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'waiting', label: '대기' },
  { key: 'review', label: '검토중' },
  { key: 'payment', label: '결제대기' },
  { key: 'confirmed', label: '확정' },
  { key: 'closed', label: '종료' },
];

function getStatusStyles(tone: ConsultationStatusTone) {
  if (tone === 'closed') {
    return {
      badge: styles.statusBadgeClosed,
      text: styles.statusTextClosed,
    };
  }

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

export default function PartnerHomeScreen() {
  return (
    <ProtectedRoleScreen
      requiredRole="partner"
      redirectTo="/partner"
      loadingTitle="파트너 상태 불러오는 중"
      loadingDescription="저장된 로그인 상태를 확인한 뒤 상담 목록으로 이어갈게요."
      deniedTitle="파트너 로그인 확인 중"
      deniedDescription="파트너 권한으로 로그인하면 상담 목록과 공고 관리 화면으로 들어갈 수 있어요.">
      <PartnerHomeContent />
    </ProtectedRoleScreen>
  );
}

function PartnerHomeContent() {
  const isFocused = useIsFocused();
  const { accessToken, authSource } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('all');
  const [postedMatchings, setPostedMatchings] = useState(() => getPostedMatchings());
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<PartnerConsultation[]>(mockPartnerConsultations);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let isMounted = true;

    const loadPosts = async () => {
      setLoadError(null);

      if (authSource === 'api' && accessToken) {
        setIsLoadingPosts(true);

        try {
          const response = await getPartnerPosts(accessToken);

          if (isMounted) {
            setPostedMatchings(response.map(mapPostResponseToMatching));
          }
          return;
        } catch {
          if (isMounted) {
            setLoadError('서버 공고를 불러오지 못해 상담 카드는 일부 mock 정보를 함께 보여주고 있어요.');
          }
        } finally {
          if (isMounted) {
            setIsLoadingPosts(false);
          }
        }
      }

      if (isMounted) {
        setPostedMatchings(getPostedMatchings());
        setIsLoadingPosts(false);
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, [accessToken, authSource, isFocused]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let isMounted = true;

    const loadConsultations = async () => {
      if (authSource === 'api' && accessToken) {
        try {
          const response = await getPartnerConsultations(accessToken);

          if (isMounted) {
            setConsultations(response.map(mapConsultationResponseToPartnerConsultation));
          }
          return;
        } catch {
          if (isMounted) {
            setLoadError(
              '상담 목록 API를 불러오지 못해 일부 상담은 mock 데이터로 보여주고 있어요.',
            );
          }
        }
      }

      if (isMounted) {
        setConsultations(mockPartnerConsultations);
      }
    };

    loadConsultations();

    return () => {
      isMounted = false;
    };
  }, [accessToken, authSource, isFocused]);

  const matchingById = useMemo(() => {
    const entries = new Map<string, Matching>();

    for (const matching of getAllMatchings()) {
      entries.set(matching.id, matching);
    }

    for (const matching of mockMatchings) {
      if (!entries.has(matching.id)) {
        entries.set(matching.id, matching);
      }
    }

    for (const matching of postedMatchings) {
      entries.set(matching.id, matching);
    }

    return entries;
  }, [postedMatchings]);

  const consultationItems = useMemo(
    () =>
      consultations
        .map((status) => {
          const matching = matchingById.get(status.matchingId);

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
    [consultations, matchingById],
  );

  const filteredConsultationItems = consultationItems.filter((item) =>
    selectedFilter === 'all' ? true : item.statusTone === selectedFilter,
  );
  const activeConsultationCount = consultationItems.filter((item) => item.statusTone !== 'closed').length;
  const closedConsultationCount = consultationItems.filter((item) => item.statusTone === 'closed').length;
  const paymentPendingCount = consultationItems.filter((item) => item.statusTone === 'payment').length;

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
          <Text style={styles.title}>파트너 상담 목록</Text>
          <Text style={styles.subtitle}>진행 중인 상담과 예약 상태를 한 번에 확인하세요.</Text>
        </View>

        {loadError ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#B45309" />
            <Text style={styles.errorBannerText}>{loadError}</Text>
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/partner/post' as never)}
          style={styles.managePostButton}>
          <Ionicons name="document-text-outline" size={18} color="#15181D" />
          <View style={styles.managePostTextBlock}>
            <Text style={styles.managePostButtonText}>공고 관리</Text>
            <Text style={styles.managePostButtonSubtext}>
              등록한 공고 {postedMatchings.length}개를 따로 관리
            </Text>
          </View>
          {isLoadingPosts ? <ActivityIndicator size="small" color="#6D5DFB" /> : null}
          <Ionicons name="chevron-forward" size={18} color="#15181D" />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/partner/post/new' as never)}
          style={styles.createPostButton}>
          <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.createPostButtonText}>새 공고 등록</Text>
        </Pressable>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>진행 중 상담</Text>
            <Text style={styles.summaryValue}>{activeConsultationCount}건</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>결제 대기</Text>
            <Text style={styles.summaryValue}>{paymentPendingCount}건</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>종료됨</Text>
            <Text style={styles.summaryValue}>{closedConsultationCount}건</Text>
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

        <View style={styles.consultationSectionHeader}>
          <Text style={styles.consultationSectionTitle}>상담 목록</Text>
          <Text style={styles.consultationSectionText}>
            공고는 위 `공고 관리`에서, 상담은 아래 목록에서 확인하세요.
          </Text>
        </View>

        <View style={styles.list}>
          {filteredConsultationItems.map((item) => {
            const statusStyles = getStatusStyles(item.statusTone);

            return (
              <Pressable
                accessibilityRole="button"
                key={item.matching.id}
                onPress={() =>
                  router.push({
                    pathname: '/partner/chat/[id]',
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
  errorBanner: {
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    color: '#B45309',
    fontSize: 13,
    fontWeight: '800',
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
  managePostButton: {
    minHeight: 48,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  managePostTextBlock: {
    flex: 1,
  },
  managePostButtonText: {
    color: '#15181D',
    fontSize: 14,
    fontWeight: '900',
  },
  managePostButtonSubtext: {
    marginTop: 3,
    color: '#747B87',
    fontSize: 11,
    fontWeight: '700',
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
  consultationSectionHeader: {
    marginTop: 18,
  },
  consultationSectionTitle: {
    color: '#15181D',
    fontSize: 18,
    fontWeight: '900',
  },
  consultationSectionText: {
    marginTop: 6,
    color: '#747B87',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  list: {
    marginTop: 18,
    gap: 14,
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
  statusBadgeClosed: {
    backgroundColor: '#FEE2E2',
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
  statusTextClosed: {
    color: '#B91C1C',
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
