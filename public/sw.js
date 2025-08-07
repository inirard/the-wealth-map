// Nome e versão do cache
const CACHE_NAME = "wealth-map-cache-v1";
const OFFLINE_URL = "/offline.html";

// Arquivos essenciais para cache na instalação
const PRECACHE_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png"
];

// Instalação e pré-cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Precaching assets");
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Estratégia de busca — Network First para HTML, Cache First para estáticos
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Ignora requisições que não sejam GET
  if (request.method !== "GET") return;

  // Network First para páginas HTML
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clona a resposta para colocar no cache
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => 
            // Se a rede falhar, tenta buscar do cache
            caches.match(request).then((cachedResponse) => {
                // Se estiver no cache, retorna. Senão, retorna a página offline.
                return cachedResponse || caches.match(OFFLINE_URL);
            })
        )
    );
    return;
  } 
  
  // Cache First para todos os outros assets (CSS, JS, imagens)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Se estiver no cache, retorna a resposta do cache
      if (cachedResponse) {
        return cachedResponse;
      }
      // Senão, busca na rede, coloca no cache e retorna
      return fetch(request).then((networkResponse) => {
        const clonedResponse = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clonedResponse);
        });
        return networkResponse;
      });
    })
  );
});


// Placeholder para futuras notificações push
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Nova mensagem", {
      body: data.body || "Você tem uma nova atualização.",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png"
    })
  );
});
