import { addFeed } from '../controllers/feedController.js';

export function initAddFeedForm() {
  const btn = document.getElementById('load-feed');
  btn.addEventListener('click', addFeed);
}