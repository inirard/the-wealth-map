'use client';

import { initializeApp, getApp, getApps } from 'firebase/app';

// Configuração da sua aplicação web no Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBbPGASGp4pjtC54zWJSevwjsKvDuWTlys",
  authDomain: "the-wealth-map.firebaseapp.com",
  projectId: "the-wealth-map",
  storageBucket: "the-wealth-map.appspot.com",
  messagingSenderId: "902521497605",
  appId: "1:902521497605:web:82034a742bf20bce51d46c",
  measurementId: "G-PQYX7YD59E"
};


// Inicializar a Firebase App de forma segura (evita reinicialização)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
