import React from 'react';
import { TabType } from '../types';

interface BottomNavBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'الرئيسية',
      icon: 'home',
      activeBg: 'bg-[#0057cd] text-white',
    },
    {
      id: 'medications' as TabType,
      label: 'الأدوية',
      icon: 'medication',
      activeBg: 'bg-[#800020] text-white',
    },
    {
      id: 'history' as TabType,
      label: 'السجل',
      icon: 'history',
      activeBg: 'bg-[#0057cd] text-white',
    },
    {
      id: 'account' as TabType,
      label: 'الحساب',
      icon: 'person',
      activeBg: 'bg-[#00677c] text-white',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-safe h-20 bg-white/95 backdrop-blur-md rounded-t-2xl shadow-[0_-4px_20px_rgba(13,110,253,0.08)] border-t border-[#c2c6d8]/20">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-150 min-w-[68px] ${
              isActive
                ? `${tab.activeBg} rounded-full px-4 py-1.5 shadow-sm scale-100`
                : 'text-[#424655] hover:bg-[#e7eeff]/60 py-1.5 px-3 rounded-xl'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px] mb-0.5 leading-none"
              style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
            >
              {tab.icon}
            </span>
            <span className="text-[12px] font-semibold leading-tight">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
