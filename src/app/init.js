// src/app/init.js
import { addFeed } from '../controllers/feedController.js';
import { loadAndRenderFeed } from '../controllers/articleController.js';
import { renderSavedFeeds } from '../ui/feedsRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('load-feed'); 
  if (!btn) {
    console.error('❌ Botón #load-feed no encontrado');
    return;
  }
  btn.addEventListener('click', addFeed);
  console.log('✅ Listener registrado en #load-feed');

  // Renderizado inicial de feeds guardados
  const savedContainer = document.getElementById('saved-feeds');
  if (savedContainer) renderSavedFeeds(savedContainer);
  else console.warn('⚠️ Contenedor #saved-feeds no encontrado');

  // Carga automática vía query string (opcional)
  const params = new URLSearchParams(window.location.search);
  const feedUrl = params.get('feed');
  if (feedUrl) loadAndRenderFeed(feedUrl);
});