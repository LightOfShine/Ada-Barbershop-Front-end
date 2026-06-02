export interface Region {
  id: string;
  name: string;
  companyId?: string;
  createdAt: string; // ISO date
  // API may return nested _count or barbershopCount
  _count?: { barbershops: number };
  barbershopCount?: number; // computed from _count.barbershops
}

export interface RegionFormData {
  name: string;
}
