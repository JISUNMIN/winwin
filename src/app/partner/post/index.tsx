import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getPartnerPosts as getPartnerPostsApi,
  mapPostResponseToMatching,
  mapPostStatusToApi,
  updatePartnerPostStatus as updatePartnerPostStatusApi,
} from '@/api/posts';
import { useAuth } from '@/auth/mock-auth';
import { ProtectedRoleScreen } from '@/components/winwin/ProtectedRoleScreen';
import { consumePostFeedbackMessage } from '@/data/post-feedback';
import {
  formatKoreanDate,
  getPostedMatchings,
  type MatchingPostStatus,
  updatePostedMatchingStatus,
} from '@/data/matchings';

type FilterKey = 'all' | MatchingPostStatus;
type SortKey = 'latest' | 'date' | 'deposit';

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'open', label: '모집중' },
  { key: 'closed', label: '마감' },
];

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'latest', label: '최신 등록순' },
  { key: 'date', label: '가까운 날짜순' },
  { key: 'deposit', label: '보증금 높은순' },
];

function getSortValueDate(value?: string) {
  return value ? new Date(value).getTime() : Number.MAX_SAFE_INTEGER;
}

export default function ShopPostManageScreen() {
  return (
    <ProtectedRoleScreen
      requiredRole="partner"
      redirectTo="/partner/post"
      loadingTitle="파트너 상태 불러오는 중"
      loadingDescription="저장된 로그인 상태를 확인한 뒤 공고 관리 화면으로 이어갈게요."
      deniedTitle="파트너 로그인 확인 중"
      deniedDescription="파트너 권한으로 로그인하면 등록한 공고를 수정하고 마감 상태를 관리할 수 있어요.">
      <ShopPostManageContent />
    </ProtectedRoleScreen>
  );
}

