'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Save, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createRegion } from '../services/region.service';

export default function TambahRegionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      await createRegion(formData.name.trim());
      window.location.href = '/dashboard/regions';
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal menambahkan region.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-[15px]">
        <Link href="/dashboard/regions" className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">Kelola Region</Link>
        <span className="text-[#1F2937] font-medium"> / Tambah Region</span>
      </div>

      <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E5E7EB] max-w-3xl">
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-[#111827]">Tambah Region Baru</h2>
          <p className="text-[13px] text-[#9CA3AF] mt-1">Tambahkan wilayah operasional baru untuk manajemen barbershop.</p>
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
            {isSaving ? 'Menyimpan...' : 'Simpan Region'}
          </button>
        </div>
      </div>
    </div>
  );
}
