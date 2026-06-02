export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://ada-backend-service.onrender.com';

export const ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  REGIONS: '/regions',
  BARBERSHOPS: '/barbershops',
  USERS: '/users',
  ATTENDANCE: {
    CHECK_IN: '/attendance/check-in',
    CHECK_OUT: '/attendance/check-out',
  },
  EXPORT: {
    ATTENDANCE: '/export/attendance',
    REWARD: '/export/reward',
  },
} as const;
