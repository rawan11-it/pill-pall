import React, { useState } from 'react';
import { Medication, DoseLog } from '../types';

interface HomeScreenProps {
  onLogNextDose: () => void;
  onConfirmMissedDose: () => void;
  onSkipMissedDose: () => void;
  missedDoseAlertActive: boolean;
  onNavigateTab: (tab: 'medications' | 'history' | 'account') => void;
  onOpenBracelet: () => void;
  braceletConnected: boolean;
  nextMedication: Medication | null;
  adherenceRate?: number;
  lowStockMedication?: Medication | null;
  onRefillRequested?: (medName: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onLogNextDose,
  onConfirmMissedDose,
  onSkipMissedDose,
  missedDoseAlertActive,
  onNavigateTab,
  onOpenBracelet,
  braceletConnected,
  nextMedication,
  adherenceRate = 98,
  lowStockMedication,
  onRefillRequested,
}) => {
  const [refillSent, setRefillSent] = useState(false);

  const handleRefillClick = () => {
    if (lowStockMedication && onRefillRequested) {
      onRefillRequested(lowStockMedication.name);
      setRefillSent(true);
      setTimeout(() => setRefillSent(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-5 pt-3 pb-8 flex flex-col gap-6 animate-fadeIn">
      {/* Smart Bracelet Status Indicator */}
      <div className="flex items-center justify-center">
        <button
          onClick={onOpenBracelet}
          className="bg-[#87CEEB] hover:bg-[#7bc4e2] px-5 py-2 rounded-full flex items-center gap-2.5 shadow-sm transition-all transform active:scale-95"
          title="انقر لإدارة السوار الذكي"
        >
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              braceletConnected ? 'bg-[#006a66] animate-pulse' : 'bg-[#ba1a1a]'
            }`}
          />
          <span className="text-[14px] font-semibold text-[#111c2c]">
            {braceletConnected ? 'السوار متصل' : 'السوار غير متصل (اضغط للمزامنة)'}
          </span>
        </button>
      </div>

      {/* Alert Banner: Missing Confirmation */}
      {missedDoseAlertActive && (
        <section
          className="bg-[#ffdad6] rounded-2xl p-5 shadow-sm border border-[#ba1a1a]/20 flex flex-col gap-3 transition-all"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <span
              className="material-symbols-outlined text-[#93000a] text-[26px] mt-0.5"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              error
            </span>
            <div className="flex-1">
              <h2 className="text-[20px] font-bold text-[#93000a] leading-tight">
                تأكيد مفقود
              </h2>
              <p className="text-[15px] text-[#93000a]/90 mt-1">
                الجرعة الصباحية لليو (أموكسيسيلين) كانت مقررة منذ 30 دقيقة.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-1">
            <button
              onClick={onSkipMissedDose}
              className="px-4 py-2 rounded-full text-[14px] font-bold text-[#93000a] hover:bg-[#ba1a1a]/10 transition-colors"
            >
              تخطي الجرعة
            </button>
            <button
              onClick={onConfirmMissedDose}
              className="px-5 py-2 rounded-full bg-[#800020] text-white text-[14px] font-bold hover:bg-[#800020]/90 active:scale-95 transition-all shadow-sm"
            >
              تأكيد تناول الجرعة
            </button>
          </div>
        </section>
      )}

      {/* Next Dose Hero Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(13,110,253,0.06)] border border-[#e7eeff] flex flex-col gap-5 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-36 h-36 bg-[#87CEEB] rounded-br-full opacity-35 -z-0 pointer-events-none" />

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <span className="text-[13px] text-[#800020] font-bold uppercase tracking-widest block mb-1">
              الجرعة القادمة
            </span>
            <h2
              className="text-[32px] sm:text-[36px] font-bold text-[#111c2c] tracking-tight"
              dir="ltr"
            >
              {nextMedication?.nextDoseTime || '02:30 PM'}
            </h2>
          </div>
          <div className="bg-[#87CEEB] text-[#111c2c] p-3 rounded-full shadow-sm flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[32px]"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              {nextMedication?.type === 'pill' ? 'pill' : 'medication_liquid'}
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-1.5 mt-1">
          <h3 className="text-[24px] font-bold text-[#111c2c]">
            {nextMedication?.name || 'إيبوبروفين'}
          </h3>
          <p className="text-[15px] text-[#424655] flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-[18px]">
              child_care
            </span>
            لليو • {nextMedication?.dosage || '5 مل (1 ملعقة صغيرة)'}
          </p>
          <p className="text-[14px] text-[#727787] mt-1">
            {nextMedication?.instructions || 'يؤخذ مع الطعام. آخر جرعة في 08:30 ص.'}
          </p>
        </div>

        <div className="relative z-10 mt-2">
          <button
            onClick={onLogNextDose}
            className="w-full bg-[#0057cd] hover:bg-[#00419e] text-white rounded-full py-3.5 px-6 flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              check_circle
            </span>
            <span className="text-[16px] font-bold">تسجيل الجرعة الآن</span>
          </button>
        </div>
      </section>

      {/* Bento Grid for Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Adherence Widget */}
        <div
          onClick={() => onNavigateTab('history')}
          role="button"
          tabIndex={0}
          className="bg-white rounded-2xl p-5 shadow-sm border border-[#e7eeff] flex items-center justify-between cursor-pointer hover:border-[#0057cd]/40 hover:shadow-md transition-all group"
        >
          <div className="flex flex-col">
            <span className="text-[12px] text-[#424655] uppercase font-semibold tracking-wider">
              الالتزام الأسبوعي
            </span>
            <span className="text-[28px] font-bold text-[#006a66] mt-1">
              {adherenceRate}%
            </span>
            <span className="text-[12px] text-[#006a66] font-medium flex items-center gap-1 mt-0.5">
              <span>ممتاز وفق الخطة</span>
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            </span>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* SVG circular progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#d8e3fa]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
              />
              <path
                className="text-[#006a66]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${adherenceRate}, 100`}
                strokeLinecap="round"
                strokeWidth="3.2"
              />
            </svg>
            <span
              className="absolute material-symbols-outlined text-[#006a66] text-[22px]"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              trending_up
            </span>
          </div>
        </div>

        {/* Inventory Widget */}
        <div
          onClick={handleRefillClick}
          role="button"
          tabIndex={0}
          className="bg-white rounded-2xl p-5 shadow-sm border border-[#e7eeff] flex items-center justify-between cursor-pointer hover:border-[#ba1a1a]/40 hover:shadow-md transition-all group"
        >
          <div className="flex flex-col">
            <span className="text-[12px] text-[#424655] uppercase font-semibold tracking-wider">
              مخزون منخفض
            </span>
            <span className="text-[16px] font-bold text-[#111c2c] mt-1">
              {lowStockMedication?.name || 'أموكسيسيلين'}
            </span>
            <span className="text-[13px] font-bold text-[#ba1a1a] mt-0.5">
              {refillSent ? '✓ تم إرسال طلب الصيدلية' : '~جرعتين متبقية'}
            </span>
          </div>

          <div
            className={`p-3 rounded-full transition-transform group-hover:scale-105 ${
              refillSent ? 'bg-[#006a66] text-white' : 'bg-[#ffdad6] text-[#93000a]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {refillSent ? 'check' : 'shopping_cart'}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
