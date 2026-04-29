import { type ReactNode } from 'react';

import { type AuthenticatedRole, useAuth } from '@/auth/mock-auth';
import { useRoleGuard } from '@/hooks/use-role-guard';

import { AccessGuardScreen } from './AccessGuardScreen';

type ProtectedRoleScreenProps = {
  requiredRole: AuthenticatedRole;
  redirectTo: string;
  loadingTitle: string;
  loadingDescription: string;
  deniedTitle: string;
  deniedDescription: string;
  children: ReactNode;
};

export function ProtectedRoleScreen({
  requiredRole,
  redirectTo,
  loadingTitle,
  loadingDescription,
  deniedTitle,
  deniedDescription,
  children,
}: ProtectedRoleScreenProps) {
  const { isReady } = useAuth();
  const canAccess = useRoleGuard(requiredRole, redirectTo);

  if (!isReady) {
    return <AccessGuardScreen title={loadingTitle} description={loadingDescription} />;
  }

  if (!canAccess) {
    return <AccessGuardScreen title={deniedTitle} description={deniedDescription} />;
  }

  return <>{children}</>;
}
