'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { fetchRegions } from '@/features/region/services/region.service';

interface TambahOutletModalProps {
  onClose: () => void;
  onSave: (nama: string, alamat: string, regionId: string) => void;
}

export function TambahOutletModal({ onClose, onSave }: TambahOutletModalProps) {
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [regionId, setRegionId] = useState('');
  
  const [regions, setRegions] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(true);

  useEffect(() => {
    fetchRegions()
      .then((data) => setRegions(data.map((r) => ({ value: r.id, label: r.name }))))
      .catch(() => {})
      .finally(() => setIsLoadingRegions(false));
  }, []);

  const handleSubmit = () => {
    if (!nama.trim() || !regionId) {
      alert('Nama Outlet dan Region wajib diisi');
      return;
    }
    onSave(nama.trim(), alamat.trim(), regionId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[20px] w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F3F4F6]">
          <h3 className="text-[17px] font-bold text-[#111827]">Tambah Outlet</h3>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#4B5563]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">
              Nama Outlet <span className="text-red-400">*</span>
            </label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Gumilir"
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#374151] placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">
              Region <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                disabled={isLoadingRegions}
                className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#374151] bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none disabled:bg-gray-50"
              >
                <option value="">Pilih Region</option>
                {regions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {isLoadingRegions && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Alamat</label>
            <input
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Jl. ..."
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[14px] text-[#374151] placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#F3F4F6] bg-[#F8FAFC]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[13px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#1E65E2] hover:bg-blue-700 rounded-lg"
          >
            <Save className="w-4 h-4" /> Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
