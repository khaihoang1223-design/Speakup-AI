import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { evaluateResponse } from "./src/data/evaluator";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Communication evaluation endpoint
app.post("/api/analyze", async (req, res) => {
  const {
    scenarioTitle,
    partnerName,
    partnerRole,
    contextDescription,
    contextPrompt,
    studentResponse,
    dialogueHistory
  } = req.body;

  if (!studentResponse || typeof studentResponse !== "string" || !studentResponse.trim()) {
    return res.status(400).json({ error: "Vui lòng nhập câu trả lời của học sinh." });
  }

  // If Gemini API is available, call Gemini
  const ai = getAiClient();
  if (ai) {
    try {
      const historyContext = Array.isArray(dialogueHistory) && dialogueHistory.length > 0
        ? `\nLỊCH SỬ ĐỐI THOẠI TRƯỚC ĐÓ:\n${dialogueHistory.map((m: any) => `- ${m.sender === 'student' ? 'Học sinh' : partnerName}: "${m.text}"`).join('\n')}`
        : '';

      const prompt = `
Bạn là Trợ lý Sư phạm Giao tiếp Học đường SpeakUp AI, đồng hành cùng học sinh THCS (11-15 tuổi) tại Việt Nam rèn luyện kỹ năng giao tiếp tình huống thực tế.

BỐI CẢNH TÌNH HUỐNG:
- Tên tình huống: ${scenarioTitle}
- Nhân vật đối thoại: ${partnerName} (${partnerRole})
- Hoàn cảnh diễn ra: ${contextDescription}
- Lời nói mở đầu / gần nhất của đối phương: "${contextPrompt}"${historyContext}
- CÂU TRẢ LỜI CỦA HỌC SINH: "${studentResponse}"

YÊU CẦU ĐẶC BIỆT ĐỂ TRÁNH RẬP KHUÔN:
1. TUYỆT ĐỐI TRÁNH NHẬN XÉT CÔNG THỨC MÁY MÓC (ví dụ không dùng các câu rập khuôn như: "Em đã lắng nghe tốt", "Câu trả lời của em đã thể hiện sự tôn trọng..."). Hãy chỉ ra chính xác từ ngữ nào, ngữ điệu nào hoặc ý tưởng nào trong câu trả lời của học sinh đã tạo nên hiệu quả giao tiếp.
2. TUYỆT ĐỐI KHÔNG DÁN NHÃN TIÊU CỰC VỀ TÍNH CÁCH (không nói: "thiếu tự tin", "kém giao tiếp", "nhút nhát"). Hãy hướng dẫn học sinh bằng tinh thần khích lệ, phân tích hành vi ngôn ngữ một cách khách quan, ấm áp và thú vị.
3. ĐỐI THOẠI TIẾP THEO PHẢI CỰC KỲ TỰ NHIÊN: Nhân vật ${partnerName} phải phản ứng trực tiếp với điều học sinh vừa nói, bộc lộ cảm xúc chân thật của lứa tuổi học trò (hoặc tác phong sư phạm ân cần nếu là Thầy/Cô), mở ra hướng đi tiếp theo cho câu chuyện như ngoài đời thật.
4. ĐƯA RA 2 CÁCH NÓI GỢI Ý ĐA DẠNG:
   - Cách 1 (shortSuggestion): Tự nhiên, gần gũi, đời thường, dí dỏm.
   - Cách 2 (alternativeSuggestion): Chững chạc, lịch thiệp, sâu sắc và tự tin.

HÃY ĐÁNH GIÁ 3 TIÊU CHÍ VÀ TRẢ VỀ ĐÚNG ĐỊNH DẠNG JSON SAU (không dùng markdown code blocks khác):
{
  "criteria": [
    {
      "name": "Rõ ràng",
      "score": "Rất tốt" | "Khá tốt" | "Cần chú ý",
      "detail": "Nhận xét cụ thể 1 câu dựa trên từ ngữ thực tế của học sinh"
    },
    {
      "name": "Lịch sự",
      "score": "Rất tốt" | "Khá tốt" | "Cần chú ý",
      "detail": "Nhận xét cụ thể 1 câu về cách xưng hô, thái độ và sắc thái biểu cảm"
    },
    {
      "name": "Phù hợp",
      "score": "Rất tốt" | "Khá tốt" | "Cần chú ý",
      "detail": "Nhận xét cụ thể 1 câu về độ trúng đích và sự khéo léo trong bối cảnh học đường"
    }
  ],
  "strengths": "1-2 câu khen ngợi cụ thể, nêu bật điểm sáng độc đáo nhất trong cách diễn đạt của học sinh",
  "improvements": "1-2 câu gợi mở chân thành, mách nhỏ mẹo giao tiếp để lần sau nói hay hơn nữa",
  "shortSuggestion": "Mẫu câu nói gợi ý 1 (thân mật, tự nhiên) đặt trong ngoặc kép",
  "alternativeSuggestion": "Mẫu câu nói gợi ý 2 (lịch thiệp, tự tin, sâu sắc) đặt trong ngoặc kép",
  "followUpDialogue": "Phản ứng và câu nói tiếp theo đầy cảm xúc của ${partnerName} để tiếp tục câu chuyện"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.78
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      }
    } catch (apiError) {
      console.error("Gemini API call failed, using intelligent fallback:", apiError);
    }
  }

  // Fallback if no API key or call failed
  const fallback = evaluateResponse(
    scenarioTitle || "Tình huống giao tiếp",
    partnerName || "bạn",
    studentResponse
  );
  return res.json(fallback);
});

// Setup Vite middleware in dev or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SpeakUp AI server running on http://localhost:${PORT}`);
  });
}

startServer();
