import { addFeed as storeFeed } from '../storage/feedRepository.js';
import { fetchFeed } from '../api/rssClient.js';
import { saveArticles } from '../storage/articleRepository.js';
import { renderArticles } from '../ui/articlesRenderer.js';
import { renderSavedFeeds } from '../ui/feedsRenderer.js';

export async function addFeed() {
  const urlInput = document.getElementById('rss-url');
  const url = urlInput.value.trim();
  if (!url) return;

  try {
    new URL(url); // valida
  } catch (_) {
    alert('URL no válida');
    return;
  }

  const feedId = await storeFeed(url);          // guarda feed + título
  await loadAndRenderFeed(url);                // descarga y muestra
  await renderSavedFeeds(document.getElementById('saved-feeds'));
}

/**
 * Descarga los artículos de un feed y los muestra.
 */
export async function loadAndRenderFeed(url) {
  const data = await fetchFeed(url);            // {feed, items}
  const db = await getDb();
  const feedRecord = await db.getFromIndex('feeds', 'url', IDBKeyRange.only(url));
  await saveArticles(feedRecord.id, data.items);
  const container = document.getElementById('articles');
  renderArticles(data.items, container);
}