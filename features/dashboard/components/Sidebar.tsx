'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { MENU_ITEMS } from '../constants/menu-items';

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
