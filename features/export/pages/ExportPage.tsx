'use client';

import { useExportReport } from '../hooks/useExportReport';
import { DateRangeSelector } from '../components/DateRangeSelector';
import { DetailReportCard } from '../components/DetailReportCard';
import { GeneralReportCard } from '../components/GeneralReportCard';

export default function ExportPage() {
  const {
    startDate, setStartDate,
    endDate, setEndDate,
    isProcessing, isReady, error, recordCount,
    reportData, handleProcess, resetReady,
  } = useExportReport();

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-[#6B7280]">Export Rekapan</h2>
      </div>

      {/* 1. Generate Report — date picker + process */}
      <DateRangeSelector
        startDate={startDate}
        endDate={endDate}
        onStartChange={(d) => { setStartDate(d); resetReady(); }}
        onEndChange={(d) => { setEndDate(d); resetReady(); }}
        isProcessing={isProcessing}
        error={error}
        onProcess={handleProcess}
      />

      {/* 2. Detail Report — PDF/Excel download */}
      <DetailReportCard
        isReady={isReady}
        reportData={reportData}
        recordCount={recordCount}
        startDate={startDate}
        endDate={endDate}
      />

      {/* 3. General Report — PDF/Excel download */}
      <GeneralReportCard
        isReady={isReady}
        reportData={reportData}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
