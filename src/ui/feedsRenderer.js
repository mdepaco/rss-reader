// src/ui/feedsRenderer.js
import { getAllFeeds } from '../storage/feedRepository.js';
import { loadAndRenderFeed } from '../controllers/articleController.js';

export async function renderSavedFeeds(container) {
  const feeds = await getAllFeeds();
  container.innerHTML = '';

  if (!feeds.length) {
    container.innerHTML = '<p class="text-muted">No hay feeds guardados.</p>';
    return;
  }

  feeds.forEach(f => {
    const div = document.createElement('div');
    div.className = 'd-flex justify-content-between align-items-center mb-2';
    div.innerHTML = `
      <span class="flex-grow-1 text-truncate">${f.title}</span>
      <button class="btn btn-sm btn-outline-primary load-feed" data-url="${f.url}">Abrir</button>
    `;
    container.appendChild(div);
  });

  container.addEventListener('click', e => {
    if (e.target.matches('.load-feed')) {
      loadAndRenderFeed(e.target.dataset.url);
    }
  });
}