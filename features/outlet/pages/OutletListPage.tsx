'use client';

import { useState } from 'react';
import { useSearch } from '@/shared/context/SearchContext';
import { Loader2, Plus, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { OutletCard } from '../components/OutletCard';
import { TambahOutletModal } from '../components/TambahOutletModal';
import { useOutletList } from '../hooks/useOutletList';

export default function OutletListPage() {
  const { searchQuery } = useSearch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, error, addOutlet, removeOutlet } = useOutletList();

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (nama: string, alamat: string, regionId: string) => {
    try {
      await addOutlet(nama, alamat, regionId);
      setIsModalOpen(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Gagal menambahkan outlet');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus outlet ${name}?`)) {
      setIsDeleting(id);
      try {
        await removeOutlet(id);
      } catch (e: unknown) {
        alert(e instanceof Error ? e.message : 'Gagal menghapus outlet');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-9 h-9 text-[#1E65E2] animate-spin" />
        <p className="text-[13px] text-[#6B7280]">Memuat data outlet...</p>
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
      {/* Header section */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-[#1E293B]">Kelola Barbershop</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#1E65E2] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Outlet
        </button>
      </div>

      {/* Grid of outlet cards with delete button support */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.map((item) => (
          <div key={item.id} className="relative group">
            <OutletCard
              outlet={item}
              onClick={() => {
                window.location.href = `/dashboard/outlet/${item.id}`;
              }}
            />
            {/* Hover overlay with edit & delete actions */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {isDeleting === item.id ? (
                <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
              ) : (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item.id, item.name); }}
                  className="bg-white p-1.5 rounded-md shadow text-red-500 hover:bg-red-50 transition-colors"
                  title="Hapus Outlet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[20px] border border-[#E5E7EB]">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-[16px] font-medium text-gray-900 mb-1">Tidak ada outlet ditemukan</h3>
          <p className="text-[13px] text-gray-500 max-w-[250px]">
            {searchQuery ? 'Coba gunakan kata kunci pencarian yang berbeda.' : 'Belum ada outlet yang ditambahkan. Silakan tambah outlet baru.'}
          </p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <TambahOutletModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
