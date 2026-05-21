'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import type { Employee } from '../types/outlet.types';

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  Masuk: { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
  IN:    { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  Dlm:   { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
};

function getStatus(i: number) {
  const keys = ['Masuk', 'IN', 'Dlm', 'Masuk'];
  const k = keys[i % keys.length];
  return { label: k, style: STATUS_STYLE[k] };
}

export function EmployeeCard({ emp, index }: { emp: Employee; index: number }) {
  const [open, setOpen] = useState(false);
  const { label, style } = getStatus(index);

  return (
    <div className="bg-[#EEF2FF] rounded-[14px] p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
          style={{ background: style.bg, color: style.text, borderColor: style.border }}
        >
          {label}
        </span>
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-[#9CA3AF] hover:text-[#374151] transition-colors p-0.5"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {open && (
            <div
              className="absolute right-0 top-6 bg-white rounded-[8px] shadow-lg border border-[#E5E7EB] z-20 min-w-[130px] py-1"
              onMouseLeave={() => setOpen(false)}
            >
              <button className="w-full text-left px-4 py-2 text-[12px] text-[#374151] hover:bg-[#F9FAFB]">
                Lihat Detail
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-[15px] font-bold text-[#1E1E2E] leading-tight">{emp.name}</p>
      <p className="text-[11px] text-[#9CA3AF] font-mono mb-4">
        {emp.id.slice(0, 8).toUpperCase()}
      </p>

      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#6366F1] flex-shrink-0" />
          <span className="text-[11px] text-[#6B7280] w-11">Masuk</span>
          <span className="text-[11px] font-semibold text-[#374151]">{emp.shiftStart ?? '09:00'}</span>
        </div>
        <div className="w-px h-4 bg-[#C7D2FE] ml-[5px]" />
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#A5B4FC] flex-shrink-0" />
          <span className="text-[11px] text-[#6B7280] w-11">Keluar</span>
          <span className="text-[11px] font-semibold text-[#374151]">{emp.shiftEnd ?? '15:30'}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#C7D2FE]">
        <p className="text-[11px] text-[#6B7280]">Reward</p>
        <p className="text-[13px] font-bold text-[#16A34A]">—</p>
      </div>
    </div>
  );
}
