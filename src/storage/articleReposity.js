import { getDb } from './db.js';
const ARTICLE_STORE = 'articles';

/**
 * Guarda un lote de artículos asociados a un feed.
 * @param {number} feedId Id del feed en IndexedDB
 * @param {Array<Object>} articles Lista de objetos article
 */
export async function saveArticles(feedId, articles) {
  const db = await getDb();
  const tx = db.transaction(ARTICLE_STORE, 'readwrite');
  for (const art of articles) {
    await tx.store.add({ ...art, feedId });
  }
  await tx.done;
}

/**
 * Recupera los artículos de un feed (ordenados por fecha descendente).
 */
export async function getArticlesByFeed(feedId) {
  const db = await getDb();
  const idx = db.transaction(ARTICLE_STORE).store.index('feedId');
  return idx.getAll(IDBKeyRange.only(feedId));
}