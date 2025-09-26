// src/ui/articlesRenderer.js
export function renderArticles(items, container) {
  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card mb-3';
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${item.title}</h5>
        <p class="card-text text-muted">${new Date(item.pubDate).toLocaleString()}</p>
        <p class="card-text">${item.snippet || ''}</p>
        <button class="btn btn-outline-primary play-btn" data-text="${escapeAttr(item.content || item.snippet)}">
          🎤 Escuchar
        </button>
        <a href="${item.link}" target="_blank" class="btn btn-outline-secondary ms-2">Ver</a>
      </div>
    `;
    container.appendChild(card);
  });

  // Delegación de eventos para TTS
  container.addEventListener('click', e => {
    if (e.target.matches('.play-btn')) {
      const txt = e.target.dataset.text;
      if (!txt) return alert('No hay contenido para leer.');

      // Cancelar cualquier reproducción previa
      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(txt);
      utter.lang = 'es-ES';
      utter.onend = () => (e.target.disabled = false);
      e.target.disabled = true;
      window.speechSynthesis.speak(utter);
    }
  });
}

/** Escape seguro para atributos HTML */
function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}