// src/ui/loadMore.js
import { DEFAULT_ARTICLES_COUNT } from '../constants/appConstants.js';
import { getCurrentFeedUrl } from '../controllers/feedController.js';
import { fetchFeed } from '../api/rssClient.js';
import { saveArticles } from '../storage/articleRepository.js';
import { renderArticles } from './articlesRenderer.js';

// Variable global (en memoria) para saber cuántos artículos queremos
let articlesCount = DEFAULT_ARTICLES_COUNT;

/**
 * Handler del botón “Cargar más”.
 * Incrementa `articlesCount`, vuelve a descargar el feed y vuelve a pintar.
 */
export async function loadMoreArticles() {
  articlesCount += DEFAULT_ARTICLES_COUNT; // aumentamos en bloques

  const url = getCurrentFeedUrl(); // función del controlador que devuelve la URL activa
  if (!url) return;

  // 1️⃣  Descargamos nuevamente (con el nuevo count)
  const data = await fetchFeed(url, articlesCount);

  // 2️⃣  Guardamos en IndexedDB (sobrescribirá los existentes)
  const { getFeedByUrl } = await import('../storage/feedRepository.js');
  const feed = await getFeedByUrl(url);
  await saveArticles(feed.id, data.items);

  // 3️⃣  Renderizamos los artículos (ya con el nuevo número)
  const container = document.getElementById('articles');
  renderArticles(data.items, container);
}