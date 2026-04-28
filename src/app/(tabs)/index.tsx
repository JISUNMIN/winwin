import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryFilter } from '@/components/winwin/CategoryFilter';
import { MatchingCard } from '@/components/winwin/MatchingCard';
import { mockMatchings } from '@/data/matchings';
import type { Category } from '@/data/matchings';

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const filteredMatchings = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return mockMatchings.filter((matching) => {
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

  const premiumCount = mockMatchings.filter((matching) => matching.premium).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>WinWin</Text>
          <Text style={styles.subtitle}>우리 동네 매칭 공고를 찾아보세요</Text>
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchLabel}>검색</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="지역, 서비스, 조건으로 검색하세요"
            placeholderTextColor="#8A8F98"
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>

        <View style={styles.locationBox}>
          <Text style={styles.locationLabel}>현재 위치</Text>
          <Text style={styles.locationText}>강남구 역삼동</Text>
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
          <Text style={styles.listCount}>{filteredMatchings.length}개</Text>
        </View>

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
    minHeight: 42,
    borderRadius: 10,
    backgroundColor: '#F1F3F6',
    color: '#15181D',
    fontSize: 15,
    paddingHorizontal: 12,
  },
  locationBox: {
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  locationLabel: {
    color: '#8A8F98',
    fontSize: 12,
    fontWeight: '700',
  },
  locationText: {
    marginTop: 4,
    color: '#15181D',
    fontSize: 16,
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
