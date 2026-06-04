'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/features/user/services/user.service';
import { fetchOutlets } from '@/features/outlet/services/outlet.service';

export default function TambahKapsterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: '',
    noHp: '',
    email: '',
    password: '',
    outletAwal: '',
    umur: '',
    alamat: '',
    tanggalMasuk: '',
    shiftStart: '',
    shiftEnd: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outlets, setOutlets] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchOutlets()
      .then((data) => setOutlets(data.map((b) => ({ value: b.id, label: b.name }))))
      .catch(() => { });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.nama || !formData.email || !formData.password || !formData.outletAwal) {
      setError('Nama, Email, Password, dan Outlet wajib diisi.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await registerUser({
        name: formData.nama,
        email: formData.email,
        password: formData.password,
        role: 'EMPLOYEE',
        regionId: '', // Ideally we'd get regionId from selected outlet if needed, but the form doesn't strictly require it
        barbershopId: formData.outletAwal,
        shiftStart: formData.shiftStart,
        shiftEnd: formData.shiftEnd,
      });
      router.push('/dashboard/kapster');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal menambahkan kapster.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-[15px]">
        <Link href="/dashboard/kapster" className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">Data Kapster</Link>
        <span className="text-[#1F2937] font-medium"> / Tambah Kapster</span>
      </div>

      <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E5E7EB]">
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-[#111827]">Tambah Kapster Baru</h2>
          <p className="text-[13px] text-[#9CA3AF] mt-1">Lengkapi form di bawah ini untuk menambahkan data kapster baru.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 max-w-4xl">
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Nama Kapster <span className="text-red-400">*</span></label>
            <input name="nama" value={formData.nama} onChange={handleChange} placeholder="Masukkan nama" className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">No Hp</label>
            <input name="noHp" value={formData.noHp} onChange={handleChange} placeholder="08..." className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Email <span className="text-red-400">*</span></label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Password Login <span className="text-red-400">*</span></label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Minimal 6 karakter" className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Outlet Awal <span className="text-red-400">*</span></label>
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
            <input name="umur" type="number" value={formData.umur} onChange={handleChange} placeholder="Umur" className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Alamat</label>
            <input name="alamat" value={formData.alamat} onChange={handleChange} placeholder="Alamat lengkap" className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600 max-w-4xl">
            {error}
          </div>
        )}

        <div className="mt-12 flex items-center justify-end gap-4 max-w-4xl pt-6 border-t border-[#F3F4F6]">
          <Link href="/dashboard/kapster" className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg transition-colors">
            <X className="w-4 h-4" /> Batal
          </Link>
          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-white bg-[#1E65E2] hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Menyimpan...' : 'Simpan Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
