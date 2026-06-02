'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, X, Loader2, AlertCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { fetchUsers } from '../services/user.service';
import { fetchRegions } from '@/features/region/services/region.service';
import { fetchOutlets } from '@/features/outlet/services/outlet.service';
import type { User, UserRole } from '../types/user.types';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'OWNER', label: 'Owner' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'EMPLOYEE', label: 'Employee' },
];

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: '' as UserRole | '',
    regionId: '', barbershopId: '', shiftStart: '', shiftEnd: '',
  });

  // Dynamic dropdown options from API
  const [regionOptions, setRegionOptions] = useState<{ value: string; label: string }[]>([]);
  const [allBarbershopOptions, setAllBarbershopOptions] = useState<{ value: string; label: string; regionId?: string }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [users, regions, outlets] = await Promise.all([
          fetchUsers(),
          fetchRegions().catch(() => []),
          fetchOutlets().catch(() => []),
        ]);

        setRegionOptions(regions.map((r) => ({ value: r.id, label: r.name })));
        setAllBarbershopOptions(outlets.map((b) => ({
          value: b.id,
          label: b.name,
          regionId: b.region?.name,
        })));

        const found = users.find((u) => u.id === id);
        if (!found) {
          setLoadError('User tidak ditemukan.');
          return;
        }
        setUser(found);
        setFormData({
          name: found.name,
          email: found.email,
          password: '',
          role: found.role,
          regionId: found.regionId ?? found.region?.id ?? '',
          barbershopId: found.barbershopId ?? found.barbershop?.id ?? '',
          shiftStart: found.shiftStart || '',
          shiftEnd: found.shiftEnd || '',
        });
      } catch (e: unknown) {
        setLoadError(e instanceof Error ? e.message : 'Gagal memuat data.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const { apiFetch } = await import('@/shared/services/api-client');
      const body: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      if (formData.password) body.password = formData.password;
      if (formData.regionId) body.regionId = formData.regionId;
      if (formData.barbershopId) body.barbershopId = formData.barbershopId;
      if (formData.shiftStart) body.shiftStart = formData.shiftStart;
      if (formData.shiftEnd) body.shiftEnd = formData.shiftEnd;

      await apiFetch(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      router.push('/dashboard/users');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan perubahan.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-9 h-9 text-[#1E65E2] animate-spin" />
        <p className="text-[13px] text-[#6B7280]">Memuat data user...</p>
      </div>
    );
  }

  if (loadError || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-[14px] font-semibold text-[#374151]">{loadError ?? 'User tidak ditemukan'}</p>
      </div>
    );
  }

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
        <span className="text-[#9CA3AF] px-1">/</span>
        <span className="text-[#1F2937] font-medium">Edit User</span>
      </div>

      <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E5E7EB]">
        <div className="mb-8">
          <h2 className="text-[24px] font-semibold text-[#111827]">{user.name}</h2>
          <p className="text-[13px] text-[#9CA3AF] mt-1">Update informasi profil dan akses pengguna.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 max-w-4xl">
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Nama Lengkap <span className="text-red-400">*</span></label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
          
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Email <span className="text-red-400">*</span></label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Password Baru <span className="text-[#9CA3AF] font-normal">(Kosongkan jika tidak diubah)</span></label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Masukkan password baru" className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
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
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}
