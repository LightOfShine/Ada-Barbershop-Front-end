'use client';

import { useState, useEffect } from 'react';
import { fetchOutlets, createOutlet } from '../services/outlet.service';
import type { Outlet } from '../types/outlet.types';

export function useOutletList() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchOutlets()
      .then((data) => setOutlets(data))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Gagal memuat data.')
      )
      .finally(() => setIsLoading(false));
  }, []);

  const addOutlet = async (nama: string, alamat: string) => {
    try {
      const newOutlet = await createOutlet(nama, alamat);
      if (newOutlet?.id) {
        setOutlets((prev) => [...prev, newOutlet]);
      }
    } catch (e) {
      console.error('Failed to add outlet:', e);
    }
  };

  return { outlets, isLoading, error, addOutlet };
}
