'use client';

import { usePathname } from 'next/navigation';
import { Search, Settings, Bell, Menu } from 'lucide-react';
import { useSearch } from '@/shared/context/SearchContext';
import { MENU_ITEMS } from '../constants/menu-items';

export function TopHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { searchQuery, setSearchQuery } = useSearch();
  const pathname = usePathname();

  // Menentukan judul halaman berdasarkan path
  const getPageTitle = () => {
    if (/^\/dashboard\/outlet\/.+/.test(pathname)) return 'Detail Outlet';
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
