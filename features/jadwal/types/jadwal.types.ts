export interface JadwalKapster {
  id: string;
  nama: string;
  idKapster: string;
  noHp: string;
  outlet: string;
  shift: string;
}

export interface SlotState {
  sourceId: string;
  targetNamaId: string;
  targetOutlet: string;
  targetShift: string;
}

export const KAPSTER_LIST: JadwalKapster[] = [
  { id: '1', nama: 'Ahmad Roni',       idKapster: '1400101', noHp: '0882006854875', outlet: 'Gumilir', shift: 'Pagi'  },
  { id: '2', nama: 'Bima Ardiansyah',  idKapster: '1400102', noHp: '082134567891',  outlet: 'Kroya',   shift: 'Siang' },
  { id: '3', nama: 'Candra Wijaya',    idKapster: '1400103', noHp: '081278945632',  outlet: 'Rinjani', shift: 'Pagi'  },
  { id: '4', nama: 'Johan Pratama',    idKapster: '1400104', noHp: '085612398765',  outlet: 'Jawa',    shift: 'Siang' },
  { id: '5', nama: 'Reyhan Saputra',   idKapster: '1400105', noHp: '081345678901',  outlet: 'Tidar',   shift: 'Pagi'  },
];

export const OUTLETS = ['Gumilir', 'Kroya', 'Rinjani', 'Tidar', 'Jawa', 'Tendean', 'Jl Laut'];

export const ACCENTS = [
  { bar: 'bg-[#2563EB]',  light: 'bg-[#EBF3FF]' },
  { bar: 'bg-[#A855F7]',  light: 'bg-[#F5F0FF]' },
  { bar: 'bg-[#10B981]',  light: 'bg-[#ECFDF5]' },
];
