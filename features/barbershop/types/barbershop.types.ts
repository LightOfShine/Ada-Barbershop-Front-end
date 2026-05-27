export interface BarbershopItem {
  id: string;
  name: string;
  address: string;
  regionId: string;
  regionName: string;
  employeeCount: number;
  createdAt: string; // ISO date
}

export interface BarbershopFormData {
  name: string;
  address: string;
  regionId: string;
}
