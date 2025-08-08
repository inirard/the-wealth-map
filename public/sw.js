
const CACHE_NAME = 'the-wealth-map-cache-v1.1';
const URLS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/images/dashboardimage.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Ativação do Service Worker e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('A apagar cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});


// Interceta os pedidos de rede (fetch)
self.addEventListener('fetch', (event) => {
  // Estratégia: Cache-First, caindo para a rede
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se o recurso estiver no cache, retorna-o
        if (response) {
          return response;
        }

        // Se não, busca na rede
        return fetch(event.request).then(
          (networkResponse) => {
            // Se a resposta da rede for válida, clona-a e guarda-a no cache para uso futuro
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      }).catch(() => {
          // Se tanto o cache quanto a rede falharem (ex: offline e recurso não está em cache)
          // Aqui poderíamos retornar uma página de fallback offline, se tivéssemos uma.
          // Por agora, o navegador irá simplesmente mostrar o erro de rede padrão.
      })
  );
});
