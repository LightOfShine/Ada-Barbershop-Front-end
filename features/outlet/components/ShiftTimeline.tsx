'use client';

import type { Employee } from '../types/outlet.types';

function shiftGroup(start?: string): 'Pagi' | 'Siang' {
  if (!start) return 'Pagi';
  const h = parseInt(start.split(':')[0], 10);
  return h >= 12 ? 'Siang' : 'Pagi';
}

export function ShiftTimeline({ employees }: { employees: Employee[] }) {
  const pagi = employees.filter((e) => shiftGroup(e.shiftStart) === 'Pagi');
  const siang = employees.filter((e) => shiftGroup(e.shiftStart) === 'Siang');

  if (employees.length === 0) return null;

  return (
    <div className="bg-white rounded-[12px] border border-[#F0F0F0] p-6">
      <h2 className="text-[15px] font-semibold text-[#374151] mb-5">Shift</h2>
      <div className="flex flex-col gap-6">
        {pagi.length > 0 && (
          <div className="flex items-start gap-5">
            <span className="text-[13px] font-semibold text-[#374151] w-12 flex-shrink-0 pt-1">
              Pagi
            </span>
            <div className="flex-1">
              <div className="flex justify-between text-[11px] text-[#9CA3AF] mb-1">
                <span>{pagi[0]?.shiftStart ?? '09:00'}</span>
                <span>{pagi[0]?.shiftEnd ?? '15:30'}</span>
              </div>
              <div
                className="h-[7px] rounded-full mb-3"
                style={{ background: 'linear-gradient(90deg, #6366F1 0%, #818CF8 100%)' }}
              />
              <div className="flex gap-2 flex-wrap">
                {pagi.map((e) => (
                  <span
                    key={e.id}
                    className="px-3 py-1 rounded-full text-[12px] font-semibold text-white"
                    style={{ background: 'linear-gradient(90deg, #6366F1 0%, #818CF8 100%)' }}
                  >
                    {e.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        {siang.length > 0 && (
          <div className="flex items-start gap-5">
            <span className="text-[13px] font-semibold text-[#374151] w-12 flex-shrink-0 pt-1">
              Siang
            </span>
            <div className="flex-1">
              <div className="flex justify-between text-[11px] text-[#9CA3AF] mb-1">
                <span>{siang[0]?.shiftStart ?? '15:30'}</span>
                <span>{siang[0]?.shiftEnd ?? '21:00'}</span>
              </div>
              <div
                className="h-[7px] rounded-full mb-3"
                style={{ background: 'linear-gradient(90deg, #EC4899 0%, #A855F7 100%)' }}
              />
              <div className="flex gap-2 flex-wrap">
                {siang.map((e) => (
                  <span
                    key={e.id}
                    className="px-3 py-1 rounded-full text-[12px] font-semibold text-white"
                    style={{ background: 'linear-gradient(90deg, #EC4899 0%, #A855F7 100%)' }}
                  >
                    {e.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
