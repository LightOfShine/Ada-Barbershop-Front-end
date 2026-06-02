'use client';

import { useState, useEffect } from 'react';
import { useSearch } from '@/shared/context/SearchContext';
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight, Eye, SlidersHorizontal, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { User } from '../types/user.types';
import { useUserList } from '../hooks/useUserList';
import { fetchRegions } from '@/features/region/services/region.service';
import { fetchOutlets } from '@/features/outlet/services/outlet.service';
import { DeleteUserModal } from '../components/DeleteUserModal';
import { UserFilterModal } from '../components/UserFilterModal';
import type { UserFilters } from '../components/UserFilterModal';

const ITEMS_PER_PAGE = 5;

const ROLE_BADGE: Record<string, string> = {
  OWNER: 'bg-purple-100 text-purple-700',
  ADMIN: 'bg-blue-100 text-blue-700',
  EMPLOYEE: 'bg-emerald-100 text-emerald-700',
};

const EMPTY_FILTERS: UserFilters = { roles: [], regions: [], barbershops: [] };

export default function UserListPage() {
  const { searchQuery } = useSearch();
  const { data, isLoading, error, removeUser } = useUserList();
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<UserFilters>(EMPTY_FILTERS);

  // Dynamic filter options from API
  const [regionOptions, setRegionOptions] = useState<{ value: string; label: string }[]>([]);
  const [barbershopOptions, setBarbershopOptions] = useState<{ value: string; label: string; regionId?: string }[]>([]);

  useEffect(() => {
    fetchRegions()
      .then((regions) => setRegionOptions(regions.map((r) => ({ value: r.id, label: r.name }))))
      .catch(() => {});
    fetchOutlets()
      .then((outlets) => setBarbershopOptions(outlets.map((b) => ({ value: b.id, label: b.name, regionId: b.region?.name }))))
      .catch(() => {});
  }, []);

  const activeFilterCount = activeFilters.roles.length + activeFilters.regions.length + activeFilters.barbershops.length;

  // Filter: search + active filters
  const filteredData = data.filter((item) => {
    // Search
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // Role filter
    if (activeFilters.roles.length > 0 && !activeFilters.roles.includes(item.role)) {
      return false;
    }

    // Region filter — match by regionName/region.name to region label
    if (activeFilters.regions.length > 0) {
      const selectedRegionLabels: string[] = regionOptions
        .filter((r) => activeFilters.regions.includes(r.value))
        .map((r) => r.label);
      const userRegion = item.regionName ?? item.region?.name;
      if (!userRegion || !selectedRegionLabels.includes(userRegion)) {
        return false;
      }
    }

    // Barbershop filter — match by barbershopName/barbershop.name to barbershop label
    if (activeFilters.barbershops.length > 0) {
      const selectedBsLabels: string[] = barbershopOptions
        .filter((b) => activeFilters.barbershops.includes(b.value))
        .map((b) => b.label);
      const userBarbershop = item.barbershopName ?? item.barbershop?.name;
      if (!userBarbershop || !selectedBsLabels.includes(userBarbershop)) {
        return false;
      }
    }

    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const safePage = currentPage > totalPages ? 1 : currentPage;
  const pagedData = filteredData.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const goToPage = (page: number) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };

  // Handlers
  const handleDelete = () => {
    if (!selectedUser) return;
    removeUser(selectedUser.id);
    setIsDeleteOpen(false);
    setSelectedUser(null);
  };

  const openDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleApplyFilters = (filters: UserFilters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters(EMPTY_FILTERS);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-9 h-9 text-[#1E65E2] animate-spin" />
        <p className="text-[13px] text-[#6B7280]">Memuat data user...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-[14px] font-semibold text-[#374151]">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-[20px] font-semibold text-[#1E293B]">Kelola User</h2>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors border ${
              activeFilterCount > 0
                ? 'border-[#1E65E2] bg-[#EBF3FF] text-[#1E65E2]'
                : 'border-[#E5E7EB] hover:border-[#D1D5DB] text-[#374151] hover:bg-[#F9FAFB]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="bg-[#1E65E2] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <Link href="/dashboard/users/tambah" className="flex items-center gap-2 bg-[#1E65E2] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors">
            <Plus className="w-4 h-4" /> Tambah User
          </Link>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] text-[#6B7280] font-medium">Filter aktif:</span>
          {activeFilters.roles.map((r) => (
            <span key={`role-${r}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-semibold">
              {r}
            </span>
          ))}
          {activeFilters.regions.map((r) => {
            const label = regionOptions.find((opt) => opt.value === r)?.label ?? r;
            return (
              <span key={`region-${r}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                {label}
              </span>
            );
          })}
          {activeFilters.barbershops.map((b) => {
            const label = barbershopOptions.find((opt) => opt.value === b)?.label ?? b;
            return (
              <span key={`bs-${b}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                {label}
              </span>
            );
          })}
          <button
            onClick={handleClearFilters}
            className="text-[11px] font-medium text-[#EF4444] hover:text-red-700 transition-colors ml-1"
          >
            Hapus semua
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F3F4F6]">
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">Nama</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">Email</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">Role</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">Region</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">Barbershop</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280]">Shift</th>
                <th className="py-5 px-6 text-[13px] font-medium text-[#6B7280] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map((item, index) => (
                <tr key={item.id ?? index} className="border-b border-[#F3F4F6] last:border-none hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap font-medium">{item.name}</td>
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap">{item.email}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${ROLE_BADGE[item.role] ?? 'bg-gray-100 text-gray-700'}`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap">{item.regionName ?? item.region?.name ?? <span className="text-[#D1D5DB]">—</span>}</td>
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap">{item.barbershopName ?? item.barbershop?.name ?? <span className="text-[#D1D5DB]">—</span>}</td>
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap">
                    {item.shiftStart && item.shiftEnd ? `${item.shiftStart} – ${item.shiftEnd}` : <span className="text-[#D1D5DB]">—</span>}
                  </td>
                  <td className="py-4 px-6 text-[13px] text-[#374151] whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                      <Link href={`/dashboard/users/${item.id}`} className="text-[#10B981] hover:text-emerald-700 transition-colors p-1" title="Detail"><Eye className="w-4 h-4" /></Link>
                      <Link href={`/dashboard/users/${item.id}/edit`} className="text-[#3B82F6] hover:text-blue-700 transition-colors p-1" title="Edit"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => openDelete(item)} className="text-[#EF4444] hover:text-red-700 transition-colors p-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-[13px] text-[#6B7280]">Data user tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F3F4F6]">
          <span className="text-[12px] text-[#6B7280]">
            Menampilkan {filteredData.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filteredData.length)} dari {filteredData.length} data
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => goToPage(safePage - 1)} disabled={safePage === 1} className="flex items-center gap-1 text-[13px] font-medium px-2 py-1 rounded mr-1 disabled:opacity-40 text-[#1E65E2] hover:bg-[#F0F5FF] disabled:hover:bg-transparent disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => goToPage(page)} className={`w-7 h-7 flex items-center justify-center rounded-[6px] text-[13px] font-medium transition-colors ${safePage === page ? 'bg-[#1E65E2] text-white' : 'text-[#6B7280] hover:bg-[#F3F4F6]'}`}>{page}</button>
            ))}
            <button onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages} className="flex items-center gap-1 text-[13px] font-medium px-2 py-1 rounded ml-1 disabled:opacity-40 text-[#1E65E2] hover:bg-[#F0F5FF] disabled:hover:bg-transparent disabled:cursor-not-allowed">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <UserFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={activeFilters}
      />

      {/* Delete Modal */}
      {isDeleteOpen && selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
