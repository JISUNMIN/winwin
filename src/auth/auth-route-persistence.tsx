import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { getDefaultRouteForAppRole, useAuth, type AppRole } from '@/auth/mock-auth';

const LAST_ROUTE_STORAGE_KEY = 'winwin.last-route';

function canAccessRoute(role: AppRole, pathname: string) {
  if (pathname.startsWith('/partner')) {
    return role === 'partner';
  }

  if (pathname.startsWith('/chat')) {
    return role === 'customer';
  }

  return pathname !== '/auth';
}

function shouldRestoreFromPath(pathname: string) {
  return pathname === '/';
}

function shouldPersistPath(pathname: string) {
  return pathname !== '/auth';
}

export function AuthRoutePersistence() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, isReady } = useAuth();
  const [storedPath, setStoredPath] = useState<string | null>(null);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [hasResolvedInitialRoute, setHasResolvedInitialRoute] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restoreStoredPath = async () => {
      try {
        const savedPath = await AsyncStorage.getItem(LAST_ROUTE_STORAGE_KEY);

        if (isMounted) {
          setStoredPath(savedPath);
        }
      } finally {
        if (isMounted) {
          setIsStorageReady(true);
        }
      }
    };

    restoreStoredPath();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !isStorageReady || hasResolvedInitialRoute) {
      return;
    }

    if (
      storedPath &&
      shouldRestoreFromPath(pathname) &&
      canAccessRoute(role, storedPath) &&
      storedPath !== pathname
    ) {
      setHasResolvedInitialRoute(true);
      router.replace(storedPath as never);
      return;
    }

    setHasResolvedInitialRoute(true);
  }, [hasResolvedInitialRoute, isReady, isStorageReady, pathname, role, router, storedPath]);

  useEffect(() => {
    if (!hasResolvedInitialRoute || !shouldPersistPath(pathname)) {
      return;
    }

    setStoredPath(pathname);
    AsyncStorage.setItem(LAST_ROUTE_STORAGE_KEY, pathname).catch(() => {
      // Last route persistence should not interrupt navigation.
    });
  }, [hasResolvedInitialRoute, pathname]);

  useEffect(() => {
    if (!hasResolvedInitialRoute || pathname === '/auth') {
      return;
    }

    if (canAccessRoute(role, pathname)) {
      return;
    }

    const fallbackPath = getDefaultRouteForAppRole(role);

    if (fallbackPath === pathname) {
      return;
    }

    setStoredPath(fallbackPath);
    AsyncStorage.setItem(LAST_ROUTE_STORAGE_KEY, fallbackPath).catch(() => {
      // Last route cleanup should not interrupt navigation.
    });
    router.replace(fallbackPath as never);
  }, [hasResolvedInitialRoute, pathname, role, router]);

  return null;
}
