import type { User } from '../types/user.types';

export const INITIAL_USER_DATA: User[] = [
  { id: '1', name: 'Hendra Wijaya', email: 'hendra.wijaya@adabarbershop.com', role: 'OWNER', regionName: undefined, barbershopName: undefined, shiftStart: undefined, shiftEnd: undefined, createdAt: '2023-01-15' },
  { id: '2', name: 'Siti Nurhaliza', email: 'siti.admin@adabarbershop.com', role: 'ADMIN', regionName: 'Cilacap', barbershopName: undefined, shiftStart: '08:00', shiftEnd: '17:00', createdAt: '2023-03-20' },
  { id: '3', name: 'Budi Santoso', email: 'budi.admin@adabarbershop.com', role: 'ADMIN', regionName: 'Banyumas', barbershopName: undefined, shiftStart: '08:00', shiftEnd: '17:00', createdAt: '2023-04-10' },
  { id: '4', name: 'Ahmad Roni', email: 'ahmadroni@gmail.com', role: 'EMPLOYEE', regionName: 'Cilacap', barbershopName: 'Gumilir', shiftStart: '08:00', shiftEnd: '15:00', createdAt: '2024-05-01' },
  { id: '5', name: 'Bima Ardiansyah', email: 'bima.ardi@gmail.com', role: 'EMPLOYEE', regionName: 'Cilacap', barbershopName: 'Kroya', shiftStart: '10:00', shiftEnd: '17:00', createdAt: '2024-06-15' },
  { id: '6', name: 'Candra Wijaya', email: 'cwijaya@gmail.com', role: 'EMPLOYEE', regionName: 'Banyumas', barbershopName: 'Purwokerto 1', shiftStart: '08:00', shiftEnd: '15:00', createdAt: '2024-07-20' },
  { id: '7', name: 'Dewi Lestari', email: 'dewi.lestari@gmail.com', role: 'EMPLOYEE', regionName: 'Banyumas', barbershopName: 'Purwokerto 2', shiftStart: '10:00', shiftEnd: '17:00', createdAt: '2024-08-05' },
  { id: '8', name: 'Eko Prasetyo', email: 'eko.prasetyo@gmail.com', role: 'EMPLOYEE', regionName: 'Cilacap', barbershopName: 'Majenang', shiftStart: '08:00', shiftEnd: '15:00', createdAt: '2024-09-12' },
  { id: '9', name: 'Fitri Handayani', email: 'fitri.h@gmail.com', role: 'ADMIN', regionName: 'Kebumen', barbershopName: undefined, shiftStart: '08:00', shiftEnd: '17:00', createdAt: '2024-10-01' },
  { id: '10', name: 'Gunawan Saputra', email: 'gunawan.s@gmail.com', role: 'EMPLOYEE', regionName: 'Kebumen', barbershopName: 'Kebumen 1', shiftStart: '08:00', shiftEnd: '15:00', createdAt: '2024-11-18' },
];

export const ROLE_OPTIONS = [
  { value: 'OWNER', label: 'Owner' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'EMPLOYEE', label: 'Employee' },
] as const;

export const REGION_OPTIONS = [
  { value: 'reg-1', label: 'Cilacap' },
  { value: 'reg-2', label: 'Banyumas' },
  { value: 'reg-3', label: 'Kebumen' },
] as const;

export const BARBERSHOP_OPTIONS = [
  { value: 'bs-1', label: 'Gumilir', regionId: 'reg-1' },
  { value: 'bs-2', label: 'Kroya', regionId: 'reg-1' },
  { value: 'bs-3', label: 'Majenang', regionId: 'reg-1' },
  { value: 'bs-4', label: 'Purwokerto 1', regionId: 'reg-2' },
  { value: 'bs-5', label: 'Purwokerto 2', regionId: 'reg-2' },
  { value: 'bs-6', label: 'Kebumen 1', regionId: 'reg-3' },
] as const;
