'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, X, Loader2, AlertCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { fetchRegions } from '../services/region.service';

export default function RegionEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [regionName, setRegionName] = useState('');
  const [formData, setFormData] = useState({ name: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegions()
      .then((regions) => {
        const found = regions.find((r) => r.id === id);
        if (!found) {
          setLoadError('Region tidak ditemukan.');
          return;
        }
        setRegionName(found.name);
        setFormData({ name: found.name });
      })
      .catch((e: unknown) => setLoadError(e instanceof Error ? e.message : 'Gagal memuat data.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Nama Region wajib diisi.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      // PUT /regions/:id — attempt if endpoint exists
      const { apiFetch } = await import('@/shared/services/api-client');
      await apiFetch(`/regions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: formData.name.trim() }),
      });
      window.location.href = '/dashboard/regions';
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
        <p className="text-[13px] text-[#6B7280]">Memuat data region...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-[14px] font-semibold text-[#374151]">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-[15px]">
        <Link href="/dashboard/regions" className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">Kelola Region</Link>
        <span className="text-[#9CA3AF] px-1">/</span>
        <span className="text-[#1F2937] font-medium">Edit Region</span>
      </div>

      <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E5E7EB] max-w-3xl">
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-[#111827]">Edit Region: {regionName}</h2>
          <p className="text-[13px] text-[#9CA3AF] mt-1">Ubah nama wilayah operasional.</p>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Nama Region <span className="text-red-400">*</span></label>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Contoh: Cilacap, Banyumas" className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600">
            {error}
          </div>
        )}

        <div className="mt-12 flex items-center gap-4 pt-6 border-t border-[#F3F4F6]">
          <Link href="/dashboard/regions" className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg transition-colors">
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
