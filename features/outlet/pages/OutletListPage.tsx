'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MapPin, Search, Loader2, AlertCircle } from 'lucide-react';
import { useOutletList } from '../hooks/useOutletList';
import { OutletCard } from '../components/OutletCard';
import { TambahOutletModal } from '../components/TambahOutletModal';

export default function OutletListPage() {
  const router = useRouter();
  const { outlets, isLoading, error, addOutlet } = useOutletList();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = outlets.filter(
    (o) =>
      (o.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.address ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOutlet = (nama: string, alamat: string) => {
    addOutlet(nama, alamat);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari outlet..."
              className="h-[40px] pl-9 pr-4 w-[220px] bg-white border border-[#E5E7EB] rounded-full text-[13px] text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E2E8F0]"
            />
          </div>
          <span className="text-[13px] text-[#9CA3AF] whitespace-nowrap">
            {isLoading ? 'Memuat...' : `${filtered.length} outlet ditemukan`}
          </span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#1E65E2] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Outlet
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 gap-3">
          <Loader2 className="w-6 h-6 text-[#1E3A8A] animate-spin" />
          <p className="text-[14px] text-[#6B7280]">Memuat daftar outlet...</p>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-[10px] px-5 py-4 text-red-700 text-[13px]">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Grid / Empty State */}
      {!isLoading && !error && (
        filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((outlet) => (
              <OutletCard
                key={outlet.id}
                outlet={outlet}
                onClick={() => router.push(`/dashboard/outlet/${outlet.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#EBF3FF] flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-[#93C5FD]" />
            </div>
            <p className="text-[15px] font-semibold text-[#374151]">Outlet tidak ditemukan</p>
            <p className="text-[13px] text-[#9CA3AF] mt-1">Coba kata kunci lain atau tambah outlet baru</p>
          </div>
        )
      )}

      {/* Modal */}
      {isModalOpen && (
        <TambahOutletModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddOutlet}
        />
      )}
    </div>
  );
}
