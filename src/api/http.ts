import { Platform } from 'react-native';

export type ApiFieldError = {
  field: string;
  message: string;
};

export type ApiErrorResponse = {
  status: number;
  error: string;
  code: string;
  message: string;
  path: string;
  fieldErrors: ApiFieldError[];
};

export class ApiError extends Error {
  status: number;
  code: string;
  path?: string;
  fieldErrors: ApiFieldError[];

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ApiError';
    this.status = response.status;
    this.code = response.code;
    this.path = response.path;
    this.fieldErrors = response.fieldErrors ?? [];
  }
}

type UnauthorizedBehavior = 'notify' | 'ignore';

let unauthorizedHandler: ((error: ApiError) => void | Promise<void>) | null = null;

function normalizeBaseUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function getApiBaseUrl() {
  const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return normalizeBaseUrl(configuredBaseUrl);
  }

  if (!__DEV__) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL is required for production builds.',
    );
  }

  if (Platform.OS === 'web') {
    return 'http://localhost:8080';
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }

  throw new Error(
    'EXPO_PUBLIC_API_BASE_URL is required on this device. Example: http://192.168.0.10:8080',
  );
}

function buildUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

export function resolveApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return buildUrl(path);
}

export function setUnauthorizedHandler(handler: ((error: ApiError) => void | Promise<void>) | null) {
  unauthorizedHandler = handler;
}

async function parseErrorResponse(response: Response): Promise<ApiErrorResponse> {
  try {
    return (await response.json()) as ApiErrorResponse;
  } catch {
    return {
      status: response.status,
      error: response.statusText || 'Request Failed',
      code: 'HTTP_ERROR',
      message: 'Request failed',
      path: '',
      fieldErrors: [],
    };
  }
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const unauthorizedBehavior =
    (init as RequestInit & { unauthorizedBehavior?: UnauthorizedBehavior } | undefined)
      ?.unauthorizedBehavior ?? 'ignore';
  const headers = new Headers(init?.headers);

  headers.set('Accept', 'application/json');

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
  });

  if (!response.ok) {
    const error = new ApiError(await parseErrorResponse(response));

    if (error.status === 401 && unauthorizedBehavior === 'notify') {
      await unauthorizedHandler?.(error);
    }

    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function requestMultipart<T>(
  path: string,
  formData: FormData,
  init?: Omit<RequestInit, 'body' | 'headers'> & {
    headers?: HeadersInit;
    unauthorizedBehavior?: UnauthorizedBehavior;
  },
): Promise<T> {
  const unauthorizedBehavior = init?.unauthorizedBehavior ?? 'ignore';
  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/json');

  const response = await fetch(resolveApiUrl(path), {
    ...init,
    body: formData,
    headers,
  });

  if (!response.ok) {
    const error = new ApiError(await parseErrorResponse(response));

    if (error.status === 401 && unauthorizedBehavior === 'notify') {
      await unauthorizedHandler?.(error);
    }

    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
