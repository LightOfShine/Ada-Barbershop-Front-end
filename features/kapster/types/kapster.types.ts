export interface Kapster {
  id: string;
  nama: string;
  idKapster: string;
  noHp: string;
  outlet: string;
  shift: string;
  email: string;
}

export interface KapsterFormData {
  nama: string;
  idKapster: string;
  noHp: string;
  email: string;
  outletAwal: string;
  umur: string;
  alamat: string;
  tanggalMasuk: string;
  shift: string;
  photo?: string;
}
