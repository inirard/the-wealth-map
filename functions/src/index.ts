import * as functions from "firebase-functions";
import express, { Request, Response } from "express";
import cors from "cors";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const client = new SecretManagerServiceClient();

async function getSecret(secretName: string): Promise<string> {
  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
  if (!projectId) throw new Error("Variável de ambiente GCP_PROJECT não definida.");

  const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;

  const [version] = await client.accessSecretVersion({ name });
  const payload = version.payload?.data?.toString();
  if (!payload) throw new Error("Payload do segredo está vazio.");

  return payload;
}

app.post("/callGemini", async (req: Request, res: Response) => {
  try {
    const geminiApiKey = await getSecret("gemini_api_key");

    const genAI = new GoogleGenerativeAI(geminiApiKey);

    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt não fornecido." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ result: text });
  } catch (error: any) {
    console.error("Erro ao chamar Gemini:", error);
    return res.status(500).json({ error: error.message || "Erro interno do servidor." });
  }
});

export const api = functions.https.onRequest(app);
