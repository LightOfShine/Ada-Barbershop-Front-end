'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useOutletDetail } from '../hooks/useOutletDetail';
import { ShiftTimeline } from '../components/ShiftTimeline';
import { EmployeeCard } from '../components/EmployeeCard';
import { BarcodeSection } from '../components/BarcodeSection';

export default function OutletDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { shop, employees, isLoading, error } = useOutletDetail(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-9 h-9 text-[#6366F1] animate-spin" />
        <p className="text-[13px] text-[#6B7280]">Memuat data outlet...</p>
      </div>
    );
  }

  if (error || !shop) {
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
    <div className="w-full flex flex-col gap-5">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#374151] text-[12px] font-medium transition-colors w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
      </button>

      {/* Shift Timeline */}
      <ShiftTimeline employees={employees} />

      {/* Detail + Employee Cards */}
      <div className="bg-white rounded-[12px] border border-[#F0F0F0] p-6">
        <h2 className="text-[15px] font-semibold text-[#374151] mb-4">Detail Outlet</h2>
        <div className="mb-5">
          <h1 className="text-[22px] font-bold text-[#1E3A8A]">{shop.name}</h1>
          {(shop.address || shop.region?.name) && (
            <div className="flex items-start gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#6B7280]">{shop.address ?? shop.region?.name}</p>
            </div>
          )}
        </div>
        {employees.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {employees.map((emp, i) => (
              <EmployeeCard key={emp.id} emp={emp} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-[#9CA3AF] py-6 text-center">
            Belum ada karyawan di outlet ini.
          </p>
        )}
      </div>

      {/* Barcode Section */}
      <BarcodeSection barbershopId={shop.id} shopName={shop.name} />
    </div>
  );
}
