// src/app/init.js
import { addFeed } from '../controllers/feedController.js';
import { renderSavedFeeds } from '../ui/feedsRenderer.js';
import { resetApp } from '../utils/resetApp.js';   // ← IMPORTANTE

document.addEventListener('DOMContentLoaded', () => {
  // --- Botón de añadir feed -------------------------------------------------
  const btnAdd = document.getElementById('load-feed');
  if (btnAdd) btnAdd.addEventListener('click', addFeed);

  // --- Renderizado inicial de feeds guardados --------------------------------
  const savedContainer = document.getElementById('saved-feeds');
  if (savedContainer) renderSavedFeeds(savedContainer);

  // --- Botón de “Restablecer datos” ----------------------------------------
  const btnReset = document.getElementById('reset-button');
  if (btnReset) btnReset.addEventListener('click', resetApp);
});