'use client';

import dynamic from 'next/dynamic';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { UserCircle, Briefcase, ArrowRight } from 'lucide-react';
import { useSearch } from './SearchContext';

// Gunakan dynamic import dengan ssr:false agar recharts tidak error di server
const ResponsiveContainer = dynamic(
  () => import('recharts').then(mod => mod.ResponsiveContainer),
  { ssr: false }
);

const ATTENDANCE_DATA = [
  { name: 'Masuk', value: 8, color: '#60A5FA', percent: '72.7%' },
  { name: 'Izin', value: 1, color: '#FCD34D', percent: '9.1%' },
  { name: 'Sakit', value: 2, color: '#F97316', percent: '18.2%' },
];

const HISTORY_DATA = [
  { admin: 'Admin 1', date: '09/04/26', kap1: 'Ahmad', kap2: 'Johan' },
  { admin: 'Admin 1', date: '08/04/26', kap1: 'Bayu', kap2: 'Aan' },
  { admin: 'Admin 2', date: '07/04/26', kap1: 'El', kap2: 'Dani' },
  { admin: 'Admin 1', date: '06/04/26', kap1: 'Reyhan', kap2: 'Bagas' },
];

const KAPSTER_DATA = [
  { name: 'Ryan Gabriel', id: '14001112', phone: '081262773946', outlet: 'Gumilir', shift: 'Siang', email: 'ryangabriel@gmail.com' },
  { name: 'Ryan Gabriel Togar Simamora', id: '14001111', phone: '081262773946', outlet: 'Arca', shift: 'Siang', email: 'ryan@gmail.com' },
  { name: 'Joko Santoso', id: '1400110', phone: '081345678901', outlet: 'Kroya', shift: 'Pagi', email: '' },
  { name: 'Hendra Saputra', id: '1400108', phone: '082298765432', outlet: 'Tidar', shift: 'Pagi', email: '' },
  { name: 'Irfan Maulana', id: '1400109', phone: '085612398765', outlet: 'Gumilir', shift: 'Siang', email: '' },
];

const OUTLET_DATA = [
  { no: 1, name: 'Gumilir', count: 3 },
  { no: 2, name: 'Kroya', count: 3 },
  { no: 3, name: 'Rinjani', count: 2 },
  { no: 4, name: 'Tidar', count: 1 },
  { no: 5, name: 'Tendean', count: 0 },
  { no: 6, name: 'Jawa', count: 1 },
  { no: 7, name: 'Jl Laut', count: 0 },
];

