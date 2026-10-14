import React from 'react';
import { Medication } from '../types';

interface MedicationDetailModalProps {
  medication: Medication | null;
  onClose: () => void;
  onLogDose: (med: Medication) => void;
  onToggleStatus: (medId: string) => void;
  onRefill: (medId: string) => void;
}

export const MedicationDetailModal: React.FC<MedicationDetailModalProps> = ({
  medication,
  onClose,
  onLogDose,
  onToggleStatus,
  onRefill,
}) => {
  if (!medication) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#c2c6d8]/30 p-6 relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#c2c6d8]/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#f0f3ff] flex items-center justify-center text-[#0057cd]">
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                {medication.type === 'pill' ? 'pill' : medication.type === 'drops' ? 'vaccines' : 'medication_liquid'}
              </span>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#111c2c]">{medication.name}</h2>
              <p className="text-xs text-[#727787]">{medication.strength} • {medication.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f0f3ff] text-[#424655] flex items-center justify-center hover:bg-[#d8e3fa]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-sm">
          <div className="p-3.5 rounded-2xl bg-[#fbf9f8] border border-[#e7eeff] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#727787]">الجرعة المقررة:</span>
              <span className="font-bold text-[#111c2c]">{medication.dosage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#727787]">الجدول الزمني:</span>
              <span className="font-bold text-[#111c2c]">{medication.scheduleDescription}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#727787]">حالة الدواء:</span>
              <span className="font-bold text-[#0057cd]">
                {medication.status === 'active' ? 'نشط' : medication.status === 'as_needed' ? 'عند الحاجة' : 'مكتمل'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#727787]">المخزون المتبقي:</span>
              <span className={`font-bold ${medication.inventoryDoses <= 3 ? 'text-[#ba1a1a]' : 'text-[#006a66]'}`}>
                {medication.inventoryDoses} جرعة
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f0f3ff] text-xs text-[#424655] flex items-start gap-2">
            <span className="material-symbols-outlined text-[#0057cd] text-[18px]">info</span>
            <div>
              <span className="font-bold block text-[#111c2c]">إرشادات الاستخدام:</span>
              <p className="mt-0.5">{medication.instructions}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 space-y-2">
            {medication.status !== 'completed' && (
              <button
                onClick={() => {
                  onLogDose(medication);
                  onClose();
                }}
                className="w-full py-3 rounded-full bg-[#0057cd] text-white font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#00419e] transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>تسجيل جرعة الآن</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onRefill(medication.id)}
                className="py-2.5 px-3 rounded-xl border border-[#c2c6d8]/50 bg-white hover:bg-[#f0f3ff] text-xs font-bold text-[#111c2c] flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                <span>إعادة تعبئة (+10 جرعات)</span>
              </button>
              <button
                onClick={() => {
                  onToggleStatus(medication.id);
                  onClose();
                }}
                className="py-2.5 px-3 rounded-xl border border-[#c2c6d8]/50 bg-white hover:bg-[#f0f3ff] text-xs font-bold text-[#800020] flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {medication.status === 'completed' ? 'refresh' : 'check'}
                </span>
                <span>{medication.status === 'completed' ? 'إعادة تنشيط' : 'تحديد كمكتمل'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
