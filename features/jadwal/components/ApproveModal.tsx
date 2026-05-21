'use client';

import { ArrowRight, Check, X } from 'lucide-react';
import type { JadwalKapster } from '../types/jadwal.types';

interface ApproveModalProps {
  slot: {
    source: JadwalKapster;
    targetNama: string;
    targetOutlet: string;
    targetShift: string;
    resolvedTarget: JadwalKapster | null;
  };
  onClose: () => void;
  onConfirm: () => void;
}

export function ApproveModal({ slot, onClose, onConfirm }: ApproveModalProps) {
  const today = new Date().toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[20px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F3F4F6]">
          <h3 className="text-[17px] font-bold text-[#111827]">Approve Schedule</h3>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#4B5563] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Info row */}
          <div className="rounded-[14px] border border-[#E5E7EB] p-5 flex gap-8 flex-wrap">
            <div>
              <div className="text-[12px] font-medium text-[#3B82F6] mb-1">Tanggal</div>
              <div className="text-[15px] font-semibold text-[#111827]">{today}</div>
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#3B82F6] mb-1">Outlet</div>
              <div className="text-[15px] font-semibold text-[#111827] flex items-center gap-1.5">
                {slot.source.outlet}
                <ArrowRight className="w-4 h-4 text-[#9CA3AF]" />
                {slot.targetOutlet || slot.resolvedTarget?.outlet || '—'}
              </div>
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#3B82F6] mb-1">Admin</div>
              <div className="text-[15px] font-semibold text-[#111827]">Admin1</div>
            </div>
          </div>

          {/* Change detail */}
          <div className="rounded-[14px] border border-[#E5E7EB] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#F3F4F6]">
              <span className="text-[13px] font-semibold text-[#374151]">Ajukan Perubahan</span>
            </div>
            <div className="flex items-center px-5 py-4 gap-4 flex-wrap bg-[#F8F9FB]">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-[11px] font-medium text-[#6B7280] mb-0.5">Nama</div>
                  <div className="text-[14px] font-semibold text-[#111827]">{slot.source.nama}</div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-[#6B7280] mb-0.5">Shift</div>
                  <div className="text-[14px] font-semibold text-[#111827]">{slot.source.shift}</div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-2 text-[#9CA3AF]">
                  <div className="h-px w-10 bg-[#D1D5DB]" />
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-[11px] font-medium text-[#6B7280] mb-0.5">Nama</div>
                  <div className="text-[14px] font-semibold text-[#111827]">{slot.resolvedTarget?.nama ?? '—'}</div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-[#6B7280] mb-0.5">Shift</div>
                  <div className="text-[14px] font-semibold text-[#111827]">{slot.targetShift || slot.resolvedTarget?.shift || '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F3F4F6] bg-[#F8FAFC]">
          <button onClick={onClose} className="px-5 py-2.5 text-[13px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg transition-colors">
            Batal
          </button>
          <button onClick={onConfirm} className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#1E65E2] hover:bg-blue-700 rounded-lg transition-colors">
            <Check className="w-4 h-4" /> Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
