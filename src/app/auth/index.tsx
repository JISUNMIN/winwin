import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getDefaultRouteForRole,
  roleLabels,
  useAuth,
  type AuthenticatedRole,
} from '@/auth/mock-auth';
import { login, signup, type AuthApiRole } from '@/api/auth';
import { ApiError, type ApiFieldError } from '@/api/http';

type AuthMode = 'login' | 'signup';

const authModeLabels: Record<AuthMode, string> = {
  login: '로그인',
  signup: '회원가입',
};

const signupRoleOptions: { role: AuthenticatedRole; title: string; description: string }[] = [
  {
    role: 'customer',
    title: '고객 계정',
    description: '지원하기, 고객 채팅, 예약 확정과 결제를 진행할 수 있어요.',
  },
  {
    role: 'partner',
    title: '파트너 계정',
    description: '상담 목록, 파트너 채팅, 공고 등록과 관리 화면으로 이동할 수 있어요.',
  },
];

function mapRoleToApiRole(role: AuthenticatedRole): AuthApiRole {
  return role === 'partner' ? 'PARTNER' : 'CUSTOMER';
}

function mapApiRoleToAppRole(role: AuthApiRole): AuthenticatedRole {
  return role === 'PARTNER' ? 'partner' : 'customer';
}

function toFieldErrorMap(fieldErrors: ApiFieldError[]) {
  return fieldErrors.reduce<Record<string, string>>((result, fieldError) => {
    result[fieldError.field] = fieldError.message;
    return result;
  }, {});
}

