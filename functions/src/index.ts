import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { Request, Response } from "express";

// Define o segredo
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

export const testGeminiKey = onRequest(
  { secrets: [GEMINI_API_KEY] },
  (req: Request, res: Response) => {
    const key = GEMINI_API_KEY.value();
    if (key) {
      res.send("✅ Chave GEMINI_API_KEY carregada com sucesso!");
    } else {
      res.status(500).send("❌ Chave não encontrada no ambiente.");
    }
  }
);
