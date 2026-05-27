'use client';

import Link from 'next/link';
import { Edit, Trash2, ArrowLeft, Shield, Mail, Clock, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { INITIAL_USER_DATA } from '../constants/mock-data';
import { useState } from 'react';
import { DeleteUserModal } from '../components/DeleteUserModal';

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const user = INITIAL_USER_DATA.find(u => u.id === params.id) || INITIAL_USER_DATA[0];

  const handleDelete = () => {
    setIsDeleteOpen(false);
    alert('User berhasil dihapus!');
    router.push('/dashboard/users');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const ROLE_COLORS: Record<string, string> = {
    OWNER: 'bg-purple-100 text-purple-700 border-purple-200',
    ADMIN: 'bg-blue-100 text-blue-700 border-blue-200',
    EMPLOYEE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="text-[15px]">
          <Link href="/dashboard/users" className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">Kelola User</Link>
          <span className="text-[#1F2937] font-medium"> / Detail User</span>
        </div>
        <Link href="/dashboard/users" className="flex items-center gap-2 text-[14px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] px-4 py-2 rounded-lg hover:bg-[#F9FAFB] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </div>

      <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E5E7EB]">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Avatar Profile */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] p-1 flex-shrink-0">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white">
              <span className="text-4xl font-bold text-[#1E3A8A]">{user.name.charAt(0)}</span>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F3F4F6] pb-6">
              <div>
                <h1 className="text-[28px] font-bold text-[#111827] flex items-center gap-3">
                  {user.name}
                  <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${ROLE_COLORS[user.role] ?? 'bg-gray-100 text-gray-700'}`}>
                    {user.role}
                  </span>
                </h1>
                <p className="text-[14px] text-[#6B7280] mt-1 flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {user.email}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Link href={`/dashboard/users/${user.id}/edit`} className="flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium text-white bg-[#3B82F6] hover:bg-blue-700 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" /> Edit User
                </Link>
                <button onClick={() => setIsDeleteOpen(true)} className="flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="space-y-6">
                <h3 className="text-[16px] font-semibold text-[#1F2937] flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#3B82F6]" /> Akses & Wilayah
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                    <span className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Region</span>
                    <p className="text-[15px] font-semibold text-[#1E293B] mt-1">{user.regionName || 'Semua Wilayah'}</p>
                  </div>
                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                    <span className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Barbershop</span>
                    <p className="text-[15px] font-semibold text-[#1E293B] mt-1">{user.barbershopName || 'Semua Cabang'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[16px] font-semibold text-[#1F2937] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#10B981]" /> Informasi Lainnya
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#F3F4F6]">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[12px] font-medium text-[#64748B] block">Jadwal Shift</span>
                      <p className="text-[14px] font-semibold text-[#1E293B]">{user.shiftStart && user.shiftEnd ? `${user.shiftStart} - ${user.shiftEnd}` : 'Tidak Ada Shift'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[12px] font-medium text-[#64748B] block">Terdaftar Pada</span>
                      <p className="text-[14px] font-semibold text-[#1E293B]">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteOpen && (
        <DeleteUserModal
          user={user}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
