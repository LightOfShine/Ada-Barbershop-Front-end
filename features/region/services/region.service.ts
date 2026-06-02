import { API_BASE_URL, ENDPOINTS } from '@/config/api';
import { apiFetch } from '@/shared/services/api-client';
import type { Region } from '../types/region.types';

/** Normalize raw API region to Region shape */
function normalizeRegion(raw: Region): Region {
  return {
    ...raw,
    barbershopCount: raw.barbershopCount ?? raw._count?.barbershops ?? 0,
  };
}

/** GET /regions */
export async function fetchRegions(): Promise<Region[]> {
  const raw = await apiFetch<Region[] | { data: Region[] }>(ENDPOINTS.REGIONS);
  const list = Array.isArray(raw) ? raw : (raw as { data: Region[] })?.data ?? [];
  return list.map(normalizeRegion);
}

/** POST /regions */
export async function createRegion(name: string): Promise<Region> {
  const raw = await apiFetch<Region | { data: Region }>(ENDPOINTS.REGIONS, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  const region = (raw as { data: Region })?.data ?? (raw as Region);
  return normalizeRegion(region);
}

/** DELETE /regions/:id */
export async function deleteRegion(id: string): Promise<void> {
  await apiFetch<unknown>(`${ENDPOINTS.REGIONS}/${id}`, {
    method: 'DELETE',
  });
}
