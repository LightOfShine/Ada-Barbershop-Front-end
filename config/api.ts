export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://ada-backend-service.onrender.com';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
  },
  BARBERSHOPS: '/barbershops',
  USERS: '/users',
  EXPORT: {
    ATTENDANCE: '/export/attendance',
  },
} as const;
