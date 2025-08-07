
"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/register-sw";

// Este componente lida com a lógica do ciclo de vida da aplicação no lado do cliente,
// como o registo do Service Worker.
export default function AppLifecycle() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null; // Este componente não renderiza nada.
}
