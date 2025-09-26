// src/controllers/articleController.js
/* --------------------------------------------------------------
   Controlador de artículos – carga y muestra los artículos de un
   feed almacenado en IndexedDB.
   -------------------------------------------------------------- */
import { getFeedByUrl } from '../storage/feedRepository.js';
import { getArticles } from '../storage/articleRepository.js';
import { renderArticles } from '../ui/articlesRenderer.js';

/**
 * Carga un feed a partir de su URL, recupera sus artículos y los
 * muestra en la página.
 *
 * @param {string} url  URL del feed RSS que el usuario ha introducido.
 */
export async function loadAndRenderFeed(url) {
  try {
    // 1️⃣ Obtener el registro del feed (contiene su id interno)
    const feed = await getFeedByUrl(url);
    if (!feed) {
      alert('Ese feed no está guardado en la base de datos. Añádelo primero.');
      return;
    }

    // 2️⃣ Obtener los últimos N artículos (N configurable)
    // getArticles devuelve TODOS los artículos; limitamos a 20 aquí:
    const allArticles = await getArticles(feed.id); // o await getArticlesByFeed(feed.id);
    const articles = allArticles.slice(0, 20); // máximo a mostrar

    if (!articles.length) {
      alert('No hay artículos guardados para este feed.');
      return;
    }

    // 3️⃣ Renderizar en el contenedor <section id="articles">
    const container = document.getElementById('articles');
    if (!container) {
      console.error('No se encontró el contenedor #articles en el DOM.');
      return;
    }

    renderArticles(articles, container);
  } catch (err) {
    console.error('Error en loadAndRenderFeed():', err);
    alert('Algo salió mal al cargar los artículos. Revisa la consola.');
  }
}