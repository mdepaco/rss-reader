let articlesCount = 10; // Número de artículos a cargar inicialmente

// Añadir un nuevo feed
function addFeed() {
    const url = document.getElementById("rss-url").value.trim();
    if (!url) return;

    // Validar si la URL es válida
    if (!isValidURL(url)) {
        alert('URL no válida');
        return;
    }

    // Guardar feed y cargar artículos
    saveFeed(url);
    loadRSS(url);
}

// Función para validar la URL
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

// Guardar un feed en localStorage con el nombre del feed
function saveFeed(url) {
    // Usar la API RSS2JSON para obtener el título del feed
    getFeedTitle(url).then(title => {
        const feed = { url, title };

        // Obtener feeds guardados desde localStorage
        const feeds = JSON.parse(localStorage.getItem("feeds")) || [];
        if (!feeds.some(f => f.url === url)) {
            feeds.push(feed);
            localStorage.setItem("feeds", JSON.stringify(feeds));
            displaySavedFeeds(); // Actualizar la lista de feeds guardados
        }
    });
}

// Obtener el título del feed usando la API RSS2JSON
function getFeedTitle(url) {
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.feed && data.feed.title) {
                return data.feed.title; // El título del feed
            }
            return 'Sin título'; // Si no se encuentra el título, usamos 'Sin título'
        })
        .catch(() => 'Sin título'); // Si no se puede obtener el título, usamos 'Sin título'
}

// Cargar y mostrar artículos del feed
function loadRSS(url) {
    // Verificamos si ya tenemos artículos guardados en localStorage
    const storedArticles = JSON.parse(localStorage.getItem(url));
    if (storedArticles && storedArticles.length > 0) {
        displayArticles(storedArticles, url); // Mostrar artículos guardados
    } else {
        fetchArticles(url); // Si no están guardados, los descargamos
    }
}

// Cargar artículos desde la API RSS2JSON
function fetchArticles(url) {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=${articlesCount}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.items) {
                const articles = data.items;
                localStorage.setItem(url, JSON.stringify(articles)); // Guardamos los artículos en localStorage
                displayArticles(articles, url); // Mostrar los artículos cargados
            }
        })
        .catch(error => {
            console.error("Error al cargar el RSS:", error);
        });
}

// Mostrar artículos en la interfaz
function displayArticles(articles, url) {
    const articlesContainer = document.getElementById("articles");
    articlesContainer.innerHTML = ""; // Limpiar artículos previos

    // Mostrar los artículos
    articles.forEach(article => {
        const articleElement = document.createElement("article");
        articleElement.classList.add("article-item");
        articleElement.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <button class="speak">Escuchar</button>
        `;
        articleElement.querySelector(".speak").addEventListener("click", () => speakText(article.description));
        articlesContainer.appendChild(articleElement);
    });

    // Añadir el botón "Cargar más" si hay más artículos disponibles
    if (articles.length >= articlesCount) {
        const loadMoreButton = document.createElement("button");
        loadMoreButton.textContent = "Cargar más";
        loadMoreButton.classList.add("load-more");
        loadMoreButton.addEventListener("click", () => loadMoreArticles(url));
        articlesContainer.appendChild(loadMoreButton);
    }
}

// Cargar más artículos cuando el usuario hace clic en "Cargar más"
function loadMoreArticles(url) {
    articlesCount += 10; // Aumentamos el número de artículos que queremos cargar
    fetchArticles(url); // Cargamos más artículos del mismo feed
}

// Hablar texto usando SpeechSynthesis
function speakText(text) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    const speech = new SpeechSynthesisUtterance(plainText);
    speech.lang = "es-ES";
    speech.rate = 0.9;
    speech.pitch = 1.0;
    speech.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.lang === "es-ES" && voice.name.toLowerCase().includes("google"));
    if (selectedVoice) speech.voice = selectedVoice;

    window.speechSynthesis.speak(speech);
}

// Mostrar los feeds guardados con el nombre de la página
function displaySavedFeeds() {
    const feedsContainer = document.getElementById("saved-feeds");
    feedsContainer.innerHTML = "";

    const feeds = JSON.parse(localStorage.getItem("feeds")) || [];
    feeds.forEach(feed => {
        const feedElement = document.createElement("div");
        feedElement.classList.add("feed-item");

        // Mostrar el nombre del feed y el favicon
        const faviconUrl = getFaviconUrl(feed.url);
        feedElement.innerHTML = `
            <img src="${faviconUrl}" alt="favicon" width="20" height="20">
            <span class="feed-title">${feed.title}</span>
            <button class="delete-feed">Eliminar</button>
        `;
        
        // Evento para eliminar el feed
        feedElement.querySelector(".delete-feed").addEventListener("click", () => deleteFeed(feed.url));

        // Evento para cargar los artículos del feed cuando se haga clic en el nombre del feed
        feedElement.querySelector(".feed-title").addEventListener("click", () => loadRSS(feed.url));

        feedsContainer.appendChild(feedElement);
    });
}

// Obtener el favicon del feed
function getFaviconUrl(url) {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${url}`;
    return faviconUrl;
}

// Eliminar un feed guardado
function deleteFeed(url) {
    const feeds = JSON.parse(localStorage.getItem("feeds")) || [];
    const updatedFeeds = feeds.filter(feed => feed.url !== url);
    localStorage.setItem("feeds", JSON.stringify(updatedFeeds));
    displaySavedFeeds(); // Actualizar la lista de feeds
}

// Cargar los feeds guardados al inicio
window.onload = () => {
    displaySavedFeeds();

    // Añadir un evento al botón para agregar feeds
    const loadFeedButton = document.getElementById("load-feed");
    loadFeedButton.addEventListener("click", addFeed);
};



