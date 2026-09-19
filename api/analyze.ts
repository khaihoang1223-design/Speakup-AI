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
      studentResponse,
      dialogueHistory
    } = body || {};

    if (!studentResponse || typeof studentResponse !== "string" || !studentResponse.trim()) {
      return res.status(400).json({ error: "Vui lòng nhập câu trả lời của học sinh." });
    }

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

        const modelName = "gemini-2.5-flash";
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.78
          }
        });

        const responseText = response.text;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          return res.status(200).json(parsed);
        }
      } catch (apiError) {
        console.error("Gemini API error on Vercel, falling back to evaluator:", apiError);
      }
    }

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
