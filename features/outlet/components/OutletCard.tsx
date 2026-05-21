'use client';

import { MapPin, QrCode } from 'lucide-react';
import type { Outlet } from '../types/outlet.types';

interface OutletCardProps {
  outlet: Outlet;
  onClick: () => void;
}

export function OutletCard({ outlet, onClick }: OutletCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative rounded-[18px] p-5 overflow-hidden cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95"
      style={{
        background: 'linear-gradient(135deg, #C7D7FF 0%, #A5B8FF 40%, #8B9DFF 100%)',
        minHeight: '130px',
      }}
    >
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

      <div className="absolute top-3 right-3">
        <span className="inline-flex items-center gap-1 bg-[#3B60E4] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
          <QrCode className="w-3 h-3" /> QR Code
        </span>
      </div>

      <div className="mt-2 pr-20">
        <h3 className="text-[18px] font-bold text-[#1E3A8A] leading-tight group-hover:text-[#1E40AF] transition-colors">
          {outlet.name}
        </h3>
        {(outlet.address || outlet.region?.name) && (
          <div className="flex items-start gap-1 mt-2">
            <MapPin className="w-3.5 h-3.5 text-[#3B60E4] flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#3B5FC4] leading-snug line-clamp-2">
              {outlet.address ?? outlet.region?.name}
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-3 right-4 text-[10px] text-[#3B60E4] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        Lihat detail →
      </div>
    </div>
  );
}
