'use client';

import { Trash2 } from 'lucide-react';
import type { Region } from '../types/region.types';

interface DeleteRegionModalProps {
  region: Region;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteRegionModal({ region, onClose, onConfirm }: DeleteRegionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[16px] w-full max-w-sm shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-[18px] font-semibold text-[#1F2937] mb-2">Hapus Region?</h3>
          <p className="text-[13px] text-[#6B7280]">
            Apakah Anda yakin ingin menghapus region <strong>{region.name}</strong>?
            {(region.barbershopCount ?? 0) > 0 && (
              <> Region ini memiliki <strong>{region.barbershopCount} barbershop</strong> yang terkait.</>
            )}
            {' '}Data yang dihapus tidak dapat dikembalikan.
          </p>
        </div>
        <div className="border-t border-[#F3F4F6] px-6 py-4 flex items-center justify-end gap-3 bg-[#F8FAFC]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-[#4B5563] hover:text-[#1F2937] transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-[6px] text-[13px] font-medium transition-colors"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