export default function DashboardPage() {
  const { searchQuery } = useSearch();

  const lowerQuery = searchQuery.toLowerCase();

  const filteredHistory = HISTORY_DATA.filter(row => 
    row.admin.toLowerCase().includes(lowerQuery) || 
    row.kap1.toLowerCase().includes(lowerQuery) || 
    row.kap2.toLowerCase().includes(lowerQuery)
  );

  const filteredKapsters = KAPSTER_DATA.filter(row => 
    row.name.toLowerCase().includes(lowerQuery) || 
    row.outlet.toLowerCase().includes(lowerQuery) ||
    row.shift.toLowerCase().includes(lowerQuery)
  );

  const filteredOutlets = OUTLET_DATA.filter(row => 
    row.name.toLowerCase().includes(lowerQuery)
  );

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* ─── TOP SUMMARY CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Total Kapster Card */}
        <div className="bg-white rounded-2xl p-6 flex flex-col justify-center border border-[#F1F5F9] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-5">
            <div className="w-[60px] h-[60px] rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
              <UserCircle className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#3B82F6] uppercase tracking-wide">Total Kapster</p>
              <h2 className="text-[32px] font-bold text-[#1E293B] leading-none mt-1">11</h2>
            </div>
          </div>
        </div>

        {/* Jumlah Outlet Card */}
        <div className="bg-white rounded-2xl p-6 flex flex-col justify-center border border-[#F1F5F9] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-5">
            <div className="w-[60px] h-[60px] rounded-full bg-[#FCE7F3] flex items-center justify-center text-[#BE185D]">
              <Briefcase className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#3B82F6] uppercase tracking-wide">Jumlah Outlet</p>
              <h2 className="text-[32px] font-bold text-[#1E293B] leading-none mt-1">12</h2>
            </div>
          </div>
        </div>

      </div>

      {/* ─── MIDDLE CHARTS & HISTORY ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        
        {/* Statistik Absensi (Takes 2/5 width) */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h3 className="text-[16px] font-bold text-[#1E293B] mb-6">Statistik Absensi</h3>
          
          <div className="flex items-center">
            {/* Donut Chart Component */}
            <div className="w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ATTENDANCE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {ATTENDANCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Component */}
            <div className="flex-1 ml-2 pt-2">
              <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-2 text-[12px] font-semibold text-[#64748B] mb-3">
                <span>Status</span>
                <span className="text-center">Jumlah</span>
                <span className="text-right">Persen</span>
              </div>
              <div className="space-y-4">
                {ATTENDANCE_DATA.map((item) => (
                  <div key={item.name} className="grid grid-cols-[1.5fr_1fr_1fr] gap-2 items-center text-[13px] text-[#334155]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium truncate">{item.name}</span>
                    </div>
                    <div className="text-center font-medium">{item.value}</div>
                    <div className="text-right">{item.percent}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Table (Takes 3/5 width) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h3 className="text-[16px] font-bold text-[#1E293B] mb-6">Riwayat</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="text-[#3B82F6] font-medium border-b border-[#F1F5F9]">
                  <th className="pb-3 px-2 font-semibold">Admin</th>
                  <th className="pb-3 px-2 font-semibold">Tanggal</th>
                  <th className="pb-3 px-2 font-semibold">Kapster 1</th>
                  <th className="pb-3 px-2 font-semibold"></th>
                  <th className="pb-3 px-2 font-semibold text-[#3B82F6]">Kapster 2</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length > 0 ? filteredHistory.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-2 text-[#475569]">{row.admin}</td>
                    <td className="py-3 px-2 text-[#475569]">{row.date}</td>
                    <td className="py-3 px-2 text-[#475569] font-medium">{row.kap1}</td>
                    <td className="py-3 px-2 text-[#94A3B8]">
                      <ArrowRight className="w-4 h-4" />
                    </td>
                    <td className="py-3 px-2 text-[#3B82F6] font-semibold">{row.kap2}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-4 text-center text-slate-400">Dimensi data riwayat tidak ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM TABLES ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        
        {/* Data Kapster (Takes 3/5 width) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h3 className="text-[16px] font-bold text-[#1E293B] mb-4">Data Kapster</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="text-[#3B82F6] font-medium border-b border-[#F1F5F9]">
                  <th className="pb-3 px-2 font-semibold whitespace-nowrap">Nama</th>
                  <th className="pb-3 px-2 font-semibold">Id_Kapster</th>
                  <th className="pb-3 px-2 font-semibold">No_Hp</th>
                  <th className="pb-3 px-2 font-semibold">Outlet</th>
                  <th className="pb-3 px-2 font-semibold">Shift</th>
                  <th className="pb-3 px-2 font-semibold">Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredKapsters.length > 0 ? filteredKapsters.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-2 text-[#475569] font-medium">{row.name}</td>
                    <td className="py-3 px-2 text-[#64748B]">{row.id}</td>
                    <td className="py-3 px-2 text-[#64748B]">{row.phone}</td>
                    <td className="py-3 px-2 text-[#64748B]">{row.outlet}</td>
                    <td className="py-3 px-2 text-[#64748B]">{row.shift}</td>
                    <td className="py-3 px-2 text-[#64748B] max-w-[150px] truncate" title={row.email}>{row.email}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="py-4 text-center text-slate-400">Tidak ada kapster yang cocok.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outlet Table (Takes 2/5 width) */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#F1F5F9] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h3 className="text-[16px] font-bold text-[#1E293B] mb-4">Outlet</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="text-[#3B82F6] font-medium border-b border-[#F1F5F9]">
                  <th className="pb-3 px-2 font-semibold">No</th>
                  <th className="pb-3 px-2 font-semibold">Outlet</th>
                  <th className="pb-3 px-2 font-semibold text-center whitespace-nowrap">Jumlah Kapster</th>
                </tr>
              </thead>
              <tbody>
                {filteredOutlets.length > 0 ? filteredOutlets.map((row) => (
                  <tr key={row.no} className="border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-2 text-[#64748B]">{row.no}</td>
                    <td className="py-3 px-2 text-[#475569] font-medium">{row.name}</td>
                    <td className="py-3 px-2 text-[#64748B] text-center">{row.count}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="py-4 text-center text-slate-400">Tidak ada outlet yang cocok.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
