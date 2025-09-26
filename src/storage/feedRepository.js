// src/storage/feedRepository.js
import { getDB } from './db.js';

export async function addFeed(url, title) {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('feeds', 'readwrite');
    const store = tx.objectStore('feeds');
    const req = store.add({ url, title });
    req.onsuccess = () => res(req.result);
    req.onerror = e => rej(e.target.error);
  });
}

export async function getAllFeeds() {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('feeds', 'readonly');
    const store = tx.objectStore('feeds');
    const req = store.getAll();
    req.onsuccess = () => res(req.result);
    req.onerror = e => rej(e.target.error);
  });
}