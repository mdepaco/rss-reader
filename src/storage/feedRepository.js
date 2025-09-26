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

/**
 * Busca un feed por su URL y devuelve el registro completo
 * (id interno, url, título). Si no lo encuentra devuelve undefined.
 *
 * @param {string} url
 * @returns {Promise<Object|undefined>}
 */
export async function getFeedByUrl(url) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('feeds', 'readonly');
    const idx = tx.objectStore('feeds').index('url');
    const req = idx.get(url);
    req.onsuccess = () => resolve(req.result);   // result puede ser undefined
    req.onerror = e => reject(e.target.error);
  });
}