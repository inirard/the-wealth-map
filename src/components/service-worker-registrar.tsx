
"use client";

import { useEffect } from 'react';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((reg) => {
            console.log("✅ Service Worker registrado:", reg);
          })
          .catch((err) => {
            console.error("❌ Erro ao registrar o Service Worker:", err);
          });
      });
    }
  }, []);

  return null; // This component does not render anything.
}
