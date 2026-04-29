'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Store,
  Search,
  Settings,
  Bell,
  Menu,
  X,
  FileText
} from 'lucide-react';
import { SearchProvider, useSearch } from './SearchContext';

const MENU_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Data Kapster', path: '/dashboard/kapster', icon: Users },
  { name: 'Ubah Jadwal', path: '/dashboard/jadwal', icon: CalendarDays },
  { name: 'Outlet', path: '/dashboard/outlet', icon: Store },
  { name: 'Export', path: '/dashboard/export', icon: FileText },
];

function TopHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { searchQuery, setSearchQuery } = useSearch();
  const pathname = usePathname();

  // Menentukan judul halaman berdasarkan path
  const getPageTitle = () => {
    const item = MENU_ITEMS.find((m) => m.path === pathname);
    return item ? item.name : 'Dashboard';
  };

  return (
    <header className="relative z-20 h-[70px] md:h-[90px] px-4 md:px-8 bg-white border-b border-[#F3F4F6] flex items-center justify-between flex-shrink-0 gap-3">
      {/* Left: Hamburger (mobile) + Title */}
      <div className="flex items-center gap-3">
        {/* Hamburger button - only visible on mobile */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden w-[40px] h-[40px] flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] transition-colors flex-shrink-0 cursor-pointer relative z-50 focus:outline-none"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 pointer-events-none" />
        </button>
        <h1 className="text-[18px] md:text-[24px] font-bold text-[#1F2937] whitespace-nowrap">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Area (Search & User Actions) */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Search Box - hidden on very small screens */}
        <div className="relative hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#9CA3AF]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for something"
            className="w-[180px] lg:w-[280px] h-[40px] md:h-[44px] pl-10 pr-4 bg-[#F8FAFC] border-none rounded-full text-[13px] focus:outline-none focus:ring-2 focus:ring-[#E2E8F0] text-[#4B5563] placeholder-[#94A3B8]"
          />
        </div>

        {/* Icon Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <button type="button" className="hidden sm:flex w-[40px] h-[40px] md:w-[44px] md:h-[44px] items-center justify-center rounded-full border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
            <Settings className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button type="button" className="w-[40px] h-[40px] md:w-[44px] md:h-[44px] flex items-center justify-center rounded-full border border-[#E2E8F0] text-[#EF4444] hover:bg-[#FEF2F2] transition-colors relative">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="w-[40px] h-[40px] md:w-[44px] md:h-[44px] rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] p-[2px] cursor-pointer flex-shrink-0">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-slate-300"></div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  // Tutup sidebar saat navigasi (di mobile)
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* Overlay backdrop (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity cursor-pointer"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-40
          w-[260px] max-w-[80vw] bg-white h-full border-r border-[#E5E7EB] flex flex-col flex-shrink-0
          transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Logo + Close button */}
        <div className="h-[70px] md:h-[90px] flex items-center justify-between border-b border-[#F3F4F6] px-4">
          <div className="relative flex-1 h-[50px] md:h-[60px]">
            <Image
              src="/logo.png"
              alt="Ada Management Apps Logo"
              fill
              style={{ objectFit: 'contain', objectPosition: 'left' }}
              priority
            />
          </div>
          {/* Close button - mobile only */}
          <button
            type="button"
            onClick={onClose}
            className="md:hidden w-[36px] h-[36px] flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] transition-colors flex-shrink-0 ml-2 focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 pointer-events-none" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg text-[14px] font-medium transition-all ${isActive
                    ? 'bg-[#EBF3FF] text-[#1D4ED8]'
                    : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151]'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#2563EB]' : 'text-[#9CA3AF]'}`} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <SearchProvider>
      <div className="flex h-[100dvh] md:h-screen w-full bg-[#F8F9FB] font-sans text-slate-800 overflow-hidden">

        {/* ─── SIDEBAR ─── */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* ─── MAIN CONTENT ─── */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">

          <TopHeader onMenuToggle={toggleSidebar} />

          {/* Scrollable Dashboard Body */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-0">
            {children}
          </div>

        </main>

      </div>
    </SearchProvider>
  );
}
