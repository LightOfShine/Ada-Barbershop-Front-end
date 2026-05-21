export interface Outlet {
  id: string;
  name: string;
  address?: string;
  region?: { name: string };
}

export interface Barbershop {
  id: string;
  name: string;
  address?: string;
  region?: { name: string };
}

export interface Employee {
  id: string;
  name: string;
  email?: string;
  role?: string;
  shiftStart?: string; // '09:00'
  shiftEnd?: string;   // '15:30'
  barbershopId?: string;
}