function ShopPostManageContent() {
  const isFocused = useIsFocused();
  const { accessToken, authSource } = useAuth();
  const [postedMatchings, setPostedMatchings] = useState(() => getPostedMatchings());
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('all');
  const [selectedSort, setSelectedSort] = useState<SortKey>('latest');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let isMounted = true;

    const loadPosts = async () => {
      setFeedbackMessage(consumePostFeedbackMessage());
      setLoadError(null);

      if (authSource === 'api' && accessToken) {
        try {
          const response = await getPartnerPostsApi(accessToken);

          if (isMounted) {
            setPostedMatchings(response.map(mapPostResponseToMatching));
          }
          return;
        } catch {
          if (isMounted) {
            setLoadError('서버 공고 목록을 불러오지 못해 임시 mock 목록을 보여주고 있어요.');
          }
        }
      }

      if (isMounted) {
        setPostedMatchings(getPostedMatchings());
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, [accessToken, authSource, isFocused]);

  useEffect(() => {
    if (!feedbackMessage) {
      return;
    }

    const timeout = setTimeout(() => {
      setFeedbackMessage(null);
    }, 2400);

    return () => clearTimeout(timeout);
  }, [feedbackMessage]);

  const openCreateScreen = () => router.push('/partner/post/new' as never);
  const openCount = postedMatchings.filter((matching) => matching.postStatus !== 'closed').length;
  const closedCount = postedMatchings.filter((matching) => matching.postStatus === 'closed').length;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredMatchings = useMemo(
    () =>
      postedMatchings.filter((matching) => {
        const matchesFilter =
          selectedFilter === 'all' ? true : (matching.postStatus ?? 'open') === selectedFilter;

        if (!matchesFilter) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const searchableText = [
          matching.shopName,
          matching.service,
          matching.location,
          ...matching.requirements,
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      }),
    [postedMatchings, selectedFilter, normalizedQuery],
  );
  const sortedMatchings = useMemo(() => {
    const items = [...filteredMatchings];

    if (selectedSort === 'date') {
      return items.sort((left, right) => {
        const leftDate = getSortValueDate(left.availableDates?.[0] ?? left.deadline);
        const rightDate = getSortValueDate(right.availableDates?.[0] ?? right.deadline);
        return leftDate - rightDate;
      });
    }

    if (selectedSort === 'deposit') {
      return items.sort((left, right) => (right.deposit ?? 0) - (left.deposit ?? 0));
    }

    return items;
  }, [filteredMatchings, selectedSort]);

  const togglePostStatus = async (id: string, nextStatus: MatchingPostStatus) => {
    if (authSource === 'api' && accessToken) {
      try {
        const updatedPost = await updatePartnerPostStatusApi(
          accessToken,
          Number(id),
          mapPostStatusToApi(nextStatus),
        );

        setPostedMatchings((current) =>
          current.map((matching) =>
            matching.id === id ? mapPostResponseToMatching(updatedPost) : matching,
          ),
        );
        setLoadError(null);
        return;
      } catch {
        setLoadError('공고 상태를 서버에 반영하지 못했어요. 잠시 후 다시 시도해 주세요.');
        return;
      }
    }

    updatePostedMatchingStatus(id, nextStatus);
    setPostedMatchings(getPostedMatchings());
  };

  const handleApplySearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

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
          <Text style={styles.title}>내 공고 관리</Text>
          <Text style={styles.subtitle}>등록한 공고를 모아 보고, 상세 화면으로 바로 들어갈 수 있어요.</Text>
        </View>

        {feedbackMessage ? (
          <View style={styles.feedbackBanner}>
            <Ionicons name="checkmark-circle" size={18} color="#15803D" />
            <Text style={styles.feedbackBannerText}>{feedbackMessage}</Text>
          </View>
        ) : null}

        {loadError ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#B45309" />
            <Text style={styles.errorBannerText}>{loadError}</Text>
          </View>
        ) : null}

        <View style={styles.summaryCard}>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>등록한 공고</Text>
            <Text style={styles.summaryValue}>{postedMatchings.length}개</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>모집중</Text>
            <Text style={styles.summaryValueSmall}>{openCount}개</Text>
          </View>

          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>마감</Text>
            <Text style={styles.summaryValueSmall}>{closedCount}개</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={openCreateScreen}
            style={styles.createButton}>
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.createButtonText}>새 공고 등록</Text>
          </Pressable>
        </View>

        {postedMatchings.length > 0 && (
          <>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color="#8A8F98" />
              <TextInput
                value={searchInput}
                onChangeText={setSearchInput}
                placeholder="샵 이름, 서비스, 위치, 조건으로 검색"
                placeholderTextColor="#8A8F98"
                style={styles.searchInput}
                returnKeyType="search"
                onSubmitEditing={handleApplySearch}
              />
              <Pressable
                accessibilityRole="button"
                onPress={handleApplySearch}
                style={styles.searchActionButton}>
                <Text style={styles.searchActionButtonText}>검색</Text>
              </Pressable>
              {searchInput.trim() ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={handleClearSearch}
                  style={styles.clearSearchButton}>
                  <Ionicons name="close-circle" size={18} color="#8A8F98" />
                </Pressable>
              ) : null}
            </View>

            <View style={styles.filterRow}>
              {filterOptions.map((option) => {
                const isSelected = selectedFilter === option.key;

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={option.key}
                    onPress={() => setSelectedFilter(option.key)}
                    style={[styles.filterChip, isSelected && styles.filterChipSelected]}>
                    <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.sortRow}>
              {sortOptions.map((option) => {
                const isSelected = selectedSort === option.key;

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={option.key}
                    onPress={() => setSelectedSort(option.key)}
                    style={[styles.sortChip, isSelected && styles.sortChipSelected]}>
                    <Text style={[styles.sortChipText, isSelected && styles.sortChipTextSelected]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {postedMatchings.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="document-text-outline" size={28} color="#8A8F98" />
            <Text style={styles.emptyTitle}>아직 등록한 공고가 없어요</Text>
            <Text style={styles.emptyText}>첫 공고를 등록하면 여기서 날짜, 위치, 보증금을 한 번에 관리할 수 있어요.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={openCreateScreen}
              style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>첫 공고 등록하기</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {sortedMatchings.length > 0 ? (
              sortedMatchings.map((matching) => {
                const nextDate = matching.availableDates?.[0] ?? matching.deadline;
                const locationGuide =
                  matching.locationVisibility === 'summary-only'
                    ? '예약 후 상세 위치 안내'
                    : '상세 위치 바로 공개';
                const isClosed = matching.postStatus === 'closed';

                return (
                  <View key={matching.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text numberOfLines={1} style={styles.shopName}>
                        {matching.shopName}
                      </Text>
                      <View style={[styles.statusBadge, isClosed && styles.statusBadgeClosed]}>
                        <Text style={[styles.statusBadgeText, isClosed && styles.statusBadgeTextClosed]}>
                          {isClosed ? '마감' : '모집중'}
                        </Text>
                      </View>
                    </View>

                    <Text numberOfLines={1} style={styles.service}>
                      {matching.service}
                    </Text>

                    <View style={styles.metaRow}>
                      <Ionicons name="location-outline" size={15} color="#747B87" />
                      <Text numberOfLines={1} style={styles.metaText}>
                        {matching.location} · {locationGuide}
                      </Text>
                    </View>

                    <View style={styles.metaRow}>
                      <Ionicons name="calendar-outline" size={15} color="#747B87" />
                      <Text style={styles.metaText}>
                        다음 가능 날짜 {formatKoreanDate(nextDate)}
                      </Text>
                    </View>

                    <View style={styles.bottomRow}>
                      <Text style={styles.bottomText}>
                        조건 {matching.requirements.length}개 · 보증금 {(matching.deposit ?? 0).toLocaleString()}원
                      </Text>
                    </View>

                    <View style={styles.actionRow}>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() =>
                          router.push({
                            pathname: '/partner/post/[id]/edit',
                            params: { id: matching.id },
                          })
                        }
                        style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>수정</Text>
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        onPress={() =>
                          router.push({
                            pathname: '/matching/[id]',
                            params: { id: matching.id },
                          })
                        }
                        style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>상세 보기</Text>
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        onPress={() => togglePostStatus(matching.id, isClosed ? 'open' : 'closed')}
                        style={[styles.primaryButton, isClosed && styles.primaryButtonMuted]}>
                        <Text style={styles.primaryButtonText}>{isClosed ? '다시 모집' : '모집 마감'}</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.searchEmptyCard}>
                <Ionicons name="search-outline" size={26} color="#8A8F98" />
                <Text style={styles.searchEmptyTitle}>검색 결과가 없어요</Text>
                <Text style={styles.searchEmptyText}>
                  검색어를 줄이거나 상태 필터를 바꿔서 다시 찾아보세요.
                </Text>
              </View>
            )}
          </View>
        )}
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
  feedbackBanner: {
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: '#ECFDF3',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feedbackBannerText: {
    flex: 1,
    color: '#166534',
    fontSize: 13,
    fontWeight: '800',
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
  summaryCard: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryBlock: {
    minWidth: 56,
  },
  summaryLabel: {
    color: '#747B87',
    fontSize: 12,
    fontWeight: '800',
  },
  summaryValue: {
    marginTop: 6,
    color: '#15181D',
    fontSize: 24,
    fontWeight: '900',
  },
  summaryValueSmall: {
    marginTop: 6,
    color: '#15181D',
    fontSize: 18,
    fontWeight: '900',
  },
  summaryDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: '#ECEFF4',
  },
  createButton: {
    minHeight: 42,
    borderRadius: 999,
    backgroundColor: '#6D5DFB',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  searchBox: {
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#15181D',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 12,
  },
  searchActionButton: {
    minHeight: 34,
    borderRadius: 999,
    backgroundColor: '#15181D',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchActionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  clearSearchButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    minHeight: 34,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipSelected: {
    backgroundColor: '#15181D',
  },
  filterChipText: {
    color: '#555B66',
    fontSize: 12,
    fontWeight: '800',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  sortRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortChip: {
    minHeight: 32,
    borderRadius: 999,
    backgroundColor: '#EEF1F6',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortChipSelected: {
    backgroundColor: '#6D5DFB',
  },
  sortChipText: {
    color: '#555B66',
    fontSize: 11,
    fontWeight: '800',
  },
  sortChipTextSelected: {
    color: '#FFFFFF',
  },
  emptyCard: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 22,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 12,
    color: '#15181D',
    fontSize: 17,
    fontWeight: '900',
  },
  emptyText: {
    marginTop: 8,
    color: '#666C77',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 16,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: '#15181D',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  list: {
    marginTop: 18,
    gap: 12,
  },
  searchEmptyCard: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
  },
  searchEmptyTitle: {
    marginTop: 10,
    color: '#15181D',
    fontSize: 16,
    fontWeight: '900',
  },
  searchEmptyText: {
    marginTop: 8,
    color: '#666C77',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shopName: {
    flex: 1,
    color: '#15181D',
    fontSize: 16,
    fontWeight: '900',
  },
  statusBadge: {
    borderRadius: 999,
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusBadgeClosed: {
    backgroundColor: '#F3F4F6',
  },
  statusBadgeText: {
    color: '#6D5DFB',
    fontSize: 11,
    fontWeight: '900',
  },
  statusBadgeTextClosed: {
    color: '#6B7280',
  },
  service: {
    marginTop: 8,
    color: '#555B66',
    fontSize: 14,
    fontWeight: '700',
  },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    flex: 1,
    color: '#747B87',
    fontSize: 12,
    fontWeight: '700',
  },
  bottomRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  bottomText: {
    flex: 1,
    color: '#333842',
    fontSize: 12,
    fontWeight: '700',
  },
  actionRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  secondaryButton: {
    minHeight: 38,
    borderRadius: 12,
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#333842',
    fontSize: 12,
    fontWeight: '900',
  },
  primaryButton: {
    minHeight: 38,
    borderRadius: 12,
    backgroundColor: '#15181D',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonMuted: {
    backgroundColor: '#6D5DFB',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
});
