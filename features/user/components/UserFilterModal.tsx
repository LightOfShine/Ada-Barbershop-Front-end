'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { REGION_OPTIONS, BARBERSHOP_OPTIONS, ROLE_OPTIONS } from '../constants/mock-data';

export interface UserFilters {
  roles: string[];
  regions: string[];
  barbershops: string[];
}

interface UserFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: UserFilters) => void;
  currentFilters: UserFilters;
}

export function UserFilterModal({ isOpen, onClose, onApply, currentFilters }: UserFilterModalProps) {
  const [roles, setRoles] = useState<string[]>(currentFilters.roles);
  const [regions, setRegions] = useState<string[]>(currentFilters.regions);
  const [barbershops, setBarbershops] = useState<string[]>(currentFilters.barbershops);

  // Sync when modal opens with current filters
  useEffect(() => {
    if (isOpen) {
      setRoles(currentFilters.roles);
      setRegions(currentFilters.regions);
      setBarbershops(currentFilters.barbershops);
    }
  }, [isOpen, currentFilters]);

  // Filtered barbershop list based on selected regions
  const availableBarbershops = regions.length > 0
    ? BARBERSHOP_OPTIONS.filter((bs) => regions.includes(bs.regionId))
    : BARBERSHOP_OPTIONS;

  // Toggle helpers
  const toggleRole = (value: string) => {
    setRoles((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  };

  const toggleRegion = (value: string) => {
    setRegions((prev) => {
      const next = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
      // Remove barbershops that no longer belong to any selected region
      if (next.length > 0) {
        setBarbershops((prevBs) =>
          prevBs.filter((bsId) => {
            const bs = BARBERSHOP_OPTIONS.find((b) => b.value === bsId);
            return bs && next.includes(bs.regionId);
          })
        );
      }
      return next;
    });
  };

  const toggleBarbershop = useCallback((value: string) => {
    setBarbershops((prev) => {
      const next = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
      // Auto-select the region of the selected barbershop
      const bs = BARBERSHOP_OPTIONS.find((b) => b.value === value);
      if (bs && !regions.includes(bs.regionId) && next.includes(value)) {
        setRegions((prevR) => prevR.includes(bs.regionId) ? prevR : [...prevR, bs.regionId]);
      }
      return next;
    });
  }, [regions]);

  const handleClear = () => {
    setRoles([]);
    setRegions([]);
    setBarbershops([]);
  };

  const handleApply = () => {
    onApply({ roles, regions, barbershops });
    onClose();
  };

  const activeCount = roles.length + regions.length + barbershops.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-[16px] w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div>
            <h3 className="text-[18px] font-semibold text-[#1F2937]">Filter User</h3>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">Sesuaikan tampilan data user</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors text-[#9CA3AF] hover:text-[#374151]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">
          {/* Role Section */}
          <div>
            <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
              Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLE_OPTIONS.map((role) => (
                <label
                  key={role.value}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all border ${
                    roles.includes(role.value)
                      ? 'border-[#1E65E2] bg-[#EBF3FF]'
                      : 'border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={roles.includes(role.value)}
                    onChange={() => toggleRole(role.value)}
                    className="w-4 h-4 rounded border-[#D1D5DB] text-[#1E65E2] focus:ring-[#1E65E2] focus:ring-offset-0 cursor-pointer accent-[#1E65E2]"
                  />
                  <span className={`text-[13px] font-medium ${roles.includes(role.value) ? 'text-[#1E65E2]' : 'text-[#374151]'}`}>
                    {role.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-[#F3F4F6]" />

          {/* Region Section */}
          <div>
            <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
              Region
            </label>
            <div className="grid grid-cols-3 gap-2">
              {REGION_OPTIONS.map((region) => (
                <label
                  key={region.value}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all border ${
                    regions.includes(region.value)
                      ? 'border-[#1E65E2] bg-[#EBF3FF]'
                      : 'border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={regions.includes(region.value)}
                    onChange={() => toggleRegion(region.value)}
                    className="w-4 h-4 rounded border-[#D1D5DB] text-[#1E65E2] focus:ring-[#1E65E2] focus:ring-offset-0 cursor-pointer accent-[#1E65E2]"
                  />
                  <span className={`text-[13px] font-medium ${regions.includes(region.value) ? 'text-[#1E65E2]' : 'text-[#374151]'}`}>
                    {region.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-[#F3F4F6]" />

          {/* Barbershop Section */}
          <div>
            <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
              Barbershop
              {regions.length > 0 && (
                <span className="ml-2 text-[10px] font-normal normal-case text-[#6B7280]">
                  (difilter sesuai region)
                </span>
              )}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableBarbershops.map((bs) => (
                <label
                  key={bs.value}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all border ${
                    barbershops.includes(bs.value)
                      ? 'border-[#1E65E2] bg-[#EBF3FF]'
                      : 'border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={barbershops.includes(bs.value)}
                    onChange={() => toggleBarbershop(bs.value)}
                    className="w-4 h-4 rounded border-[#D1D5DB] text-[#1E65E2] focus:ring-[#1E65E2] focus:ring-offset-0 cursor-pointer accent-[#1E65E2]"
                  />
                  <span className={`text-[13px] font-medium ${barbershops.includes(bs.value) ? 'text-[#1E65E2]' : 'text-[#374151]'}`}>
                    {bs.label}
                  </span>
                </label>
              ))}
              {availableBarbershops.length === 0 && (
                <p className="col-span-2 text-[12px] text-[#9CA3AF] py-2">Tidak ada barbershop di region yang dipilih.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#F3F4F6] px-6 py-4 flex items-center justify-between bg-[#F8FAFC]">
          <button
            onClick={handleClear}
            disabled={activeCount === 0}
            className="text-[13px] font-medium text-[#6B7280] hover:text-[#374151] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="bg-[#1E65E2] hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-2"
          >
            Apply Filters
            {activeCount > 0 && (
              <span className="bg-white/20 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
