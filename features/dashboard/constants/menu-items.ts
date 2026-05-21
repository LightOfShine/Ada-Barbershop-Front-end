import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Store,
  FileText,
} from 'lucide-react';

export const MENU_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Data Kapster', path: '/dashboard/kapster', icon: Users },
  { name: 'Ubah Jadwal', path: '/dashboard/jadwal', icon: CalendarDays },
  { name: 'Outlet', path: '/dashboard/outlet', icon: Store },
  { name: 'Export', path: '/dashboard/export', icon: FileText },
] as const;
