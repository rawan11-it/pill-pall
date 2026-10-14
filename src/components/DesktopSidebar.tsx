import React from 'react';
import { TabType } from '../types';
import { USER_PARENT } from '../data/mockData';

interface DesktopSidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenBracelet: () => void;
  braceletConnected: boolean;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenBracelet,
  braceletConnected,
}) => {
  return (
    <aside className="hidden lg:flex flex-col gap-2 p-5 bg-white shadow-xl h-full w-72 rounded-l-3xl border-l border-[#c2c6d8]/20 fixed right-0 top-16 z-30">
      {/* User Header */}
      <div className="mb-6 pb-4 border-b border-[#c2c6d8]/20">
        <img
          src={USER_PARENT.avatar}
          alt={USER_PARENT.name}
          className="w-16 h-16 rounded-full mb-3 object-cover ring-2 ring-[#87CEEB]"
        />
        <h3 className="text-[18px] font-bold text-[#0057cd]">مستخدم Pill Pal</h3>
        <p className="text-xs text-[#424655] mt-0.5">تتبع الأدوية نشط</p>
        <button
          onClick={onOpenBracelet}
          className="mt-2 text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#87CEEB]/25 text-[#00677c] font-semibold"
        >
          <span className={`w-2 h-2 rounded-full ${braceletConnected ? 'bg-[#006a66]' : 'bg-[#ba1a1a]'}`} />
          <span>{braceletConnected ? 'السوار متصل (88%)' : 'السوار غير متصل'}</span>
        </button>
      </div>

      {/* Nav Links */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex items-center gap-3 p-3 rounded-2xl text-[14px] font-semibold transition-all ${
          currentTab === 'home'
            ? 'bg-[#0057cd] text-white shadow-sm'
            : 'text-[#424655] hover:bg-[#f0f3ff]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[20px]"
          style={{ fontVariationSettings: currentTab === 'home' ? '"FILL" 1' : '"FILL" 0' }}
        >
          home
        </span>
        <span>الرئيسية</span>
      </button>

      <button
        onClick={() => onTabChange('medications')}
        className={`flex items-center gap-3 p-3 rounded-2xl text-[14px] font-semibold transition-all ${
          currentTab === 'medications'
            ? 'bg-[#800020] text-white shadow-sm'
            : 'text-[#424655] hover:bg-[#f0f3ff]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[20px]"
          style={{ fontVariationSettings: currentTab === 'medications' ? '"FILL" 1' : '"FILL" 0' }}
        >
          medication
        </span>
        <span>الأدوية</span>
      </button>

      <button
        onClick={() => onTabChange('history')}
        className={`flex items-center gap-3 p-3 rounded-2xl text-[14px] font-semibold transition-all ${
          currentTab === 'history'
            ? 'bg-[#3ad7fd] text-[#005b6d] font-bold shadow-sm'
            : 'text-[#424655] hover:bg-[#f0f3ff]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[20px]"
          style={{ fontVariationSettings: currentTab === 'history' ? '"FILL" 1' : '"FILL" 0' }}
        >
          history
        </span>
        <span>السجل</span>
      </button>

      <button
        onClick={() => onTabChange('account')}
        className={`flex items-center gap-3 p-3 rounded-2xl text-[14px] font-semibold transition-all ${
          currentTab === 'account'
            ? 'bg-[#00677c] text-white shadow-sm'
            : 'text-[#424655] hover:bg-[#f0f3ff]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[20px]"
          style={{ fontVariationSettings: currentTab === 'account' ? '"FILL" 1' : '"FILL" 0' }}
        >
          person
        </span>
        <span>الحساب</span>
      </button>

      {/* Bottom Auxiliary Links */}
      <div className="mt-auto pt-4 border-t border-[#c2c6d8]/20 flex flex-col gap-1 text-xs text-[#727787]">
        <div className="flex items-center gap-2 p-2 hover:bg-[#f0f3ff] rounded-xl cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">language</span>
          <span>العربية / English</span>
        </div>
        <div className="flex items-center gap-2 p-2 hover:bg-[#f0f3ff] rounded-xl cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">help</span>
          <span>مركز المساعدة والدعم</span>
        </div>
        <div className="flex items-center gap-2 p-2 hover:bg-[#f0f3ff] rounded-xl cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">security</span>
          <span>سياسة الخصوصية والأمان</span>
        </div>
      </div>
    </aside>
  );
};
