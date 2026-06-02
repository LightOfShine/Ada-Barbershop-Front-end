import { API_BASE_URL } from '@/config/api';

function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') ?? '';
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    cache: 'no-store',
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `Request failed (${res.status})`);
  }

  return res.json();
}

/**
 * Helper: buat auth headers untuk fetch manual.
 * Digunakan ketika butuh kontrol lebih (misal: stream, FormData).
 */
export function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  };
}
