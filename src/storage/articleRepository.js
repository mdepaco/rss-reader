// src/storage/articleRepository.js
import { getDB } from './db.js';

export async function saveArticles(feedId, items) {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('articles', 'readwrite');
    const store = tx.objectStore('articles');
    items.forEach(it => store.put({ feedId, ...it }));
    tx.oncomplete = () => res();
    tx.onerror = e => rej(e.target.error);
  });
}

export async function getArticlesByFeed(feedId) {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('articles', 'readonly');
    const idx = tx.objectStore('articles').index('feedId');
    const req = idx.getAll(IDBKeyRange.only(feedId));
    req.onsuccess = () => res(req.result);
    req.onerror = e => rej(e.target.error);
  });
}