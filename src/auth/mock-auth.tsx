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

export type AppRole = 'guest' | 'customer' | 'partner';
export type AuthenticatedRole = Exclude<AppRole, 'guest'>;

const AUTH_STORAGE_KEY = 'winwin.mock-auth.role';

type AuthContextValue = {
  role: AppRole;
  isReady: boolean;
  isLoggedIn: boolean;
  signInAs: (nextRole: AuthenticatedRole) => void;
  signOut: () => void;
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

function isAppRole(value: string | null): value is AppRole {
  return value === 'guest' || value === 'customer' || value === 'partner';
}

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<AppRole>('guest');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restoreRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

        if (isMounted && isAppRole(storedRole)) {
          setRole(storedRole);
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    restoreRole();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    AsyncStorage.setItem(AUTH_STORAGE_KEY, role).catch(() => {
      // Mock auth persistence should fail quietly and keep in-memory state usable.
    });
  }, [isReady, role]);

  const value = useMemo<AuthContextValue>(
    () => ({
      role,
      isReady,
      isLoggedIn: role !== 'guest',
      signInAs: (nextRole) => {
        setRole(nextRole);
      },
      signOut: () => {
        setRole('guest');
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
    [isReady, role],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside MockAuthProvider');
  }

  return context;
}
