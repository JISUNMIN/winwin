import { requestJson } from '@/api/http';

export type AuthApiRole = 'CUSTOMER' | 'PARTNER';

export type SignupPayload = {
  email: string;
  password: string;
  name: string;
  role: AuthApiRole;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthTokenResponse = {
  userId: number;
  email: string;
  name: string;
  role: AuthApiRole;
  accessToken: string;
};

export type MeResponse = {
  id: number;
  email: string;
  name: string;
  role: AuthApiRole;
};

export function signup(payload: SignupPayload) {
  return requestJson<AuthTokenResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload) {
  return requestJson<AuthTokenResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMe(accessToken: string) {
  return requestJson<MeResponse>('/api/users/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
