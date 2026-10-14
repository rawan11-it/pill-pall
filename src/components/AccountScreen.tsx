import React, { useState } from 'react';
import { USER_PARENT } from '../data/mockData';
import { ChildProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import firebaseConfig from '../../firebase-applet-config.json';

interface AccountScreenProps {
  childrenList: ChildProfile[];
  onOpenBracelet: () => void;
  braceletConnected: boolean;
  onToggleBracelet: () => void;
  onLogout?: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  childrenList,
  onOpenBracelet,
  braceletConnected,
  onToggleBracelet,
  onLogout,
}) => {
  const { user, loginWithGoogle, isGuest } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleExportReport = () => {
    setReportGenerated(true);
    setTimeout(() => {
      setReportGenerated(false);
      window.print();
    }, 600);
  };

  const displayName = user?.displayName || USER_PARENT.name;
  const displayEmail = user?.email || USER_PARENT.email;
  const displayAvatar = user?.photoURL || USER_PARENT.avatar;

  return (
    <div className="w-full max-w-7xl mx-auto px-5 pt-4 pb-28 flex flex-col gap-6 animate-fadeIn">
      {/* Profile Header */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-[#e7eeff] flex flex-col sm:flex-row items-center gap-5">
        <img
          src={displayAvatar}
          alt={displayName}
          className="w-20 h-20 rounded-full object-cover ring-4 ring-[#87CEEB]/40 shadow-sm"
        />
        <div className="text-center sm:text-right flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#87CEEB]/30 text-[#00677c] text-xs font-bold mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006a66]" />
            <span>{user ? 'حساب موثق عبر Google' : 'وضع الاستكشاف (زائر)'}</span>
          </div>
          <h2 className="text-[22px] font-bold text-[#111c2c]">
            {displayName}
          </h2>
          <p className="text-[14px] text-[#727787] mt-0.5">
            {displayEmail} {user ? '' : `• ${USER_PARENT.phone}`}
          </p>

          {isGuest && (
            <div className="mt-2.5">
              <button
                onClick={() => loginWithGoogle()}
                className="px-3.5 py-1.5 bg-[#0057cd] text-white text-xs font-bold rounded-full hover:bg-[#00419e] transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>ربط الحساب بسحابة Google Firebase</span>
              </button>
            </div>
          )}
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-full border border-[#c2c6d8]/40 hover:bg-[#ffdad6]/30 text-[#ba1a1a] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>تسجيل الخروج</span>
          </button>
        )}
      </section>

      {/* Cloud & Database Architecture Card */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#e7eeff] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#006a66]/15 flex items-center justify-center text-[#006a66]">
              <span className="material-symbols-outlined text-[22px]">database</span>
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#111c2c]">سحابة البيانات والتوثيق (Firebase)</h3>
              <p className="text-xs text-[#727787]">مزامنة مباشرة ومشفرة مع Cloud Firestore</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#006a66]/15 text-[#006a66] text-xs font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#006a66] animate-pulse" />
            <span>متصلة ونشطة</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#c2c6d8]/20 text-xs text-[#424655]">
          <div className="p-2.5 bg-[#fbf9f8] rounded-xl flex flex-col gap-0.5">
            <span className="text-[#727787] font-medium">معرف قاعدة البيانات (Database ID):</span>
            <code className="text-[#0057cd] font-bold text-[11px] truncate" dir="ltr">
              {firebaseConfig.firestoreDatabaseId}
            </code>
          </div>
          <div className="p-2.5 bg-[#fbf9f8] rounded-xl flex flex-col gap-0.5">
            <span className="text-[#727787] font-medium">معرف المشروع (Firebase Project):</span>
            <code className="text-[#0057cd] font-bold text-[11px]" dir="ltr">
              {firebaseConfig.projectId}
            </code>
          </div>
          <div className="p-2.5 bg-[#fbf9f8] rounded-xl flex flex-col gap-0.5">
            <span className="text-[#727787] font-medium">حالة قواعد الأمان (Firestore Rules):</span>
            <span className="text-[#006a66] font-bold">مفعلة ومنشورة (Zero-Trust ABAC)</span>
          </div>
          <div className="p-2.5 bg-[#fbf9f8] rounded-xl flex flex-col gap-0.5">
            <span className="text-[#727787] font-medium">المزامنة الحية (Realtime Snapshot):</span>
            <span className="text-[#006a66] font-bold">مستمعات فورية لكافة السجلات</span>
          </div>
        </div>
      </section>

      {/* Smart Bracelet Card */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#e7eeff] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#87CEEB]/30 flex items-center justify-center text-[#00677c]">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                watch
              </span>
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#111c2c]">السوار الذكي (Pill Pal Band)</h3>
              <p className="text-xs text-[#727787]">مربوط بحمد • رقم المعرف PAL-8842</p>
            </div>
          </div>

          <button
            onClick={onToggleBracelet}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              braceletConnected
                ? 'bg-[#006a66]/15 text-[#006a66]'
                : 'bg-[#ba1a1a]/15 text-[#ba1a1a]'
            }`}
          >
            {braceletConnected ? 'متصل (88%)' : 'غير متصل'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#c2c6d8]/20">
          <button
            onClick={onOpenBracelet}
            className="p-3 bg-[#f0f3ff] hover:bg-[#dee8ff] rounded-xl text-center text-xs font-semibold text-[#0057cd] transition-colors flex flex-col items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            <span>إعدادات واختبار السوار</span>
          </button>
          <div className="p-3 bg-[#fbf9f8] rounded-xl text-center text-xs font-medium text-[#424655] flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-[20px] text-[#006a66]">thermostat</span>
            <span>حرارة الطفل: 36.8° م</span>
          </div>
          <div className="p-3 bg-[#fbf9f8] rounded-xl text-center text-xs font-medium text-[#424655] col-span-2 sm:col-span-1 flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-[20px] text-[#0057cd]">sync</span>
            <span>مزامنة مباشرة</span>
          </div>
        </div>
      </section>

      {/* Children Managed */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#e7eeff] flex flex-col gap-3">
        <h3 className="text-[18px] font-bold text-[#111c2c]">الأطفال المسجلون ({childrenList.length})</h3>
        <div className="space-y-2.5">
          {childrenList.map((child) => (
            <div
              key={child.id}
              className="p-3.5 rounded-xl bg-[#fbf9f8] border border-[#e7eeff] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={child.avatar}
                  alt={child.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-[15px] text-[#111c2c]">{child.name}</h4>
                  <p className="text-xs text-[#727787]">
                    العمر: {child.age} • فصيلة الدم: {child.bloodType} • الوزن: {child.weight}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-white text-[#006a66] rounded-full border border-[#c2c6d8]/20">
                سوار نشط
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Physician Details */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#e7eeff] flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#800020] text-[22px]">
            emergency
          </span>
          <h3 className="text-[18px] font-bold text-[#111c2c]">جهات الاتصال الطبية</h3>
        </div>

        <div className="p-4 rounded-xl bg-[#ffdad6]/20 border border-[#ba1a1a]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h4 className="font-bold text-[15px] text-[#111c2c]">{USER_PARENT.doctorName}</h4>
            <p className="text-xs text-[#727787] mt-0.5">{USER_PARENT.emergencyHospital}</p>
          </div>
          <a
            href={`tel:${USER_PARENT.doctorPhone}`}
            className="px-4 py-1.5 rounded-full bg-[#800020] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#600018]"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>اتصال فوري</span>
          </a>
        </div>
      </section>

      {/* App Preferences & Export */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#e7eeff] flex flex-col gap-3">
        <h3 className="text-[18px] font-bold text-[#111c2c]">التفضيلات والإشعارات</h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-[14px] font-medium text-[#111c2c]">إشعارات التذكير بمواعيد الجرعات</span>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 accent-[#0057cd] rounded"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-[14px] font-medium text-[#111c2c]">اهتزاز وصوت تنبيه السوار الذكي</span>
            <input
              type="checkbox"
              checked={soundAlerts}
              onChange={(e) => setSoundAlerts(e.target.checked)}
              className="w-5 h-5 accent-[#0057cd] rounded"
            />
          </label>

          <div className="pt-2 border-t border-[#c2c6d8]/20 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportReport}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#0057cd] text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#00419e] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>{reportGenerated ? 'جاري تجهيز التقرير...' : 'طباعة تقرير الالتزام للطبيب'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
