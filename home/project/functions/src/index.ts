import * as functions from "firebase-functions";
import express from "express";

const app = express();

// Se precisar de CORS para chamadas diretas ao Cloud Function (não App Hosting), descomente:
// import cors from "cors";
// app.use(cors({ origin: true }));

app.use(express.json());

// Removido o endpoint legado /callGemini.
// Toda a lógica de IA agora é tratada pelo Next.js no App Hosting.
// Esta função pode ser usada para outros propósitos de backend no futuro.

app.get("/", (req, res) => {
  res.send("Firebase Functions backend is running.");
});

export const api = functions.https.onRequest(app);
