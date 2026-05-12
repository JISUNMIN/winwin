import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  getMe,
  getMeWithUnauthorizedHandling,
  type AuthApiRole,
  type AuthTokenResponse,
  type MeResponse,
} from '@/api/auth';
import { ApiError, setUnauthorizedHandler } from '@/api/http';

export type AppRole = 'guest' | 'customer' | 'partner';
export type AuthenticatedRole = Exclude<AppRole, 'guest'>;
export type AuthSource = 'mock' | 'api';

const AUTH_STORAGE_KEY = 'winwin.auth.session';

type AuthUser = {
  id: number | null;
  email: string | null;
  name: string | null;
  role: AuthenticatedRole;
};

type StoredAuthSession =
  | {
      source: 'mock';
      role: AppRole;
    }
  | {
      source: 'api';
      accessToken: string;
      user: AuthUser;
    };

type AuthSession =
  | {
      source: 'mock';
      role: AppRole;
      accessToken: null;
      user: null;
    }
  | {
      source: 'api';
      role: AuthenticatedRole;
      accessToken: string;
      user: AuthUser;
    };

type AuthContextValue = {
  role: AppRole;
  isReady: boolean;
  isLoggedIn: boolean;
  authSource: AuthSource | null;
  accessToken: string | null;
  user: AuthUser | null;
  signInAs: (nextRole: AuthenticatedRole) => void;
  signOut: () => void;
  completeAuthSession: (authResponse: AuthTokenResponse) => Promise<void>;
  openAuth: (options?: { requiredRole?: AuthenticatedRole; redirectTo?: string }) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const roleLabels: Record<AppRole, string> = {
  guest: '게스트',
  customer: '고객',
  partner: '파트너',
};

export function getDefaultRouteForRole(role: AuthenticatedRole) {
  return role === 'partner' ? '/partner' : '/';
}

export function getDefaultRouteForAppRole(role: AppRole) {
  return role === 'partner' ? '/partner' : '/';
}

function mapApiRoleToAppRole(role: AuthApiRole): AuthenticatedRole {
  return role === 'PARTNER' ? 'partner' : 'customer';
}

function toAuthUserFromTokenResponse(authResponse: AuthTokenResponse): AuthUser {
  return {
    id: authResponse.userId,
    email: authResponse.email,
    name: authResponse.name,
    role: mapApiRoleToAppRole(authResponse.role),
  };
}

function toAuthUserFromMeResponse(meResponse: MeResponse): AuthUser {
  return {
    id: meResponse.id,
    email: meResponse.email,
    name: meResponse.name,
    role: mapApiRoleToAppRole(meResponse.role),
  };
}

function isAppRole(value: string | null): value is AppRole {
  return value === 'guest' || value === 'customer' || value === 'partner';
}

function isStoredAuthSession(value: unknown): value is StoredAuthSession {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const session = value as Record<string, unknown>;

  if (session.source === 'mock') {
    return isAppRole(typeof session.role === 'string' ? session.role : null);
  }

  if (session.source === 'api') {
    return (
      typeof session.accessToken === 'string' &&
      !!session.user &&
      typeof session.user === 'object' &&
      typeof (session.user as Record<string, unknown>).role === 'string' &&
      ((session.user as Record<string, unknown>).role === 'customer' ||
        (session.user as Record<string, unknown>).role === 'partner')
    );
  }

  return false;
}

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const persistSession = async (nextSession: StoredAuthSession | null) => {
      if (nextSession === null) {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    };

    const restoreSession = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

        if (!storedValue) {
          if (isMounted) {
            setSession(null);
          }
          return;
        }

        let parsed: unknown;

        try {
          parsed = JSON.parse(storedValue);
        } catch {
          if (isAppRole(storedValue)) {
            parsed = { source: 'mock', role: storedValue };
          }
        }

        if (!isStoredAuthSession(parsed)) {
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
          if (isMounted) {
            setSession(null);
          }
          return;
        }

        if (parsed.source === 'mock') {
          if (isMounted) {
            setSession(
              parsed.role === 'guest'
                ? null
                : {
                    source: 'mock',
                    role: parsed.role,
                    accessToken: null,
                    user: null,
                  },
            );
          }
          return;
        }

        try {
          const me = await getMe(parsed.accessToken);
          const user = toAuthUserFromMeResponse(me);

          if (isMounted) {
            setSession({
              source: 'api',
              role: user.role,
              accessToken: parsed.accessToken,
              user,
            });
          }

          await persistSession({
            source: 'api',
            accessToken: parsed.accessToken,
            user,
          });
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) {
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
            setSession(null);
            return;
          }

          if (isMounted) {
            setSession({
              source: 'api',
              role: parsed.user.role,
              accessToken: parsed.accessToken,
              user: parsed.user,
            });
          }
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      setSession((currentSession) => {
        if (currentSession?.source !== 'api') {
          return currentSession;
        }

        return null;
      });

      await AsyncStorage.removeItem(AUTH_STORAGE_KEY).catch(() => {
        // Global 401 cleanup should still proceed in memory even if persistence removal fails.
      });

      router.replace('/auth' as never);
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  const role = session?.role ?? 'guest';
  const user = session?.user ?? null;
  const accessToken = session?.accessToken ?? null;
  const authSource = session?.source ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      role,
      isReady,
      isLoggedIn: role !== 'guest',
      authSource,
      accessToken,
      user,
      signInAs: (nextRole) => {
        const nextSession: AuthSession = {
          source: 'mock',
          role: nextRole,
          accessToken: null,
          user: null,
        };

        setSession(nextSession);
        AsyncStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ source: 'mock', role: nextRole } satisfies StoredAuthSession),
        ).catch(() => {
          // Mock auth persistence should fail quietly and keep in-memory state usable.
        });
      },
      signOut: () => {
        setSession(null);
        AsyncStorage.removeItem(AUTH_STORAGE_KEY).catch(() => {
          // Sign out should still succeed in memory even if persistence cleanup fails.
        });
      },
      completeAuthSession: async (authResponse) => {
        const nextUser = toAuthUserFromTokenResponse(authResponse);
        const nextSession: AuthSession = {
          source: 'api',
          role: nextUser.role,
          accessToken: authResponse.accessToken,
          user: nextUser,
        };

        setSession(nextSession);
        await AsyncStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            source: 'api',
            accessToken: authResponse.accessToken,
            user: nextUser,
          } satisfies StoredAuthSession),
        );
      },
      openAuth: ({ requiredRole, redirectTo } = {}) => {
        router.push(
          {
            pathname: '/auth' as never,
            params: {
              requiredRole,
              redirectTo,
            },
          } as never,
        );
      },
    }),
    [accessToken, authSource, isReady, role, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useRequireAuthMe() {
  const { accessToken } = useAuth();

  if (!accessToken) {
    throw new Error('useRequireAuthMe requires an authenticated access token');
  }

  return () => getMeWithUnauthorizedHandling(accessToken);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside MockAuthProvider');
  }

  return context;
}
