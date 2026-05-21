'use client';

import { KAPSTER_LIST, OUTLETS, type JadwalKapster } from '../types/jadwal.types';

type Accent = { bar: string; light: string };

interface KapsterTargetCardProps {
  accent: Accent;
  targetNama: string;
  targetOutlet: string;
  targetShift: string;
  onNamaChange: (v: string) => void;
  onOutletChange: (v: string) => void;
  onShiftChange: (v: string) => void;
  resolvedTarget: JadwalKapster | null;
}

export function KapsterTargetCard({
  accent, targetNama, targetOutlet, targetShift,
  onNamaChange, onOutletChange, onShiftChange, resolvedTarget,
}: KapsterTargetCardProps) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F3F4F6]">
        <div className={`w-1 h-5 rounded-full ${accent.bar}`} />
        <span className="text-[14px] font-semibold text-[#1E293B]">Pindah Jadwal</span>
        <span className="ml-auto text-[12px] text-[#9CA3AF]">Pilih kapster pengganti</span>
      </div>
      <div className="bg-[#F8F9FB] px-6 py-5">
        <div className="flex items-start gap-8 flex-wrap">
          <div className="min-w-[160px] flex-1">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">Nama</div>
            <select
              value={targetNama}
              onChange={(e) => onNamaChange(e.target.value)}
              className="w-full h-[36px] px-2 pr-7 border border-[#E5E7EB] rounded-[8px] text-[14px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-blue-500 transition-colors appearance-auto"
            >
              <option value="">— Pilih —</option>
              {KAPSTER_LIST.map((k) => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[100px]">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">Id Kapster</div>
            <div className="text-[14px] font-medium text-[#6B7280] h-[36px] flex items-center">{resolvedTarget?.idKapster ?? '—'}</div>
          </div>
          <div className="min-w-[140px]">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">No Hp</div>
            <div className="text-[14px] font-medium text-[#6B7280] h-[36px] flex items-center">{resolvedTarget?.noHp ?? '—'}</div>
          </div>
          <div className="flex-1 min-w-[110px]">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">Outlet</div>
            <select
              value={targetOutlet}
              onChange={(e) => onOutletChange(e.target.value)}
              className="w-full h-[36px] px-2 border border-[#E5E7EB] rounded-[8px] text-[14px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">— Pilih —</option>
              {OUTLETS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[100px]">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">Shift</div>
            <select
              value={targetShift}
              onChange={(e) => onShiftChange(e.target.value)}
              className="w-full h-[36px] px-2 border border-[#E5E7EB] rounded-[8px] text-[14px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">— Pilih —</option>
              <option value="Pagi">Pagi</option>
              <option value="Siang">Siang</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
