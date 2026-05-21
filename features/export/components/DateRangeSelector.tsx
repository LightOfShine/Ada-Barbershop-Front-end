'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FileCheck2, CalendarRange, Loader2, AlertCircle } from 'lucide-react';
import { formatDisplayDate } from '../utils/helpers';

interface DateRangeSelectorProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartChange: (date: Date | null) => void;
  onEndChange: (date: Date | null) => void;
  isProcessing: boolean;
  error: string | null;
  onProcess: () => void;
}

export function DateRangeSelector({
  startDate, endDate, onStartChange, onEndChange,
  isProcessing, error, onProcess,
}: DateRangeSelectorProps) {
  return (
    <div className="bg-white rounded-[16px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-8">
      {/* Card Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-[#E0E7FF] rounded-md flex items-center justify-center">
          <FileCheck2 className="w-4 h-4 text-[#4F46E5]" />
        </div>
        <h3 className="text-[22px] font-bold text-[#1E3A8A]">Generate Report</h3>
      </div>

      {/* Date Range */}
      <div className="mb-10">
        <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
          Rentang Tanggal Laporan
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-[#9CA3AF] font-medium">Dari</span>
            <div className="relative">
              <CalendarRange className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none z-10" />
              <DatePicker
                selected={startDate}
                onChange={onStartChange}
                selectsStart
                startDate={startDate ?? undefined}
                endDate={endDate ?? undefined}
                maxDate={endDate ?? new Date()}
                dateFormat="dd MMMM yyyy"
                locale="id"
                placeholderText="Pilih tanggal mulai"
                className="h-[45px] pl-10 pr-4 w-[220px] font-semibold text-[#4B5563] bg-[#F3F4F6] border-none rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <span className="text-[#9CA3AF] font-bold mt-5">—</span>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-[#9CA3AF] font-medium">Sampai</span>
            <div className="relative">
              <CalendarRange className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none z-10" />
              <DatePicker
                selected={endDate}
                onChange={onEndChange}
                selectsEnd
                startDate={startDate ?? undefined}
                endDate={endDate ?? undefined}
                minDate={startDate ?? undefined}
                maxDate={new Date()}
                dateFormat="dd MMMM yyyy"
                locale="id"
                placeholderText="Pilih tanggal akhir"
                className="h-[45px] pl-10 pr-4 w-[220px] font-semibold text-[#4B5563] bg-[#F3F4F6] border-none rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {startDate && endDate && (
            <div className="mt-5 px-4 py-2 bg-[#EFF6FF] rounded-[8px] text-[13px] text-[#1E40AF] font-medium border border-[#BFDBFE]">
              {formatDisplayDate(startDate)} &nbsp;—&nbsp; {formatDisplayDate(endDate)}
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3 mb-6 text-red-700 text-[13px]">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Action */}
      <div className="flex items-center justify-end">
        <button
          onClick={onProcess}
          disabled={isProcessing || !startDate || !endDate}
          className="flex items-center gap-2 bg-[#374151] hover:bg-[#1F2937] text-white px-8 py-3 rounded-[6px] text-[14px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Process Report
            </>
          )}
        </button>
      </div>

      {/* DatePicker styles */}
      <style>{`
        .react-datepicker-wrapper { display: block; }
        .react-datepicker__header { background: #1E3A8A; color: white; border-bottom: none; border-radius: 8px 8px 0 0; }
        .react-datepicker__current-month, .react-datepicker__day-name { color: white; }
        .react-datepicker__day--selected, .react-datepicker__day--in-range { background-color: #2563EB !important; }
        .react-datepicker__day--keyboard-selected { background-color: #93C5FD !important; }
        .react-datepicker { border-radius: 12px; border: 1px solid #E5E7EB; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .react-datepicker__navigation-icon::before { border-color: white; }
      `}</style>
    </div>
  );
}
