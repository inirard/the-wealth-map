// This is a basic service worker file. Its presence is required for PWA installation.
// It can be expanded later to include caching strategies.

self.addEventListener('install', (event) => {
  console.log('Service Worker: Ficheiro instalado com sucesso.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ficheiro ativado com sucesso.');
});

self.addEventListener('fetch', (event) => {
  // We are not adding any fetch logic for now.
  // This just confirms the service worker is active.
});
