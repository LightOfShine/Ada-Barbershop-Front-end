'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchUsers } from '../services/user.service';
import type { User } from '../types/user.types';

export function useUserList() {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const users = await fetchUsers();
      setData(users);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data user.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const removeUser = (id: string) => {
    setData((prev) => prev.filter((u) => u.id !== id));
  };

  return { data, isLoading, error, reload: load, removeUser };
}
