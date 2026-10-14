import React, { useState } from 'react';
import { Medication, MedicationStatus } from '../types';

interface MedicationsScreenProps {
  medications: Medication[];
  onOpenAddModal: () => void;
  onSelectMedication: (med: Medication) => void;
}

export const MedicationsScreen: React.FC<MedicationsScreenProps> = ({
  medications,
  onOpenAddModal,
  onSelectMedication,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | MedicationStatus>('active');

  const filteredMedications = medications.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.strength.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'all') return true;
    return med.status === activeFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-5 pt-4 pb-28 flex flex-col gap-5 animate-fadeIn">
      {/* Title & Search & Filter */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#111c2c]">
            الأدوية
          </h1>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-[#424655] border border-[#c2c6d8]/30">
            {filteredMedications.length} أدوية مسجلة
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#727787]">
            <span className="material-symbols-outlined text-[22px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث عن الأدوية..."
            className="w-full pr-12 pl-4 py-3 bg-white border border-[#c2c6d8]/60 rounded-full text-[16px] text-[#111c2c] placeholder:text-[#727787] focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#727787] hover:text-[#111c2c]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setActiveFilter('active')}
            className={`flex-shrink-0 px-5 py-2 text-[14px] font-semibold rounded-full transition-all ${
              activeFilter === 'active'
                ? 'bg-[#800020] text-white shadow-sm'
                : 'bg-[#d8e3fa] text-[#424655] hover:bg-[#c2c6d8]/50'
            }`}
          >
            نشط
          </button>
          <button
            onClick={() => setActiveFilter('as_needed')}
            className={`flex-shrink-0 px-5 py-2 text-[14px] font-semibold rounded-full transition-all ${
              activeFilter === 'as_needed'
                ? 'bg-[#800020] text-white shadow-sm'
                : 'bg-[#d8e3fa] text-[#424655] hover:bg-[#c2c6d8]/50'
            }`}
          >
            عند الحاجة
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`flex-shrink-0 px-5 py-2 text-[14px] font-semibold rounded-full transition-all ${
              activeFilter === 'completed'
                ? 'bg-[#800020] text-white shadow-sm'
                : 'bg-[#d8e3fa] text-[#424655] hover:bg-[#c2c6d8]/50'
            }`}
          >
            مكتمل
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-shrink-0 px-4 py-2 text-[13px] font-medium rounded-full transition-all ${
              activeFilter === 'all'
                ? 'bg-[#0057cd] text-white shadow-sm'
                : 'bg-white text-[#424655] border border-[#c2c6d8]/40 hover:bg-[#f0f3ff]'
            }`}
          >
            عرض الكل ({medications.length})
          </button>
        </div>
      </section>

      {/* Medications List */}
      <section className="flex flex-col gap-3.5">
        {filteredMedications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-[#727787] border border-[#c2c6d8]/30 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-[#727787]">
              search_off
            </span>
            <p className="font-semibold text-base text-[#111c2c]">لا توجد أدوية مطابقة للبحث</p>
            <p className="text-sm">جرّب كلمة بحث مختلفة أو اختر تبويباً آخر</p>
          </div>
        ) : (
          filteredMedications.map((med) => {
            const isCompleted = med.status === 'completed';
            const isActive = med.status === 'active';
            const isAsNeeded = med.status === 'as_needed';

            // Distinct theme styling per card as in Image 7
            let borderStripColor = 'bg-[#800020]';
            let iconBg = 'bg-[#ffdad6] text-[#800020]';
            let badgeBg = 'bg-[#800020] text-white';
            let badgeText = 'نشط';
            let iconName = 'pill';

            if (isAsNeeded) {
              borderStripColor = 'bg-[#006a66]';
              iconBg = 'bg-[#84f5ee]/40 text-[#006a66]';
              badgeBg = 'bg-[#d8e3fa] text-[#424655]';
              badgeText = 'عند الحاجة';
              iconName = 'medication_liquid';
            } else if (isCompleted) {
              borderStripColor = 'bg-transparent';
              iconBg = 'bg-[#d8e3fa] text-[#424655]';
              badgeBg = 'bg-[#e7eeff] text-[#727787]';
              badgeText = 'مكتمل';
              iconName = 'vaccines';
            }

            return (
              <div
                key={med.id}
                onClick={() => onSelectMedication(med)}
                role="button"
                tabIndex={0}
                className={`bg-white rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(13,110,253,0.06)] flex items-start gap-4 hover:shadow-md transition-all cursor-pointer relative overflow-hidden group border border-[#e7eeff] ${
                  isCompleted ? 'opacity-80' : ''
                }`}
              >
                {/* Accent Color Edge Strip (Right edge in RTL) */}
                <div
                  className={`absolute top-0 right-0 w-1.5 h-full ${borderStripColor}`}
                />

                {/* Pill/Syrup/Drops Icon Circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${iconBg}`}
                >
                  <span
                    className="material-symbols-outlined text-[24px]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    {iconName}
                  </span>
                </div>

                {/* Medication Details */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-[20px] font-bold text-[#111c2c] truncate ${
                        isCompleted ? 'line-through text-[#727787]' : ''
                      }`}
                    >
                      {med.name}
                    </h3>

                    {/* Status Badge */}
                    <span
                      className={`text-[12px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${badgeBg}`}
                    >
                      {badgeText}
                    </span>
                  </div>

                  <p className="text-[14px] text-[#424655] mt-0.5 truncate">
                    {med.strength} • {med.category}
                  </p>

                  <div className="mt-2.5 flex items-center gap-2 text-[#727787] text-[13px]">
                    <span className="material-symbols-outlined text-[17px]">
                      {isCompleted ? 'event_available' : 'schedule'}
                    </span>
                    <span>{med.scheduleDescription}</span>
                  </div>

                  {med.inventoryDoses <= 3 && med.status !== 'completed' && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ba1a1a] bg-[#ffdad6]/60 px-2.5 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      <span>متبقي {med.inventoryDoses} جرعات فقط في الصيدلية المنزلية</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={onOpenAddModal}
        aria-label="إضافة دواء"
        className="fixed left-5 bottom-24 sm:bottom-12 w-14 h-14 bg-[#800020] text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-[#600018] hover:scale-105 active:scale-95 transition-all z-40"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};
