import { addFeed } from '../controllers/feedController.js';
import { loadAndRenderFeed } from '../controllers/articleController.js';

window.addEventListener('DOMContentLoaded', async () => {
  await renderSavedFeeds(document.getElementById('saved-feeds'));
  initAddFeedForm();
});