'use client';

import { useState, useCallback } from 'react';
import { SearchProvider } from '@/shared/context/SearchContext';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

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
