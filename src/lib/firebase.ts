import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Initialize Firestore targeting the provisioned database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider for popup login
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Validate Connection to Firestore on boot
export async function testConnection(): Promise<boolean> {
  try {
    // Attempt a lightweight server read to verify network/config
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection check: client is offline or database initializing.');
      return false;
    }
    // Permissions error on 'test/connection' is expected if unauthenticated or locked down
    return true;
  }
}

// Run connection check
testConnection().catch((err) => {
  console.debug('Firestore initial handshake:', err?.message || err);
});