export default function AuthScreen() {
  const { role, isLoggedIn, authSource, user, signInAs, signOut, completeAuthSession } = useAuth();
  const params = useLocalSearchParams<{
    requiredRole?: AuthenticatedRole;
    redirectTo?: string;
  }>();
  const [mode, setMode] = useState<AuthMode>('login');
  const [signupRole, setSignupRole] = useState<AuthenticatedRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredRole = params.requiredRole;
  const redirectTo =
    typeof params.redirectTo === 'string' && params.redirectTo.length > 0
      ? params.redirectTo
      : undefined;

  const title = requiredRole
    ? `${roleLabels[requiredRole]} 권한이 필요한 화면입니다`
    : 'WinWin 인증';
  const subtitle = requiredRole
    ? `${roleLabels[requiredRole]} 계정으로 로그인하면 요청한 화면으로 바로 이동합니다.`
    : '이제 실제 auth API를 호출해 로그인과 회원가입을 연결할 수 있어요.';

  const clearErrors = () => {
    setSubmitError(null);
    setFieldErrors({});
  };

  const handleApiSuccess = async (accessResponse: Awaited<ReturnType<typeof login>>) => {
    const authenticatedRole = mapApiRoleToAppRole(accessResponse.role);

    await completeAuthSession(accessResponse);

    if (requiredRole && authenticatedRole !== requiredRole) {
      Alert.alert(
        '권한이 다른 계정입니다',
        `${roleLabels[requiredRole]} 권한이 필요한 화면이라 ${roleLabels[authenticatedRole]} 기본 화면으로 이동합니다.`,
      );
      router.replace(getDefaultRouteForRole(authenticatedRole) as never);
      return;
    }

    router.replace((redirectTo ?? getDefaultRouteForRole(authenticatedRole)) as never);
  };

  const handleSubmit = async () => {
    clearErrors();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const response = await login({
          email: email.trim(),
          password,
        });

        await handleApiSuccess(response);
        return;
      }

      const response = await signup({
        email: email.trim(),
        password,
        name: name.trim(),
        role: mapRoleToApiRole(signupRole),
      });

      await handleApiSuccess(response);
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
        setFieldErrors(toFieldErrorMap(error.fieldErrors));
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Ionicons name="shield-checkmark-outline" size={34} color="#6D5DFB" />
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
            {isLoggedIn
              ? `${authSource === 'api' ? '실제 API 세션' : '개발용 mock 세션'}${
                  user?.email ? ` · ${user.email}` : ''
                }`
              : '게스트는 홈과 상세는 볼 수 있지만, 고객 액션과 파트너 화면은 제한됩니다.'}
          </Text>
        </View>

        <View style={styles.modeRow}>
          {(['login', 'signup'] as const).map((nextMode) => (
            <Pressable
              accessibilityRole="button"
              key={nextMode}
              onPress={() => {
                clearErrors();
                setMode(nextMode);
              }}
              style={[styles.modeButton, mode === nextMode && styles.modeButtonActive]}>
              <Text
                style={[styles.modeButtonText, mode === nextMode && styles.modeButtonTextActive]}>
                {authModeLabels[nextMode]}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {mode === 'login' ? '계정으로 로그인' : '새 계정 만들기'}
          </Text>
          <Text style={styles.formDescription}>
            {mode === 'login'
              ? '이메일과 비밀번호로 실제 auth API를 호출합니다.'
              : '회원가입 성공 시 access token을 저장하고 바로 로그인 상태로 전환합니다.'}
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>이메일</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={(value) => {
                setEmail(value);
                if (submitError || fieldErrors.email) {
                  clearErrors();
                }
              }}
              placeholder="partner@example.com"
              placeholderTextColor="#8A8F98"
              style={[styles.input, fieldErrors.email && styles.inputError]}
              value={email}
            />
            {fieldErrors.email ? <Text style={styles.fieldErrorText}>{fieldErrors.email}</Text> : null}
          </View>

          {mode === 'signup' && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>이름</Text>
              <TextInput
                onChangeText={(value) => {
                  setName(value);
                  if (submitError || fieldErrors.name) {
                    clearErrors();
                  }
                }}
                placeholder="Partner One"
                placeholderTextColor="#8A8F98"
                style={[styles.input, fieldErrors.name && styles.inputError]}
                value={name}
              />
              {fieldErrors.name ? <Text style={styles.fieldErrorText}>{fieldErrors.name}</Text> : null}
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>비밀번호</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onChangeText={(value) => {
                setPassword(value);
                if (submitError || fieldErrors.password) {
                  clearErrors();
                }
              }}
              placeholder="8자 이상 입력"
              placeholderTextColor="#8A8F98"
              secureTextEntry
              style={[styles.input, fieldErrors.password && styles.inputError]}
              value={password}
            />
            {fieldErrors.password ? (
              <Text style={styles.fieldErrorText}>{fieldErrors.password}</Text>
            ) : null}
          </View>

          {mode === 'signup' && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>계정 역할</Text>
              <View style={styles.signupRoleList}>
                {signupRoleOptions.map((option) => (
                  <Pressable
                    accessibilityRole="button"
                    key={option.role}
                    onPress={() => {
                      setSignupRole(option.role);
                      if (submitError || fieldErrors.role) {
                        clearErrors();
                      }
                    }}
                    style={[
                      styles.signupRoleCard,
                      signupRole === option.role && styles.signupRoleCardActive,
                    ]}>
                    <Text style={styles.signupRoleTitle}>{option.title}</Text>
                    <Text style={styles.signupRoleDescription}>{option.description}</Text>
                  </Pressable>
                ))}
              </View>
              {fieldErrors.role ? <Text style={styles.fieldErrorText}>{fieldErrors.role}</Text> : null}
            </View>
          )}

          {submitError ? <Text style={styles.submitErrorText}>{submitError}</Text> : null}

          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {mode === 'login' ? '로그인하기' : '회원가입 후 시작하기'}
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.helperCard}>
          <Text style={styles.helperTitle}>게스트 또는 빠른 전환</Text>
          <Text style={styles.helperDescription}>
            실제 auth API 연결과 별개로, 현재 화면 흐름 확인용 빠른 전환도 계속 사용할 수 있어요.
          </Text>

          <View style={styles.quickActionList}>
            <Pressable
              accessibilityRole="button"
              onPress={() => handleSelectRole('guest')}
              style={[styles.quickActionButton, role === 'guest' && styles.quickActionButtonActive]}>
              <Text
                style={[
                  styles.quickActionButtonText,
                  role === 'guest' && styles.quickActionButtonTextActive,
                ]}>
                게스트
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => handleSelectRole('customer')}
              style={[
                styles.quickActionButton,
                role === 'customer' && styles.quickActionButtonActive,
              ]}>
              <Text
                style={[
                  styles.quickActionButtonText,
                  role === 'customer' && styles.quickActionButtonTextActive,
                ]}>
                고객 mock
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => handleSelectRole('partner')}
              style={[
                styles.quickActionButton,
                role === 'partner' && styles.quickActionButtonActive,
              ]}>
              <Text
                style={[
                  styles.quickActionButtonText,
                  role === 'partner' && styles.quickActionButtonTextActive,
                ]}>
                파트너 mock
              </Text>
            </Pressable>
          </View>
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
  modeRow: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#15181D',
  },
  modeButtonText: {
    color: '#555B66',
    fontSize: 14,
    fontWeight: '800',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  formCard: {
    marginTop: 14,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 18,
    gap: 14,
  },
  formTitle: {
    color: '#15181D',
    fontSize: 20,
    fontWeight: '900',
  },
  formDescription: {
    color: '#555B66',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: '#15181D',
    fontSize: 13,
    fontWeight: '800',
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 14,
    color: '#15181D',
    fontSize: 15,
    fontWeight: '600',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#D33A2C',
    backgroundColor: '#FFF6F5',
  },
  fieldErrorText: {
    color: '#D33A2C',
    fontSize: 12,
    fontWeight: '700',
  },
  signupRoleList: {
    gap: 10,
  },
  signupRoleCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8EBF0',
    backgroundColor: '#FFFFFF',
    padding: 14,
  },
  signupRoleCardActive: {
    borderColor: '#6D5DFB',
    backgroundColor: '#F5F3FF',
  },
  signupRoleTitle: {
    color: '#15181D',
    fontSize: 15,
    fontWeight: '900',
  },
  signupRoleDescription: {
    marginTop: 6,
    color: '#555B66',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  submitErrorText: {
    color: '#D33A2C',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  submitButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#6D5DFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#A79CFF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  helperCard: {
    marginTop: 14,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 18,
  },
  helperTitle: {
    color: '#15181D',
    fontSize: 16,
    fontWeight: '900',
  },
  helperDescription: {
    marginTop: 8,
    color: '#555B66',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
  quickActionList: {
    marginTop: 14,
    gap: 10,
  },
  quickActionButton: {
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: '#F1F3F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionButtonActive: {
    backgroundColor: '#15181D',
  },
  quickActionButtonText: {
    color: '#555B66',
    fontSize: 14,
    fontWeight: '800',
  },
  quickActionButtonTextActive: {
    color: '#FFFFFF',
  },
});
