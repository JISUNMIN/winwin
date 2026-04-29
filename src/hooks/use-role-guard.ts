import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { useAuth, type AuthenticatedRole } from '@/auth/mock-auth';

export function useRoleGuard(requiredRole: AuthenticatedRole, redirectTo: string) {
  const router = useRouter();
  const { role } = useAuth();
  const hasRedirectedRef = useRef(false);
  const canAccess = role === requiredRole;

  useEffect(() => {
    if (canAccess || hasRedirectedRef.current) {
      return;
    }

    hasRedirectedRef.current = true;
    router.replace(
      {
        pathname: '/auth' as never,
        params: {
          requiredRole,
          redirectTo,
        },
      } as never,
    );
  }, [canAccess, redirectTo, requiredRole, router]);

  return canAccess;
}
