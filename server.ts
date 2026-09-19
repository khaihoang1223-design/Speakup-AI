import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

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

// Fallback intelligent evaluation if API key is missing or API errors
function generateRuleBasedFeedback(
  scenarioTitle: string,
  partnerName: string,
  studentResponse: string
) {
  const text = studentResponse.trim().toLowerCase();
  const wordCount = text.split(/\s+/).length;

  const hasPoliteWords = /cảm ơn|xin lỗi|bạn|cậu|mình|tớ|nhé|nha|ạ|phiền/i.test(text);
  const isTooShort = wordCount < 4;

  const clearScore = isTooShort ? "Cần chú ý" : wordCount > 10 ? "Rất tốt" : "Khá tốt";
  const politeScore = hasPoliteWords ? "Rất tốt" : "Khá tốt";
  const fitScore = wordCount >= 5 ? "Rất tốt" : "Khá tốt";

  let strengths = `Em đã thể hiện tinh thần chủ động lắng nghe và phản hồi trực tiếp lời của ${partnerName}.`;
  if (hasPoliteWords) {
    strengths += " Lời văn có từ ngữ xưng hô thân thiện, tạo thiện cảm tốt với bạn học.";
  }

  let improvements = isTooShort
    ? "Em có thể diễn đạt thêm 1 chi tiết hoặc lý do nhỏ để câu nói thêm tự nhiên và ấm áp hơn nhé."
    : "Em có thể thử kèm theo một câu hỏi ngắn hoặc lời chúc nhẹ nhàng để duy trì sự gắn kết với bạn.";

  let shortSuggestion = `“Chào ${partnerName}, mình rất vui được chia sẻ cùng bạn. Cậu thấy thế này có ổn không?”`;
  let followUpDialogue = `Hay quá, tớ đồng ý với ý kiến của cậu! Giờ tụi mình cùng bắt tay vào làm tiếp nhé?`;

  if (scenarioTitle.includes("Làm quen")) {
    shortSuggestion = `“Chào cậu nha, tớ là học sinh lớp mình nè! Cậu cứ ngồi đây nhé, trường mình có nhiều hoạt động vui lắm.”`;
    followUpDialogue = `Cảm ơn cậu nhiều nhé! May quá có cậu làm quen trước, tớ đỡ thấy bỡ ngỡ hẳn luôn.`;
  } else if (scenarioTitle.includes("nhóm")) {
    shortSuggestion = `“Tớ có ý tưởng này, các cậu nghe thử xem sao nhé: tụi mình có thể làm sơ đồ tư duy để bài thuyết trình sinh động hơn.”`;
    followUpDialogue = `Ý tưởng vẽ sơ đồ tư duy hay đấy! Cậu có thể nói rõ hơn phần hình ảnh minh họa được không?`;
  } else if (scenarioTitle.includes("Góp ý")) {
    shortSuggestion = `“Tớ thấy ý tưởng của cậu rất sáng tạo, nhưng nếu dùng màu đỏ đậm quá thì các bạn phía xa sẽ khó đọc. Hay mình đổi sang nền sáng hơn chút nhé?”`;
    followUpDialogue = `Ừ nhỉ, cậu nói tớ mới để ý đến góc nhìn của người đọc. Vậy mình thử phối màu xanh lá nhạt xem sao!`;
  } else if (scenarioTitle.includes("Xin lỗi")) {
    shortSuggestion = `“Tớ thật sự xin lỗi cậu vì đã làm cong mép sách và trả trễ. Tớ đã vuốt lại bìa cẩn thận rồi, lần sau tớ sẽ chú ý hơn nhiều.”`;
    followUpDialogue = `Không sao đâu, cậu đã nhận lỗi và trả sách là tớ vui rồi. Lần sau cậu cứ giữ cẩn thận chút nhé.`;
  } else if (scenarioTitle.includes("Từ chối")) {
    shortSuggestion = `“Cảm ơn cậu đã rủ tớ nhé! Nhưng chiều nay tớ bận giúp mẹ và ôn bài Toán rồi, tụi mình hẹn nhau vào chiều thứ Bảy được không?”`;
    followUpDialogue = `Tiếc ghê, nhưng cậu cứ lo việc gia đình và học bài đi nhé. Hẹn cậu đúng thứ Bảy tụi mình đi đá bóng!`;
  }

  return {
    criteria: [
      {
        name: "Rõ ràng",
        score: clearScore,
        detail: isTooShort
          ? "Câu trả lời còn hơi ngắn, có thể diễn đạt cụ thể thêm một chút."
          : "Nội dung diễn đạt rành mạch, bạn nghe sẽ hiểu ngay ý của em."
      },
      {
        name: "Lịch sự",
        score: politeScore,
        detail: hasPoliteWords
          ? "Cách xưng hô và thái độ rất tôn trọng, hòa nhã với bạn học."
          : "Có thể bổ sung thêm xưng hô (cậu/tớ/bạn) và từ cảm thán (nhé, nha) để thêm phần ấm áp."
      },
      {
        name: "Phù hợp",
        score: fitScore,
        detail: "Câu trả lời đúng trọng tâm tình huống học đường đang diễn ra."
      }
    ],
    strengths,
    improvements,
    shortSuggestion,
    followUpDialogue
  };
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
    studentResponse
  } = req.body;

  if (!studentResponse || typeof studentResponse !== "string" || !studentResponse.trim()) {
    return res.status(400).json({ error: "Vui lòng nhập câu trả lời của học sinh." });
  }

  // If Gemini API is available, call gemini-3.8-flash
  const ai = getAiClient();
  if (ai) {
    try {
      const prompt = `
Bạn là chuyên gia sư phạm tâm lý giáo dục giao tiếp thân thiện, ân cần dành riêng cho học sinh Trung học Cơ sở (THCS, độ tuổi 11 - 15 tuổi) tại Việt Nam, mang tên SpeakUp AI.

BỐI CẢNH TÌNH HUỐNG:
- Tình huống: ${scenarioTitle}
- Bạn đối thoại: ${partnerName} (${partnerRole})
- Bối cảnh: ${contextDescription}
- Lời mở đầu của bạn học: "${contextPrompt}"
- CÂU TRẢ LỜI CỦA HỌC SINH: "${studentResponse}"

NGUYÊN TẮC AN TOÀN SƯ PHẠM BẮT BUỘC:
1. Tuyệt đối KHÔNG đánh giá tính cách học sinh.
2. Tuyệt đối KHÔNG dùng các từ dán nhãn tiêu cực như: "giao tiếp kém", "nhút nhát", "thiếu tự tin", "rụt rè", "yếu đuối".
3. CHỈ nhận xét khách quan, chân thành vào câu chữ của câu trả lời trong tình huống hiện tại.
4. Giọng điệu ấm áp, tích cực, truyền cảm hứng, phù hợp văn hóa học đường Việt Nam (xưng hô: em / thầy cô / trợ lý).

HÃY PHÂN TÍCH THEO ĐÚNG 3 TIÊU CHÍ:
1. Rõ ràng: Diễn đạt có rành mạch, đủ ý, dễ hiểu không?
2. Lịch sự: Ngữ khí, cách xưng hô (cậu - tớ, mình - bạn, em - anh/chị), từ ngữ cảm ơn/xin lỗi có tôn trọng bạn không?
3. Phù hợp với tình huống: Có đúng trọng tâm bối cảnh học đường và giải quyết khúc mắc giao tiếp không?

YÊU CẦU TRẢ VỀ ĐÚNG ĐỊNH DẠNG JSON SAU (không dùng markdown code blocks khác):
{
  "criteria": [
    {
      "name": "Rõ ràng",
      "score": "Rất tốt" | "Khá tốt" | "Cần chú ý",
      "detail": "Nhận xét ngắn 1 câu về độ rõ ràng"
    },
    {
      "name": "Lịch sự",
      "score": "Rất tốt" | "Khá tốt" | "Cần chú ý",
      "detail": "Nhận xét ngắn 1 câu về phép lịch sự"
    },
    {
      "name": "Phù hợp",
      "score": "Rất tốt" | "Khá tốt" | "Cần chú ý",
      "detail": "Nhận xét ngắn 1 câu về độ phù hợp tình huống"
    }
  ],
  "strengths": "Điểm em làm tốt: 1-2 câu khen ngợi cụ thể vào câu trả lời của em",
  "improvements": "Điểm em có thể cải thiện: 1-2 câu gợi mở mang tính xây dựng, giúp câu nói hay hơn",
  "shortSuggestion": "Một câu nói mẫu ngắn gọn, tự nhiên đặt trong ngoặc kép để em tham khảo",
  "followUpDialogue": "Câu nói tiếp theo của ${partnerName} để tiếp tục cuộc trò chuyện tự nhiên như người bạn bè cùng lớp"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6
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
  const fallback = generateRuleBasedFeedback(
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
