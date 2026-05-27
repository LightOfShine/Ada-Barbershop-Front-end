'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Save, Camera, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CompanyEditPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: 'Ada Barbershop',
    phone: '081234567890',
    email: 'hello@adabarbershop.com',
    address: 'Jl. S. Parman No. 23, Gumilir, Cilacap Utara',
  });
  const [logoPreview, setLogoPreview] = useState<string | null>('/logo.png');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!formData.name) {
      alert('Nama perusahaan wajib diisi.');
      return;
    }
    alert('Profil perusahaan berhasil diperbarui!');
    router.refresh(); // Or whatever state update mechanism
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-[15px]">
        <span className="text-[#1F2937] font-medium">Profil Perusahaan</span>
      </div>

      <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E5E7EB] max-w-4xl">
        <div className="flex flex-col md:flex-row gap-10 items-start mb-10">
          
          <div className="relative w-[140px] h-[140px] flex-shrink-0">
            <div className="w-full h-full rounded-2xl overflow-hidden relative bg-[#F8FAFC] border-2 border-[#E5E7EB] flex items-center justify-center p-4">
              {logoPreview ? (
                <Image src={logoPreview} alt="Company Logo" fill style={{ objectFit: 'contain' }} className="p-2" />
              ) : (
                <Building2 className="w-12 h-12 text-[#94A3B8]" />
              )}
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white backdrop-blur-[2px]"
              >
                <Camera className="w-7 h-7 mb-2" />
                <span className="text-[12px] font-medium">Ubah Logo</span>
              </div>
            </div>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
          </div>
          
          <div className="pt-2">
            <h2 className="text-[24px] font-bold text-[#111827]">{formData.name}</h2>
            <p className="text-[14px] text-[#6B7280] mt-1 max-w-lg leading-relaxed">
              Kelola informasi profil perusahaan yang akan ditampilkan di seluruh sistem manajemen. Pastikan data yang dimasukkan akurat.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Nama Perusahaan <span className="text-red-400">*</span>
            </label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full h-[46px] px-4 border border-[#E5E7EB] rounded-[10px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#EBF3FF] transition-all" />
          </div>
          
          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Nomor Telepon
            </label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full h-[46px] px-4 border border-[#E5E7EB] rounded-[10px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#EBF3FF] transition-all" />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Resmi
            </label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full h-[46px] px-4 border border-[#E5E7EB] rounded-[10px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#EBF3FF] transition-all" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[13px] font-medium text-[#8B98BA] mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Alamat Lengkap
            </label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full p-4 border border-[#E5E7EB] rounded-[10px] text-[15px] font-medium text-[#374151] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#EBF3FF] transition-all resize-none" />
          </div>
        </div>

        <div className="mt-12 flex items-center justify-end pt-6 border-t border-[#F3F4F6]">
          <button onClick={handleSave} className="flex items-center gap-2 px-8 py-3 text-[14px] font-semibold text-white bg-[#1E65E2] hover:bg-blue-700 rounded-[10px] transition-colors shadow-sm hover:shadow-md">
            <Save className="w-5 h-5" /> Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
