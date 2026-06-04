'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, X, Loader2, AlertCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { fetchUsers } from '@/features/user/services/user.service';
import { fetchOutlets } from '@/features/outlet/services/outlet.service';
import type { User } from '@/features/user/types/user.types';

export default function KapsterEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [kapster, setKapster] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    noHp: '',
    email: '',
    password: '',
    outletAwal: '',
    umur: '',
    alamat: '',
    shiftStart: '',
    shiftEnd: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outlets, setOutlets] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [users, barbershops] = await Promise.all([
          fetchUsers(),
          fetchOutlets().catch(() => [])
        ]);

        setOutlets(barbershops.map((b) => ({ value: b.id, label: b.name })));

        const found = users.find((u) => u.id === id);
        if (!found) {
          setLoadError('Kapster tidak ditemukan.');
          return;
        }

        setKapster(found);
        setFormData({
          nama: found.name,
          noHp: '',
          email: found.email,
          password: '',
          outletAwal: found.barbershopId ?? found.barbershop?.id ?? '',
          umur: '',
          alamat: '',
          shiftStart: found.shiftStart ?? '',
          shiftEnd: found.shiftEnd ?? ''
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
    if (!formData.nama || !formData.email || !formData.outletAwal) {
      setError('Nama, Email, dan Outlet wajib diisi.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const { apiFetch } = await import('@/shared/services/api-client');
      const body: Record<string, unknown> = {
        name: formData.nama,
        email: formData.email,
        role: kapster?.role ?? 'EMPLOYEE',
        barbershopId: formData.outletAwal,
      };
      if (formData.password) body.password = formData.password;
      if (formData.shiftStart) body.shiftStart = formData.shiftStart;
      if (formData.shiftEnd) body.shiftEnd = formData.shiftEnd;

      await apiFetch(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });

      window.location.href = `/dashboard/kapster/${id}`;
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
        <p className="text-[13px] text-[#6B7280]">Memuat data kapster...</p>
      </div>
    );
  }

  if (loadError || !kapster) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-[14px] font-semibold text-[#374151]">{loadError ?? 'Kapster tidak ditemukan'}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-[15px]">
        <Link href="/dashboard/kapster" className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">Data Kapster</Link>
        <span className="text-[#9CA3AF] px-1">/</span>
        <Link href={`/dashboard/kapster/${id}`} className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">Detail Kapster</Link>
        <span className="text-[#1F2937] font-medium"> / Edit Profil</span>
      </div>

      <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E5E7EB]">
        <div className="flex flex-col gap-5 mb-10">
          <div className="relative w-[120px] h-[120px]">
            <div className="w-full h-full rounded-full overflow-hidden relative bg-[#EEF2FF] border-2 border-[#E5E7EB] flex items-center justify-center">
              <span className="text-4xl font-bold text-[#6366F1]">{kapster.name.charAt(0)}</span>
            </div>
          </div>
          <h2 className="text-[24px] font-semibold text-[#111827]">{kapster.name}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 max-w-4xl">
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Nama <span className="text-red-400">*</span></label>
            <input name="nama" value={formData.nama} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">No Hp</label>
            <input name="noHp" value={formData.noHp} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Email <span className="text-red-400">*</span></label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Password Baru <span className="text-[#9CA3AF] font-normal">(Kosongkan jika tidak diubah)</span></label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Outlet <span className="text-red-400">*</span></label>
            <select name="outletAwal" value={formData.outletAwal} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white">
              <option value="">Pilih Outlet</option>
              {outlets.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Mulai Shift</label>
              <input name="shiftStart" type="time" value={formData.shiftStart} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
            </div>
            <div className="flex-1">
              <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Akhir Shift</label>
              <input name="shiftEnd" type="time" value={formData.shiftEnd} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Umur</label>
            <input name="umur" type="number" value={formData.umur} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Alamat</label>
            <input name="alamat" value={formData.alamat} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600 max-w-4xl">
            {error}
          </div>
        )}

        <div className="mt-12 flex items-center justify-end gap-4 max-w-4xl pt-6 border-t border-[#F3F4F6]">
          <Link href={`/dashboard/kapster/${id}`} className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg transition-colors">
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
