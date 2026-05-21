'use client';

import { useState } from 'react';
import type { AttendanceRecord } from '../types/export.types';
import { formatDate } from '../utils/helpers';
import { fetchAttendanceReport } from '../services/export.service';

export function useExportReport() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordCount, setRecordCount] = useState(0);
  const [reportData, setReportData] = useState<AttendanceRecord[]>([]);

  const handleProcess = async () => {
    if (!startDate || !endDate) {
      setError('Pilih rentang tanggal terlebih dahulu.');
      return;
    }
    if (formatDate(startDate) > formatDate(endDate)) {
      setError('Tanggal mulai tidak boleh lebih besar dari tanggal akhir.');
      return;
    }

    setIsProcessing(true);
    setIsReady(false);
    setError(null);
    setReportData([]);

    try {
      const data = await fetchAttendanceReport(startDate, endDate);
      setReportData(data);
      setRecordCount(data.length);
      setIsReady(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data.');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    startDate, setStartDate,
    endDate, setEndDate,
    isProcessing, isReady, error, recordCount,
    reportData,
    handleProcess,
    resetReady: () => setIsReady(false),
  };
}
