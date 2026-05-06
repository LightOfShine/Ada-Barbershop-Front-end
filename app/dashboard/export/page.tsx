'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FileText, FileSpreadsheet, Loader2, FileCheck2, CalendarRange, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper: trigger browser download from a Blob
const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface AttendanceRecord {
  attendanceId: string;
  employeeName: string;
  employeeEmail: string;
  employeeRole: string;
  branchName: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  checkInStatus: string;
  checkOutStatus: string;
}

interface GeneralReportRow {
  barbershopName: string;
  onTimeIn: number;
  onTimeOut: number;
}

/**
 * Agregat data per barbershop:
 * hitung jumlah checkInStatus === 'ON_TIME' dan checkOutStatus === 'ON_TIME'.
 * Nilai status dari backend bisa 'ON_TIME', 'on_time', atau 'ONTIME' —
 * pakai toLowerCase + includes('on_time') agar case-insensitive.
 */
const buildGeneralReport = (data: AttendanceRecord[]): GeneralReportRow[] => {
  const map = new Map<string, GeneralReportRow>();
  for (const r of data) {
    const key = r.branchName || 'Unknown';
    if (!map.has(key)) map.set(key, { barbershopName: key, onTimeIn: 0, onTimeOut: 0 });
    const row = map.get(key)!;
    if ((r.checkInStatus ?? '').toLowerCase() === 'on_time') row.onTimeIn += 1;
    if ((r.checkOutStatus ?? '').toLowerCase() === 'on_time') row.onTimeOut += 1;
  }
  // Urutkan abjad
  return Array.from(map.values()).sort((a, b) => a.barbershopName.localeCompare(b.barbershopName));
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Mengirim endDate sebagai hari BERIKUTNYA (exclusive upper bound).
 * Ini memastikan seluruh data di hari endDate ter-query oleh backend,
 * karena backend biasanya menggunakan `< endDate` (bukan `<=`).
 * Fix untuk bug laporan kosong saat startDate === endDate.
 */
const formatEndDateForApi = (date: Date): string => {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return formatDate(next);
};

const formatDisplayDate = (date: Date | null): string => {
  if (!date) return '-';
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function ExportPage() {
  // Date range state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordCount, setRecordCount] = useState(0);

  // Data cache
  const [reportData, setReportData] = useState<AttendanceRecord[]>([]);

  // ─── Fetch Report from API ─────────────────────────────────────────────────
  const handleProcess = async () => {
    if (!startDate || !endDate) {
      setError('Pilih rentang tanggal terlebih dahulu.');
      return;
    }
    // Bandingkan tanggal saja (bukan timestamp) agar startDate === endDate tetap valid
    if (formatDate(startDate) > formatDate(endDate)) {
      setError('Tanggal mulai tidak boleh lebih besar dari tanggal akhir.');
      return;
    }

    setIsProcessing(true);
    setIsReady(false);
    setError(null);
    setReportData([]);

    try {
      const token = localStorage.getItem('token') || '';
      const params = new URLSearchParams({
        startDate: formatDate(startDate),
        // Kirim endDate+1 hari (exclusive upper bound) agar backend juga
        // meng-include data di hari endDate yang dipilih user.
        endDate: formatEndDateForApi(endDate),
      });

      const res = await fetch(
        `https://ada-backend-service.onrender.com/export/attendance?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.message || `Gagal mengambil data (${res.status})`);
      }

      const raw = await res.json();
      // Normalise: backend might wrap data in { data: [...] } or return array directly
      const allData: AttendanceRecord[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : [];

      // ── Client-side filtering ────────────────────────────────────────────────
      // Backend terkadang tidak memfilter tanggal dengan benar (mis. timezone).
      // Filter ulang di frontend untuk memastikan hanya data dalam rentang
      // startDate s.d. endDate yang ditampilkan.
      const start = formatDate(startDate); // 'YYYY-MM-DD'
      const end   = formatDate(endDate);   // 'YYYY-MM-DD'

      const data = allData.filter((r) => {
        // r.date bisa berupa 'YYYY-MM-DD' atau ISO string '2026-05-02T...'.
        // Ambil 10 karakter pertama agar selalu dalam format 'YYYY-MM-DD'.
        const recordDate = r.date ? r.date.slice(0, 10) : '';
        return recordDate >= start && recordDate <= end;
      });
      // ────────────────────────────────────────────────────────────────────────

      setReportData(data);
      setRecordCount(data.length);
      setIsReady(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Export Excel ──────────────────────────────────────────────────────────
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  const handleExportExcel = () => {
    if (!reportData.length) {
      alert('Tidak ada data untuk diekspor. Klik "Process Report" terlebih dahulu.');
      return;
    }

    setIsDownloadingExcel(true);
    try {
      const worksheetData = reportData.map((r, i) => ({
        No: i + 1,
        'ID Absensi': r.attendanceId,
        'Nama Karyawan': r.employeeName,
        Email: r.employeeEmail,
        Role: r.employeeRole,
        Cabang: r.branchName,
        Tanggal: r.date,
        'Check In': r.checkInTime,
        'Check Out': r.checkOutTime,
        'Status Check In': r.checkInStatus,
        'Status Check Out': r.checkOutStatus,
      }));

      const ws = XLSX.utils.json_to_sheet(worksheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Rekapan Absensi');

      // Auto column width
      const colWidths = Object.keys(worksheetData[0] || {}).map((key) => ({
        wch: Math.max(key.length, 16),
      }));
      ws['!cols'] = colWidths;

      // Use Blob + anchor — more reliable than XLSX.writeFile in Next.js
      const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbOut], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const fileName = `rekapan-absensi_${formatDate(startDate!)}_sd_${formatDate(endDate!)}.xlsx`;
      downloadBlob(blob, fileName);
    } catch (e) {
      console.error('Excel export error:', e);
      alert('Gagal membuat file Excel. Periksa console untuk detail.');
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  // ─── Export PDF ────────────────────────────────────────────────────────────
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const handleExportPDF = () => {
    if (!reportData.length) {
      alert('Tidak ada data untuk diekspor. Klik "Process Report" terlebih dahulu.');
      return;
    }

    // Ambil username dari localStorage (data login)
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const generatedBy = parsedUser?.name || parsedUser?.email || parsedUser?.username || 'Ada Barbershop System';

    setIsDownloadingPDF(true);

    // Load logo as base64 via canvas, then generate PDF
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/logo.png';

    img.onload = () => {
      try {
        // Convert logo to base64 via canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const logoBase64 = canvas.toDataURL('image/png');

        const doc = new jsPDF({ orientation: 'landscape' });
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();

        // Real-time generated timestamp
        const now = new Date();
        const generatedAt = now.toLocaleString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });

        // ── Per-page header & footer via didDrawPage ──────────────────────────
        const drawHeaderFooter = (data: { pageNumber: number; pageCount: number }) => {
          const pageNum = data.pageNumber;
          const pageTotal = data.pageCount;

          // ── HEADER ────────────────────────────────────────────────────────
          // White background strip
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, pageW, 20, 'F');

          // Logo (height 14px, auto width)
          const logoH = 14;
          const logoW = (img.naturalWidth / img.naturalHeight) * logoH;
          doc.addImage(logoBase64, 'PNG', 10, 3, logoW, logoH);

          // Title text
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(30, 58, 138);
          doc.text('Rekapan Absensi — Ada Barbershop', 10 + logoW + 6, 12);

          // Generated date/time — right side of header
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(`Dibuat: ${generatedAt}`, pageW - 10, 12, { align: 'right' });



          // ── FOOTER ────────────────────────────────────────────────────────
          // Light separator line
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.3);
          doc.line(10, pageH - 12, pageW - 10, pageH - 12);

          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7.5);
          doc.setTextColor(120, 120, 120);

          // Left: generated at
          doc.text(`Generated at: ${generatedAt}`, 10, pageH - 6);

          // Centre: page number
          doc.setFont('helvetica', 'normal');
          doc.text(`Halaman ${pageNum}`, pageW / 2, pageH - 6, { align: 'center' });

          // Right: generated by
          doc.setFont('helvetica', 'italic');
          doc.text(`Generated by: ${generatedBy}`, pageW - 10, pageH - 6, { align: 'right' });

          // Reset colour for table content
          doc.setTextColor(0, 0, 0);
        };

        autoTable(doc, {
          startY: 26,
          margin: { top: 26, bottom: 18 },
          head: [['No', 'Nama', 'Email', 'Role', 'Cabang', 'Tanggal', 'Check In', 'Check Out', 'Status In', 'Status Out']],
          body: reportData.map((r, i) => [
            i + 1,
            r.employeeName,
            r.employeeEmail,
            r.employeeRole,
            r.branchName,
            r.date,
            r.checkInTime,
            r.checkOutTime,
            r.checkInStatus,
            r.checkOutStatus,
          ]),
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [243, 244, 246] },
          // Sub-header row: period + total
          didDrawPage: (data) => {
            // Draw header/footer on every page
            drawHeaderFooter({ pageNumber: data.pageNumber, pageCount: (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages() });

            // Period info row (only on first page, below header strip)
            if (data.pageNumber === 1) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(9);
              doc.setTextColor(80, 80, 80);
              doc.text(
                `Periode: ${formatDisplayDate(startDate)} s.d. ${formatDisplayDate(endDate)}   |   Total: ${recordCount} data`,
                10,
                23
              );
              doc.setTextColor(0, 0, 0);
            }
          },
        });

        // Use Blob + anchor — more reliable than doc.save() in Next.js
        const pdfBlob = doc.output('blob');
        const fileName = `rekapan-absensi_${formatDate(startDate!)}_sd_${formatDate(endDate!)}.pdf`;
        downloadBlob(pdfBlob, fileName);
      } catch (e) {
        console.error('PDF export error:', e);
        alert('Gagal membuat file PDF. Periksa console untuk detail.');
      } finally {
        setIsDownloadingPDF(false);
      }
    };

    img.onerror = () => {
      // Fallback: generate PDF without logo
      try {
        const doc = new jsPDF({ orientation: 'landscape' });
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();

        const now = new Date();
        const generatedAt = now.toLocaleString('id-ID', {
          day: '2-digit', month: 'long', year: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        });

        const drawHeaderFooter = (data: { pageNumber: number; pageCount: number }) => {
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, pageW, 20, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(30, 58, 138);
          doc.text('Rekapan Absensi — Ada Barbershop', 10, 12);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(`Dibuat: ${generatedAt}`, pageW - 10, 12, { align: 'right' });
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.3);
          doc.line(10, pageH - 12, pageW - 10, pageH - 12);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7.5);
          doc.setTextColor(120, 120, 120);
          doc.text(`Generated at: ${generatedAt}`, 10, pageH - 6);
          doc.setFont('helvetica', 'normal');
          doc.text(`Halaman ${data.pageNumber}`, pageW / 2, pageH - 6, { align: 'center' });
          doc.setFont('helvetica', 'italic');
          doc.text(`Generated by: ${generatedBy}`, pageW - 10, pageH - 6, { align: 'right' });
          doc.setTextColor(0, 0, 0);
        };

        autoTable(doc, {
          startY: 26,
          margin: { top: 26, bottom: 18 },
          head: [['No', 'Nama', 'Email', 'Role', 'Cabang', 'Tanggal', 'Check In', 'Check Out', 'Status In', 'Status Out']],
          body: reportData.map((r, i) => [i + 1, r.employeeName, r.employeeEmail, r.employeeRole, r.branchName, r.date, r.checkInTime, r.checkOutTime, r.checkInStatus, r.checkOutStatus]),
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [243, 244, 246] },
          didDrawPage: (data) => {
            drawHeaderFooter({ pageNumber: data.pageNumber, pageCount: (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages() });
            if (data.pageNumber === 1) {
              doc.setFontSize(9);
              doc.setTextColor(80, 80, 80);
              doc.text(`Periode: ${formatDisplayDate(startDate)} s.d. ${formatDisplayDate(endDate)}   |   Total: ${recordCount} data`, 10, 23);
              doc.setTextColor(0, 0, 0);
            }
          },
        });

        const pdfBlob = doc.output('blob');
        downloadBlob(pdfBlob, `rekapan-absensi_${formatDate(startDate!)}_sd_${formatDate(endDate!)}.pdf`);
      } catch (e) {
        console.error('PDF export error:', e);
        alert('Gagal membuat file PDF. Periksa console untuk detail.');
      } finally {
        setIsDownloadingPDF(false);
      }
    };
  };

  // ─── Export General Report — Excel ─────────────────────────────────────────
  const [isDownloadingGeneralExcel, setIsDownloadingGeneralExcel] = useState(false);

  const handleExportGeneralExcel = () => {
    if (!reportData.length) {
      alert('Tidak ada data. Klik "Process Report" terlebih dahulu.');
      return;
    }
    setIsDownloadingGeneralExcel(true);
    try {
      const rows = buildGeneralReport(reportData);
      const worksheetData = rows.map((r, i) => ({
        No: i + 1,
        'Nama Barbershop': r.barbershopName,
        'Jumlah Status IN (On Time)': r.onTimeIn,
        'Jumlah Status OUT (On Time)': r.onTimeOut,
      }));

      const ws = XLSX.utils.json_to_sheet(worksheetData);
      // Lebar kolom otomatis
      ws['!cols'] = Object.keys(worksheetData[0] || {}).map((k) => ({ wch: Math.max(k.length + 2, 18) }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Laporan General');

      const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbOut], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      downloadBlob(blob, `laporan-general_${formatDate(startDate!)}_sd_${formatDate(endDate!)}.xlsx`);
    } catch (e) {
      console.error('General Excel error:', e);
      alert('Gagal membuat file Excel. Periksa console untuk detail.');
    } finally {
      setIsDownloadingGeneralExcel(false);
    }
  };

  // ─── Export General Report — PDF ────────────────────────────────────────────
  const [isDownloadingGeneralPDF, setIsDownloadingGeneralPDF] = useState(false);

  const handleExportGeneralPDF = () => {
    if (!reportData.length) {
      alert('Tidak ada data. Klik "Process Report" terlebih dahulu.');
      return;
    }

    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const generatedBy = parsedUser?.name || parsedUser?.email || parsedUser?.username || 'Ada Barbershop System';

    setIsDownloadingGeneralPDF(true);

    const rows = buildGeneralReport(reportData);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/logo.png';

    const renderPDF = (logoBase64: string | null) => {
      try {
        const doc = new jsPDF({ orientation: 'portrait' });
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();

        const now = new Date();
        const generatedAt = now.toLocaleString('id-ID', {
          day: '2-digit', month: 'long', year: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        });

        const drawHeaderFooter = (data: { pageNumber: number }) => {
          // Header
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, pageW, 20, 'F');
          if (logoBase64) {
            const logoH = 14;
            const naturalRatio = img.naturalWidth / img.naturalHeight || 1;
            const logoW = naturalRatio * logoH;
            doc.addImage(logoBase64, 'PNG', 10, 3, logoW, logoH);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(30, 58, 138);
            doc.text('Laporan General — Ada Barbershop', 10 + logoW + 6, 12);
          } else {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(30, 58, 138);
            doc.text('Laporan General — Ada Barbershop', 10, 12);
          }
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(`Dibuat: ${generatedAt}`, pageW - 10, 12, { align: 'right' });

          // Footer
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.3);
          doc.line(10, pageH - 12, pageW - 10, pageH - 12);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7.5);
          doc.setTextColor(120, 120, 120);
          doc.text(`Generated at: ${generatedAt}`, 10, pageH - 6);
          doc.setFont('helvetica', 'normal');
          doc.text(`Halaman ${data.pageNumber}`, pageW / 2, pageH - 6, { align: 'center' });
          doc.setFont('helvetica', 'italic');
          doc.text(`Generated by: ${generatedBy}`, pageW - 10, pageH - 6, { align: 'right' });
          doc.setTextColor(0, 0, 0);
        };

        autoTable(doc, {
          startY: 26,
          margin: { top: 26, bottom: 18 },
          head: [['No', 'Nama Barbershop', 'Status IN (On Time)', 'Status OUT (On Time)']],
          body: rows.map((r, i) => [i + 1, r.barbershopName, r.onTimeIn, r.onTimeOut]),
          styles: { fontSize: 9, cellPadding: 4 },
          headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [243, 244, 246] },
          columnStyles: {
            0: { halign: 'center', cellWidth: 12 },
            2: { halign: 'center' },
            3: { halign: 'center' },
          },
          didDrawPage: (data) => {
            drawHeaderFooter({ pageNumber: data.pageNumber });
            if (data.pageNumber === 1) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(9);
              doc.setTextColor(80, 80, 80);
              doc.text(
                `Periode: ${formatDisplayDate(startDate)} s.d. ${formatDisplayDate(endDate)}   |   ${rows.length} cabang`,
                10, 23
              );
              doc.setTextColor(0, 0, 0);
            }
          },
        });

        const pdfBlob = doc.output('blob');
        downloadBlob(pdfBlob, `laporan-general_${formatDate(startDate!)}_sd_${formatDate(endDate!)}.pdf`);
      } catch (e) {
        console.error('General PDF error:', e);
        alert('Gagal membuat file PDF. Periksa console untuk detail.');
      } finally {
        setIsDownloadingGeneralPDF(false);
      }
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      renderPDF(canvas.toDataURL('image/png'));
    };
    img.onerror = () => renderPDF(null);
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-[#6B7280]">Export Rekapan</h2>
      </div>

      {/* Primary Card — Generate Report */}
      <div className="bg-white rounded-[16px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-8">
        {/* Card Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-[#E0E7FF] rounded-md flex items-center justify-center">
            <FileCheck2 className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <h3 className="text-[22px] font-bold text-[#1E3A8A]">Generate Report</h3>
        </div>

        {/* Date Range Section */}
        <div className="mb-10">
          <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
            Rentang Tanggal Laporan
          </label>
          <div className="flex flex-wrap items-center gap-4">
            {/* From */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-[#9CA3AF] font-medium">Dari</span>
              <div className="relative">
                <CalendarRange className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none z-10" />
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => {
                    setStartDate(date);
                    setIsReady(false);
                  }}
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

            {/* To */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-[#9CA3AF] font-medium">Sampai</span>
              <div className="relative">
                <CalendarRange className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none z-10" />
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => {
                    setEndDate(date);
                    setIsReady(false);
                  }}
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

            {/* Summary chip */}
            {startDate && endDate && (
              <div className="mt-5 px-4 py-2 bg-[#EFF6FF] rounded-[8px] text-[13px] text-[#1E40AF] font-medium border border-[#BFDBFE]">
                {formatDisplayDate(startDate)} &nbsp;—&nbsp; {formatDisplayDate(endDate)}
              </div>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3 mb-6 text-red-700 text-[13px]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center justify-end">
          <button
            onClick={handleProcess}
            disabled={isProcessing || !startDate || !endDate}
            className="flex items-center gap-2 bg-[#374151] hover:bg-[#1F2937] text-white px-8 py-3 rounded-[6px] text-[14px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses...
              </>
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
      </div>

      {/* Secondary Card — Finalisasi dan Download */}
      <div
        className={`bg-white rounded-[16px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-8 transition-all duration-300 ${isReady ? 'opacity-100' : 'opacity-40 pointer-events-none'
          }`}
      >
        {/* Card header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-[#D1FAE5] rounded-md flex items-center justify-center">
            <Download className="w-4 h-4 text-[#16A34A]" />
          </div>
          <h3 className="text-[20px] font-bold text-[#1E3A8A]">Finalisasi dan Download</h3>
        </div>
        <p className="text-[#6B7280] text-[14px] mb-2">
          Pilih format file yang akan didownload sesuai kebutuhan
        </p>

        {/* Success info */}
        {isReady && (
          <div className="flex items-center gap-2 text-[13px] text-[#16A34A] font-medium mb-6">
            <CheckCircle2 className="w-4 h-4" />
            {recordCount} data absensi berhasil dimuat untuk periode{' '}
            {formatDisplayDate(startDate)} — {formatDisplayDate(endDate)}
          </div>
        )}

        <div className="flex items-center gap-4 flex-wrap mt-4">
          <button
            onClick={handleExportPDF}
            disabled={isDownloadingPDF}
            className="flex items-center gap-2 bg-[#4B5563] hover:bg-[#374151] text-white px-8 py-3 rounded-[6px] text-[14px] font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloadingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {isDownloadingPDF ? 'Membuat PDF...' : 'Unduh PDF'}
          </button>
          <button
            onClick={handleExportExcel}
            disabled={isDownloadingExcel}
            className="flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white px-8 py-3 rounded-[6px] text-[14px] font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloadingExcel ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            {isDownloadingExcel ? 'Membuat Excel...' : 'Ekspor Excel'}
          </button>
        </div>
      </div>

      {/* Tertiary Card — Laporan General */}
      <div
        className={`bg-white rounded-[16px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-8 transition-all duration-300 ${isReady ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}
      >
        {/* Card header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-[#FEF3C7] rounded-md flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4 text-[#D97706]" />
          </div>
          <h3 className="text-[20px] font-bold text-[#1E3A8A]">Laporan General</h3>
        </div>
        <p className="text-[#6B7280] text-[14px] mb-4">
          Rekapan ringkas per barbershop — jumlah kehadiran tepat waktu (IN &amp; OUT)
        </p>

        <div className="flex items-center gap-4 flex-wrap mt-2">
          <button
            onClick={handleExportGeneralPDF}
            disabled={isDownloadingGeneralPDF}
            className="flex items-center gap-2 bg-[#4B5563] hover:bg-[#374151] text-white px-8 py-3 rounded-[6px] text-[14px] font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloadingGeneralPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {isDownloadingGeneralPDF ? 'Membuat PDF...' : 'Unduh PDF General'}
          </button>
          <button
            onClick={handleExportGeneralExcel}
            disabled={isDownloadingGeneralExcel}
            className="flex items-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white px-8 py-3 rounded-[6px] text-[14px] font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloadingGeneralExcel ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            {isDownloadingGeneralExcel ? 'Membuat Excel...' : 'Ekspor Excel General'}
          </button>
        </div>
      </div>

      {/* DatePicker custom styles */}
      <style>{`
        .react-datepicker-wrapper { display: block; }
        .react-datepicker__header { background: #1E3A8A; color: white; border-bottom: none; border-radius: 8px 8px 0 0; }
        .react-datepicker__current-month,
        .react-datepicker__day-name { color: white; }
        .react-datepicker__day--selected,
        .react-datepicker__day--in-range,
        .react-datepicker__day--range-start,
        .react-datepicker__day--range-end { background-color: #1E3A8A !important; color: white !important; border-radius: 4px; }
        .react-datepicker__day--in-selecting-range { background-color: #BFDBFE !important; color: #1E3A8A !important; }
        .react-datepicker__day:hover { background-color: #EFF6FF; border-radius: 4px; }
        .react-datepicker { border: 1px solid #E5E7EB; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); font-family: inherit; }
        .react-datepicker__navigation-icon::before { border-color: white; }
        .react-datepicker__year-read-view--down-arrow,
        .react-datepicker__month-read-view--down-arrow { border-color: white; }
        .react-datepicker__today-button { background: #EFF6FF; color: #1E3A8A; font-weight: 600; border-radius: 0 0 8px 8px; }
      `}</style>
    </div>
  );
}
