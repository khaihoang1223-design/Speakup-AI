import { GoogleGenAI } from "@google/genai";
import { evaluateResponse } from "../src/data/evaluator";

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export default async function handler(req: any, res: any) {
  // Support CORS for flexibility
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        // keep as is
      }
    }

    const {
      scenarioTitle,
      partnerName,
      partnerRole,
      contextDescription,
      contextPrompt,
      studentResponse
    } = body || {};

    if (!studentResponse || typeof studentResponse !== "string" || !studentResponse.trim()) {
      return res.status(400).json({ error: "Vui lòng nhập câu trả lời của học sinh." });
    }

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

        const modelName = "gemini-2.5-flash";
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.6
          }
        });

        const responseText = response.text;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          return res.status(200).json(parsed);
        }
      } catch (apiError) {
        console.error("Gemini API call on Vercel error, fallback to rule engine:", apiError);
      }
    }

    // Fallback if key is not yet added in Vercel settings or API limits
    const fallbackData = evaluateResponse(
      scenarioTitle || "Giao tiếp học đường",
      partnerName || "Bạn học",
      studentResponse
    );
    return res.status(200).json(fallbackData);
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ error: "Lỗi xử lý yêu cầu phân tích." });
  }
}
