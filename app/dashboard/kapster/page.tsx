'use client';

import { useState } from 'react';
import { useSearch } from '../SearchContext';
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';
import Link from 'next/link';

interface Kapster {
  id: string;
  nama: string;
  idKapster: string;
  noHp: string;
  outlet: string;
  shift: string;
  email: string;
}

const INITIAL_DATA: Kapster[] = [
  { id: '1', nama: 'Ahmad', idKapster: '1400101', noHp: '0882006854875', outlet: 'Gumilir', shift: 'Pagi', email: 'ahmadroni@gmail.com' },
  { id: '2', nama: 'Bima Ardiansyah', idKapster: '1400102', noHp: '082134567891', outlet: 'Kroya', shift: 'Siang', email: 'bima.ardi@gmail.com' },
  { id: '3', nama: 'Candra Wijaya', idKapster: '1400103', noHp: '081278945632', outlet: 'Rinjani', shift: 'Pagi', email: 'cwijaya@gmail.com' },
  { id: '4', nama: 'Bima Ardiansyah', idKapster: '1400102', noHp: '082134567891', outlet: 'Kroya', shift: 'Siang', email: 'bima.ardi@gmail.com' },
  { id: '5', nama: 'Candra Wijaya', idKapster: '1400103', noHp: '081278945632', outlet: 'Rinjani', shift: 'Pagi', email: 'cwijaya@gmail.com' },
  { id: '6', nama: 'Candra Wijaya', idKapster: '1400103', noHp: '081278945632', outlet: 'Rinjani', shift: 'Pagi', email: 'cwijaya@gmail.com' },
  { id: '7', nama: 'Candra Wijaya', idKapster: '1400103', noHp: '081278945632', outlet: 'Rinjani', shift: 'Pagi', email: 'cwijaya@gmail.com' },
  { id: '8', nama: 'Candra Wijaya', idKapster: '1400103', noHp: '081278945632', outlet: 'Rinjani', shift: 'Pagi', email: 'cwijaya@gmail.com' },
  { id: '9', nama: 'Candra Wijaya', idKapster: '1400103', noHp: '081278945632', outlet: 'Rinjani', shift: 'Pagi', email: 'cwijaya@gmail.com' },
];

const ITEMS_PER_PAGE = 5;

export default function KapsterPage() {
  const { searchQuery } = useSearch();
  const [data, setData] = useState<Kapster[]>(INITIAL_DATA);
  const [currentPage, setCurrentPage] = useState(1);

  // States for Delete Modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedKapster, setSelectedKapster] = useState<Kapster | null>(null);

  // Filter Logic
  const filteredData = data.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.idKapster.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const safePage = currentPage > totalPages ? 1 : currentPage;
  const pagedData = filteredData.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Handlers
  const handleDelete = () => {
    if (!selectedKapster) return;
    setData(data.filter(item => item.id !== selectedKapster.id));
    setIsDeleteOpen(false);
    setSelectedKapster(null);
  };

  const openDelete = (kapster: Kapster) => {
    setSelectedKapster(kapster);
    setIsDeleteOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-[#1E293B]">Data Kapster</h2>
        <Link
          href="/dashboard/kapster/tambah"
          className="flex items-center gap-2 bg-[#1E65E2] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Kapster
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F3F4F6]">
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">Nama</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">Id_Kapster</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">No_Hp</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">Outlet</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">Shift</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">Email</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map((item, index) => (
                <tr key={item.id ?? index} className="border-b border-[#F3F4F6] last:border-none hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap">{item.nama}</td>
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap">{item.idKapster}</td>
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap">{item.noHp}</td>
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap">{item.outlet}</td>
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap">{item.shift}</td>
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap">{item.email}</td>
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                      <Link href={`/dashboard/kapster/${item.id}`} className="text-[#10B981] hover:text-emerald-700 transition-colors p-1" title="Detail">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/dashboard/kapster/${item.id}/edit`} className="text-[#3B82F6] hover:text-blue-700 transition-colors p-1" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => openDelete(item)} className="text-[#EF4444] hover:text-red-700 transition-colors p-1" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[13px] text-[#6B7280]">
                    Data kapster tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F3F4F6]">
          {/* Info */}
          <span className="text-[12px] text-[#6B7280]">
            Menampilkan {filteredData.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filteredData.length)} dari {filteredData.length} data
          </span>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              className="flex items-center gap-1 text-[13px] font-medium px-2 py-1 rounded transition-colors mr-1
                disabled:opacity-40 disabled:cursor-not-allowed
                text-[#1E65E2] hover:bg-[#F0F5FF] disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-7 h-7 flex items-center justify-center rounded-[6px] text-[13px] font-medium transition-colors ${
                  safePage === page
                    ? 'bg-[#1E65E2] text-white'
                    : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="flex items-center gap-1 text-[13px] font-medium px-2 py-1 rounded transition-colors ml-1
                disabled:opacity-40 disabled:cursor-not-allowed
                text-[#1E65E2] hover:bg-[#F0F5FF] disabled:hover:bg-transparent"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>


      {isDeleteOpen && selectedKapster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[16px] w-full max-w-sm shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-[18px] font-semibold text-[#1F2937] mb-2">Hapus Data?</h3>
              <p className="text-[13px] text-[#6B7280]">
                Apakah Anda yakin ingin menghapus <strong>{selectedKapster.nama}</strong>? Data yang dihapus tidak dapat dikembalikan.
              </p>
            </div>
            <div className="border-t border-[#F3F4F6] px-6 py-4 flex items-center justify-end gap-3 bg-[#F8FAFC]">
              <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-[13px] font-medium text-[#4B5563] hover:text-[#1F2937] transition-colors">Batal</button>
              <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-[6px] text-[13px] font-medium transition-colors">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
