'use client';

import { useState, useEffect } from 'react';
import { fetchOutlets, fetchEmployees } from '../services/outlet.service';
import type { Barbershop, Employee } from '../types/outlet.types';

export function useOutletDetail(id: string) {
  const [shop, setShop] = useState<Barbershop | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const list = await fetchOutlets();
        const found = list.find((b) => b.id === id);
        if (!found) throw new Error('Outlet tidak ditemukan.');
        setShop(found);

        const allUsers = await fetchEmployees();
        const inShop = allUsers.filter((u) => u.barbershopId === id);
        setEmployees(
          inShop.length > 0 ? inShop : allUsers.filter((u) => u.role === 'EMPLOYEE')
        );
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Terjadi kesalahan.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  return { shop, employees, isLoading, error };
}
