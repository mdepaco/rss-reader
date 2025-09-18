import { speakText } from './speech.js';
import { loadMoreArticles } from './loadMore.js';

export function renderArticles(articles, containerEl) {
  containerEl.innerHTML = ''; // limpiar

  articles.forEach(article => {
    const articleEl = document.createElement('article');
    articleEl.className = 'article-item';
    articleEl.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.description}</p>
      <button class="speak">Escuchar</button>
    `;
    articleEl.querySelector('.speak')
      .addEventListener('click', () => speakText(article.description));
    containerEl.appendChild(articleEl);
  });

  // Botón “Cargar más”
  if (articles.length >= DEFAULT_ARTICLES_COUNT) {
    const btn = document.createElement('button');
    btn.textContent = 'Cargar más';
    btn.className = 'load-more';
    btn.addEventListener('click', () => loadMoreArticles());
    containerEl.appendChild(btn);
  }
}