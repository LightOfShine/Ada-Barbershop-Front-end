'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQRCode } from 'next-qrcode';
import {
  ArrowLeft, MoreVertical, MapPin, QrCode,
  Printer, RefreshCw, Loader2, AlertCircle,
} from 'lucide-react';

const API = 'https://ada-backend-service.onrender.com';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Barbershop {
  id: string;
  name: string;
  address?: string;
  region?: { name: string };
}

interface Employee {
  id: string;
  name: string;
  email?: string;
  role?: string;
  shiftStart?: string; // '09:00'
  shiftEnd?: string;   // '15:30'
  barbershopId?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function headers() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  return { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' };
}

function shiftGroup(start?: string): 'Pagi' | 'Siang' {
  if (!start) return 'Pagi';
  const h = parseInt(start.split(':')[0], 10);
  return h >= 12 ? 'Siang' : 'Pagi';
}

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  Masuk: { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
  IN:    { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  Dlm:   { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
};
function getStatus(i: number) {
  const keys = ['Masuk', 'IN', 'Dlm', 'Masuk'];
  const k = keys[i % keys.length];
  return { label: k, style: STATUS_STYLE[k] };
}

// ─── Shift Timeline ───────────────────────────────────────────────────────────
function ShiftTimeline({ employees }: { employees: Employee[] }) {
  const pagi  = employees.filter(e => shiftGroup(e.shiftStart) === 'Pagi');
  const siang = employees.filter(e => shiftGroup(e.shiftStart) === 'Siang');

  if (employees.length === 0) return null;

  return (
    <div className="bg-white rounded-[12px] border border-[#F0F0F0] p-6">
      <h2 className="text-[15px] font-semibold text-[#374151] mb-5">Shift</h2>

      <div className="flex flex-col gap-6">
        {pagi.length > 0 && (
          <div className="flex items-start gap-5">
            <span className="text-[13px] font-semibold text-[#374151] w-12 flex-shrink-0 pt-1">Pagi</span>
            <div className="flex-1">
              <div className="flex justify-between text-[11px] text-[#9CA3AF] mb-1">
                <span>{pagi[0]?.shiftStart ?? '09:00'}</span>
                <span>{pagi[0]?.shiftEnd ?? '15:30'}</span>
              </div>
              <div className="h-[7px] rounded-full mb-3"
                style={{ background: 'linear-gradient(90deg, #6366F1 0%, #818CF8 100%)' }} />
              <div className="flex gap-2 flex-wrap">
                {pagi.map(e => (
                  <span key={e.id}
                    className="px-3 py-1 rounded-full text-[12px] font-semibold text-white"
                    style={{ background: 'linear-gradient(90deg, #6366F1 0%, #818CF8 100%)' }}>
                    {e.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {siang.length > 0 && (
          <div className="flex items-start gap-5">
            <span className="text-[13px] font-semibold text-[#374151] w-12 flex-shrink-0 pt-1">Siang</span>
            <div className="flex-1">
              <div className="flex justify-between text-[11px] text-[#9CA3AF] mb-1">
                <span>{siang[0]?.shiftStart ?? '15:30'}</span>
                <span>{siang[0]?.shiftEnd ?? '21:00'}</span>
              </div>
              <div className="h-[7px] rounded-full mb-3"
                style={{ background: 'linear-gradient(90deg, #EC4899 0%, #A855F7 100%)' }} />
              <div className="flex gap-2 flex-wrap">
                {siang.map(e => (
                  <span key={e.id}
                    className="px-3 py-1 rounded-full text-[12px] font-semibold text-white"
                    style={{ background: 'linear-gradient(90deg, #EC4899 0%, #A855F7 100%)' }}>
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

// ─── Employee Card ────────────────────────────────────────────────────────────
function EmployeeCard({ emp, index }: { emp: Employee; index: number }) {
  const [open, setOpen] = useState(false);
  const { label, style } = getStatus(index);

  return (
    <div className="bg-[#EEF2FF] rounded-[14px] p-4 relative">
      {/* Status + menu */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
          style={{ background: style.bg, color: style.text, borderColor: style.border }}>
          {label}
        </span>
        <div className="relative">
          <button onClick={() => setOpen(v => !v)}
            className="text-[#9CA3AF] hover:text-[#374151] transition-colors p-0.5">
            <MoreVertical className="w-4 h-4" />
          </button>
          {open && (
            <div className="absolute right-0 top-6 bg-white rounded-[8px] shadow-lg border border-[#E5E7EB] z-20 min-w-[130px] py-1"
              onMouseLeave={() => setOpen(false)}>
              <button className="w-full text-left px-4 py-2 text-[12px] text-[#374151] hover:bg-[#F9FAFB]">
                Lihat Detail
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Name & ID */}
      <p className="text-[15px] font-bold text-[#1E1E2E] leading-tight">{emp.name}</p>
      <p className="text-[11px] text-[#9CA3AF] font-mono mb-4">{emp.id.slice(0, 8).toUpperCase()}</p>

      {/* Shift timeline */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#6366F1] flex-shrink-0" />
          <span className="text-[11px] text-[#6B7280] w-11">Masuk</span>
          <span className="text-[11px] font-semibold text-[#374151]">{emp.shiftStart ?? '09:00'}</span>
        </div>
        <div className="w-px h-4 bg-[#C7D2FE] ml-[5px]" />
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#A5B4FC] flex-shrink-0" />
          <span className="text-[11px] text-[#6B7280] w-11">Keluar</span>
          <span className="text-[11px] font-semibold text-[#374151]">{emp.shiftEnd ?? '15:30'}</span>
        </div>
      </div>

      {/* Reward */}
      <div className="mt-3 pt-3 border-t border-[#C7D2FE]">
        <p className="text-[11px] text-[#6B7280]">Reward</p>
        <p className="text-[13px] font-bold text-[#16A34A]">—</p>
      </div>
    </div>
  );
}

// ─── Generate Barcode Section ─────────────────────────────────────────────────
function BarcodeSection({ barbershopId, shopName }: { barbershopId: string; shopName: string }) {
  const { Canvas } = useQRCode();
  const [qrToken, setQrToken]     = useState<string>('');
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch QR token dari API
  const fetchQr = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/barbershops/${barbershopId}/qr`, { headers: headers() });
      if (!res.ok) { setQrToken(''); return; }
      const raw = await res.json();
      // Backend kirim string token — normalisasi berbagai bentuk response
      const token: string =
        typeof raw === 'string' ? raw
        : (raw?.qrToken ?? raw?.token ?? raw?.data?.qrToken ?? raw?.data ?? '');
      setQrToken(String(token).trim());
    } catch {
      setQrToken('');
    } finally {
      setLoading(false);
    }
  }, [barbershopId]);

  // Generate / Refresh QR via PUT /barbershops/{id}/refresh-qr
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${API}/barbershops/${barbershopId}/refresh-qr`, {
        method: 'PUT', headers: headers(),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      await fetchQr();
    } catch (e) {
      alert('Gagal generate QR: ' + e);
    } finally {
      setGenerating(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await handleGenerate();
    setRefreshing(false);
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>QR Absensi – ${shopName}</title>
      <style>body{display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0}
      .w{text-align:center;padding:40px}h2{font-family:sans-serif;color:#1E3A8A;margin-bottom:16px}
      p{font-family:monospace;font-size:11px;color:#6B7280;margin-top:12px;word-break:break-all}
      </style></head><body><div class="w">
      <h2>QR Absensi – ${shopName}</h2>
      ${printRef.current.innerHTML}
      <p>${qrToken}</p></div></body></html>`);
    win.document.close();
    win.print();
  };

  useEffect(() => { fetchQr(); }, [fetchQr]);

  return (
    <div className="bg-white rounded-[12px] border border-[#F0F0F0] p-6">
      <h2 className="text-[15px] font-semibold text-[#374151] mb-5">Generate Barcode</h2>

      <div className="flex justify-center">
        <div className="border border-[#E5E7EB] rounded-[16px] px-8 py-8 flex flex-col items-center gap-4 min-w-[220px]">

          {/* Loading awal */}
          {loading ? (
            <>
              <Loader2 className="w-10 h-10 text-[#6366F1] animate-spin mt-4 mb-2" />
              <p className="text-[12px] text-[#9CA3AF] mb-4">Memeriksa barcode...</p>
            </>

          ) : generating ? (
            <>
              <Loader2 className="w-10 h-10 text-[#6366F1] animate-spin mt-4 mb-2" />
              <p className="text-[12px] text-[#9CA3AF] mb-4">Membuat barcode...</p>
            </>

          ) : qrToken ? (
            /* ── QR tersedia ── */
            <>
              <div ref={printRef}>
                <Canvas
                  text={qrToken}
                  options={{ width: 180, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } }}
                />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleRefresh} disabled={refreshing}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-[6px] border border-[#E5E7EB] text-[12px] font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors disabled:opacity-60">
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-[6px] bg-[#3B60E4] hover:bg-[#1E40AF] text-white text-[12px] font-semibold transition-colors">
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
              </div>
            </>

          ) : (
            /* ── Belum digenerate ── */
            <>
              <div className="mt-2 mb-1 text-[#CCCCCC]">
                <QrCode className="w-12 h-12" strokeWidth={1.2} />
              </div>
              <p className="text-[12px] text-[#9CA3AF] text-center leading-snug">
                Barcode belum digenerate<br />untuk hari ini.
              </p>
              <button onClick={handleGenerate}
                className="flex items-center gap-1.5 bg-[#3B60E4] hover:bg-[#1E40AF] text-white text-[12px] font-semibold px-5 py-2 rounded-[6px] transition-colors mt-1">
                <span>✦</span> Generate Barcode
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OutletDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [shop, setShop]           = useState<Barbershop | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setPageLoading(true);

        // 1. Cari info barbershop dari list
        const shopRes = await fetch(`${API}/barbershops`, { headers: headers() });
        if (!shopRes.ok) throw new Error(`Gagal mengambil outlet (${shopRes.status})`);
        const shopRaw = await shopRes.json();
        const list: Barbershop[] = Array.isArray(shopRaw) ? shopRaw : shopRaw?.data ?? [];
        const found = list.find(b => b.id === id);
        if (!found) throw new Error('Outlet tidak ditemukan.');
        setShop(found);

        // 2. Ambil users & filter berdasarkan barbershopId
        const userRes = await fetch(`${API}/users`, { headers: headers() });
        if (userRes.ok) {
          const userRaw = await userRes.json();
          const all: Employee[] = Array.isArray(userRaw) ? userRaw : userRaw?.data ?? [];
          // Filter karyawan di outlet ini; jika barbershopId tidak ada, tampilkan semua
          const inShop = all.filter(u => u.barbershopId === id);
          setEmployees(inShop.length > 0 ? inShop : all.filter(u => u.role === 'EMPLOYEE'));
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Terjadi kesalahan.');
      } finally {
        setPageLoading(false);
      }
    })();
  }, [id]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (pageLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <Loader2 className="w-9 h-9 text-[#6366F1] animate-spin" />
      <p className="text-[13px] text-[#6B7280]">Memuat data outlet...</p>
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !shop) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <AlertCircle className="w-7 h-7 text-red-400" />
      </div>
      <p className="text-[14px] font-semibold text-[#374151]">{error ?? 'Outlet tidak ditemukan'}</p>
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-[#6366F1] text-[13px] font-medium hover:underline">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </button>
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col gap-5">

      {/* Back */}
      <button onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#374151] text-[12px] font-medium transition-colors w-fit">
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali
      </button>

      {/* Shift Timeline */}
      <ShiftTimeline employees={employees} />

      {/* Detail Outlet */}
      <div className="bg-white rounded-[12px] border border-[#F0F0F0] p-6">
        <h2 className="text-[15px] font-semibold text-[#374151] mb-4">Detail Outlet</h2>

        {/* Info */}
        <div className="mb-5">
          <h1 className="text-[22px] font-bold text-[#1E3A8A]">{shop.name}</h1>
          {(shop.address || shop.region?.name) && (
            <div className="flex items-start gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#6B7280]">{shop.address ?? shop.region?.name}</p>
            </div>
          )}
        </div>

        {/* Employee cards */}
        {employees.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {employees.map((emp, i) => (
              <EmployeeCard key={emp.id} emp={emp} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-[#9CA3AF] py-6 text-center">
            Belum ada karyawan di outlet ini.
          </p>
        )}
      </div>

      {/* Generate Barcode */}
      <BarcodeSection barbershopId={shop.id} shopName={shop.name} />

    </div>
  );
}
