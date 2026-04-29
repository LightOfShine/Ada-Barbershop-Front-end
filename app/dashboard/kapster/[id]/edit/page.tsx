'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Camera, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function KapsterEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Mock data for the static UI
  const [formData, setFormData] = useState({
    nama: 'Ahmad Roni',
    idKapster: '1400101',
    noHp: '0882006854875',
    email: 'ahmadroni@gmail.com',
    outletAwal: 'Gumilir',
    umur: '27',
    alamat: 'Jl. S. Parman No. 23, Gumilir, Cilacap Utara',
    tanggalMasuk: '2014-05-01',
    photo: '/barber_portrait.png'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Simulasi penyimpanan dan kembali ke halaman detail
    alert('Data kapster berhasil diperbarui!');
    router.push(`/dashboard/kapster/${params.id}`);
  };

  const handlePhotoUploadClick = () => {
    // trigger file input
    document.getElementById('photo-upload')?.click();
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Breadcrumbs */}
      <div className="text-[15px]">
        <Link href="/dashboard/kapster" className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
          Data Kapster
        </Link>
        <span className="text-[#9CA3AF] px-1">/</span>
        <Link href={`/dashboard/kapster/${params.id}`} className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
          Detail Kapster
        </Link>
        <span className="text-[#1F2937] font-medium"> / Edit Profil</span>
      </div>

      {/* Edit Card */}
      <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E5E7EB]">
        
        {/* Profile Header w/ Upload */}
        <div className="flex flex-col gap-5 mb-10">
          <div className="relative w-[120px] h-[120px]">
            <div className="w-full h-full rounded-full overflow-hidden relative bg-[#F3F4F6] border-2 border-[#E5E7EB]">
              <Image 
                src={formData.photo} 
                alt="Profile Ahmad Roni" 
                fill
                style={{ objectFit: 'cover' }}
              />
              {/* Overlay untuk edit foto */}
              <div 
                onClick={handlePhotoUploadClick}
                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">Ubah Foto</span>
              </div>
            </div>
            {/* Hidden file input */}
            <input type="file" id="photo-upload" className="hidden" accept="image/*" />
          </div>
          
          <h2 className="text-[24px] font-semibold text-[#111827]">
            {formData.nama}
          </h2>
        </div>

        {/* Info Grid (Inputs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 max-w-4xl">
          
          {/* Row 1 */}
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Nama</label>
            <input 
              name="nama" 
              value={formData.nama} 
              onChange={handleChange}
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">No Hp</label>
            <input 
              name="noHp" 
              value={formData.noHp} 
              onChange={handleChange}
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Row 2 */}
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Id Kapster</label>
            <input 
              name="idKapster" 
              value={formData.idKapster} 
              onChange={handleChange}
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Email</label>
            <input 
              name="email" 
              type="email"
              value={formData.email} 
              onChange={handleChange}
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Row 3 */}
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Alamat</label>
            <input 
              name="alamat" 
              value={formData.alamat} 
              onChange={handleChange}
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Outlet Awal</label>
            <input 
              name="outletAwal" 
              value={formData.outletAwal} 
              onChange={handleChange}
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Row 4 */}
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2">Umur</label>
            <input 
              name="umur" 
              type="number"
              value={formData.umur} 
              onChange={handleChange}
              className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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

        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex items-center justify-end gap-4 max-w-4xl pt-6 border-t border-[#F3F4F6]">
          <Link 
            href={`/dashboard/kapster/${params.id}`}
            className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" /> Batal
          </Link>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium text-white bg-[#1E65E2] hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" /> Simpan Perubahan
          </button>
        </div>

      </div>

    </div>
  );
}
