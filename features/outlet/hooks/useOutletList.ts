'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchOutlets, createOutlet, deleteOutlet as deleteOutletAPI } from '../services/outlet.service';
import type { Barbershop } from '../types/outlet.types';

export function useOutletList() {
  const [data, setData] = useState<Barbershop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const outlets = await fetchOutlets();
      setData(outlets);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data outlet.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addOutlet = async (nama: string, alamat: string, regionId: string): Promise<Barbershop> => {
    const newOutlet = await createOutlet(nama, alamat, regionId);
    setData((prev) => [...prev, newOutlet]);
    return newOutlet;
  };

  const removeOutlet = async (id: string): Promise<void> => {
    await deleteOutletAPI(id);
    setData((prev) => prev.filter((o) => o.id !== id));
  };

  return { data, isLoading, error, reload: load, addOutlet, removeOutlet };
}
