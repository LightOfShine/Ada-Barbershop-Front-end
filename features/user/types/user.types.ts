export type UserRole = 'OWNER' | 'ADMIN' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  regionName?: string;
  barbershopName?: string;
  shiftStart?: string; // '08:00'
  shiftEnd?: string;   // '17:00'
  createdAt: string;   // ISO date
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
