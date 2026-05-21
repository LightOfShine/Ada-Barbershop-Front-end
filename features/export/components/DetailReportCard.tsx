'use client';

import { useState } from 'react';
import { FileText, FileSpreadsheet, Loader2, Download, CheckCircle2 } from 'lucide-react';
import type { AttendanceRecord } from '../types/export.types';
import { formatDisplayDate } from '../utils/helpers';
import { generateDetailPDF, generateDetailExcel } from '../utils/generators';

interface DetailReportCardProps {
  isReady: boolean;
  reportData: AttendanceRecord[];
  recordCount: number;
  startDate: Date | null;
  endDate: Date | null;
}

export function DetailReportCard({ isReady, reportData, recordCount, startDate, endDate }: DetailReportCardProps) {
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  const handlePDF = async () => {
    if (!reportData.length || !startDate || !endDate) return;
    setIsDownloadingPDF(true);
    try { await generateDetailPDF(reportData, startDate, endDate, recordCount); }
    catch { alert('Gagal membuat PDF.'); }
    finally { setIsDownloadingPDF(false); }
  };

  const handleExcel = () => {
    if (!reportData.length || !startDate || !endDate) return;
    setIsDownloadingExcel(true);
    try { generateDetailExcel(reportData, startDate, endDate); }
    catch { alert('Gagal membuat Excel.'); }
    finally { setIsDownloadingExcel(false); }
  };

  return (
    <div className={`bg-white rounded-[16px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-8 transition-all duration-300 ${isReady ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-[#D1FAE5] rounded-md flex items-center justify-center">
          <Download className="w-4 h-4 text-[#16A34A]" />
        </div>
        <h3 className="text-[20px] font-bold text-[#1E3A8A]">Laporan Detail</h3>
      </div>
      <p className="text-[#6B7280] text-[14px] mb-2">Pilih format file yang akan didownload sesuai kebutuhan</p>

      {isReady && (
        <div className="flex items-center gap-2 text-[13px] text-[#16A34A] font-medium mb-6">
          <CheckCircle2 className="w-4 h-4" />
          {recordCount} data absensi berhasil dimuat untuk periode {formatDisplayDate(startDate)} — {formatDisplayDate(endDate)}
        </div>
      )}

      <div className="flex items-center gap-4 flex-wrap mt-4">
        <button onClick={handlePDF} disabled={isDownloadingPDF} className="flex items-center gap-2 bg-[#4B5563] hover:bg-[#374151] text-white px-8 py-3 rounded-[6px] text-[14px] font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {isDownloadingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          {isDownloadingPDF ? 'Membuat PDF...' : 'Unduh PDF'}
        </button>
        <button onClick={handleExcel} disabled={isDownloadingExcel} className="flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white px-8 py-3 rounded-[6px] text-[14px] font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {isDownloadingExcel ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
          {isDownloadingExcel ? 'Membuat Excel...' : 'Ekspor Excel'}
        </button>
      </div>
    </div>
  );
}
