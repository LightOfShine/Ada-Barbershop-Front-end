export interface Region {
  id: string;
  name: string;
  barbershopCount: number;
  createdAt: string; // ISO date
}

export interface RegionFormData {
  name: string;
}
