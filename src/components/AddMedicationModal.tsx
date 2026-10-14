import React, { useState } from 'react';
import { Medication, ChildProfile } from '../types';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  childrenList: ChildProfile[];
  onAddMedication: (med: Medication) => void;
}

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  childrenList,
  onAddMedication,
}) => {
  const [name, setName] = useState('');
  const [strength, setStrength] = useState('250مغ');
  const [category, setCategory] = useState('مضاد حيوي');
  const [dosage, setDosage] = useState('5 مل (1 ملعقة صغيرة)');
  const [scheduleType, setScheduleType] = useState('twice');
  const [selectedChildId, setSelectedChildId] = useState(childrenList[0]?.id || 'hamad');
  const [type, setType] = useState<'pill' | 'syrup' | 'drops'>('syrup');
  const [inventory, setInventory] = useState(14);
  const [instructions, setInstructions] = useState('يؤخذ مع الطعام.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let scheduleDesc = 'مرتين يومياً (8 ص، 8 م)';
    let times = ['08:00 ص', '08:00 م'];
    let status: 'active' | 'as_needed' = 'active';

    if (scheduleType === 'once') {
      scheduleDesc = 'مرة واحدة يومياً (9 ص)';
      times = ['09:00 ص'];
    } else if (scheduleType === 'as_needed') {
      scheduleDesc = 'كل 6 ساعات عند الحاجة';
      times = ['عند الحاجة'];
      status = 'as_needed';
    } else if (scheduleType === 'three') {
      scheduleDesc = '3 مرات يومياً (8 ص، 2 م، 8 م)';
      times = ['08:00 ص', '02:00 م', '08:00 م'];
    }

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: name.trim(),
      strength,
      category,
      dosage,
      scheduleDescription: scheduleDesc,
      times,
      instructions: instructions || 'يؤخذ حسب توجيهات الطبيب.',
      status,
      inventoryDoses: Number(inventory) || 10,
      lowStockThreshold: 4,
      childId: selectedChildId,
      type,
      nextDoseTime: times[0] || '08:00 ص',
    };

    onAddMedication(newMed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#c2c6d8]/30 p-6 relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#c2c6d8]/20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#800020]/15 flex items-center justify-center text-[#800020]">
              <span className="material-symbols-outlined text-[24px]">add_circle</span>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#111c2c]">إضافة دواء جديد</h2>
              <p className="text-xs text-[#727787]">تسجيل وصفة طبية أو علاج جديد</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f0f3ff] text-[#424655] flex items-center justify-center hover:bg-[#d8e3fa]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Child selection */}
          <div>
            <label className="block text-xs font-bold text-[#424655] mb-1.5">
              الطفل المخصص له الدواء
            </label>
            <div className="flex gap-2">
              {childrenList.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedChildId(c.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedChildId === c.id
                      ? 'bg-[#0057cd] text-white shadow-sm'
                      : 'bg-[#f0f3ff] text-[#424655]'
                  }`}
                >
                  <img src={c.avatar} alt={c.name} className="w-5 h-5 rounded-full object-cover" />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Medicine Name */}
          <div>
            <label className="block text-xs font-bold text-[#424655] mb-1">
              اسم الدواء <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: أموكسيسيلين، باراسيتامول..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#c2c6d8]/60 bg-white text-sm focus:ring-2 focus:ring-[#800020] focus:outline-none"
            />
          </div>

          {/* Strength & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">
                التركيز / القوة
              </label>
              <input
                type="text"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                placeholder="250مغ أو 100مغ/5مل"
                className="w-full px-3 py-2 rounded-xl border border-[#c2c6d8]/60 bg-white text-sm focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">
                التصنيف
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#c2c6d8]/60 bg-white text-sm focus:ring-2 focus:ring-[#800020] focus:outline-none"
              >
                <option value="مضاد حيوي">مضاد حيوي</option>
                <option value="مسكن/خافض للحرارة">مسكن/خافض للحرارة</option>
                <option value="مكمل غذائي">مكمل غذائي</option>
                <option value="شراب حساسية">شراب حساسية</option>
                <option value="قطرات">قطرات</option>
              </select>
            </div>
          </div>

          {/* Type Icon & Dosage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">
                شكل الدواء
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType('syrup')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors ${
                    type === 'syrup' ? 'bg-[#006a66] text-white border-[#006a66]' : 'bg-white text-[#424655] border-[#c2c6d8]/50'
                  }`}
                >
                  شراب
                </button>
                <button
                  type="button"
                  onClick={() => setType('pill')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors ${
                    type === 'pill' ? 'bg-[#800020] text-white border-[#800020]' : 'bg-white text-[#424655] border-[#c2c6d8]/50'
                  }`}
                >
                  حبوب
                </button>
                <button
                  type="button"
                  onClick={() => setType('drops')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors ${
                    type === 'drops' ? 'bg-[#0057cd] text-white border-[#0057cd]' : 'bg-white text-[#424655] border-[#c2c6d8]/50'
                  }`}
                >
                  قطرات
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">
                الجرعة الواحدة
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="5 مل (1 ملعقة)"
                className="w-full px-3 py-2 rounded-xl border border-[#c2c6d8]/60 bg-white text-sm focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs font-bold text-[#424655] mb-1">
              الجدول الزمني
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setScheduleType('twice')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border ${
                  scheduleType === 'twice' ? 'bg-[#800020] text-white border-[#800020]' : 'bg-white text-[#424655] border-[#c2c6d8]/50'
                }`}
              >
                مرتين يومياً
              </button>
              <button
                type="button"
                onClick={() => setScheduleType('as_needed')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border ${
                  scheduleType === 'as_needed' ? 'bg-[#006a66] text-white border-[#006a66]' : 'bg-white text-[#424655] border-[#c2c6d8]/50'
                }`}
              >
                عند الحاجة
              </button>
              <button
                type="button"
                onClick={() => setScheduleType('once')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border ${
                  scheduleType === 'once' ? 'bg-[#0057cd] text-white border-[#0057cd]' : 'bg-white text-[#424655] border-[#c2c6d8]/50'
                }`}
              >
                مرة يومياً
              </button>
            </div>
          </div>

          {/* Quantity & Instructions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">
                كمية المخزون المتبقية
              </label>
              <input
                type="number"
                min="1"
                value={inventory}
                onChange={(e) => setInventory(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#c2c6d8]/60 bg-white text-sm focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">
                إرشادات التناول
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="مع الطعام أو بعده"
                className="w-full px-3 py-2 rounded-xl border border-[#c2c6d8]/60 bg-white text-sm focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#800020] text-white text-[15px] font-bold hover:bg-[#600018] shadow-md transition-all active:scale-98"
            >
              حفظ وإضافة الدواء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
