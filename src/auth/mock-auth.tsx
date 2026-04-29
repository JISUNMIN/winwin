import { router } from 'expo-router';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type AppRole = 'guest' | 'customer' | 'partner';
export type AuthenticatedRole = Exclude<AppRole, 'guest'>;

type AuthContextValue = {
  role: AppRole;
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

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<AppRole>('guest');

  const value = useMemo<AuthContextValue>(
    () => ({
      role,
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
    [role],
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
