/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, ChildProfile, Medication, DoseLog } from './types';
import {
  INITIAL_CHILDREN,
  INITIAL_MEDICATIONS,
  INITIAL_LOGS,
  WEEK_DAYS_DATA,
} from './data/mockData';
import { useAuth } from './context/AuthContext';
import {
  subscribeChildren,
  subscribeMedications,
  subscribeDoseLogs,
  saveChild,
  saveMedication,
  updateMedicationInventory,
  saveDoseLog,
  updateDoseLogStatus,
  bootstrapInitialUserData,
} from './lib/dbService';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { DesktopSidebar } from './components/DesktopSidebar';
import { HomeScreen } from './components/HomeScreen';
import { MedicationsScreen } from './components/MedicationsScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { AccountScreen } from './components/AccountScreen';
import { EmergencyModal } from './components/EmergencyModal';
import { SmartBraceletModal } from './components/SmartBraceletModal';
import { AddMedicationModal } from './components/AddMedicationModal';
import { AddChildModal } from './components/AddChildModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MedicationDetailModal } from './components/MedicationDetailModal';

export default function App() {
  const { user, loading: authLoading, isGuest, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(INITIAL_CHILDREN);
  const [selectedChildId, setSelectedChildId] = useState<string>('hamad');
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [logs, setLogs] = useState<DoseLog[]>(INITIAL_LOGS);
  const [weekDays, setWeekDays] = useState(WEEK_DAYS_DATA);
  const [missedDoseAlertActive, setMissedDoseAlertActive] = useState<boolean>(true);
  const [braceletConnected, setBraceletConnected] = useState<boolean>(true);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Modals
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isBraceletOpen, setIsBraceletOpen] = useState(false);
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [selectedMedDetail, setSelectedMedDetail] = useState<Medication | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Real-time Firestore synchronization for authenticated user
  useEffect(() => {
    if (!user) {
      setIsCloudSynced(false);
      return;
    }

    let unsubChildren: (() => void) | undefined;
    let unsubMeds: (() => void) | undefined;
    let unsubLogs: (() => void) | undefined;

    const setupFirestore = async () => {
      try {
        // Bootstrap user document and initial demo data if database is empty
        await bootstrapInitialUserData(user.uid, user.email || '', user.displayName);

        // Attach real-time Firestore listeners
        unsubChildren = subscribeChildren(user.uid, (data) => {
          if (data && data.length > 0) {
            setChildrenList(data);
          }
        });

        unsubMeds = subscribeMedications(user.uid, (data) => {
          if (data && data.length > 0) {
            setMedications(data);
          }
        });

        unsubLogs = subscribeDoseLogs(user.uid, (data) => {
          if (data && data.length > 0) {
            setLogs(data);
          }
        });

        setIsCloudSynced(true);
      } catch (err) {
        console.error('Firestore synchronization init error:', err);
      }
    };

    setupFirestore();

    return () => {
      if (unsubChildren) unsubChildren();
      if (unsubMeds) unsubMeds();
      if (unsubLogs) unsubLogs();
    };
  }, [user]);

  // Handle logging dose (updates Firestore or local state)
  const handleLogDose = async (med: Medication) => {
    const updatedInventory = Math.max(0, med.inventoryDoses - 1);

    const newLog: DoseLog = {
      id: `log-${Date.now()}`,
      medicationId: med.id,
      medicationName: `${med.name} (${med.dosage})`,
      doseAmount: med.dosage,
      childId: med.childId,
      childName: med.childId === 'hamad' ? 'حمد' : 'غلا',
      timestamp: new Date().toISOString(),
      timeString: new Date().toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      dateKey: 'today',
      dateLabel: 'اليوم، 17 أكتوبر',
      status: 'taken',
    };

    if (user) {
      try {
        await updateMedicationInventory(user.uid, med.id, updatedInventory);
        await saveDoseLog(user.uid, newLog);
        showToast(`✓ تم تسجيل جرعة ${med.name} وتحديث Firestore السحابي`);
      } catch (err) {
        console.error('Failed to log dose to Firestore:', err);
        showToast('تعذر حفظ الجرعة في السحابة، يرجى التحقق من الاتصال');
      }
    } else {
      setMedications((prev) =>
        prev.map((m) => (m.id === med.id ? { ...m, inventoryDoses: updatedInventory } : m))
      );
      setLogs((prev) => [newLog, ...prev]);
      showToast(`✓ تم تسجيل جرعة ${med.name} بنجاح`);
    }

    setWeekDays((prev) =>
      prev.map((d) => (d.status === 'today' ? { ...d, status: 'today' } : d))
    );
  };

  // Next dose button
  const handleLogNextDose = () => {
    const ibuprofen = medications.find((m) => m.id === 'ibuprofen') || medications[0];
    if (ibuprofen) {
      handleLogDose(ibuprofen);
    }
  };

  // Confirm missed dose
  const handleConfirmMissedDose = () => {
    setMissedDoseAlertActive(false);
    const amox = medications.find((m) => m.id === 'amoxicillin') || medications[0];
    if (amox) {
      handleLogDose(amox);
      showToast('✓ تم تأكيد تناول الجرعة الصباحية (أموكسيسيلين) وإلغاء التنبيه');
    }
  };

  // Skip missed dose
  const handleSkipMissedDose = async () => {
    setMissedDoseAlertActive(false);
    const skipLog: DoseLog = {
      id: `log-skip-${Date.now()}`,
      medicationId: 'amoxicillin',
      medicationName: 'أموكسيسيلين (5 مل)',
      doseAmount: '5 مل',
      childId: 'hamad',
      childName: 'حمد',
      timestamp: new Date().toISOString(),
      timeString: '8:30 صباحاً',
      dateKey: 'today',
      dateLabel: 'اليوم، 17 أكتوبر',
      status: 'skipped',
    };

    if (user) {
      try {
        await saveDoseLog(user.uid, skipLog);
      } catch (err) {
        console.error(err);
      }
    } else {
      setLogs((prev) => [skipLog, ...prev]);
    }
    showToast('تم تخطي الجرعة وتحديث الملاحظات للمتابعة');
  };

  // Toggle log status (taken <-> missed)
  const handleToggleLogStatus = async (logId: string) => {
    const targetLog = logs.find((l) => l.id === logId);
    if (!targetLog) return;
    const nextStatus: 'taken' | 'missed' = targetLog.status === 'taken' ? 'missed' : 'taken';

    if (user) {
      try {
        await updateDoseLogStatus(user.uid, logId, nextStatus);
        showToast(`تم تعديل حالة الجرعة إلى: ${nextStatus === 'taken' ? 'تم التناول' : 'فائتة'}`);
      } catch (err) {
        console.error(err);
      }
    } else {
      setLogs((prev) =>
        prev.map((log) => (log.id === logId ? { ...log, status: nextStatus } : log))
      );
      showToast(`تم تعديل حالة الجرعة إلى: ${nextStatus === 'taken' ? 'تم التناول' : 'فائتة'}`);
    }
  };

  // Add new medication
  const handleAddMedication = async (newMed: Medication) => {
    if (user) {
      try {
        await saveMedication(user.uid, newMed);
        showToast(`تم حفظ دواء ${newMed.name} في Firestore بنجاح`);
      } catch (err) {
        console.error(err);
      }
    } else {
      setMedications((prev) => [newMed, ...prev]);
      showToast(`تمت إضافة دواء ${newMed.name} محلياً`);
    }
  };

  // Add new child
  const handleAddChild = async (newChild: ChildProfile) => {
    if (user) {
      try {
        await saveChild(user.uid, newChild);
        setSelectedChildId(newChild.id);
        showToast(`تم حفظ ملف الطفل ${newChild.name} في Firestore بنجاح`);
      } catch (err) {
        console.error(err);
      }
    } else {
      setChildrenList((prev) => [...prev, newChild]);
      setSelectedChildId(newChild.id);
      showToast(`تمت إضافة ملف الطفل ${newChild.name}`);
    }
  };

  // Toggle med status (active / completed)
  const handleToggleMedStatus = async (medId: string) => {
    const med = medications.find((m) => m.id === medId);
    if (!med) return;
    const nextStatus = med.status === 'completed' ? 'active' : 'completed';
    const updated = {
      ...med,
      status: nextStatus as any,
      completedDate: nextStatus === 'completed' ? 'اليوم' : undefined,
    };

    if (user) {
      try {
        await saveMedication(user.uid, updated);
        showToast('تم تحديث حالة الدواء في السحابة');
      } catch (err) {
        console.error(err);
      }
    } else {
      setMedications((prev) => prev.map((m) => (m.id === medId ? updated : m)));
      showToast('تم تحديث حالة الدواء');
    }
  };

  // Refill medication (+10 doses)
  const handleRefillMedication = async (medId: string) => {
    const med = medications.find((m) => m.id === medId);
    if (!med) return;
    const newCount = med.inventoryDoses + 10;

    if (user) {
      try {
        await updateMedicationInventory(user.uid, medId, newCount);
        showToast('✓ تمت إضافة 10 جرعات للمخزون ومزامنتها مع Firestore');
      } catch (err) {
        console.error(err);
      }
    } else {
      setMedications((prev) =>
        prev.map((m) => (m.id === medId ? { ...m, inventoryDoses: newCount } : m))
      );
      showToast('✓ تمت إضافة 10 جرعات للمخزون');
    }
  };

  // Loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#0057cd] border-t-transparent animate-spin" />
          <p className="text-sm font-semibold text-[#111c2c]">جاري تهيئة Pill Pal والاتصال بالسحابة...</p>
        </div>
      </div>
    );
  }

  // Welcome screen is shown first if not logged in and not in guest mode
  if (!user && !isGuest) {
    return <WelcomeScreen />;
  }

  const nextMedication = medications.find((m) => m.id === 'ibuprofen') || medications[0] || null;
  const lowStockMedication = medications.find((m) => m.inventoryDoses <= 3 && m.status !== 'completed') || null;

  return (
    <div className="min-h-screen bg-[#F5F5DC] text-[#111c2c] flex flex-col font-sans selection:bg-[#0057cd] selection:text-white">
      {/* Top App Bar with live sync indicator */}
      <TopAppBar
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenBracelet={() => setIsBraceletOpen(true)}
        braceletConnected={braceletConnected}
        isCloudSynced={isCloudSynced}
        userEmail={user?.email}
        userPhoto={user?.photoURL}
      />

      {/* Main Canvas Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto lg:pr-76 transition-all">
        {currentTab === 'home' && (
          <HomeScreen
            onLogNextDose={handleLogNextDose}
            onConfirmMissedDose={handleConfirmMissedDose}
            onSkipMissedDose={handleSkipMissedDose}
            missedDoseAlertActive={missedDoseAlertActive}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenBracelet={() => setIsBraceletOpen(true)}
            braceletConnected={braceletConnected}
            nextMedication={nextMedication}
            adherenceRate={98}
            lowStockMedication={lowStockMedication}
            onRefillRequested={(medName) =>
              showToast(`تم إرسال طلب إعادة صرف ${medName} إلى الصيدلية الشريكة بنجاح!`)
            }
          />
        )}

        {currentTab === 'medications' && (
          <MedicationsScreen
            medications={medications}
            onOpenAddModal={() => setIsAddMedicationOpen(true)}
            onSelectMedication={(med) => setSelectedMedDetail(med)}
          />
        )}

        {currentTab === 'history' && (
          <HistoryScreen
            childrenList={childrenList}
            selectedChildId={selectedChildId}
            onSelectChild={(id) => setSelectedChildId(id)}
            onOpenAddChild={() => setIsAddChildOpen(true)}
            logs={logs}
            weekDays={weekDays}
            onToggleLogStatus={handleToggleLogStatus}
          />
        )}

        {currentTab === 'account' && (
          <AccountScreen
            childrenList={childrenList}
            onOpenBracelet={() => setIsBraceletOpen(true)}
            braceletConnected={braceletConnected}
            onToggleBracelet={() => {
              setBraceletConnected((prev) => !prev);
              showToast(!braceletConnected ? 'تم الاتصال بالسوار بنجاح' : 'تم قطع اتصال السوار مؤقتاً');
            }}
            onLogout={async () => {
              await logout();
              showToast('تم تسجيل الخروج بنجاح');
            }}
          />
        )}
      </main>

      {/* Desktop Persistent Sidebar (Matches Image 9) */}
      <DesktopSidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenBracelet={() => setIsBraceletOpen(true)}
        braceletConnected={braceletConnected}
      />

      {/* Mobile Bottom Navigation Bar (Matches Images 1, 7, 9) */}
      <div className="lg:hidden">
        <BottomNavBar
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
        />
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#111c2c] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-fadeIn border border-white/10">
          <span className="material-symbols-outlined text-[#87CEEB] text-[18px]">
            notifications_active
          </span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white mr-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Interactive Modals */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        childrenList={childrenList}
      />

      <SmartBraceletModal
        isOpen={isBraceletOpen}
        onClose={() => setIsBraceletOpen(false)}
        isConnected={braceletConnected}
        onToggleConnection={() => {
          setBraceletConnected((prev) => !prev);
          showToast(!braceletConnected ? 'تم الاتصال بالسوار بنجاح' : 'تم فصل السوار');
        }}
      />

      <AddMedicationModal
        isOpen={isAddMedicationOpen}
        onClose={() => setIsAddMedicationOpen(false)}
        childrenList={childrenList}
        onAddMedication={handleAddMedication}
      />

      <AddChildModal
        isOpen={isAddChildOpen}
        onClose={() => setIsAddChildOpen(false)}
        onAddChild={handleAddChild}
      />

      <MedicationDetailModal
        medication={selectedMedDetail}
        onClose={() => setSelectedMedDetail(null)}
        onLogDose={(med) => handleLogDose(med)}
        onToggleStatus={(medId) => handleToggleMedStatus(medId)}
        onRefill={(medId) => handleRefillMedication(medId)}
      />
    </div>
  );
}
