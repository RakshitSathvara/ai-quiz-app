import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let _db: Firestore | null = null;

function getFirebaseAdmin(): Firestore {
  if (_db) return _db;

  if (getApps().length > 0) {
    _db = getFirestore();
    return _db;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  let parsed: Record<string, string> | null = null;

  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON — Firebase writes will fail.");
    }
  }

  try {
    if (parsed && parsed.project_id) {
      initializeApp({ credential: cert(parsed as ServiceAccount) });
    } else {
      initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });
    }
  } catch (e) {
    console.warn("Firebase Admin initialization failed:", e);
  }

  _db = getFirestore();
  return _db;
}

export function getDb(): Firestore {
  return getFirebaseAdmin();
}
