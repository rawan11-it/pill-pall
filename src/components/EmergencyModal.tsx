import React from 'react';
import { USER_PARENT } from '../data/mockData';
import { ChildProfile } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  childrenList: ChildProfile[];
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  childrenList,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-[#800020] p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#c2c6d8]/30">
          <div className="flex items-center gap-2.5 text-[#800020]">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              emergency
            </span>
            <h2 className="text-[22px] font-bold text-[#800020]">
              خدمة الطوارئ السريعة
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f0f3ff] text-[#424655] flex items-center justify-center hover:bg-[#d8e3fa]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick Dial Action Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="tel:997"
            className="p-4 rounded-2xl bg-[#800020] text-white flex items-center gap-3 hover:bg-[#600018] transition-all shadow-md active:scale-98"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[26px]">ambulance</span>
            </div>
            <div>
              <div className="text-[13px] font-medium opacity-90">الإسعاف الوطني</div>
              <div className="text-[22px] font-bold tracking-wider">997</div>
            </div>
          </a>

          <a
            href="tel:937"
            className="p-4 rounded-2xl bg-[#006a66] text-white flex items-center gap-3 hover:bg-[#00504d] transition-all shadow-md active:scale-98"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[26px]">support_agent</span>
            </div>
            <div>
              <div className="text-[13px] font-medium opacity-90">مركز السموم والاستشارات</div>
              <div className="text-[22px] font-bold tracking-wider">937</div>
            </div>
          </a>
        </div>

        {/* Doctor Contact */}
        <div className="mt-4 p-4 rounded-2xl bg-[#f0f3ff] border border-[#c2c6d8]/40 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-[15px] text-[#111c2c]">{USER_PARENT.doctorName}</h4>
            <p className="text-xs text-[#727787] mt-0.5">{USER_PARENT.emergencyHospital}</p>
            <p className="text-xs font-semibold text-[#0057cd] mt-0.5" dir="ltr">{USER_PARENT.doctorPhone}</p>
          </div>
          <a
            href={`tel:${USER_PARENT.doctorPhone}`}
            className="px-4 py-2 rounded-full bg-[#0057cd] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#00419e]"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>اتصال بالطبيب</span>
          </a>
        </div>

        {/* Patient Emergency Summary Card for Paramedics */}
        <div className="mt-5 space-y-3">
          <h3 className="text-[16px] font-bold text-[#111c2c] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#800020] text-[20px]">id_card</span>
            <span>البطاقة الطبية العاجلة للمسعفين</span>
          </h3>

          <div className="space-y-2">
            {childrenList.map((child) => (
              <div
                key={child.id}
                className="p-3.5 rounded-2xl bg-[#fbf9f8] border border-[#e7eeff] text-xs text-[#424655] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[14px] text-[#111c2c]">{child.name}</span>
                  <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#93000a] font-bold">
                    فصيلة الدم: {child.bloodType}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[12px] pt-1">
                  <div><strong className="text-[#111c2c]">العمر:</strong> {child.age}</div>
                  <div><strong className="text-[#111c2c]">الوزن التقريبي:</strong> {child.weight}</div>
                </div>
                <div className="text-[12px] pt-0.5 text-[#ba1a1a]">
                  <strong>الحساسية:</strong> {child.allergies}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Close */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-[#f0f3ff] hover:bg-[#d8e3fa] text-[#111c2c] font-bold text-[14px] transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
