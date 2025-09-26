// src/storage/db.js
const DB_NAME = 'rssReaderDB';
const DB_VER  = 1;
let _db;

export async function getDB() {
  if (_db) return _db;
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      const feedStore = db.createObjectStore('feeds', { keyPath: 'id', autoIncrement: true });
      feedStore.createIndex('url', 'url', { unique: true });
      const artStore = db.createObjectStore('articles', { keyPath: 'id', autoIncrement: true });
      artStore.createIndex('feedId', 'feedId', { unique: false });
    };
    req.onsuccess = e => { _db = e.target.result; resolve(_db); };
    req.onerror = e => reject(e.target.error);
  });
}