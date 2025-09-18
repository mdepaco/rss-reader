// src/storage/db.js
/**
 * Abre (o crea) la base de datos "rssReaderDB".
 * Version 1 contiene dos object stores:
 *   - feeds   (keyPath: "id", autoIncrement)
 *   - articles (keyPath: "id", autoIncrement)
 *
 * Cada artículo lleva un campo `feedId` que lo enlaza con su feed.
 */

const DB_NAME = 'rssReaderDB';
const DB_VERSION = 1;
let dbInstance = null;

/**
 * @returns {Promise<IDBDatabase>}
 */
export function openDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Store para los feeds
      if (!db.objectStoreNames.contains('feeds')) {
        const feedStore = db.createObjectStore('feeds', {
          keyPath: 'id',
          autoIncrement: true,
        });
        feedStore.createIndex('url', 'url', { unique: true });
      }

      // Store para los artículos
      if (!db.objectStoreNames.contains('articles')) {
        const articleStore = db.createObjectStore('articles', {
          keyPath: 'id',
          autoIncrement: true,
        });
        articleStore.createIndex('feedId', 'feedId', { unique: false });
        articleStore.createIndex('pubDate', 'pubDate', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => reject(event.target.error);
  });
}

/**
 * Helper genérico para ejecutar una transacción de lectura/escritura.
 * @param {'readonly'|'readwrite'} mode
 * @param {(tx: IDBTransaction) => void} callback
 * @returns {Promise<any>}
 */
export function runTransaction(mode, callback) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['feeds', 'articles'], mode);
      const result = callback(tx);
      tx.oncomplete = () => resolve(result);
      tx.onerror = (e) => reject(e.target.error);
    });
  });
}