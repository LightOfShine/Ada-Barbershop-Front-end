'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MapPin, X, Save, Search, Loader2, QrCode, AlertCircle, Users } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Outlet {
  id: string;
  name: string;
  address?: string;
  region?: { name: string };
}

// ── Outlet Card ───────────────────────────────────────────────────────────────
function OutletCard({ outlet, onClick }: { outlet: Outlet; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="relative rounded-[18px] p-5 overflow-hidden cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95"
      style={{
        background: 'linear-gradient(135deg, #C7D7FF 0%, #A5B8FF 40%, #8B9DFF 100%)',
        minHeight: '130px',
      }}
    >
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

      {/* QR Badge */}
      <div className="absolute top-3 right-3">
        <span className="inline-flex items-center gap-1 bg-[#3B60E4] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
          <QrCode className="w-3 h-3" />
          QR Code
        </span>
      </div>

      <div className="mt-2 pr-20">
        <h3 className="text-[18px] font-bold text-[#1E3A8A] leading-tight group-hover:text-[#1E40AF] transition-colors">
          {outlet.name}
        </h3>
        {(outlet.address || outlet.region?.name) && (
          <div className="flex items-start gap-1 mt-2">
            <MapPin className="w-3.5 h-3.5 text-[#3B60E4] flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#3B5FC4] leading-snug line-clamp-2">
              {outlet.address ?? outlet.region?.name}
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-3 right-4 text-[10px] text-[#3B60E4] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        Lihat detail →
      </div>
    </div>
  );
}

// ── Tambah Outlet Modal ───────────────────────────────────────────────────────
function TambahOutletModal({ onClose, onSave }: { onClose: () => void; onSave: (n: string, a: string) => void }) {
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[20px] w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F3F4F6]">
          <h3 className="text-[17px] font-bold text-[#111827]">Tambah Outlet</h3>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#4B5563]"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Nama Outlet <span className="text-red-400">*</span></label>
            <input value={nama} onChange={e => setNama(e.target.value)} placeholder="Contoh: Gumilir"
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#374151] placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Alamat</label>
            <input value={alamat} onChange={e => setAlamat(e.target.value)} placeholder="Jl. ..."
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#374151] placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#F3F4F6] bg-[#F8FAFC]">
          <button onClick={onClose} className="px-5 py-2.5 text-[13px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg">Batal</button>
          <button onClick={() => { if (!nama.trim()) { alert('Nama wajib diisi'); return; } onSave(nama.trim(), alamat.trim()); }}
            className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#1E65E2] hover:bg-blue-700 rounded-lg">
            <Save className="w-4 h-4" /> Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OutletPage() {
  const router = useRouter();
  const [outlets, setOutlets]         = useState<Outlet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading]     = useState(true);
  const [fetchError, setFetchError]   = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    setIsLoading(true);
    fetch('https://ada-backend-service.onrender.com/barbershops', {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
      .then(res => { if (!res.ok) throw new Error(`Error ${res.status}`); return res.json(); })
      .then(raw => { setOutlets(Array.isArray(raw) ? raw : raw?.data ?? []); })
      .catch((e: unknown) => setFetchError(e instanceof Error ? e.message : 'Gagal memuat data.'))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = outlets.filter(o =>
    (o.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.address ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOutlet = (nama: string, alamat: string) => {
    const token = localStorage.getItem('token') || '';
    fetch('https://ada-backend-service.onrender.com/barbershops', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nama, address: alamat }),
    })
      .then(res => res.json())
      .then(s => { if (s?.id) setOutlets(prev => [...prev, s]); })
      .catch(console.error);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari outlet..."
              className="h-[40px] pl-9 pr-4 w-[220px] bg-white border border-[#E5E7EB] rounded-full text-[13px] text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E2E8F0]" />
          </div>
          <span className="text-[13px] text-[#9CA3AF] whitespace-nowrap">
            {isLoading ? 'Memuat...' : `${filtered.length} outlet ditemukan`}
          </span>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#1E65E2] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors">
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
      {!isLoading && fetchError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-[10px] px-5 py-4 text-red-700 text-[13px]">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {fetchError}
        </div>
      )}

      {/* Grid */}
      {!isLoading && !fetchError && (
        filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(outlet => (
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

      {isModalOpen && <TambahOutletModal onClose={() => setIsModalOpen(false)} onSave={handleAddOutlet} />}
    </div>
  );
}
