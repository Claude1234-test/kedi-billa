/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const DB_NAME = 'RomanticAnimationAudioDB_v2';
const DB_VERSION = 1;
const STORE_NAME = 'audioStore';
const AUDIO_KEY = 'custom_song';

export interface SavedAudioResponse {
  blob: Blob;
  name: string;
}

interface DBPayload {
  base64: string;
  name: string;
  mimeType: string;
}

/**
 * Open or initialize IndexedDB for storing custom audio files safely in the browser.
 */
function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Converts a raw File/Blob into a Base64 string for safe cloning across sandboxed scopes.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.substring(result.indexOf(',') + 1);
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Reconstructs a Binary Blob from a Base64 string payload.
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

/**
 * Saves an uploaded audio File inside browser storage.
 */
export async function savePermanentAudio(file: File): Promise<void> {
  const base64Data = await fileToBase64(file);
  const payload: DBPayload = {
    base64: base64Data,
    name: file.name,
    mimeType: file.type || 'audio/mp3'
  };

  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(payload, AUDIO_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("IndexedDB failed, writing to localStorage fallback...", err);
    try {
      localStorage.setItem(`fallback_${AUDIO_KEY}`, JSON.stringify(payload));
    } catch (localErr) {
      console.error("Local storage quota exceeded. File might be too large for fallback storage.", localErr);
      throw new Error("File is too large to save permanently in your browser's private canvas. Please try a smaller audio file (under 5MB).");
    }
  }
}

/**
 * Retrieves the permanently saved audio from standard or fallback client storage.
 */
export async function getPermanentAudio(): Promise<SavedAudioResponse | null> {
  let payload: DBPayload | null = null;

  try {
    const db = await getDB();
    payload = await new Promise<DBPayload | null>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(AUDIO_KEY);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.warn("IndexedDB read failed. Attempting localStorage fallback...", error);
  }

  // Fallback check
  if (!payload) {
    try {
      const raw = localStorage.getItem(`fallback_${AUDIO_KEY}`);
      if (raw) {
        payload = JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Failed retrieving from localStorage fallback", e);
    }
  }

  if (payload && payload.base64) {
    try {
      const blob = base64ToBlob(payload.base64, payload.mimeType);
      return {
        blob,
        name: payload.name
      };
    } catch (err) {
      console.error("Failed to reconstruct blob from retrieved storage payload", err);
    }
  }

  return null;
}
