'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../services/user.service';
import { fetchRegions } from '@/features/region/services/region.service';
import { fetchOutlets } from '@/features/outlet/services/outlet.service';
import type { UserRole } from '../types/user.types';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'OWNER', label: 'Owner' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'EMPLOYEE', label: 'Employee' },
];

export default function TambahUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: '' as UserRole | '',
    regionId: '', barbershopId: '', shiftStart: '', shiftEnd: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic dropdown options from API
  const [regionOptions, setRegionOptions] = useState<{ value: string; label: string }[]>([]);
  const [allBarbershopOptions, setAllBarbershopOptions] = useState<{ value: string; label: string; regionId?: string }[]>([]);

  useEffect(() => {
    fetchRegions()
      .then((regions) => setRegionOptions(regions.map((r) => ({ value: r.id, label: r.name }))))
      .catch(() => {});
    fetchOutlets()
      .then((outlets) => setAllBarbershopOptions(outlets.map((b) => ({
        value: b.id,
        label: b.name,
        regionId: b.region?.name, // Used for filtering — we compare by region name since we may not have regionId on barbershop
      }))))
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Nama, Email, Password, dan Role wajib diisi.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as UserRole,
        regionId: formData.regionId,
        barbershopId: formData.barbershopId,
        shiftStart: formData.shiftStart,
        shiftEnd: formData.shiftEnd,
      });
      // Gunakan window.location.href untuk memaksa refresh hard reload
      // sehingga cache komponen bersih dan API get dipanggil ulang
      window.location.href = '/dashboard/users';
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal menambahkan user.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter barbershops based on selected region
  const filteredBarbershops = formData.regionId
    ? allBarbershopOptions.filter(b => {
        const regionLabel = regionOptions.find(r => r.value === formData.regionId)?.label;
        return b.regionId === regionLabel;
      })
    : allBarbershopOptions;

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
                {regionOptions.map(opt => (
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

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600 max-w-4xl">
            {error}
          </div>
        )}

        <div className="mt-12 flex items-center justify-end gap-4 max-w-4xl pt-6 border-t border-[#F3F4F6]">
          <Link href="/dashboard/users" className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg transition-colors">
            <X className="w-4 h-4" /> Batal
          </Link>
          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-white bg-[#1E65E2] hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Menyimpan...' : 'Simpan User'}
          </button>
        </div>
      </div>
    </div>
  );
}
