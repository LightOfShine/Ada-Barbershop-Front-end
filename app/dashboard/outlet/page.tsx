'use client';

import { useState } from 'react';
import { Plus, MapPin, Users, X, Save, Search } from 'lucide-react';

// ── Mock Data ────────────────────────────────────────────────────────────────
interface Outlet {
  id: number;
  nama: string;
  alamat: string;
  jumlahKapster: number;
}

const INITIAL_OUTLETS: Outlet[] = [
  { id: 1,  nama: 'Gumilir',      alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 2,  nama: 'Kroya',        alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 3,  nama: 'Rinjani',      alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 4,  nama: 'Tidar',        alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 5,  nama: 'Tendean',      alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 6,  nama: 'Jawa',         alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 7,  nama: 'Jl Laut',      alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 8,  nama: 'Kuripan',      alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 9,  nama: 'Bromo',        alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 10, nama: 'Arca',         alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 11, nama: 'Karangklesem', alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 12, nama: 'Adipala',      alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 13, nama: 'Limbangan',    alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 14, nama: 'Bisma',        alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 15, nama: 'Kroya 2',      alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
  { id: 16, nama: 'Pwt',          alamat: 'Jl. Jeruk Legi, Rejanegara, Gumilir',       jumlahKapster: 4 },
];

// ── Outlet Card ──────────────────────────────────────────────────────────────
function OutletCard({ outlet }: { outlet: Outlet }) {
  return (
    <div
      className="relative rounded-[18px] p-5 overflow-hidden cursor-pointer group transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #C7D7FF 0%, #A5B8FF 40%, #8B9DFF 100%)',
        minHeight: '130px',
      }}
    >
      {/* Decorative circle accent */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

      {/* Badge */}
      <div className="absolute top-3 right-3">
        <span className="inline-flex items-center gap-1 bg-[#3B60E4] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
          <Users className="w-3 h-3" />
          {outlet.jumlahKapster} Kapster
        </span>
      </div>

      {/* Content */}
      <div className="mt-2 pr-20">
        <h3 className="text-[18px] font-bold text-[#1E3A8A] leading-tight">
          #{outlet.id} {outlet.nama}
        </h3>
        <div className="flex items-start gap-1 mt-2">
          <MapPin className="w-3.5 h-3.5 text-[#3B60E4] flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#3B5FC4] leading-snug line-clamp-2">
            {outlet.alamat}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Modal Tambah Outlet ──────────────────────────────────────────────────────
function TambahOutletModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (nama: string, alamat: string) => void;
}) {
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');

  const handleSubmit = () => {
    if (!nama.trim()) {
      alert('Nama outlet wajib diisi.');
      return;
    }
    onSave(nama.trim(), alamat.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[20px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F3F4F6]">
          <h3 className="text-[17px] font-bold text-[#111827]">Tambah Outlet</h3>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#4B5563] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">
              Nama Outlet <span className="text-red-400">*</span>
            </label>
            <input
              value={nama}
              onChange={e => setNama(e.target.value)}
              placeholder="Contoh: Gumilir"
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#374151] placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Alamat</label>
            <input
              value={alamat}
              onChange={e => setAlamat(e.target.value)}
              placeholder="Jl. ..."
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#374151] placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F3F4F6] bg-[#F8FAFC]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[13px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#1E65E2] hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" /> Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function OutletPage() {
  const [outlets, setOutlets] = useState<Outlet[]>(INITIAL_OUTLETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = outlets.filter(o =>
    o.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.alamat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOutlet = (nama: string, alamat: string) => {
    const newId = outlets.length > 0 ? Math.max(...outlets.map(o => o.id)) + 1 : 1;
    setOutlets(prev => [...prev, { id: newId, nama, alamat, jumlahKapster: 0 }]);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Local search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari outlet..."
              className="h-[40px] pl-9 pr-4 w-[220px] bg-white border border-[#E5E7EB] rounded-full text-[13px] text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E2E8F0] transition-colors"
            />
          </div>
          <span className="text-[13px] text-[#9CA3AF] whitespace-nowrap">
            {filtered.length} outlet ditemukan
          </span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#1E65E2] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Outlet
        </button>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(outlet => (
            <OutletCard key={outlet.id} outlet={outlet} />
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
