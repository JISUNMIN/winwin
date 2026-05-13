import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getDiscoverablePosts, mapPostResponseToMatching } from '@/api/posts';
import { roleLabels, useAuth } from '@/auth/mock-auth';
import { CategoryFilter } from '@/components/winwin/CategoryFilter';
import { MatchingCard } from '@/components/winwin/MatchingCard';
import { getDiscoverableMatchings } from '@/data/matchings';
import type { Category } from '@/data/matchings';
import { formatFullLocationText } from '@/utils/location-text';

export default function HomeScreen() {
  const router = useRouter();
  const { role, isLoggedIn, authSource, user, openAuth, signInAs, signOut } = useAuth();
  const isFocused = useIsFocused();
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [matchings, setMatchings] = useState(() => getDiscoverableMatchings());
  const [currentLocation, setCurrentLocation] = useState('위치를 확인해보세요');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [matchingLoadError, setMatchingLoadError] = useState<string | null>(null);
  const [isFetchingMatchings, setIsFetchingMatchings] = useState(false);
  const [showPartnerMenu, setShowPartnerMenu] = useState(false);
  const [showDevRoleActions, setShowDevRoleActions] = useState(false);

  const handleFetchLocation = async () => {
    setIsFetchingLocation(true);
    setLocationError(null);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        setLocationError('위치 권한이 허용되지 않았어요.');
        setCurrentLocation('위치 권한 필요');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const address = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const firstAddress = address[0];

      if (firstAddress) {
        setCurrentLocation(formatFullLocationText(firstAddress, '현재 위치를 확인했어요'));
        return;
      }

      setCurrentLocation('주소를 확인하지 못했어요. 다시 시도해 주세요.');
    } catch {
      setLocationError('현재 위치를 가져오지 못했어요.');
      setCurrentLocation('위치를 다시 확인해주세요');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  useEffect(() => {
    handleFetchLocation();
  }, []);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let isMounted = true;

    const loadMatchings = async () => {
      setIsFetchingMatchings(true);
      setMatchingLoadError(null);

      try {
        const response = await getDiscoverablePosts();

        if (isMounted) {
          setMatchings(response.map(mapPostResponseToMatching));
        }
      } catch {
        if (isMounted) {
          setMatchings(getDiscoverableMatchings());
          setMatchingLoadError('서버 공고를 불러오지 못해 임시 mock 목록을 보여주고 있어요.');
        }
      } finally {
        if (isMounted) {
          setIsFetchingMatchings(false);
        }
      }
    };

    loadMatchings();

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const handleApplySearch = () => {
    setQuery(searchInput.trim());
  };

  const filteredMatchings = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return matchings.filter((matching) => {
      const matchesCategory =
        selectedCategory === 'all' || matching.category === selectedCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const searchableText = [
        matching.shopName,
        matching.location,
        matching.service,
        ...matching.requirements,
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [query, selectedCategory]);

  const premiumCount = matchings.filter((matching) => matching.premium).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => {
          setShowPartnerMenu(false);
          setShowDevRoleActions(false);
        }}>
        <View style={styles.accountBar}>
          <View>
            <Text style={styles.accountLabel}>현재 역할</Text>
            <Text style={styles.accountValue}>
              {isLoggedIn ? `${roleLabels[role]} 로그인` : '게스트'}
            </Text>
            <Text style={styles.accountDescription}>
              {isLoggedIn
                ? authSource === 'api'
                  ? user?.email ?? '실제 API 계정으로 로그인 중'
                  : '개발용 mock 세션으로 진입 중'
                : '로그인하면 요청한 역할 화면으로 바로 이동할 수 있어요.'}
            </Text>
          </View>

          <View style={styles.accountActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setShowDevRoleActions(false);
                if (isLoggedIn) {
                  signOut();
                  return;
                }

                openAuth();
              }}
              style={styles.accountButton}>
              <Text style={styles.accountButtonText}>{isLoggedIn ? '로그아웃' : '로그인'}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setShowPartnerMenu(false);
                setShowDevRoleActions((current) => !current);
              }}
              style={[
                styles.devToggleButton,
                showDevRoleActions && styles.devToggleButtonActive,
              ]}>
              <Text
                style={[
                  styles.devToggleButtonText,
                  showDevRoleActions && styles.devToggleButtonTextActive,
                ]}>
                개발용 전환
              </Text>
            </Pressable>

            {showDevRoleActions ? (
              <View style={styles.roleQuickActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={signOut}
                  style={[styles.roleQuickButton, role === 'guest' && styles.roleQuickButtonActive]}>
                  <Text
                    style={[
                      styles.roleQuickButtonText,
                      role === 'guest' && styles.roleQuickButtonTextActive,
                    ]}>
                    게스트
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => signInAs('customer')}
                  style={[
                    styles.roleQuickButton,
                    role === 'customer' && styles.roleQuickButtonActive,
                  ]}>
                  <Text
                    style={[
                      styles.roleQuickButtonText,
                      role === 'customer' && styles.roleQuickButtonTextActive,
                    ]}>
                    고객 mock
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => signInAs('partner')}
                  style={[
                    styles.roleQuickButton,
                    role === 'partner' && styles.roleQuickButtonActive,
                  ]}>
                  <Text
                    style={[
                      styles.roleQuickButtonText,
                      role === 'partner' && styles.roleQuickButtonTextActive,
                    ]}>
                    파트너 mock
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {role === 'partner' && (
              <View style={styles.partnerMenuWrap}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setShowDevRoleActions(false);
                    setShowPartnerMenu((current) => !current);
                  }}
                  style={styles.partnerMenuButton}>
                  <Text style={styles.partnerMenuButtonText}>파트너 바로가기</Text>
                </Pressable>

                {showPartnerMenu && (
                  <View style={styles.partnerMenuDropdown}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        setShowPartnerMenu(false);
                        router.push('/partner');
                      }}
                      style={styles.partnerMenuItem}>
                      <Text style={styles.partnerMenuItemText}>상담 목록</Text>
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        setShowPartnerMenu(false);
                        router.push('/partner/post');
                      }}
                      style={styles.partnerMenuItem}>
                      <Text style={styles.partnerMenuItemText}>공고 관리</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {showDevRoleActions ? (
          <View style={styles.devNoticeBox}>
            <Text style={styles.devNoticeTitle}>개발용 빠른 전환</Text>
            <Text style={styles.devNoticeText}>
              실제 auth API와 별개로 고객/파트너 흐름을 빠르게 확인할 때만 사용하세요.
            </Text>
          </View>
        ) : null}

        <View style={styles.header}>
          <Text style={styles.logo}>WinWin</Text>
          <Text style={styles.subtitle}>우리 동네 매칭 공고를 찾아보세요</Text>
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchLabel}>검색</Text>
          <TextInput
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder="지역, 서비스, 조건으로 검색하세요"
            placeholderTextColor="#8A8F98"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={handleApplySearch}
          />
          <Pressable
            accessibilityRole="button"
            onPress={handleApplySearch}
            style={styles.searchButton}>
            <Text style={styles.searchButtonText}>검색</Text>
          </Pressable>
        </View>

        <View style={styles.locationBox}>
          <View style={styles.locationHeader}>
            <Text style={styles.locationLabel}>현재 위치</Text>

            <Pressable
              accessibilityRole="button"
              onPress={handleFetchLocation}
              style={styles.locationRefreshButton}>
              <Text style={styles.locationRefreshButtonText}>
                {isFetchingLocation ? '확인 중' : '새로고침'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.locationValueRow}>
            {isFetchingLocation ? (
              <ActivityIndicator size="small" color="#6D5DFB" />
            ) : null}
            <Text style={styles.locationText}>{currentLocation}</Text>
          </View>

          {locationError ? <Text style={styles.locationErrorText}>{locationError}</Text> : null}
        </View>

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        <View style={styles.summaryBox}>
          <View>
            <Text style={styles.summaryLabel}>
              {query.trim() || selectedCategory !== 'all' ? '필터 결과' : '전체 매칭'}
            </Text>
            <Text style={styles.summaryValue}>{filteredMatchings.length}개</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View>
            <Text style={styles.summaryLabel}>프리미엄</Text>
            <Text style={styles.summaryValue}>{premiumCount}개</Text>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>매칭 공고</Text>
          <View style={styles.listHeaderMeta}>
            {isFetchingMatchings ? (
              <ActivityIndicator size="small" color="#6D5DFB" />
            ) : null}
            <Text style={styles.listCount}>{filteredMatchings.length}개</Text>
          </View>
        </View>

        {matchingLoadError ? (
          <View style={styles.listErrorBox}>
            <Text style={styles.listErrorText}>{matchingLoadError}</Text>
          </View>
        ) : null}

        {filteredMatchings.length > 0 ? (
          <View style={styles.cardList}>
            {filteredMatchings.map((matching) => (
              <MatchingCard
                key={matching.id}
                matching={matching}
                onPress={() =>
                  router.push({
                    pathname: '/matching/[id]',
                    params: { id: matching.id },
                  })
                }
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>매칭 공고가 없습니다</Text>
            <Text style={styles.emptyText}>검색어를 줄이거나 다른 카테고리를 선택해보세요.</Text>
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
    paddingBottom: 96,
  },
  accountBar: {
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  accountLabel: {
    color: '#6D5DFB',
    fontSize: 12,
    fontWeight: '800',
  },
  accountValue: {
    marginTop: 4,
    color: '#15181D',
    fontSize: 16,
    fontWeight: '900',
  },
  accountDescription: {
    marginTop: 6,
    color: '#555B66',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  accountActions: {
    alignItems: 'flex-end',
    gap: 8,
    position: 'relative',
  },
  accountButton: {
    minHeight: 36,
    borderRadius: 999,
    backgroundColor: '#6D5DFB',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  devToggleButton: {
    minHeight: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D6DAE1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devToggleButtonActive: {
    borderColor: '#15181D',
    backgroundColor: '#15181D',
  },
  devToggleButtonText: {
    color: '#555B66',
    fontSize: 12,
    fontWeight: '800',
  },
  devToggleButtonTextActive: {
    color: '#FFFFFF',
  },
  roleQuickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleQuickButton: {
    minHeight: 32,
    borderRadius: 999,
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleQuickButtonActive: {
    backgroundColor: '#15181D',
  },
  roleQuickButtonText: {
    color: '#555B66',
    fontSize: 12,
    fontWeight: '800',
  },
  roleQuickButtonTextActive: {
    color: '#FFFFFF',
  },
  devNoticeBox: {
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: '#FFF9E8',
    borderWidth: 1,
    borderColor: '#F4DE9A',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  devNoticeTitle: {
    color: '#7C5A00',
    fontSize: 13,
    fontWeight: '900',
  },
  devNoticeText: {
    marginTop: 6,
    color: '#7C5A00',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  partnerMenuWrap: {
    alignItems: 'flex-end',
  },
  partnerMenuButton: {
    minHeight: 32,
    borderRadius: 999,
    backgroundColor: '#15181D',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerMenuButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  partnerMenuDropdown: {
    position: 'absolute',
    top: 38,
    right: 0,
    minWidth: 132,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EBF0',
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    zIndex: 20,
  },
  partnerMenuItem: {
    minHeight: 42,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  partnerMenuItemText: {
    color: '#15181D',
    fontSize: 14,
    fontWeight: '800',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 18,
  },
  logo: {
    color: '#6D5DFB',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    color: '#555B66',
    fontSize: 15,
    lineHeight: 22,
  },
  searchBox: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  searchLabel: {
    marginBottom: 8,
    color: '#6D5DFB',
    fontSize: 13,
    fontWeight: '700',
  },
  searchInput: {
    flex: 1,
    minHeight: 42,
    borderRadius: 10,
    backgroundColor: '#F1F3F6',
    color: '#15181D',
    fontSize: 15,
    paddingHorizontal: 12,
  },
  searchButton: {
    marginTop: 10,
    minHeight: 42,
    borderRadius: 10,
    backgroundColor: '#15181D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  locationBox: {
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  locationLabel: {
    color: '#8A8F98',
    fontSize: 12,
    fontWeight: '700',
  },
  locationRefreshButton: {
    minHeight: 28,
    borderRadius: 999,
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRefreshButtonText: {
    color: '#6D5DFB',
    fontSize: 11,
    fontWeight: '900',
  },
  locationValueRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    flex: 1,
    color: '#15181D',
    fontSize: 16,
    fontWeight: '700',
  },
  locationErrorText: {
    marginTop: 8,
    color: '#D33A2C',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryBox: {
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: '#15181D',
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: '#B8BEC9',
    fontSize: 13,
    fontWeight: '700',
  },
  summaryValue: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  summaryDivider: {
    width: 1,
    height: 42,
    backgroundColor: '#343A44',
  },
  listHeader: {
    marginTop: 22,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listHeaderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listTitle: {
    color: '#15181D',
    fontSize: 18,
    fontWeight: '800',
  },
  listCount: {
    color: '#747B87',
    fontSize: 13,
    fontWeight: '700',
  },
  listErrorBox: {
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  listErrorText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  cardList: {
    gap: 14,
  },
  emptyBox: {
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E1E4EA',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#15181D',
    fontSize: 15,
    fontWeight: '800',
  },
  emptyText: {
    marginTop: 8,
    color: '#555B66',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
