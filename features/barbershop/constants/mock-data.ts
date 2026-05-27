import type { BarbershopItem } from '../types/barbershop.types';

export const INITIAL_BARBERSHOP_DATA: BarbershopItem[] = [
  { id: 'bs-1', name: 'Ada Barbershop Gumilir', address: 'Jl. S. Parman No. 23, Gumilir, Cilacap Utara', regionId: 'reg-1', regionName: 'Cilacap', employeeCount: 4, createdAt: '2023-01-15' },
  { id: 'bs-2', name: 'Ada Barbershop Kroya', address: 'Jl. Jend. Sudirman No. 45, Kroya', regionId: 'reg-1', regionName: 'Cilacap', employeeCount: 3, createdAt: '2023-03-20' },
  { id: 'bs-3', name: 'Ada Barbershop Majenang', address: 'Jl. Raya Majenang No. 12', regionId: 'reg-1', regionName: 'Cilacap', employeeCount: 2, createdAt: '2023-06-10' },
  { id: 'bs-4', name: 'Ada Barbershop Purwokerto 1', address: 'Jl. Jend. Soedirman No. 100, Purwokerto', regionId: 'reg-2', regionName: 'Banyumas', employeeCount: 5, createdAt: '2023-07-15' },
  { id: 'bs-5', name: 'Ada Barbershop Purwokerto 2', address: 'Jl. Overste Isdiman No. 88, Purwokerto', regionId: 'reg-2', regionName: 'Banyumas', employeeCount: 3, createdAt: '2024-01-05' },
  { id: 'bs-6', name: 'Ada Barbershop Kebumen 1', address: 'Jl. Pahlawan No. 55, Kebumen', regionId: 'reg-3', regionName: 'Kebumen', employeeCount: 2, createdAt: '2024-02-18' },
  { id: 'bs-7', name: 'Ada Barbershop Purbalingga', address: 'Jl. MT Haryono No. 30, Purbalingga', regionId: 'reg-4', regionName: 'Purbalingga', employeeCount: 3, createdAt: '2024-04-22' },
  { id: 'bs-8', name: 'Ada Barbershop Tegal 1', address: 'Jl. Gajah Mada No. 18, Tegal', regionId: 'reg-6', regionName: 'Tegal', employeeCount: 4, createdAt: '2024-07-10' },
  { id: 'bs-9', name: 'Ada Barbershop Tegal 2', address: 'Jl. Ahmad Yani No. 72, Tegal', regionId: 'reg-6', regionName: 'Tegal', employeeCount: 2, createdAt: '2024-09-05' },
];

export const REGION_OPTIONS = [
  { value: 'reg-1', label: 'Cilacap' },
  { value: 'reg-2', label: 'Banyumas' },
  { value: 'reg-3', label: 'Kebumen' },
  { value: 'reg-4', label: 'Purbalingga' },
  { value: 'reg-5', label: 'Banjarnegara' },
  { value: 'reg-6', label: 'Tegal' },
] as const;
