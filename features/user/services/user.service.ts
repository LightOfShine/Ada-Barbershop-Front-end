import { API_BASE_URL, ENDPOINTS } from '@/config/api';
import { apiFetch } from '@/shared/services/api-client';
import type { User, UserFormData } from '../types/user.types';

/** Normalize raw API user to User shape (flatten nested region/barbershop) */
export function normalizeUser(raw: User): User {
  return {
    ...raw,
    regionName: raw.regionName ?? raw.region?.name,
    barbershopName: raw.barbershopName ?? raw.barbershop?.name,
    regionId: raw.regionId ?? raw.region?.id,
    barbershopId: raw.barbershopId ?? raw.barbershop?.id,
  };
}

/** GET /users */
export async function fetchUsers(): Promise<User[]> {
  const raw = await apiFetch<User[] | { data: User[] }>(ENDPOINTS.USERS);
  const list = Array.isArray(raw) ? raw : (raw as { data: User[] })?.data ?? [];
  return list.map(normalizeUser);
}

/** GET /users — filter by role */
export async function fetchUsersByRole(role: string): Promise<User[]> {
  const all = await fetchUsers();
  return all.filter((u) => u.role === role);
}

/**
 * POST /auth/register — create a new user.
 * Only OWNER/ADMIN can call this; the JWT must be sent automatically by apiFetch.
 */
export async function registerUser(data: UserFormData): Promise<User> {
  const body: Record<string, unknown> = {
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
  };
  if (data.regionId) body.regionId = data.regionId;
  if (data.barbershopId) body.barbershopId = data.barbershopId;
  if (data.shiftStart) body.shiftStart = data.shiftStart;
  if (data.shiftEnd) body.shiftEnd = data.shiftEnd;

  const raw = await apiFetch<User | { data: User }>(ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const user = (raw as { data: User })?.data ?? (raw as User);
  return normalizeUser(user);
}
