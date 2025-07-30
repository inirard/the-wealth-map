'use client';

import { initializeApp, getApp, getApps } from 'firebase/app';

// TODO: Cole a sua configuração do Firebase aqui
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:1234567890abcdef123456"
};

// Inicializar a Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
