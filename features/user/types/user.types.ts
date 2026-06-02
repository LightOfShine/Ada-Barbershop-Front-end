export type UserRole = 'OWNER' | 'ADMIN' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  regionId?: string;
  barbershopId?: string;
  shiftStart?: string; // '08:00'
  shiftEnd?: string;   // '17:00'
  createdAt: string;   // ISO date
  // Nested relations from API
  region?: { id: string; name: string };
  barbershop?: { id: string; name: string };
  // Computed convenience fields
  regionName?: string;
  barbershopName?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole | '';
  regionId: string;
  barbershopId: string;
  shiftStart: string;
  shiftEnd: string;
}
