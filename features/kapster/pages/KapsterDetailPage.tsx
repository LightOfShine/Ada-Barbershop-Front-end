'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Edit, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { fetchUsers } from '@/features/user/services/user.service';
import type { User } from '@/features/user/types/user.types';

export default function KapsterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then((users) => {
        const found = users.find((u) => u.id === id);
        if (!found) {
          setError('Kapster tidak ditemukan.');
          return;
        }
        setUser(found);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Gagal memuat data.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-9 h-9 text-[#1E65E2] animate-spin" />
        <p className="text-[13px] text-[#6B7280]">Memuat data kapster...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-[14px] font-semibold text-[#374151]">{error ?? 'Kapster tidak ditemukan'}</p>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#1E65E2] text-[13px] font-medium hover:underline">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
      </div>
    );
  }

  const kapsterData = {
    nama: user.name,
    idKapster: user.id.slice(0, 8),
    noHp: '—',
    email: user.email,
    outletAwal: user.barbershopName ?? user.barbershop?.name ?? '—',
    umur: '—',
    alamat: '—',
    tanggalMasuk: user.createdAt ?? '—',
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
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden relative bg-[#EEF2FF] border-2 border-[#E5E7EB] flex items-center justify-center">
            <span className="text-4xl font-bold text-[#6366F1]">{kapsterData.nama.charAt(0)}</span>
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
          <div><div className="text-[13px] font-medium text-[#8B98BA] mb-1.5">Tanggal Masuk</div><div className="text-[15px] text-[#374151] font-medium items-center flex gap-2"><Calendar className="w-4 h-4 text-[#8B98BA]" />{kapsterData.tanggalMasuk.slice(0, 10)}</div></div>
        </div>
      </div>
    </div>
  );
}
