'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchRegions, createRegion, deleteRegion } from '../services/region.service';
import type { Region } from '../types/region.types';

export function useRegionList() {
  const [data, setData] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const regions = await fetchRegions();
      setData(regions);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data region.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addRegion = async (name: string): Promise<Region> => {
    const newRegion = await createRegion(name);
    setData((prev) => [...prev, newRegion]);
    return newRegion;
  };

  const removeRegion = async (id: string): Promise<void> => {
    await deleteRegion(id);
    setData((prev) => prev.filter((r) => r.id !== id));
  };

  return { data, isLoading, error, reload: load, addRegion, removeRegion };
}
