import React, { useState } from 'react';

interface SmartBraceletModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  onToggleConnection: () => void;
  batteryLevel?: number;
}

export const SmartBraceletModal: React.FC<SmartBraceletModalProps> = ({
  isOpen,
  onClose,
  isConnected,
  onToggleConnection,
  batteryLevel = 88,
}) => {
  const [vibrating, setVibrating] = useState(false);
  const [beeping, setBeeping] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const playBuzzerSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // AudioContext fallback
    }
  };

  const handleTestVibration = () => {
    setVibrating(true);
    setFeedbackMessage('تم إرسال إشارة اهتزاز تنبيهية إلى سوار الطفل...');
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    setTimeout(() => {
      setVibrating(false);
    }, 1500);
  };

  const handleTestBuzzer = () => {
    setBeeping(true);
    playBuzzerSound();
    setFeedbackMessage('تم تشغيل نغمة التذكير اللطيفة على السوار...');
    setTimeout(() => {
      setBeeping(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#87CEEB]/40 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#c2c6d8]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#87CEEB]/40 flex items-center justify-center text-[#00677c]">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                watch
              </span>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#111c2c]">سوار Pill Pal الذكي</h2>
              <p className="text-xs text-[#727787]">مزامنة مباشرة مع تطبيق الهاتف</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f0f3ff] text-[#424655] flex items-center justify-center hover:bg-[#d8e3fa]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Bracelet Status Card */}
        <div className="mt-4 p-4 rounded-2xl bg-[#f0f3ff] border border-[#d8e3fa] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                isConnected ? 'bg-[#006a66] animate-pulse' : 'bg-[#ba1a1a]'
              }`}
            />
            <div>
              <div className="text-[15px] font-bold text-[#111c2c]">
                {isConnected ? 'السوار متصل بالبلوتوث' : 'السوار غير متصل'}
              </div>
              <div className="text-xs text-[#727787]">المعرف: PAL-8842 (معصم حمد)</div>
            </div>
          </div>

          <button
            onClick={onToggleConnection}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              isConnected
                ? 'bg-[#ba1a1a]/15 text-[#ba1a1a] hover:bg-[#ba1a1a]/25'
                : 'bg-[#006a66]/15 text-[#006a66] hover:bg-[#006a66]/25'
            }`}
          >
            {isConnected ? 'فصل الاتصال' : 'إعادة الاتصال'}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-2xl bg-[#fbf9f8] border border-[#e7eeff]">
            <span className="material-symbols-outlined text-[22px] text-[#006a66]">
              battery_5_bar
            </span>
            <div className="text-[16px] font-bold text-[#111c2c] mt-0.5">{batteryLevel}%</div>
            <div className="text-[11px] text-[#727787]">البطارية</div>
          </div>

          <div className="p-3 rounded-2xl bg-[#fbf9f8] border border-[#e7eeff]">
            <span className="material-symbols-outlined text-[22px] text-[#0057cd]">
              thermostat
            </span>
            <div className="text-[16px] font-bold text-[#111c2c] mt-0.5">36.8° م</div>
            <div className="text-[11px] text-[#727787]">حرارة الطفل</div>
          </div>

          <div className="p-3 rounded-2xl bg-[#fbf9f8] border border-[#e7eeff]">
            <span className="material-symbols-outlined text-[22px] text-[#800020]">
              sensors
            </span>
            <div className="text-[16px] font-bold text-[#111c2c] mt-0.5">قيد الارتداء</div>
            <div className="text-[11px] text-[#727787]">حساس اللمس</div>
          </div>
        </div>

        {/* Interactive Bracelet Actions */}
        <div className="mt-5 space-y-2.5">
          <h4 className="text-[14px] font-bold text-[#111c2c]">إرسال تنبيه تجريبي للسوار</h4>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleTestVibration}
              disabled={!isConnected || vibrating}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                vibrating
                  ? 'bg-[#800020] text-white border-[#800020] animate-bounce'
                  : 'bg-white hover:bg-[#f0f3ff] text-[#111c2c] border-[#c2c6d8]/40'
              } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="material-symbols-outlined text-[22px]">vibration</span>
              <span>{vibrating ? 'جاري الاهتزاز...' : 'اهتزاز للتذكير'}</span>
            </button>

            <button
              onClick={handleTestBuzzer}
              disabled={!isConnected || beeping}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                beeping
                  ? 'bg-[#0057cd] text-white border-[#0057cd] scale-95'
                  : 'bg-white hover:bg-[#f0f3ff] text-[#111c2c] border-[#c2c6d8]/40'
              } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="material-symbols-outlined text-[22px]">volume_up</span>
              <span>{beeping ? 'رنين النغمة...' : 'نغمة تنبيه لطيفة'}</span>
            </button>
          </div>

          {feedbackMessage && (
            <p className="text-xs text-center text-[#006a66] font-semibold bg-[#84f5ee]/20 py-2 px-3 rounded-xl animate-fadeIn">
              {feedbackMessage}
            </p>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-[#0057cd] text-white font-bold text-[14px] hover:bg-[#00419e] transition-colors shadow-sm"
          >
            تم
          </button>
        </div>
      </div>
    </div>
  );
};
