
// Nome e versão do cache
const CACHE_NAME = "wealthmap-cache-v1";
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
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) {
          console.log("[Service Worker] Deleting old cache:", key);
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim();
});

// Estratégia de busca — Network First para HTML, Cache First para estáticos
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Ignora requisições que não sejam GET
  if (request.method !== "GET") return;

  // Network First para páginas HTML e API
  if (request.destination === 'document' || request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Se for uma resposta válida, armazena em cache
          if (response.ok) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
          }
          return response;
        })
        .catch(() => {
            // Se a rede falhar, tenta obter do cache ou mostra a página offline
            return caches.match(request).then((res) => res || caches.match(OFFLINE_URL))
        })
    );
  } else if (request.destination) { // Cache First para outros assets (css, js, images)
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const cloned = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
            }
            return response;
          })
        );
      })
    );
  }
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
