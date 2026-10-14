import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreErrors';
import { ChildProfile, Medication, DoseLog } from '../types';
import { INITIAL_CHILDREN, INITIAL_MEDICATIONS, INITIAL_LOGS, USER_PARENT } from '../data/mockData';

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  doctorName?: string;
  doctorPhone?: string;
  emergencyHospital?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- User Profile Services ---

export function subscribeUserProfile(
  userId: string,
  onUpdate: (profile: UserProfileData | null) => void
): () => void {
  const path = `users/${userId}`;
  const userDocRef = doc(db, 'users', userId);

  return onSnapshot(
    userDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as UserProfileData);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveUserProfile(userId: string, data: Partial<UserProfileData>): Promise<void> {
  const path = `users/${userId}`;
  const userDocRef = doc(db, 'users', userId);

  const payload: UserProfileData = {
    id: userId,
    name: data.name || USER_PARENT.name,
    email: data.email || USER_PARENT.email,
    phone: data.phone || USER_PARENT.phone,
    avatar: data.avatar || USER_PARENT.avatar,
    doctorName: data.doctorName || USER_PARENT.doctorName,
    doctorPhone: data.doctorPhone || USER_PARENT.doctorPhone,
    emergencyHospital: data.emergencyHospital || USER_PARENT.emergencyHospital,
    updatedAt: new Date().toISOString(),
    createdAt: data.createdAt || new Date().toISOString(),
  };

  try {
    await setDoc(userDocRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// --- Children Services ---

export function subscribeChildren(
  userId: string,
  onUpdate: (children: ChildProfile[]) => void
): () => void {
  const path = `users/${userId}/children`;
  const childrenCol = collection(db, 'users', userId, 'children');

  return onSnapshot(
    childrenCol,
    (snapshot) => {
      const items: ChildProfile[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as ChildProfile);
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveChild(userId: string, child: ChildProfile): Promise<void> {
  const path = `users/${userId}/children/${child.id}`;
  const childDocRef = doc(db, 'users', userId, 'children', child.id);

  const payload = {
    ...child,
    userId,
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(childDocRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeChild(userId: string, childId: string): Promise<void> {
  const path = `users/${userId}/children/${childId}`;
  const childDocRef = doc(db, 'users', userId, 'children', childId);

  try {
    await deleteDoc(childDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- Medication Services ---

export function subscribeMedications(
  userId: string,
  onUpdate: (medications: Medication[]) => void
): () => void {
  const path = `users/${userId}/medications`;
  const medsCol = collection(db, 'users', userId, 'medications');

  return onSnapshot(
    medsCol,
    (snapshot) => {
      const items: Medication[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as Medication);
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveMedication(userId: string, medication: Medication): Promise<void> {
  const path = `users/${userId}/medications/${medication.id}`;
  const medDocRef = doc(db, 'users', userId, 'medications', medication.id);

  const payload = {
    ...medication,
    userId,
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(medDocRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateMedicationInventory(
  userId: string,
  medicationId: string,
  newInventory: number
): Promise<void> {
  const path = `users/${userId}/medications/${medicationId}`;
  const medDocRef = doc(db, 'users', userId, 'medications', medicationId);

  try {
    await updateDoc(medDocRef, {
      inventoryDoses: Math.max(0, newInventory),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function removeMedication(userId: string, medicationId: string): Promise<void> {
  const path = `users/${userId}/medications/${medicationId}`;
  const medDocRef = doc(db, 'users', userId, 'medications', medicationId);

  try {
    await deleteDoc(medDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- Dose Log Services ---

export function subscribeDoseLogs(
  userId: string,
  onUpdate: (logs: DoseLog[]) => void
): () => void {
  const path = `users/${userId}/doseLogs`;
  const logsCol = collection(db, 'users', userId, 'doseLogs');
  const logsQuery = query(logsCol, orderBy('timestamp', 'desc'));

  return onSnapshot(
    logsQuery,
    (snapshot) => {
      const items: DoseLog[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as DoseLog);
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveDoseLog(userId: string, log: DoseLog): Promise<void> {
  const path = `users/${userId}/doseLogs/${log.id}`;
  const logDocRef = doc(db, 'users', userId, 'doseLogs', log.id);

  const payload = {
    ...log,
    userId,
    createdAt: log.timestamp || new Date().toISOString(),
  };

  try {
    await setDoc(logDocRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateDoseLogStatus(
  userId: string,
  logId: string,
  newStatus: 'taken' | 'missed' | 'skipped'
): Promise<void> {
  const path = `users/${userId}/doseLogs/${logId}`;
  const logDocRef = doc(db, 'users', userId, 'doseLogs', logId);

  try {
    await updateDoc(logDocRef, {
      status: newStatus,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// --- Initial Seed / Bootstrap for New Users ---

export async function bootstrapInitialUserData(userId: string, email: string, displayName?: string | null): Promise<void> {
  const childrenCol = collection(db, 'users', userId, 'children');
  const snapshot = await getDocs(childrenCol);

  // If user already has children registered in Firestore, no need to re-seed
  if (!snapshot.empty) {
    return;
  }

  // 1. Create UserProfile
  await saveUserProfile(userId, {
    id: userId,
    name: displayName || USER_PARENT.name,
    email: email || USER_PARENT.email,
  });

  // 2. Seed initial children
  for (const child of INITIAL_CHILDREN) {
    await saveChild(userId, child);
  }

  // 3. Seed initial medications
  for (const med of INITIAL_MEDICATIONS) {
    await saveMedication(userId, med);
  }

  // 4. Seed initial dose logs
  for (const log of INITIAL_LOGS) {
    await saveDoseLog(userId, log);
  }
}
