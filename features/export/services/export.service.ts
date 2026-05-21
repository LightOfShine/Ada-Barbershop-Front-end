import { API_BASE_URL } from '@/config/api';
import type { AttendanceRecord } from '../types/export.types';
import { formatDate, formatEndDateForApi } from '../utils/helpers';

export async function fetchAttendanceReport(
  startDate: Date,
  endDate: Date,
): Promise<AttendanceRecord[]> {
  const token = localStorage.getItem('token') || '';
  const params = new URLSearchParams({
    startDate: formatDate(startDate),
    endDate: formatEndDateForApi(endDate),
  });

  const res = await fetch(`${API_BASE_URL}/export/attendance?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson?.message || `Gagal mengambil data (${res.status})`);
  }

  const raw = await res.json();
  const allData: AttendanceRecord[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
      ? raw.data
      : [];

  // Client-side date filtering
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return allData.filter((r) => {
    const recordDate = r.date ? r.date.slice(0, 10) : '';
    return recordDate >= start && recordDate <= end;
  });
}
