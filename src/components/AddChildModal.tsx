import React, { useState } from 'react';
import { ChildProfile } from '../types';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChild: (child: ChildProfile) => void;
}

export const AddChildModal: React.FC<AddChildModalProps> = ({
  isOpen,
  onClose,
  onAddChild,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('4 سنوات');
  const [weight, setWeight] = useState('16 كغ');
  const [bloodType, setBloodType] = useState('O+');
  const [allergies, setAllergies] = useState('لا توجد');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Use default child avatar placeholder
    const newChild: ChildProfile = {
      id: `child-${Date.now()}`,
      name: name.trim(),
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLQ2F4KX79gYJmcHpc9bRMdfPQDU6c7fFtGTksdXodse0-phYQ6aZz1NlRw4LmptQPmsuU-xsWNTOkyT2435zryxJOGSSPAO83mQbl-Ie2SmGwITmwlydTwXTjIneR3qmPrKo-zfHUgopPVt3FeVRiVd6bdp45Dwf6EDN2InVxvn0Zbh5TGQXZJ258JwogvToQCccEx3-d3WlnwfBwMxl8Awy0aZcEVtnfuyxLaww2UUMqh_eEag8qXw',
      age,
      weight,
      bloodType,
      allergies,
      braceletId: `PAL-${Math.floor(1000 + Math.random() * 9000)}`,
      braceletBattery: 95,
      braceletConnected: true,
      temperature: '36.9° م',
    };

    onAddChild(newChild);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#c2c6d8]/30 p-6 relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#c2c6d8]/20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#0057cd]/15 flex items-center justify-center text-[#0057cd]">
              <span className="material-symbols-outlined text-[24px]">child_care</span>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#111c2c]">إضافة ملف طفل جديد</h2>
              <p className="text-xs text-[#727787]">ربط جدول الأدوية وسوار التتبع</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f0f3ff] text-[#424655] flex items-center justify-center hover:bg-[#d8e3fa]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#424655] mb-1">
              اسم الطفل <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: سعود، نورة..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#c2c6d8]/60 bg-white text-sm focus:ring-2 focus:ring-[#0057cd] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">العمر</label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="مثال: 4 سنوات"
                className="w-full px-3 py-2 rounded-xl border border-[#c2c6d8]/60 bg-white text-sm focus:ring-2 focus:ring-[#0057cd] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">الوزن</label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="مثال: 16 كغ"
                className="w-full px-3 py-2 rounded-xl border border-[#c2c6d8]/60 bg-white text-sm focus:ring-2 focus:ring-[#0057cd] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">فصيلة الدم</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#c2c6d8]/60 bg-white text-sm focus:ring-2 focus:ring-[#0057cd] focus:outline-none"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#424655] mb-1">الحساسية</label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="حساسية أدوية أو أطعمة"
                className="w-full px-3 py-2 rounded-xl border border-[#c2c6d8]/60 bg-white text-sm focus:ring-2 focus:ring-[#0057cd] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#0057cd] text-white text-[15px] font-bold hover:bg-[#00419e] shadow-md transition-all active:scale-98"
            >
              حفظ الملف وربط السوار
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
