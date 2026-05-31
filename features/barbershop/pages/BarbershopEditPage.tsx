'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { fetchOutlets } from '@/features/outlet/services/outlet.service';
import type { Barbershop } from '@/features/outlet/types/outlet.types';

export default function BarbershopEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [outlet, setOutlet] = useState<Barbershop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    regionName: '',
  });

  useEffect(() => {
    fetchOutlets()
      .then((list) => {
        const found = list.find((b) => b.id === id);
        if (!found) {
          setError('Outlet tidak ditemukan.');
          return;
        }
        setOutlet(found);
        setFormData({
          name: found.name ?? '',
          address: found.address ?? '',
          regionName: found.region?.name ?? '',
        });
      })
      .catch(() => setError('Gagal memuat data outlet.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name) {
      alert('Nama outlet wajib diisi.');
      return;
    }
    alert('Perubahan outlet berhasil disimpan!');
    router.push(`/dashboard/outlet/${id}`);
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
            <input name="regionName" value={formData.regionName} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white" />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Alamat Lengkap</label>
            <input name="address" value={formData.address} onChange={handleChange} className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
        </div>

        <div className="mt-12 flex items-center gap-4 pt-6 border-t border-[#F3F4F6]">
          <button onClick={() => router.back()} className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" /> Batal
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-white bg-[#1E65E2] hover:bg-blue-700 rounded-lg transition-colors">
            <Save className="w-4 h-4" /> Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
