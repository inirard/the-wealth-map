
// src/lib/register-sw.ts
export async function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                console.log("Novo conteúdo disponível; por favor, recarregue a página.");
              } else {
                console.log("Conteúdo em cache para uso offline.");
              }
            }
          };
        }
      };

      console.log("✅ Service Worker registrado:", registration);
    } catch (error) {
      console.error("❌ Falha ao registrar Service Worker:", error);
    }
  }
}
