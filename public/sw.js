<<<<<<< HEAD

const CACHE_NAME = 'wealth-map-cache-v1';
const OFFLINE_URL = 'offline.html'; // Fallback page
const PRECACHE_ASSETS = [
    '/',
    '/offline.html',
    '/icon.svg',
    '/favicon.ico',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/icons/apple-icon-180.png'
];

// Install event: precache the core assets
self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(PRECACHE_ASSETS);
        self.skipWaiting(); // Activate worker immediately
        console.log('Service Worker: Caching core assets complete.');
    })());
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.filter(name => name !== CACHE_NAME)
                      .map(name => caches.delete(name))
        );
        await self.clients.claim(); // Take control of all clients
        console.log('Service Worker: Activated and old caches cleaned.');
    })());
});

// Fetch event: serve from cache, fall back to network, then to offline page
self.addEventListener('fetch', (event) => {
    // Only handle navigation requests (for pages) with the offline fallback logic
    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                // First, try to use the navigation preload response if it's supported
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }

                // Always try the network first for navigation to get the freshest content
                const networkResponse = await fetch(event.request);
                return networkResponse;
            } catch (error) {
                // Network request failed, probably offline
                console.log('Service Worker: Fetch failed; returning offline page.');
                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(OFFLINE_URL);
                return cachedResponse;
            }
        })());
    } else {
        // For non-navigation requests (CSS, JS, images), use a cache-first strategy
        event.respondWith((async () => {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }

            // Not in cache, try network
            try {
                const networkResponse = await fetch(event.request);
                // If the request is successful, clone it and store in cache
                if (networkResponse.ok) {
                    await cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
            } catch (error) {
                // The network failed, but we don't have a generic fallback for assets
                console.log('Service Worker: Asset fetch failed, no fallback available.', error);
                // The browser will handle the error (e.g., show a broken image icon)
            }
        })());
    }
=======
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
>>>>>>> 484140835dea099e59b6c4348aeac0e04b0f73c7
});
