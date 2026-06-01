const enableDevRoleSwitchFromEnv =
  process.env.EXPO_PUBLIC_ENABLE_DEV_ROLE_SWITCH?.trim().toLowerCase();
const enableDevFallbackDataFromEnv =
  process.env.EXPO_PUBLIC_ENABLE_DEV_FALLBACK_DATA?.trim().toLowerCase();

export const ENABLE_DEV_ROLE_SWITCH =
  enableDevRoleSwitchFromEnv === 'true' ||
  (enableDevRoleSwitchFromEnv !== 'false' && __DEV__);

export const ENABLE_DEV_FALLBACK_DATA =
  enableDevFallbackDataFromEnv === 'true' ||
  (enableDevFallbackDataFromEnv !== 'false' && __DEV__);
