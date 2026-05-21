'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { KAPSTER_LIST, ACCENTS, type SlotState } from '../types/jadwal.types';
import { KapsterSourceCard } from '../components/KapsterSourceCard';
import { KapsterTargetCard } from '../components/KapsterTargetCard';
import { ApproveModal } from '../components/ApproveModal';

export default function JadwalPage() {
  const [slot, setSlot] = useState<SlotState>({
    sourceId: '1', targetNamaId: '', targetOutlet: '', targetShift: '',
  });
  const [showApprove, setShowApprove] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const source = KAPSTER_LIST.find((k) => k.id === slot.sourceId) ?? null;
  const resolvedTarget = KAPSTER_LIST.find((k) => k.id === slot.targetNamaId) ?? null;

  const handleSimpan = () => {
    const target = KAPSTER_LIST.find((k) => k.id === slot.targetNamaId);
    if (!source || !target || !slot.targetOutlet || !slot.targetShift) {
      alert('Lengkapi semua pilihan (termasuk Shift) sebelum menyimpan.');
      return;
    }
    setShowApprove(true);
  };

  const handleConfirm = () => {
    setShowApprove(false);
    setSlot((prev) => ({ ...prev, targetNamaId: '', targetOutlet: '', targetShift: '' }));
    setSuccessMsg('Perubahan jadwal berhasil diajukan!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#10B981] text-white text-[13px] font-medium px-5 py-3 rounded-[10px] shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <Check className="w-4 h-4" />{successMsg}
        </div>
      )}

      {/* Source card */}
      <span className="text-[15px] font-bold text-[#1E293B]">Kapster 1</span>
      {source && <KapsterSourceCard kapster={source} accent={ACCENTS[0]} />}

      {/* Arrow divider */}
      <div className="flex justify-center"><div className="h-6 w-px bg-[#E5E7EB]" /></div>

      {/* Target card */}
      {source && (
        <KapsterTargetCard
          accent={{ bar: 'bg-[#A855F7]', light: 'bg-[#F8F9FB]' }}
          targetNama={slot.targetNamaId}
          targetOutlet={slot.targetOutlet}
          targetShift={slot.targetShift}
          onNamaChange={(v) => setSlot((prev) => ({
            ...prev, targetNamaId: v,
            targetShift: KAPSTER_LIST.find((k) => k.id === v)?.shift ?? '',
          }))}
          onOutletChange={(v) => setSlot((prev) => ({ ...prev, targetOutlet: v }))}
          onShiftChange={(v) => setSlot((prev) => ({ ...prev, targetShift: v }))}
          resolvedTarget={resolvedTarget}
        />
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSimpan}
          className="bg-[#1E65E2] hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg text-[14px] font-semibold transition-colors"
        >
          Simpan
        </button>
      </div>

      {/* Approve modal */}
      {showApprove && source && (
        <ApproveModal
          slot={{ source, targetNama: slot.targetNamaId, targetOutlet: slot.targetOutlet, targetShift: slot.targetShift, resolvedTarget }}
          onClose={() => setShowApprove(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
