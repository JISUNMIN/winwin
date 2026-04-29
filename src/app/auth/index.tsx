import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getDefaultRouteForRole,
  roleLabels,
  useAuth,
  type AuthenticatedRole,
} from '@/auth/mock-auth';

const roleCards: {
  role: 'guest' | AuthenticatedRole;
  title: string;
  description: string;
}[] = [
  {
    role: 'guest',
    title: '게스트로 보기',
    description: '홈과 상세 화면만 가볍게 둘러보고, 고객 액션과 파트너 화면은 나중에 들어갈 수 있어요.',
  },
  {
    role: 'customer',
    title: '고객으로 로그인',
    description: '지원하기, 고객 채팅, 예약 확정과 결제를 이어서 확인할 수 있어요.',
  },
  {
    role: 'partner',
    title: '파트너로 로그인',
    description: '상담 목록, 파트너 채팅, 공고 등록과 관리 화면으로 이동할 수 있어요.',
  },
];

export default function AuthScreen() {
  const { role, isLoggedIn, signInAs, signOut } = useAuth();
  const params = useLocalSearchParams<{
    requiredRole?: AuthenticatedRole;
    redirectTo?: string;
  }>();

  const requiredRole = params.requiredRole;
  const redirectTo =
    typeof params.redirectTo === 'string' && params.redirectTo.length > 0
      ? params.redirectTo
      : undefined;

  const title = requiredRole
    ? `${roleLabels[requiredRole]} 권한이 필요한 화면입니다`
    : 'Mock 로그인';
  const subtitle = requiredRole
    ? `${roleLabels[requiredRole]}으로 로그인하면 요청한 화면으로 바로 이동합니다.`
    : '현재 앱은 mock 인증 단계입니다. 필요한 역할을 골라 흐름을 테스트하세요.';

  const handleSelectRole = (nextRole: 'guest' | AuthenticatedRole) => {
    if (nextRole === 'guest') {
      signOut();
      router.replace('/' as never);
      return;
    }

    signInAs(nextRole);
    router.replace((redirectTo ?? getDefaultRouteForRole(nextRole)) as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Ionicons name="person-circle-outline" size={34} color="#6D5DFB" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.currentCard}>
          <Text style={styles.currentLabel}>현재 상태</Text>
          <Text style={styles.currentValue}>
            {isLoggedIn ? `${roleLabels[role]} 로그인` : '게스트 모드'}
          </Text>
          <Text style={styles.currentDescription}>
            게스트는 홈과 상세는 볼 수 있지만, 고객 액션과 파트너 화면은 제한됩니다.
          </Text>
        </View>

        <View style={styles.cardList}>
          {roleCards.map((item) => (
            <Pressable
              accessibilityRole="button"
              key={item.role}
              onPress={() => handleSelectRole(item.role)}
              style={[styles.roleCard, role === item.role && styles.roleCardActive]}>
              <Text style={styles.roleCardTitle}>{item.title}</Text>
              <Text style={styles.roleCardDescription}>{item.description}</Text>
              <Text style={styles.roleCardAction}>
                {role === item.role ? '현재 선택됨' : '이 역할로 변경'}
              </Text>
            </Pressable>
          ))}
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
    paddingTop: 28,
    paddingBottom: 36,
  },
  header: {
    alignItems: 'center',
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 16,
    color: '#15181D',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    color: '#555B66',
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '600',
    textAlign: 'center',
  },
  currentCard: {
    marginTop: 24,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 18,
  },
  currentLabel: {
    color: '#6D5DFB',
    fontSize: 13,
    fontWeight: '800',
  },
  currentValue: {
    marginTop: 10,
    color: '#15181D',
    fontSize: 22,
    fontWeight: '900',
  },
  currentDescription: {
    marginTop: 8,
    color: '#555B66',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  cardList: {
    marginTop: 18,
    gap: 12,
  },
  roleCard: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  roleCardActive: {
    borderColor: '#6D5DFB',
    backgroundColor: '#F5F3FF',
  },
  roleCardTitle: {
    color: '#15181D',
    fontSize: 18,
    fontWeight: '900',
  },
  roleCardDescription: {
    marginTop: 8,
    color: '#555B66',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  roleCardAction: {
    marginTop: 12,
    color: '#6D5DFB',
    fontSize: 13,
    fontWeight: '800',
  },
});
