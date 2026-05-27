'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { REGION_OPTIONS } from '../constants/mock-data';

export default function TambahBarbershopPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', address: '', regionId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.regionId) {
      alert('Nama dan Region wajib diisi.');
      return;
    }
    alert('Barbershop berhasil ditambahkan!');
    router.push('/dashboard/barbershops');
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-[15px]">
        <Link href="/dashboard/barbershops" className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">Kelola Barbershop</Link>
        <span className="text-[#1F2937] font-medium"> / Tambah Barbershop</span>
      </div>

      <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E5E7EB] max-w-3xl">
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-[#111827]">Tambah Cabang Barbershop</h2>
          <p className="text-[13px] text-[#9CA3AF] mt-1">Lengkapi informasi untuk menambahkan cabang barbershop baru.</p>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Nama Cabang <span className="text-red-400">*</span></label>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Contoh: Ada Barbershop Gumilir" className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
          
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Region / Wilayah <span className="text-red-400">*</span></label>
            <select name="regionId" value={formData.regionId} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white">
              <option value="">Pilih Region</option>
              {REGION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Alamat Lengkap</label>
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Jl. Raya..." className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
        </div>

        <div className="mt-12 flex items-center gap-4 pt-6 border-t border-[#F3F4F6]">
          <Link href="/dashboard/barbershops" className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg transition-colors">
            <X className="w-4 h-4" /> Batal
          </Link>
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-white bg-[#1E65E2] hover:bg-blue-700 rounded-lg transition-colors">
            <Save className="w-4 h-4" /> Simpan Barbershop
          </button>
        </div>
      </div>
    </div>
  );
}
