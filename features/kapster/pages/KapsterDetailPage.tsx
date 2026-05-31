'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Edit } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function KapsterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const kapsterData = {
    nama: 'Ahmad Roni',
    idKapster: '1400101',
    noHp: '0882006854875',
    email: 'ahmadroni@gmail.com',
    outletAwal: 'Gumilir',
    umur: '27',
    alamat: 'Jl. S. Parman No. 23, Gumilir, Cilacap Utara',
    tanggalMasuk: '2014-05-01'
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="text-[15px]">
          <Link href="/dashboard/kapster" className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">Data Kapster</Link>
          <span className="text-[#1F2937] font-medium"> / Detail Kapster</span>
        </div>
        <Link href={`/dashboard/kapster/${id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-[#1E65E2] hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium transition-colors">
          <Edit className="w-4 h-4" /> Edit Profil
        </Link>
      </div>
      <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E5E7EB]">
        <div className="flex flex-col gap-5 mb-10">
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden relative bg-[#F3F4F6] border-2 border-[#E5E7EB]">
            <Image src="/barber_portrait.png" alt="Profile" fill style={{ objectFit: 'cover' }} className="hover:scale-110 transition-transform duration-500" />
          </div>
          <h2 className="text-[24px] font-semibold text-[#111827]">{kapsterData.nama}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 max-w-4xl">
          <div><div className="text-[13px] font-medium text-[#8B98BA] mb-1.5">Nama</div><div className="text-[15px] text-[#374151] font-medium">{kapsterData.nama}</div></div>
          <div><div className="text-[13px] font-medium text-[#8B98BA] mb-1.5">No Hp</div><div className="text-[15px] text-[#374151] font-medium">{kapsterData.noHp}</div></div>
          <div><div className="text-[13px] font-medium text-[#8B98BA] mb-1.5">Id Kapster</div><div className="text-[15px] text-[#374151] font-medium">{kapsterData.idKapster}</div></div>
          <div><div className="text-[13px] font-medium text-[#8B98BA] mb-1.5">Email</div><div className="text-[15px] text-[#374151] font-medium">{kapsterData.email}</div></div>
          <div><div className="text-[13px] font-medium text-[#8B98BA] mb-1.5">Alamat</div><div className="text-[15px] text-[#374151] font-medium">{kapsterData.alamat}</div></div>
          <div><div className="text-[13px] font-medium text-[#8B98BA] mb-1.5">Outlet Awal</div><div className="text-[15px] text-[#374151] font-medium">{kapsterData.outletAwal}</div></div>
          <div><div className="text-[13px] font-medium text-[#8B98BA] mb-1.5">Umur</div><div className="text-[15px] text-[#374151] font-medium">{kapsterData.umur}</div></div>
          <div><div className="text-[13px] font-medium text-[#8B98BA] mb-1.5">Tanggal Masuk</div><div className="text-[15px] text-[#374151] font-medium items-center flex gap-2"><Calendar className="w-4 h-4 text-[#8B98BA]" />{kapsterData.tanggalMasuk}</div></div>
        </div>
      </div>
    </div>
  );
}
