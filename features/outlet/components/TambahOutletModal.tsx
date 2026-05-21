'use client';

import { useState } from 'react';
import { X, Save } from 'lucide-react';

interface TambahOutletModalProps {
  onClose: () => void;
  onSave: (nama: string, alamat: string) => void;
}

export function TambahOutletModal({ onClose, onSave }: TambahOutletModalProps) {
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');

  const handleSubmit = () => {
    if (!nama.trim()) {
      alert('Nama wajib diisi');
      return;
    }
    onSave(nama.trim(), alamat.trim());
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
