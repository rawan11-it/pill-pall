export type TabType = 'home' | 'medications' | 'history' | 'account';

export interface ChildProfile {
  id: string;
  name: string;
  avatar: string;
  age: string;
  weight: string;
  bloodType: string;
  allergies: string;
  braceletId: string;
  braceletBattery: number;
  braceletConnected: boolean;
  temperature: string;
}

export type MedicationStatus = 'active' | 'as_needed' | 'completed';

export interface Medication {
  id: string;
  name: string;
  strength: string;
  category: string;
  dosage: string;
  scheduleDescription: string;
  times: string[];
  instructions: string;
  status: MedicationStatus;
  inventoryDoses: number;
  lowStockThreshold: number;
  childId: string;
  type: 'pill' | 'syrup' | 'drops' | 'injection';
  lastDoseTime?: string;
  nextDoseTime?: string;
  completedDate?: string;
}

export type LogStatus = 'taken' | 'missed' | 'skipped';

export interface DoseLog {
  id: string;
  medicationId: string;
  medicationName: string;
  doseAmount: string;
  childId: string;
  childName: string;
  timestamp: string;
  timeString: string;
  dateKey: string; // e.g. "today", "yesterday", "2026-10-14"
  dateLabel: string; // e.g. "اليوم، 17 أكتوبر"
  status: LogStatus;
  notes?: string;
}

export interface DayAdherence {
  dayName: string;
  dateNumber: number;
  status: 'taken' | 'missed' | 'future' | 'today';
}
