// Añadir un nuevo feed
function addFeed() {
    const url = document.getElementById("rss-url").value.trim();
    if (!url) return;

    // Validar si la URL es válida
    if (!isValidURL(url)) {
        alert('URL no válida');
        return;
    }

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

        const feeds = JSON.parse(localStorage.getItem("feeds")) || [];
        if (!feeds.some(f => f.url === url)) {
            feeds.push(feed);
            localStorage.setItem("feeds", JSON.stringify(feeds));
            displaySavedFeeds(); // Para actualizar la lista de feeds guardados
        }
    });
}

// Obtener el título del feed usando la API RSS2JSON
function getFeedTitle(url) {
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Asegurarnos de que el título se obtenga de la propiedad 'feed'
            if (data && data.feed && data.feed.title) {
                return data.feed.title; // El título del feed
            }
            return 'Sin título'; // Si no se encuentra el título, usamos un valor predeterminado
        })
        .catch(() => 'Sin título'); // Si no se puede obtener el título, usamos 'Sin título'
}

// Cargar y mostrar artículos del feed
function loadRSS(url) {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Verifica si los datos están llegando correctamente
            displayArticles(data.items);
        })
        .catch(error => {
            console.error("Error al cargar el RSS:", error);
        });
}


// Mostrar artículos en la interfaz
function displayArticles(articles, feedTitle) {
    const articlesContainer = document.getElementById("articles");
    articlesContainer.innerHTML = "";

    // Mostrar el título del feed en la parte superior de los artículos
    const feedTitleElement = document.createElement("h2");
    feedTitleElement.innerText = feedTitle;
    articlesContainer.appendChild(feedTitleElement);

    // Mostrar artículos
    articles.forEach(article => {
        const articleElement = document.createElement("article");
        articleElement.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <button class="speak">Escuchar</button>
        `;
        articleElement.querySelector(".speak").addEventListener("click", () => speakText(article.description));
        articlesContainer.appendChild(articleElement);
    });
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
            <span>${feed.title}</span>
            <button class="delete-feed">Eliminar</button>
        `;
        feedElement.querySelector(".delete-feed").addEventListener("click", () => deleteFeed(feed.url));
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
    displaySavedFeeds();
}


