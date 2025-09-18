import { fetchFeedTitle } from '../api/rssClient.js';
import { getDb } from './db.js';               // función interna que abre IndexedDB

const FEED_STORE = 'feeds';

/**
 * Guarda un nuevo feed (si no existe) y devuelve su id.
 * @param {string} url URL del RSS
 * @returns {Promise<number>} id del feed guardado
 */
export async function addFeed(url) {
  const title = await fetchFeedTitle(url);
  const db = await getDb();

  // Verificar si ya está guardado
  const existing = await db.getAllFromIndex(FEED_STORE, 'url', IDBKeyRange.only(url));
  if (existing.length > 0) return existing[0].id; // ya estaba

  const feed = { url, title };
  const id = await db.add(FEED_STORE, feed);
  return id;
}

/**
 * Obtiene todos los feeds guardados.
 */
export async function getAllFeeds() {
  const db = await getDb();
  return db.getAll(FEED_STORE);
}

/**
 * Elimina un feed y sus artículos asociados.
 */
export async function deleteFeed(id) {
  const db = await getDb();
  await db.delete(FEED_STORE, id);
  // También borramos los artículos vinculados
  const articleTx = db.transaction('articles', 'readwrite');
  const idx = articleTx.store.index('feedId');
  const cursor = await idx.openCursor(IDBKeyRange.only(id));
  while (cursor) {
    await cursor.delete();
    cursor.continue();
  }
  await articleTx.done;
}