// src/api/rssClient.js
import { DEFAULT_ARTICLES_COUNT } from '../constants/appConstants.js';

const RSS2JSON_ENDPOINT = 'https://api.rss2json.com/v1/api.json';

/**
 * Obtiene el feed completo (título + items) desde rss2json.
 * @param {string} url  URL del RSS original
 * @param {number} count  Nº máximo de items (0 → solo meta)
 * @returns {Promise<Object>}  {feed, items}
 */
export async function fetchFeed(url, count = DEFAULT_ARTICLES_COUNT) {
  const endpoint = `${RSS2JSON_ENDPOINT}?rss_url=${encodeURIComponent(
    url,
  )}&count=${count}`;
  const resp = await fetch(endpoint);
  if (!resp.ok) throw new Error(`RSS fetch error ${resp.status}`);
  const data = await resp.json();
  if (data.status !== 'ok') throw new Error('RSS API returned error');
  return data; // {feed:{title,...}, items:[...] }
}

/**
 * Sólo devuelve el título del feed (útil al guardar).
 */
export async function fetchFeedTitle(url) {
  const data = await fetchFeed(url, 0);
  return data.feed?.title ?? 'Sin título';
}