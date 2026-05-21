'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQRCode } from 'next-qrcode';
import jsPDF from 'jspdf';
import { Printer, RefreshCw, Loader2, QrCode } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';
import { authHeaders } from '@/shared/services/api-client';

interface BarcodeSectionProps {
  barbershopId: string;
  shopName: string;
}

export function BarcodeSection({ barbershopId, shopName }: BarcodeSectionProps) {
  const { Canvas } = useQRCode();
  const [qrToken, setQrToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [printing, setPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchQr = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/barbershops/${barbershopId}/qr`, {
        headers: authHeaders(),
      });
      if (!res.ok) {
        setQrToken('');
        return;
      }
      const raw = await res.json();
      const token: string =
        typeof raw === 'string'
          ? raw
          : (raw?.qrToken ?? raw?.token ?? raw?.data?.qrToken ?? raw?.data ?? '');
      setQrToken(String(token).trim());
    } catch {
      setQrToken('');
    } finally {
      setLoading(false);
    }
  }, [barbershopId]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/barbershops/${barbershopId}/refresh-qr`, {
        method: 'PUT',
        headers: authHeaders(),
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

  const handlePrint = async () => {
    if (!printRef.current || !qrToken) return;
    setPrinting(true);
    try {
      const qrCanvas = printRef.current.querySelector('canvas');
      if (!qrCanvas) throw new Error('Canvas QR tidak ditemukan.');
      const imgData = qrCanvas.toDataURL('image/png');

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
      const pageW = pdf.internal.pageSize.getWidth();

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(30, 58, 138);
      pdf.text(`QR Absensi – ${shopName}`, pageW / 2, 18, { align: 'center' });

      const qrSize = 80;
      const qrX = (pageW - qrSize) / 2;
      pdf.addImage(imgData, 'PNG', qrX, 26, qrSize, qrSize);

      pdf.setFont('courier', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(107, 114, 128);
      pdf.text(qrToken, pageW / 2, 26 + qrSize + 8, { align: 'center', maxWidth: pageW - 20 });

      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      a.click();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
    } catch (err) {
      alert('Gagal membuat PDF: ' + err);
    } finally {
      setPrinting(false);
    }
  };

  useEffect(() => {
    fetchQr();
  }, [fetchQr]);

  return (
    <div className="bg-white rounded-[12px] border border-[#F0F0F0] p-6">
      <h2 className="text-[15px] font-semibold text-[#374151] mb-5">Generate Barcode</h2>
      <div className="flex justify-center">
        <div className="border border-[#E5E7EB] rounded-[16px] px-8 py-8 flex flex-col items-center gap-4 min-w-[220px]">
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
            <>
              <div ref={printRef}>
                <Canvas
                  text={qrToken}
                  options={{ width: 180, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } }}
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-[6px] border border-[#E5E7EB] text-[12px] font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
                </button>
                <button
                  onClick={handlePrint}
                  disabled={printing}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-[6px] bg-[#3B60E4] hover:bg-[#1E40AF] text-white text-[12px] font-semibold transition-colors disabled:opacity-60"
                >
                  {printing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Printer className="w-3.5 h-3.5" />
                  )}
                  {printing ? 'Memproses...' : 'Print PDF'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mt-2 mb-1 text-[#CCCCCC]">
                <QrCode className="w-12 h-12" strokeWidth={1.2} />
              </div>
              <p className="text-[12px] text-[#9CA3AF] text-center leading-snug">
                Barcode belum digenerate
                <br />
                untuk hari ini.
              </p>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-1.5 bg-[#3B60E4] hover:bg-[#1E40AF] text-white text-[12px] font-semibold px-5 py-2 rounded-[6px] transition-colors mt-1"
              >
                <span>✦</span> Generate Barcode
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
