'use client';

import { useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';

// ── Mock Data ──────────────────────────────────────────────────────────────────
const KAPSTER_LIST = [
  { id: '1', nama: 'Ahmad Roni',       idKapster: '1400101', noHp: '0882006854875', outlet: 'Gumilir', shift: 'Pagi'  },
  { id: '2', nama: 'Bima Ardiansyah',  idKapster: '1400102', noHp: '082134567891',  outlet: 'Kroya',   shift: 'Siang' },
  { id: '3', nama: 'Candra Wijaya',    idKapster: '1400103', noHp: '081278945632',  outlet: 'Rinjani', shift: 'Pagi'  },
  { id: '4', nama: 'Johan Pratama',    idKapster: '1400104', noHp: '085612398765',  outlet: 'Jawa',    shift: 'Siang' },
  { id: '5', nama: 'Reyhan Saputra',   idKapster: '1400105', noHp: '081345678901',  outlet: 'Tidar',   shift: 'Pagi'  },
];

const OUTLETS = ['Gumilir', 'Kroya', 'Rinjani', 'Tidar', 'Jawa', 'Tendean', 'Jl Laut'];

type Kapster = typeof KAPSTER_LIST[number];

// ── Accent bar colours cycling per "Kapster N" section ──────────────────────
const ACCENTS = [
  { bar: 'bg-[#2563EB]',  light: 'bg-[#EBF3FF]' },
  { bar: 'bg-[#A855F7]',  light: 'bg-[#F5F0FF]' },
  { bar: 'bg-[#10B981]',  light: 'bg-[#ECFDF5]' },
];

// ── Sub-component: read-only kapster card ────────────────────────────────────
function KapsterSourceCard({
  kapster,
  accent,
}: {
  kapster: Kapster;
  accent: (typeof ACCENTS)[number];
}) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden">
      {/* Title row */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F3F4F6]">
        <div className={`w-1 h-5 rounded-full ${accent.bar}`} />
        <span className="text-[14px] font-semibold text-[#1E293B]">Pindah Jadwal</span>
      </div>
      {/* Data row */}
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

// ── Sub-component: editable target card ─────────────────────────────────────
function KapsterTargetCard({
  accent,
  targetNama,
  targetOutlet,
  targetShift,
  onNamaChange,
  onOutletChange,
  onShiftChange,
  resolvedTarget,
}: {
  accent: (typeof ACCENTS)[number];
  targetNama: string;
  targetOutlet: string;
  targetShift: string;
  onNamaChange: (v: string) => void;
  onOutletChange: (v: string) => void;
  onShiftChange: (v: string) => void;
  resolvedTarget: Kapster | null;
}) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden">
      {/* Title row */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F3F4F6]">
        <div className={`w-1 h-5 rounded-full ${accent.bar}`} />
        <span className="text-[14px] font-semibold text-[#1E293B]">Pindah Jadwal</span>
        <span className="ml-auto text-[12px] text-[#9CA3AF]">Pilih kapster pengganti</span>
      </div>
      {/* Selector row */}
      <div className="bg-[#F8F9FB] px-6 py-5">
        <div className="flex items-start gap-8 flex-wrap">
          {/* Nama dropdown */}
          <div className="min-w-[160px] flex-1">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">Nama</div>
            <select
              value={targetNama}
              onChange={e => onNamaChange(e.target.value)}
              className="w-full h-[36px] px-2 pr-7 border border-[#E5E7EB] rounded-[8px] text-[14px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-blue-500 transition-colors appearance-auto"
            >
              <option value="">— Pilih —</option>
              {KAPSTER_LIST.map(k => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
          </div>

          {/* Id Kapster — auto-filled */}
          <div className="min-w-[100px]">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">Id Kapster</div>
            <div className="text-[14px] font-medium text-[#6B7280] h-[36px] flex items-center">
              {resolvedTarget?.idKapster ?? '—'}
            </div>
          </div>

          {/* No Hp — auto-filled */}
          <div className="min-w-[140px]">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">No Hp</div>
            <div className="text-[14px] font-medium text-[#6B7280] h-[36px] flex items-center">
              {resolvedTarget?.noHp ?? '—'}
            </div>
          </div>

          {/* Outlet dropdown */}
          <div className="flex-1 min-w-[110px]">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">Outlet</div>
            <select
              value={targetOutlet}
              onChange={e => onOutletChange(e.target.value)}
              className="w-full h-[36px] px-2 border border-[#E5E7EB] rounded-[8px] text-[14px] font-medium text-[#1E293B] bg-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">— Pilih —</option>
              {OUTLETS.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Shift — dropdown (bisa diubah) */}
          <div className="min-w-[100px]">
            <div className="text-[11px] font-medium text-[#3B82F6] mb-1">Shift</div>
            <select
              value={targetShift}
              onChange={e => onShiftChange(e.target.value)}
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

// ── Modal: Approve Schedule ──────────────────────────────────────────────────
function ApproveModal({
  slot,
  onClose,
  onConfirm,
}: {
  slot: {
    source: Kapster;
    targetNama: string;
    targetOutlet: string;
    targetShift: string;
    resolvedTarget: Kapster | null;
  };
  onClose: () => void;
  onConfirm: () => void;
}) {
  const today = new Date().toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[20px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F3F4F6]">
          <h3 className="text-[17px] font-bold text-[#111827]">Approve Schedule</h3>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#4B5563] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Summary card */}
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

          {/* Change detail card */}
          <div className="rounded-[14px] border border-[#E5E7EB] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#F3F4F6]">
              <span className="text-[13px] font-semibold text-[#374151]">Ajukan Perubahan</span>
            </div>
            <div className="flex items-center px-5 py-4 gap-4 flex-wrap bg-[#F8F9FB]">
              {/* Source */}
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

              {/* Arrow */}
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-2 text-[#9CA3AF]">
                  <div className="h-px w-10 bg-[#D1D5DB]" />
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Target */}
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-[11px] font-medium text-[#6B7280] mb-0.5">Nama</div>
                  <div className="text-[14px] font-semibold text-[#111827]">
                    {slot.resolvedTarget?.nama ?? '—'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-[#6B7280] mb-0.5">Shift</div>
                  <div className="text-[14px] font-semibold text-[#111827]">
                    {slot.targetShift || slot.resolvedTarget?.shift || '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F3F4F6] bg-[#F8FAFC]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[13px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#1E65E2] hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" /> Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
interface SlotState {
  sourceId: string;
  targetNamaId: string;
  targetOutlet: string;
  targetShift: string;
}

export default function UbahJadwalPage() {
  const [slot, setSlot] = useState<SlotState>({ sourceId: '1', targetNamaId: '', targetOutlet: '', targetShift: '' });
  const [showApprove, setShowApprove] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const source = KAPSTER_LIST.find(k => k.id === slot.sourceId) ?? null;
  const resolvedTarget = KAPSTER_LIST.find(k => k.id === slot.targetNamaId) ?? null;

  const handleSimpan = () => {
    const target = KAPSTER_LIST.find(k => k.id === slot.targetNamaId);
    if (!source || !target || !slot.targetOutlet || !slot.targetShift) {
      alert('Lengkapi semua pilihan (termasuk Shift) sebelum menyimpan.');
      return;
    }
    setShowApprove(true);
  };

  const handleConfirm = () => {
    setShowApprove(false);
    setSlot(prev => ({ ...prev, targetNamaId: '', targetOutlet: '', targetShift: '' }));
    setSuccessMsg('Perubahan jadwal berhasil diajukan!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="w-full flex flex-col gap-6">

      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#10B981] text-white text-[13px] font-medium px-5 py-3 rounded-[10px] shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <Check className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* Section label */}
      <span className="text-[15px] font-bold text-[#1E293B]">Kapster 1</span>

      {/* Source card */}
      {source && <KapsterSourceCard kapster={source} accent={ACCENTS[0]} />}

      {/* Divider */}
      <div className="flex justify-center">
        <div className="h-6 w-px bg-[#E5E7EB]" />
      </div>

      {/* Target card */}
      {source && (
        <KapsterTargetCard
          accent={{ bar: 'bg-[#A855F7]', light: 'bg-[#F8F9FB]' }}
          targetNama={slot.targetNamaId}
          targetOutlet={slot.targetOutlet}
          targetShift={slot.targetShift}
          onNamaChange={v => setSlot(prev => ({ ...prev, targetNamaId: v, targetShift: KAPSTER_LIST.find(k => k.id === v)?.shift ?? '' }))}
          onOutletChange={v => setSlot(prev => ({ ...prev, targetOutlet: v }))}
          onShiftChange={v => setSlot(prev => ({ ...prev, targetShift: v }))}
          resolvedTarget={resolvedTarget}
        />
      )}

      {/* Simpan button */}
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
          slot={{
            source,
            targetNama: slot.targetNamaId,
            targetOutlet: slot.targetOutlet,
            targetShift: slot.targetShift,
            resolvedTarget,
          }}
          onClose={() => setShowApprove(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
