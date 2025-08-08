
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
});
