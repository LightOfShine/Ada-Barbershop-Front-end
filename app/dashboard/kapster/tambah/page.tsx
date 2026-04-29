'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Camera, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TambahKapsterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nama: '',
    idKapster: '',
    noHp: '',
    email: '',
    outletAwal: '',
    umur: '',
    alamat: '',
    tanggalMasuk: '',
    shift: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleSave = () => {
    // Validasi sederhana
    if (!formData.nama || !formData.idKapster || !formData.noHp) {
      alert('Nama, ID Kapster, dan No HP wajib diisi.');
      return;
    }
    // Simulasi simpan → kembali ke daftar
    alert('Data kapster berhasil ditambahkan!');
    router.push('/dashboard/kapster');
  };

  return (
    <div className="w-full flex flex-col gap-6">

      {/* Breadcrumbs */}
      <div className="text-[15px]">
        <Link href="/dashboard/kapster" className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
          Data Kapster
        </Link>
        <span className="text-[#1F2937] font-medium"> / Tambah Kapster</span>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E5E7EB]">

        {/* Profile Photo Upload */}
        <div className="flex flex-col gap-5 mb-10">
          <div className="relative w-[120px] h-[120px]">
            <div className="w-full h-full rounded-full overflow-hidden relative bg-[#F3F4F6] border-2 border-[#E5E7EB]">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="Foto Kapster"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                /* Placeholder avatar */
                <div className="w-full h-full flex items-center justify-center bg-[#EEF2FF]">
                  <svg className="w-14 h-14 text-[#C7D2FE]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
              )}
              {/* Overlay upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">Upload Foto</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-[#111827]">
              {formData.nama || <span className="text-[#9CA3AF] font-normal text-[17px]">Nama kapster akan tampil di sini</span>}
            </h2>
            <p className="text-[13px] text-[#9CA3AF] mt-1">Klik foto untuk mengupload gambar</p>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 max-w-4xl">

          {/* Row 1 */}
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">
              Nama <span className="text-red-400">*</span>
            </label>
            <input
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">
              No HP <span className="text-red-400">*</span>
            </label>
            <input
              name="noHp"
              value={formData.noHp}
              onChange={handleChange}
              placeholder="08xx..."
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Row 2 */}
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">
              ID Kapster <span className="text-red-400">*</span>
            </label>
            <input
              name="idKapster"
              value={formData.idKapster}
              onChange={handleChange}
              placeholder="Contoh: 1400101"
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Row 3 */}
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Alamat</label>
            <input
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              placeholder="Jl. ..."
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Outlet Awal</label>
            <input
              name="outletAwal"
              value={formData.outletAwal}
              onChange={handleChange}
              placeholder="Nama outlet"
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Row 4 */}
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Umur</label>
            <input
              name="umur"
              type="number"
              min="17"
              max="65"
              value={formData.umur}
              onChange={handleChange}
              placeholder="Contoh: 25"
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] placeholder:font-normal placeholder:text-[#D1D5DB] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Tanggal Masuk</label>
            <div className="relative">
              <input
                name="tanggalMasuk"
                type="date"
                value={formData.tanggalMasuk}
                onChange={handleChange}
                className="w-full h-[44px] pl-10 pr-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              <Calendar className="w-[18px] h-[18px] text-[#8B98BA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Row 5 */}
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Shift</label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white"
            >
              <option value="">Pilih Shift</option>
              <option value="Pagi">Pagi</option>
              <option value="Siang">Siang</option>
            </select>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex items-center justify-end gap-4 max-w-4xl pt-6 border-t border-[#F3F4F6]">
          <Link
            href="/dashboard/kapster"
            className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" /> Batal
          </Link>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-white bg-[#1E65E2] hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" /> Simpan Data
          </button>
        </div>

      </div>
    </div>
  );
}
