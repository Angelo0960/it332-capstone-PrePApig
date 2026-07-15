// src/services/offlineStorage.js
import { openDB } from 'idb';

const DB_NAME = 'PrepAPigDB';
const DB_VERSION = 1;

export const stores = {
  BATCHES: 'batches',
  FEED_RECORDS: 'feedRecords',
  VACCINATION_RECORDS: 'vaccinationRecords',
  SYNC_QUEUE: 'syncQueue',
};

let dbPromise = null;

export async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(stores.BATCHES)) {
          const batchStore = db.createObjectStore(stores.BATCHES, { keyPath: 'id' });
          batchStore.createIndex('byDate', 'createdAt');
        }
        if (!db.objectStoreNames.contains(stores.FEED_RECORDS)) {
          const feedStore = db.createObjectStore(stores.FEED_RECORDS, { keyPath: 'id' });
          feedStore.createIndex('byBatch', 'batchId');
        }
        if (!db.objectStoreNames.contains(stores.VACCINATION_RECORDS)) {
          const vaxStore = db.createObjectStore(stores.VACCINATION_RECORDS, { keyPath: 'id' });
          vaxStore.createIndex('byBatch', 'batchId');
        }
        if (!db.objectStoreNames.contains(stores.SYNC_QUEUE)) {
          const queueStore = db.createObjectStore(stores.SYNC_QUEUE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          queueStore.createIndex('byStatus', 'status');
        }
      },
    });
  }
  return dbPromise;
}

// Generic CRUD helpers
export async function saveRecord(storeName, record) {
  const db = await getDB();
  return db.put(storeName, record);
}

export async function getAllRecords(storeName) {
  const db = await getDB();
  return db.getAll(storeName);
}

export async function getRecordsByIndex(storeName, indexName, value) {
  const db = await getDB();
  return db.getAllFromIndex(storeName, indexName, value);
}

export async function deleteRecord(storeName, id) {
  const db = await getDB();
  return db.delete(storeName, id);
}

// Sync queue operations
export async function addToSyncQueue(operation) {
  const db = await getDB();
  const queueItem = {
    ...operation,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  return db.add(stores.SYNC_QUEUE, queueItem);
}

export async function getPendingSyncItems() {
  const db = await getDB();
  return db.getAllFromIndex(stores.SYNC_QUEUE, 'byStatus', 'pending');
}

export async function markSyncItemCompleted(id) {
  const db = await getDB();
  const item = await db.get(stores.SYNC_QUEUE, id);
  if (item) {
    item.status = 'completed';
    return db.put(stores.SYNC_QUEUE, item);
  }
}

export async function clearCompletedSyncItems() {
  const db = await getDB();
  const tx = db.transaction(stores.SYNC_QUEUE, 'readwrite');
  const store = tx.objectStore(stores.SYNC_QUEUE);
  const all = await store.getAll();
  for (const item of all) {
    if (item.status === 'completed') {
      await store.delete(item.id);
    }
  }
  await tx.done;
}