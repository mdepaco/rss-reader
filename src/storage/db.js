
import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@7.1.1?module';

export function openDBInstance() {
  if (!dbPromise) {
    dbPromise = openDB('rssReaderDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('feeds')) {
          const feedStore = db.createObjectStore('feeds', {
            keyPath: 'id',
            autoIncrement: true,
          });
          feedStore.createIndex('url', 'url', { unique: true });
        }
        if (!db.objectStoreNames.contains('articles')) {
          const articleStore = db.createObjectStore('articles', {
            keyPath: 'id',
            autoIncrement: true,
          });
          articleStore.createIndex('feedId', 'feedId', { unique: false });
          articleStore.createIndex('link', 'link', { unique: true });
        }
      },
    });
  }
  return dbPromise;
}

/* Helper para transacciones */
export async function runTransaction(mode, callback) {
  const db = await openDBInstance();
  const tx = db.transaction(['feeds', 'articles'], mode);
  const result = await callback(tx);
  await tx.done;
  return result;
}