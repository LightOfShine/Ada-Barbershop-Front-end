import {
  LayoutDashboard,
  CalendarDays,
  Store,
  FileText,
  UserCog,
  Globe,
  Building2,
} from 'lucide-react';

export const MENU_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Ubah Jadwal', path: '/dashboard/jadwal', icon: CalendarDays },
  { name: 'Outlet', path: '/dashboard/outlet', icon: Store },
  { name: 'Kelola User', path: '/dashboard/users', icon: UserCog },
  { name: 'Region', path: '/dashboard/regions', icon: Globe },
  { name: 'Company', path: '/dashboard/company', icon: Building2 },
  { name: 'Export', path: '/dashboard/export', icon: FileText },
] as const;
