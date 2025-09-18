import { renderSavedFeeds } from '../ui/feedsRenderer.js';
import { initAddFeedForm } from '../ui/addFeedForm.js';

window.addEventListener('DOMContentLoaded', async () => {
  await renderSavedFeeds(document.getElementById('saved-feeds'));
  initAddFeedForm();
});