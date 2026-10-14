import React from 'react';

interface TopAppBarProps {
  onOpenEmergency: () => void;
  onOpenBracelet?: () => void;
  braceletConnected?: boolean;
  isCloudSynced?: boolean;
  userEmail?: string | null;
  userPhoto?: string | null;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenEmergency,
  onOpenBracelet,
  braceletConnected = true,
  isCloudSynced = true,
  userEmail,
  userPhoto,
}) => {
  return (
    <header className="docked full-width top-0 sticky z-40 bg-[#F5F5DC]/95 backdrop-blur-md border-b border-[#c2c6d8]/20 transition-all">
      <div className="flex items-center justify-between px-5 h-16 w-full max-w-7xl mx-auto">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#0057cd]/10 flex items-center justify-center text-[#0057cd]">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: '"FILL" 1' }}>
              pill
            </span>
          </div>
          <h1 className="text-[24px] font-bold text-[#0057cd] tracking-tight font-headline-md">
            Pill Pal
          </h1>

          {/* Cloud Sync Status Indicator */}
          <div
            title={userEmail ? `متصل بحساب: ${userEmail} (Firestore نشط)` : 'مزامنة السحابة نشطة'}
            className="hidden md:flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#006a66]/10 text-[#006a66] mr-1"
          >
            <span className="material-symbols-outlined text-[14px]">
              {isCloudSynced ? 'cloud_done' : 'cloud_sync'}
            </span>
            <span>{userEmail ? 'سحابة نشطة' : 'سحابة متصلة'}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {userPhoto && (
            <img
              src={userPhoto}
              alt="الملف الشخصي"
              className="w-7 h-7 rounded-full object-cover ring-2 ring-[#0057cd]/40 hidden sm:block"
              title={userEmail || ''}
            />
          )}

          {onOpenBracelet && (
            <button
              onClick={onOpenBracelet}
              title="حالة السوار الذكي"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#87CEEB]/30 hover:bg-[#87CEEB]/50 text-[#111c2c] text-xs font-medium transition-colors"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  braceletConnected ? 'bg-[#006a66] animate-pulse' : 'bg-[#ba1a1a]'
                }`}
              />
              <span>{braceletConnected ? 'السوار متصل' : 'السوار غير متصل'}</span>
            </button>
          )}

          {/* Emergency Button */}
          <button
            onClick={onOpenEmergency}
            aria-label="طوارئ"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#800020] text-white hover:bg-[#800020]/90 active:scale-95 transition-all shadow-sm"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: '"FILL" 1, "wght" 300' }}
            >
              medical_services
            </span>
            <span className="text-[13px] font-bold tracking-wider">
              طوارئ
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
