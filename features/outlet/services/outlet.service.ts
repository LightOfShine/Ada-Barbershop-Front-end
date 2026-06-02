import { API_BASE_URL, ENDPOINTS } from '@/config/api';
import { authHeaders } from '@/shared/services/api-client';
import type { Barbershop, Employee } from '../types/outlet.types';

export async function fetchOutlets(): Promise<Barbershop[]> {
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.BARBERSHOPS}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const raw = await res.json();
  return Array.isArray(raw) ? raw : raw?.data ?? [];
}

export async function createOutlet(
  name: string,
  address: string,
  regionId: string,
): Promise<Barbershop> {
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.BARBERSHOPS}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, address, regionId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `Gagal membuat outlet (${res.status})`);
  }
  const raw = await res.json();
  return raw?.data ?? raw;
}

export async function deleteOutlet(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.BARBERSHOPS}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `Gagal menghapus outlet (${res.status})`);
  }
}

export async function fetchEmployees(): Promise<Employee[]> {
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.USERS}`, {
    headers: authHeaders(),
  });
  if (!res.ok) return [];
  const raw = await res.json();
  return Array.isArray(raw) ? raw : raw?.data ?? [];
}

