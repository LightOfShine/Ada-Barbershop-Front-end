'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROLE_OPTIONS, REGION_OPTIONS, BARBERSHOP_OPTIONS } from '../constants/mock-data';

export default function TambahUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: '',
    regionId: '', barbershopId: '', shiftStart: '', shiftEnd: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.role) {
      alert('Nama, Email, dan Role wajib diisi.');
      return;
    }
    alert('User berhasil ditambahkan!');
    router.push('/dashboard/users');
  };

  // Filter barbershops based on selected region
  const filteredBarbershops = formData.regionId 
    ? BARBERSHOP_OPTIONS.filter(b => b.regionId === formData.regionId)
    : BARBERSHOP_OPTIONS;

  const showShift = formData.role === 'ADMIN' || formData.role === 'EMPLOYEE';
  const showRegion = formData.role === 'ADMIN' || formData.role === 'EMPLOYEE';
  const showBarbershop = formData.role === 'EMPLOYEE';

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-[15px]">
        <Link href="/dashboard/users" className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">Kelola User</Link>
        <span className="text-[#1F2937] font-medium"> / Tambah User</span>
      </div>

      <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E5E7EB]">
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-[#111827]">Tambah User Baru</h2>
          <p className="text-[13px] text-[#9CA3AF] mt-1">Lengkapi form di bawah ini untuk menambahkan pengguna ke dalam sistem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 max-w-4xl">
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Nama Lengkap <span className="text-red-400">*</span></label>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Masukkan nama" className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
          
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Email <span className="text-red-400">*</span></label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Password <span className="text-red-400">*</span></label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Minimal 6 karakter" className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Role <span className="text-red-400">*</span></label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white">
              <option value="">Pilih Role</option>
              {ROLE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {showRegion && (
            <div>
              <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Wilayah / Region</label>
              <select name="regionId" value={formData.regionId} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white">
                <option value="">Pilih Wilayah</option>
                {REGION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {showBarbershop && (
            <div>
              <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Barbershop / Cabang</label>
              <select name="barbershopId" value={formData.barbershopId} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white">
                <option value="">Pilih Cabang</option>
                {filteredBarbershops.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {showShift && (
            <>
              <div>
                <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Jam Masuk Shift</label>
                <input name="shiftStart" type="time" value={formData.shiftStart} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Jam Selesai Shift</label>
                <input name="shiftEnd" type="time" value={formData.shiftEnd} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
            </>
          )}
        </div>

        <div className="mt-12 flex items-center justify-end gap-4 max-w-4xl pt-6 border-t border-[#F3F4F6]">
          <Link href="/dashboard/users" className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg transition-colors">
            <X className="w-4 h-4" /> Batal
          </Link>
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-white bg-[#1E65E2] hover:bg-blue-700 rounded-lg transition-colors">
            <Save className="w-4 h-4" /> Simpan User
          </button>
        </div>
      </div>
    </div>
  );
}
