import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getCustomerConsultations,
  mapConsultationResponseToPartnerConsultation,
} from '@/api/consultations';
import { useAuth } from '@/auth/mock-auth';
import { ProtectedRoleScreen } from '@/components/winwin/ProtectedRoleScreen';
import { ENABLE_DEV_FALLBACK_DATA } from '@/config/app-flags';
import {
  formatConsultationUpdatedText,
  getMockCustomerConsultations,
  type ConsultationStatusTone,
  type PartnerConsultation,
} from '@/data/consultations';
import { getAllMatchings, mockMatchings, type Matching } from '@/data/matchings';

export default function CustomerConsultationListRoute() {
  return (
    <ProtectedRoleScreen
      requiredRole="customer"
      redirectTo="/chat"
      loadingTitle="고객 상태 불러오는 중"
      loadingDescription="저장된 로그인 상태를 확인한 뒤 내 상담 목록으로 이어갈게요."
      deniedTitle="고객 로그인 확인 중"
      deniedDescription="고객 권한으로 로그인하면 진행 중인 상담과 예약 상태를 볼 수 있어요.">
      <CustomerConsultationListContent />
    </ProtectedRoleScreen>
  );
}

function getStatusColor(tone: ConsultationStatusTone) {
  if (tone === 'closed') {
    return '#B91C1C';
  }

  if (tone === 'confirmed') {
    return '#6D5DFB';
  }

  if (tone === 'payment') {
    return '#1D4ED8';
  }

  if (tone === 'waiting') {
    return '#6B7280';
  }

  return '#15803D';
}

function CustomerConsultationListContent() {
  const isFocused = useIsFocused();
  const { accessToken, authSource } = useAuth();
  const [consultations, setConsultations] = useState<PartnerConsultation[]>(
    ENABLE_DEV_FALLBACK_DATA ? getMockCustomerConsultations() : [],
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let isMounted = true;

    const loadConsultations = async () => {
      setLoadError(null);

      if (authSource === 'api' && accessToken) {
        try {
          const response = await getCustomerConsultations(accessToken);

          if (isMounted) {
            setConsultations(response.map(mapConsultationResponseToPartnerConsultation));
          }
          return;
        } catch {
          if (isMounted) {
            setLoadError(
              ENABLE_DEV_FALLBACK_DATA
                ? '상담 목록 API를 불러오지 못해 일부 상담은 개발용 예시 데이터로 함께 보여주고 있어요.'
                : '상담 목록 API를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
            );
          }
        }
      }

      if (isMounted && ENABLE_DEV_FALLBACK_DATA) {
        setConsultations(getMockCustomerConsultations());
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

    if (ENABLE_DEV_FALLBACK_DATA) {
      for (const matching of mockMatchings) {
        if (!entries.has(matching.id)) {
          entries.set(matching.id, matching);
        }
      }
    }

    return entries;
  }, []);

  const items = useMemo(
    () =>
      consultations
        .map((consultation) => {
          const matching = matchingById.get(consultation.matchingId);

          if (!matching) {
            return null;
          }

          return {
            ...consultation,
            matching,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [consultations, matchingById],
  );
  const activeConsultationCount = items.filter((item) => item.statusTone !== 'closed').length;
  const paymentPendingCount = items.filter((item) => item.statusTone === 'payment').length;

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
          <Text style={styles.title}>내 상담 목록</Text>
          <Text style={styles.subtitle}>진행 중인 상담과 예약 상태를 여기서 이어서 볼 수 있어요.</Text>
        </View>

        {loadError ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#B45309" />
            <Text style={styles.errorBannerText}>{loadError}</Text>
          </View>
        ) : null}

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>현재 상담</Text>
            <Text style={styles.summaryValue}>{activeConsultationCount}건</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>입금 대기</Text>
            <Text style={styles.summaryValue}>{paymentPendingCount}건</Text>
          </View>
        </View>

        <View style={styles.list}>
          {items.map((item) => (
            <Pressable
              accessibilityRole="button"
              key={item.matching.id}
              onPress={() =>
                router.push({
                  pathname: '/chat/[id]',
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
                  <Text style={[styles.statusText, { color: getStatusColor(item.statusTone) }]}>
                    {item.statusLabel}
                  </Text>
                </View>

                <Text numberOfLines={1} style={styles.service}>
                  {item.matching.service}
                </Text>

                <Text style={styles.summaryText}>{item.summary}</Text>

                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>
                    최근 업데이트 {formatConsultationUpdatedText(item.updatedAt)}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#6D5DFB" />
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>아직 진행 중인 상담이 없어요</Text>
            <Text style={styles.emptyText}>공고 상세에서 지원하기를 누르면 상담이 시작됩니다.</Text>
          </View>
        ) : null}
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
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
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
    height: 150,
    backgroundColor: '#E8EBF0',
  },
  cardBody: {
    padding: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  shopName: {
    flex: 1,
    color: '#15181D',
    fontSize: 17,
    fontWeight: '900',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
  },
  service: {
    marginTop: 8,
    color: '#555B66',
    fontSize: 14,
    fontWeight: '700',
  },
  summaryText: {
    marginTop: 12,
    color: '#333842',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
  },
  metaRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaText: {
    color: '#747B87',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyBox: {
    marginTop: 18,
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
