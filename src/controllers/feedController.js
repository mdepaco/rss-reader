// src/controllers/feedController.js
import { addFeed as storeFeed } from '../storage/feedRepository.js';
import { downloadAndParse } from '../api/rssClient.js';
import { saveArticles } from '../storage/articleRepository.js';
import { renderSavedFeeds } from '../ui/feedsRenderer.js';
import { renderArticles } from '../ui/articlesRenderer.js';

export async function addFeed() {
  const urlInput = document.getElementById('rss-url');
  const url = urlInput.value.trim();
  if (!url) return alert('Introduce una URL');

  try {
    new URL(url); // valida sintaxis
  } catch (_) {
    return alert('URL no válida');
  }

  const btn = document.getElementById('load-feed');
  btn.disabled = true;
  btn.textContent = 'Cargando…';

  try {
    // 1️⃣ Obtener título (para guardarlo)
    const { feed, items } = await downloadAndParse(url);
    const feedId = await storeFeed(url, feed.title || 'Sin título');

    // 2️⃣ Guardar artículos
    await saveArticles(feedId, items);

    // 3️⃣ Actualizar UI
    await renderSavedFeeds(document.getElementById('saved-feeds'));
    renderArticles(items, document.getElementById('articles'));
  } catch (err) {
    console.error(err);
    alert(`Error al procesar el feed: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Añadir feed';
    urlInput.value = '';
  }
}