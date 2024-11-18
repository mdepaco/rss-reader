document.getElementById("load-feed").addEventListener("click", addFeed);

// Cargar feeds guardados cuando la página se carga
window.onload = loadSavedFeeds;

function addFeed() {
    const url = document.getElementById("rss-url").value;
    if (!url) return;

    // Guarda el feed en localStorage
    saveFeed(url);
    loadRSS(url);
}

function loadRSS(url) {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`)
        .then(response => response.json())
        .then(data => {
            displayArticles(data.items);
        })
        .catch(error => console.error("Error al cargar el RSS:", error));
}

function displayArticles(articles) {
    const articlesContainer = document.getElementById("articles");
    articlesContainer.innerHTML = "";

    articles.forEach(article => {
        const articleElement = document.createElement("article");
        articleElement.innerHTML = `
            <h2>${article.title}</h2>
            <p>${article.description}</p>
            <button class="speak">Escuchar</button>
        `;
        articleElement.querySelector(".speak").addEventListener("click", () => speakText(article.description));
        articlesContainer.appendChild(articleElement);
    });
}

function speakText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "es-ES"; // Ajusta el idioma a español

    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = function() {
            voices = window.speechSynthesis.getVoices();
            selectVoiceAndSpeak(voices, speech);
        };
    } else {
        selectVoiceAndSpeak(voices, speech);
    }
}

function selectVoiceAndSpeak(voices, speech) {
    // Elige la primera voz en español
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].lang.startsWith("es")) {
            speech.voice = voices[i];
            break;
        }
    }
    window.speechSynthesis.speak(speech);
}

// Guardar un feed en localStorage
function saveFeed(url) {
    let feeds = JSON.parse(localStorage.getItem("feeds")) || [];
    if (!feeds.includes(url)) {
        feeds.push(url);
        localStorage.setItem("feeds", JSON.stringify(feeds));
        displaySavedFeeds();
    }
}

// Cargar feeds guardados
function loadSavedFeeds() {
    const feeds = JSON.parse(localStorage.getItem("feeds")) || [];
    feeds.forEach(feed => loadRSS(feed));
    displaySavedFeeds();
}

// Mostrar feeds guardados en la interfaz
function displaySavedFeeds() {
    const feedsContainer = document.getElementById("saved-feeds");
    feedsContainer.innerHTML = "";

    const feeds = JSON.parse(localStorage.getItem("feeds")) || [];
    feeds.forEach(feed => {
        const feedElement = document.createElement("div");
        feedElement.classList.add("feed-item");
        feedElement.innerHTML = `
            <span>${feed}</span>
            <button class="delete-feed">Eliminar</button>
        `;
        feedElement.querySelector(".delete-feed").addEventListener("click", () => deleteFeed(feed));
        feedsContainer.appendChild(feedElement);
    });
}

// Eliminar un feed guardado
function deleteFeed(url) {
    let feeds = JSON.parse(localStorage.getItem("feeds")) || [];
    feeds = feeds.filter(feed => feed !== url);
    localStorage.setItem("feeds", JSON.stringify(feeds));
    displaySavedFeeds();
}

// Actualizar feeds cada 10 minutos (600,000 ms)
setInterval(loadSavedFeeds, 600000);



