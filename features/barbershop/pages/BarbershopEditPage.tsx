'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { fetchOutlets } from '@/features/outlet/services/outlet.service';
import type { Barbershop } from '@/features/outlet/types/outlet.types';
import { fetchRegions } from '@/features/region/services/region.service';
import type { Region } from '@/features/region/types/region.types';

export default function BarbershopEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [outlet, setOutlet] = useState<Barbershop | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    regionId: '',
  });

  useEffect(() => {
    Promise.all([fetchOutlets(), fetchRegions()])
      .then(([list, regionList]) => {
        setRegions(regionList);
        const found = list.find((b) => String(b.id) === String(id));
        if (!found) {
          setError('Outlet tidak ditemukan.');
          return;
        }
        setOutlet(found);
        setFormData({
          name: found.name ?? '',
          address: found.address ?? '',
          regionId: String((found as unknown as Record<string, unknown>).regionId ?? ((found as unknown as Record<string, unknown>).region as Record<string, unknown> | undefined)?.id ?? ''),
        });
      })
      .catch(() => setError('Gagal memuat data outlet.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Nama outlet wajib diisi.');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    try {
      const { apiFetch } = await import('@/shared/services/api-client');
      await apiFetch(`/barbershops/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name.trim(),
          address: formData.address.trim(),
          regionId: formData.regionId || undefined,
        }),
      });
      window.location.href = `/dashboard/outlet/${id}`;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan perubahan.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-9 h-9 text-[#6366F1] animate-spin" />
        <p className="text-[13px] text-[#6B7280]">Memuat data outlet...</p>
      </div>
    );
  }

  if (error || !outlet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-[14px] font-semibold text-[#374151]">
          {error ?? 'Outlet tidak ditemukan'}
        </p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#6366F1] text-[13px] font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#374151] text-[12px] font-medium transition-colors w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
      </button>

      <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E5E7EB] max-w-3xl">
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-[#111827]">Edit Outlet: {outlet.name}</h2>
          <p className="text-[13px] text-[#9CA3AF] mt-1">Ubah informasi detail dari outlet ini.</p>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Nama Outlet <span className="text-red-400">*</span></label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Region / Wilayah</label>
            <select
              name="regionId"
              value={formData.regionId}
              onChange={handleChange}
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white appearance-none"
            >
              <option value="">-- Pilih Wilayah --</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Alamat Lengkap</label>
            <input name="address" value={formData.address} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600">
            {error}
          </div>
        )}

        <div className="mt-12 flex items-center gap-4 pt-6 border-t border-[#F3F4F6]">
          <button onClick={() => router.back()} className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" /> Batal
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-white bg-[#1E65E2] hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}
