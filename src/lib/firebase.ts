// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDFTYgevul6NNNjdMsSwFslHp5Evz2cTs",
  authDomain: "the-wealth-map.firebaseapp.com",
  projectId: "the-wealth-map",
  storageBucket: "the-wealth-map.appspot.com",
  messagingSenderId: "902521497605",
  appId: "1:902521497605:web:82034a742bf20bce51d46c",
  measurementId: "G-PQYX7YD59E"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
