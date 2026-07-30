import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client lazily or safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", name: "말하는 레디" });
});

// Chat endpoint for Ready (레디)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, topic } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `
너는 6살 귀여운 래서판다 친구 '레디'야. 어린 아이(4~8세)와 친근하게 대화하고 있어.
- 밝고 따뜻하며 칭찬을 아끼지 않는 다정한 말투를 써.
- 한 번에 1~2문장으로 짧고 직관적으로 대답해줘. (아이들이 이해하기 쉽게!)
- 친근한 반말 말투(~했구나!, ~ 정말 대단해!, ~도 너무 좋아해!)를 사용해.
- 문장 끝에는 아이가 계속 말하고 싶어지도록 가볍고 재미있는 질문이나 맞장구를 쳐줘.
- 항상 귀여운 이모지(🌟, 🍎, 🐱, 🎈, 🎉)를 1~2개 섞어서 대답해줘.
`;

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not set
      const defaultReplies = [
        "우와! 그렇게 말해줘서 너무 고마워! 🌟 레디랑 또 무슨 이야기 할까?",
        "우와 정말?! 너무 재미있다! 🎉 레디한테 더 이야기해줘!",
        "히히, 레디는 네 목소리 듣는 게 제일 좋아! ⭐ 또 말해볼래?",
        "대단해! 정말 또박또박 멋지게 말하는구나! 🎈",
      ];
      const reply = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
      return res.json({ reply });
    }

    const promptText = topic
      ? `아이와의 대화 주제: ${topic}\n아이의 말: "${message || "안녕 레디야!"}"`
      : `아이의 말: "${message || "안녕 레디야!"}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const reply = response.text || "우와 정말?! 레디도 너무 좋아! 🌟 더 말해줄래?";
    res.json({ reply });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    res.json({
      reply: "우와! 정말 대단해! 🌟 레디한테 더 신나는 이야기 들려줘!",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
