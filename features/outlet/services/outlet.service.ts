import { API_BASE_URL } from '@/config/api';
import { authHeaders } from '@/shared/services/api-client';
import type { Barbershop, Employee } from '../types/outlet.types';

export async function fetchOutlets(): Promise<Barbershop[]> {
  const res = await fetch(`${API_BASE_URL}/barbershops`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const raw = await res.json();
  return Array.isArray(raw) ? raw : raw?.data ?? [];
}

export async function createOutlet(name: string, address: string): Promise<Barbershop> {
  const res = await fetch(`${API_BASE_URL}/barbershops`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, address }),
  });
  return res.json();
}

export async function fetchEmployees(): Promise<Employee[]> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    headers: authHeaders(),
  });
  if (!res.ok) return [];
  const raw = await res.json();
  return Array.isArray(raw) ? raw : raw?.data ?? [];
}
