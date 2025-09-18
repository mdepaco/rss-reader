import { deleteFeed, getAllFeeds } from '../storage/feedRepository.js';
import { loadRSS } from '../api/rssClient.js';
import { getFaviconUrl } from '../utils/favicon.js';

export async function renderSavedFeeds(containerEl) {
  const feeds = await getAllFeeds();
  containerEl.innerHTML = '';

  feeds.forEach(feed => {
    const div = document.createElement('div');
    div.className = 'feed-item';
    div.innerHTML = `
      <img src="${getFaviconUrl(feed.url)}" alt="favicon" width="20" height="20">
      <span class="feed-title">${feed.title}</span>
      <button class="delete-feed">Eliminar</button>
    `;

    div.querySelector('.delete-feed')
      .addEventListener('click', async () => {
        await deleteFeed(feed.id);
        renderSavedFeeds(containerEl); // refrescar
      });

    div.querySelector('.feed-title')
      .addEventListener('click', () => loadRSS(feed.url));

    containerEl.appendChild(div);
  });
}