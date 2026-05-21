import type { AttendanceRecord, GeneralReportRow } from '../types/export.types';

export const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Mengirim endDate sebagai hari BERIKUTNYA (exclusive upper bound).
 * Fix untuk bug laporan kosong saat startDate === endDate.
 */
export const formatEndDateForApi = (date: Date): string => {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return formatDate(next);
};

export const formatDisplayDate = (date: Date | null): string => {
  if (!date) return '-';
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

/**
 * Agregat data per barbershop:
 * hitung jumlah checkInStatus === 'ON_TIME' dan checkOutStatus === 'ON_TIME'.
 */
export const buildGeneralReport = (data: AttendanceRecord[]): GeneralReportRow[] => {
  const map = new Map<string, GeneralReportRow>();
  for (const r of data) {
    const key = r.branchName || 'Unknown';
    if (!map.has(key)) map.set(key, { barbershopName: key, onTimeIn: 0, onTimeOut: 0 });
    const row = map.get(key)!;
    if ((r.checkInStatus ?? '').toLowerCase() === 'on_time') row.onTimeIn += 1;
    if ((r.checkOutStatus ?? '').toLowerCase() === 'on_time') row.onTimeOut += 1;
  }
  return Array.from(map.values()).sort((a, b) => a.barbershopName.localeCompare(b.barbershopName));
};
