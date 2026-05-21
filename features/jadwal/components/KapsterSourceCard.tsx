'use client';

import type { JadwalKapster } from '../types/jadwal.types';

type Accent = { bar: string; light: string };

interface KapsterSourceCardProps {
  kapster: JadwalKapster;
  accent: Accent;
}

export function KapsterSourceCard({ kapster, accent }: KapsterSourceCardProps) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F3F4F6]">
        <div className={`w-1 h-5 rounded-full ${accent.bar}`} />
        <span className="text-[14px] font-semibold text-[#1E293B]">Pindah Jadwal</span>
      </div>
      <div className={`${accent.light} px-6 py-5`}>
        <div className="flex items-start gap-8 flex-wrap">
          <div className="min-w-[140px]">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">Nama</div>
            <div className="text-[14px] font-semibold text-[#1E293B]">{kapster.nama}</div>
          </div>
          <div className="min-w-[100px]">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">Id Kapster</div>
            <div className="text-[14px] font-semibold text-[#1E293B]">{kapster.idKapster}</div>
          </div>
          <div className="min-w-[140px]">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">No Hp</div>
            <div className="text-[14px] font-semibold text-[#1E293B]">{kapster.noHp}</div>
          </div>
          <div className="flex-1 min-w-[90px]">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">Outlet</div>
            <div className="text-[14px] font-semibold text-[#1E293B]">{kapster.outlet}</div>
          </div>
          <div className="min-w-[70px]">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">Shift</div>
            <div className="text-[14px] font-semibold text-[#1E293B]">{kapster.shift}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
