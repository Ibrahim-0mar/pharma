import { clsx, type ClassValue } from "clsx";
import { openDB } from "idb";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DB_NAME = "prescriptionsDB";
const STORE_NAME = "prescriptions";

async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
}

interface Prescription {
  id?: number;
  name: string;
  dosage: string;
  frequency: string;
}

export async function addPrescriptionToDB(prescription: Prescription) {
  const db = await initDB();
  await db.put(STORE_NAME, prescription);
}

export async function getPrescriptionsFromDB() {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
}
