import { AIFeedback } from '../types';

export function evaluateResponse(
  scenarioTitle: string,
  partnerName: string,
  studentResponse: string
): AIFeedback {
  const text = studentResponse.trim().toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  const hasPoliteWords = /cảm ơn|xin lỗi|bạn|cậu|mình|tớ|nhé|nha|ạ|phiền|vui lòng/i.test(text);
  const isTooShort = wordCount < 4;

  const clearScore = isTooShort ? 'Cần chú ý' : wordCount > 10 ? 'Rất tốt' : 'Khá tốt';
  const politeScore = hasPoliteWords ? 'Rất tốt' : 'Khá tốt';
  const fitScore = wordCount >= 5 ? 'Rất tốt' : 'Khá tốt';

  let strengths = `Em đã thể hiện tinh thần chủ động lắng nghe và phản hồi trực tiếp lời của ${partnerName}.`;
  if (hasPoliteWords) {
    strengths += ' Lời văn có từ ngữ xưng hô thân thiện, tạo thiện cảm tốt với bạn học.';
  }

  let improvements = isTooShort
    ? 'Em có thể diễn đạt thêm 1 chi tiết hoặc lý do nhỏ để câu nói thêm tự nhiên và ấm áp hơn nhé.'
    : 'Em có thể thử kèm theo một câu hỏi ngắn hoặc lời chúc nhẹ nhàng để duy trì sự gắn kết với bạn.';

  let shortSuggestion = `“Chào ${partnerName}, mình rất vui được chia sẻ cùng bạn. Cậu thấy thế này có ổn không?”`;
  let followUpDialogue = `Hay quá, tớ đồng ý với ý kiến của cậu! Giờ tụi mình cùng bắt tay vào làm tiếp nhé?`;

  if (scenarioTitle.includes('Làm quen')) {
    shortSuggestion = `“Chào cậu nha, tớ là học sinh lớp mình nè! Cậu cứ ngồi đây nhé, trường mình có nhiều hoạt động vui lắm.”`;
    followUpDialogue = `Cảm ơn cậu nhiều nhé! May quá có cậu làm quen trước, tớ đỡ thấy bỡ ngỡ hẳn luôn.`;
  } else if (scenarioTitle.includes('nhóm')) {
    shortSuggestion = `“Tớ có ý tưởng này, các cậu nghe thử xem sao nhé: tụi mình có thể làm sơ đồ tư duy để bài thuyết trình sinh động hơn.”`;
    followUpDialogue = `Ý tưởng vẽ sơ đồ tư duy hay đấy! Cậu có thể nói rõ hơn phần hình ảnh minh họa được không?`;
  } else if (scenarioTitle.includes('Góp ý')) {
    shortSuggestion = `“Tớ thấy ý tưởng của cậu rất sáng tạo, nhưng nếu dùng màu đỏ đậm quá thì các bạn phía xa sẽ khó đọc. Hay mình đổi sang nền sáng hơn chút nhé?”`;
    followUpDialogue = `Ừ nhỉ, cậu nói tớ mới để ý đến góc nhìn của người đọc. Vậy mình thử phối màu xanh lá nhạt xem sao!`;
  } else if (scenarioTitle.includes('Xin lỗi')) {
    shortSuggestion = `“Tớ thật sự xin lỗi cậu vì đã làm cong mép sách và trả trễ. Tớ đã vuốt lại bìa cẩn thận rồi, lần sau tớ sẽ chú ý hơn nhiều.”`;
    followUpDialogue = `Không sao đâu, cậu đã nhận lỗi và trả sách là tớ vui rồi. Lần sau cậu cứ giữ cẩn thận chút nhé.`;
  } else if (scenarioTitle.includes('Từ chối')) {
    shortSuggestion = `“Cảm ơn cậu đã rủ tớ nhé! Nhưng chiều nay tớ bận giúp mẹ và ôn bài Toán rồi, tụi mình hẹn nhau vào chiều thứ Bảy được không?”`;
    followUpDialogue = `Tiếc ghê, nhưng cậu cứ lo việc gia đình và học bài đi nhé. Hẹn cậu đúng thứ Bảy tụi mình đi đá bóng!`;
  }

  return {
    criteria: [
      {
        name: 'Rõ ràng',
        score: clearScore,
        detail: isTooShort
          ? 'Câu trả lời còn hơi ngắn, có thể diễn đạt cụ thể thêm một chút.'
          : 'Nội dung diễn đạt rành mạch, bạn nghe sẽ hiểu ngay ý của em.'
      },
      {
        name: 'Lịch sự',
        score: politeScore,
        detail: hasPoliteWords
          ? 'Cách xưng hô và thái độ rất tôn trọng, hòa nhã với bạn học.'
          : 'Có thể bổ sung thêm xưng hô (cậu/tớ/bạn) và từ cảm thán (nhé, nha) để thêm phần ấm áp.'
      },
      {
        name: 'Phù hợp',
        score: fitScore,
        detail: 'Câu trả lời đúng trọng tâm tình huống học đường đang diễn ra.'
      }
    ],
    strengths,
    improvements,
    shortSuggestion,
    followUpDialogue
  };
}
