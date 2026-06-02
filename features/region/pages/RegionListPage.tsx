'use client';

import { useState } from 'react';
import { useSearch } from '@/shared/context/SearchContext';
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { Region } from '../types/region.types';
import { DeleteRegionModal } from '../components/DeleteRegionModal';
import { useRegionList } from '../hooks/useRegionList';

const ITEMS_PER_PAGE = 5;

export default function RegionListPage() {
  const { searchQuery } = useSearch();
  const { data, isLoading, error, removeRegion } = useRegionList();
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const safePage = currentPage > totalPages ? 1 : currentPage;
  const pagedData = filteredData.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const goToPage = (page: number) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };

  // Handlers
  const handleDelete = async () => {
    if (!selectedRegion) return;
    setIsDeleting(true);
    try {
      await removeRegion(selectedRegion.id);
      setIsDeleteOpen(false);
      setSelectedRegion(null);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Gagal menghapus region.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openDelete = (region: Region) => {
    setSelectedRegion(region);
    setIsDeleteOpen(true);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-9 h-9 text-[#1E65E2] animate-spin" />
        <p className="text-[13px] text-[#6B7280]">Memuat data region...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-[14px] font-semibold text-[#374151]">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-[#1E293B]">Kelola Region</h2>
        <Link href="/dashboard/regions/tambah" className="flex items-center gap-2 bg-[#1E65E2] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors">
          <Plus className="w-4 h-4" /> Tambah Region
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F3F4F6]">
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">Nama Region</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">Jumlah Barbershop</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">Dibuat Pada</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map((item, index) => (
                <tr key={item.id ?? index} className="border-b border-[#F3F4F6] last:border-none hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap font-medium">{item.name}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${(item.barbershopCount ?? 0) > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.barbershopCount ?? 0} cabang
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[13px] text-[#6B7280] whitespace-nowrap">{item.createdAt ? formatDate(item.createdAt) : '—'}</td>
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                      <Link href={`/dashboard/regions/${item.id}/edit`} className="text-[#3B82F6] hover:text-blue-700 transition-colors p-1" title="Edit"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => openDelete(item)} className="text-[#EF4444] hover:text-red-700 transition-colors p-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-[13px] text-[#6B7280]">Data region tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F3F4F6]">
          <span className="text-[12px] text-[#6B7280]">
            Menampilkan {filteredData.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filteredData.length)} dari {filteredData.length} data
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => goToPage(safePage - 1)} disabled={safePage === 1} className="flex items-center gap-1 text-[13px] font-medium px-2 py-1 rounded mr-1 disabled:opacity-40 text-[#1E65E2] hover:bg-[#F0F5FF] disabled:hover:bg-transparent disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => goToPage(page)} className={`w-7 h-7 flex items-center justify-center rounded-[6px] text-[13px] font-medium transition-colors ${safePage === page ? 'bg-[#1E65E2] text-white' : 'text-[#6B7280] hover:bg-[#F3F4F6]'}`}>{page}</button>
            ))}
            <button onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages} className="flex items-center gap-1 text-[13px] font-medium px-2 py-1 rounded ml-1 disabled:opacity-40 text-[#1E65E2] hover:bg-[#F0F5FF] disabled:hover:bg-transparent disabled:cursor-not-allowed">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteOpen && selectedRegion && (
        <DeleteRegionModal
          region={selectedRegion}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
