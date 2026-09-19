import { AIFeedback } from '../types';

export function evaluateResponse(
  scenarioTitle: string,
  partnerName: string,
  studentResponse: string,
  scenarioId?: string
): AIFeedback {
  const text = studentResponse.trim();
  const lowerText = text.toLowerCase();
  const wordCount = lowerText.split(/\s+/).filter(Boolean).length;

  const hasGreeting = /chào|hi|hello|ơi|kìa|ê|cô ơi|thầy ơi/i.test(lowerText);
  const hasPoliteParticles = /ạ|dạ|vâng|cảm ơn|xin lỗi|phiền|vui lòng|nhé|nha|nhen/i.test(lowerText);
  const hasPronouns = /tớ|mình|cậu|bạn|em|cô|thầy|mình|chúng mình|tụi mình/i.test(lowerText);
  const hasQuestion = /[?？]|sao|không|được không|nhỉ|thế nào/i.test(lowerText);
  const hasReason = /vì|tại|bởi vì|do|nên|hôm nay|chiều nay|tối qua|sáng nay/i.test(lowerText);
  const hasAlternative = /hay là|thay vì|thử|đổi sang|hẹn|ngày mai|thứ bảy|tiết sau/i.test(lowerText);

  // Scoring
  let clearScore: 'Rất tốt' | 'Khá tốt' | 'Cần chú ý' = 'Khá tốt';
  let clearDetail = 'Câu trả lời diễn đạt ý tứ tương đối dễ hiểu.';
  if (wordCount < 4) {
    clearScore = 'Cần chú ý';
    clearDetail = 'Câu nói còn hơi ngắn (dưới 4 từ), bạn nghe có thể thấy cộc lốc hoặc chưa rõ lý do.';
  } else if (wordCount >= 10 && (hasReason || hasAlternative || hasQuestion)) {
    clearScore = 'Rất tốt';
    clearDetail = 'Diễn đạt rất rành mạch, có luận điểm rõ ràng và dễ tiếp thu cho người đối thoại.';
  } else if (wordCount >= 5) {
    clearScore = 'Khá tốt';
    clearDetail = 'Ý kiến nêu ra tương đối đầy đủ, truyền tải được thông điệp chính.';
  }

  let politeScore: 'Rất tốt' | 'Khá tốt' | 'Cần chú ý' = 'Khá tốt';
  let politeDetail = 'Cách dùng từ hòa nhã, đúng mực của học sinh.';
  if (hasPoliteParticles && hasPronouns) {
    politeScore = 'Rất tốt';
    politeDetail = 'Ngữ khí rất chân thành, xưng hô lễ phép và ấm áp, tạo thiện cảm lớn.';
  } else if (!hasPronouns && !hasPoliteParticles && wordCount < 6) {
    politeScore = 'Cần chú ý';
    politeDetail = 'Nên bổ sung xưng hô thân mật (cậu - tớ, mình - bạn) hoặc kính ngữ với thầy cô (dạ, thưa cô) để tránh cộc lốc.';
  } else {
    politeScore = 'Khá tốt';
    politeDetail = 'Thái độ tôn trọng người đối thoại, văn minh học đường.';
  }

  let fitScore: 'Rất tốt' | 'Khá tốt' | 'Cần chú ý' = 'Khá tốt';
  let fitDetail = 'Câu trả lời giải quyết được khúc mắc trong tình huống học đường.';
  if (hasAlternative || hasReason || (hasQuestion && wordCount > 7)) {
    fitScore = 'Rất tốt';
    fitDetail = 'Cách phản hồi cực kỳ thông minh: không chỉ trả lời mà còn chủ động đề xuất giải pháp tích cực!';
  }

  // Personalized Strengths
  const strengthPoints: string[] = [];
  if (hasGreeting) strengthPoints.push('chủ động mở lời chào thân thiện');
  if (hasPronouns) strengthPoints.push(`xưng hô chuẩn mực, gắn kết với ${partnerName}`);
  if (hasPoliteParticles) strengthPoints.push('dùng từ ngữ hòa nhã, lễ độ');
  if (hasReason) strengthPoints.push('nêu rõ lý do chính đáng và chân thật');
  if (hasQuestion) strengthPoints.push('biết hỏi thăm ngược lại để duy trì cuộc đối thoại hai chiều');
  if (hasAlternative) strengthPoints.push('có tinh thần xây dựng khi đề xuất giải pháp thay thế hợp tình hợp lý');

  const strengths = strengthPoints.length > 0
    ? `Em đã làm rất tốt khi ${strengthPoints.slice(0, 2).join(' và ')}. Điều này giúp ${partnerName} cảm thấy được tôn trọng và thấu hiểu ngay lập tức.`
    : `Em đã bình tĩnh lắng nghe và phản hồi trực tiếp vào vấn đề mà ${partnerName} vừa đề cập.`;

  // Constructive Improvements
  let improvements = '';
  if (wordCount < 5) {
    improvements = 'Em hãy thử mở rộng câu nói thêm một chút bằng cách thêm lý do hoặc một câu hỏi quan tâm nhé.';
  } else if (!hasPronouns && !partnerName.startsWith('Cô') && !partnerName.startsWith('Thầy')) {
    improvements = `Em có thể thêm xưng hô "cậu ơi", "mình nghĩ là..." để cuộc trò chuyện với ${partnerName} thêm phần gắn kết tự nhiên.`;
  } else if (partnerName.startsWith('Cô') || partnerName.startsWith('Thầy')) {
    improvements = 'Khi nói chuyện với thầy cô, em nhớ thêm kính ngữ "Dạ thưa cô/thầy" ở đầu câu và chữ "ạ" ở cuối câu để thể hiện sự lễ phép nhé.';
  } else if (!hasAlternative && (scenarioTitle.includes('Từ chối') || scenarioTitle.includes('Góp ý'))) {
    improvements = 'Bí quyết từ chối hoặc góp ý khéo léo là kèm theo một giải pháp thay thế (ví dụ: hẹn một dịp khác, hoặc đề xuất màu sắc khác hài hòa hơn).';
  } else {
    improvements = 'Em có thể luyện tập nói câu này với ánh mắt tự tin, nụ cười nhẹ để câu chuyện thêm phần ấm áp nhé!';
  }

  // Context-specific Dynamic Suggestions & Partner Reactions
  let shortSuggestion = `“Chào ${partnerName}, mình hiểu ý bạn rồi. Tụi mình cùng trao đổi thêm để tìm cách tối ưu nhất nhé!”`;
  let alternativeSuggestion = `“Cảm ơn ${partnerName} đã chia sẻ thẳng thắn. Theo mình thì tụi mình có thể làm thế này nè...”`;
  let followUpDialogue = `Hay quá, nghe cậu nói thế tớ thấy an tâm hẳn! Cậu gợi ý cách cụ thể hơn được không?`;

  const titleLower = scenarioTitle.toLowerCase();

  if (titleLower.includes('chuyển trường') || titleLower.includes('làm quen')) {
    shortSuggestion = `“Chào cậu nha, tớ là học sinh lớp mình nè! Cậu cứ ngồi đây nhé, trường mình có nhiều câu lạc bộ vui lắm, lát ra chơi tớ dẫn cậu đi tham quan nha!”`;
    alternativeSuggestion = `“Chào bạn, bàn này còn trống nè bạn ngồi đi! Có gì chưa rõ về thầy cô hay thời khóa biểu cứ hỏi mình nhé.”`;
    followUpDialogue = `Cảm ơn cậu nhiều lắm nha! May quá gặp được cậu tốt bụng, tự nhiên tớ thấy bớt lo lắng bỡ ngỡ hẳn luôn.`;
  } else if (titleLower.includes('bắt chuyện') || titleLower.includes('giải lao')) {
    shortSuggestion = `“A cậu cũng thích bộ truyện này hả! Tớ mê nhân vật chính cực kỳ luôn, cậu đọc đến đoạn cao trào ở tập 3 chưa?”`;
    alternativeSuggestion = `“Chào cậu, tớ cũng đang theo dõi bộ sách này nè. Cậu thấy tập này tác giả viết có cuốn bằng tập trước không?”`;
    followUpDialogue = `Ôi đúng gu luôn rồi! Đoạn đấy kịch tính dã man, tớ đọc mà nín thở luôn á. Cậu thích nhân vật nào nhất trong truyện?`;
  } else if (titleLower.includes('thuyết trình') || titleLower.includes('ý tưởng')) {
    shortSuggestion = `“Tớ có ý tưởng này nhóm nghe thử xem sao nhé: tụi mình có thể làm mini-game đố vui ở đầu bài để thu hút các bạn, sau đó chiếu video ngắn minh họa.”`;
    alternativeSuggestion = `“Theo tớ quan sát, các bạn trong lớp rất thích hình ảnh trực quan. Hay là nhóm mình dùng sơ đồ tư duy kết hợp phỏng vấn ngắn các bạn xem sao?”`;
    followUpDialogue = `Ý tưởng làm mini-game khởi động hay cực kỳ luôn! Cậu có thể đảm nhận phần soạn câu hỏi đố vui này cho nhóm được không?`;
  } else if (titleLower.includes('quá tải') || titleLower.includes('san sẻ')) {
    shortSuggestion = `“Linh ơi cậu đừng lo một mình, để tớ chia phần tìm hình ảnh và định dạng chữ cho cậu nhé. Tụi mình làm chung sẽ xong sớm thôi!”`;
    alternativeSuggestion = `“Cậu nghỉ tay uống nước đi, gửi tài liệu qua tớ làm giúp một nửa slide nội dung cho. Nhóm là phải hỗ trợ nhau mà!”`;
    followUpDialogue = `Trời ơi cảm ơn cậu nhiều lắm, cứu tinh của tớ đây rồi! Vậy tớ gửi cậu phần 2 và 3 nhé, có cậu giúp tớ nhẹ cả người.`;
  } else if (titleLower.includes('deadline') || titleLower.includes('đúng hạn')) {
    shortSuggestion = `“Long ơi, nhóm mình cần nộp bài sớm để ghép và sửa lỗi nữa. Cậu ráng gửi trước 8h tối nay giúp nhóm nhé, nếu kẹt phần nào cứ ới tụi mình hỗ trợ!”`;
    alternativeSuggestion = `“Tớ hiểu cậu đang bận, nhưng bài này tính điểm chung cả nhóm. Cậu hoàn thành nốt phần của mình trong chiều nay để nhóm trưởng kịp nộp nhé.”`;
    followUpDialogue = `Ừ nhỉ, tớ sơ suất quá suýt làm ảnh hưởng tiến độ cả nhóm. Tớ sẽ tranh thủ làm ngay trong chiều nay và gửi trước 8h tối cho cậu xem nhé!`;
  } else if (titleLower.includes('báo tường') || titleLower.includes('góp ý')) {
    shortSuggestion = `“Tớ thấy ý tưởng của cậu rất nổi bật, nhưng nếu nền đỏ thẫm quá thì các bạn phía xa sẽ khó đọc chữ. Hay mình đổi sang nền sáng hơn rồi viền đỏ xem sao?”`;
    alternativeSuggestion = `“Nhiệt huyết của cậu rất tuyệt, nhưng để bài báo đạt điểm cao thì yếu tố dễ đọc cũng quan trọng lắm. Cậu xem thử mẫu phối màu này xem có ưng không?”`;
    followUpDialogue = `Ừ nhỉ, cậu nói tớ mới nhận ra góc nhìn của người đọc phía xa. Phối nền kem viền đỏ như cậu bảo nhìn nghệ thuật mà dịu mắt hơn hẳn đấy!`;
  } else if (titleLower.includes('bảo vệ ý kiến')) {
    shortSuggestion = `“Tớ hiểu lo lắng của Mai về việc bừa bộn. Nhưng nếu tụi mình đặt ra nội quy mượn sách và nhờ ban cán sự phụ trách xếp gọn thì góc sách sẽ rất văn minh đó.”`;
    alternativeSuggestion = `“Cảm ơn góp ý của Mai nha. Tớ nghĩ tụi mình có thể thử nghiệm trong 2 tuần trước, nếu thấy hiệu quả thì duy trì, cậu thấy sao?”`;
    followUpDialogue = `Nghe cậu phân tích có nội quy và làm thử nghiệm trước thì tớ thấy yên tâm hơn rồi. Vậy tụi mình cùng lập bản kế hoạch thử xem sao nhé!`;
  } else if (titleLower.includes('hỏng đồ') || titleLower.includes('xin lỗi')) {
    shortSuggestion = `“Linh ơi tớ thật lòng xin lỗi cậu nhiều nha! Tớ bất cẩn làm cong góc bìa sách cậu quý, tớ đã ép phẳng lại rồi và mua tặng cậu cái đánh dấu sách xinh xắn để chuộc lỗi nè.”`;
    alternativeSuggestion = `“Tớ xin lỗi cậu vì đã trả sách muộn làm cậu lo lắng và còn làm quăn mép nữa. Lần sau mượn đồ tớ sẽ giữ gìn cẩn thận hơn rất nhiều, cậu tha lỗi cho tớ nhé.”`;
    followUpDialogue = `Thấy cậu nhận lỗi chân thành và chu đáo thế này thì tớ không giận nữa đâu! Lần sau cậu nhớ giữ gìn cẩn thận hơn là được rồi nè.`;
  } else if (titleLower.includes('hiểu lầm') || titleLower.includes('tin đồn')) {
    shortSuggestion = `“Trúc ơi không hề có chuyện đó đâu, bài vẽ của cậu phối màu rất đẹp mà! Chắc có bạn nào nghe nhầm rồi truyền đạt sai thôi, cậu đừng buồn tớ nha.”`;
    alternativeSuggestion = `“May quá cậu hỏi thẳng tớ chứ không giữ trong lòng! Tớ luôn quý và ủng hộ cậu, hôm qua tớ còn khen tranh của cậu sáng tạo nữa mà.”`;
    followUpDialogue = `Thế mà tớ cứ tưởng thật làm tớ buồn suốt từ sáng tới giờ. May quá tớ hỏi thẳng cậu, tụi mình vẫn là bạn tốt của nhau nhé!`;
  } else if (titleLower.includes('can ngăn') || titleLower.includes('cãi nhau')) {
    shortSuggestion = `“Huy ơi bình tĩnh lại một chút nào! Trận bóng giao hữu vui là chính, va chạm trên sân là bình thường thôi. Cậu ra ngoài uống ngụm nước hạ hỏa đã nhé!”`;
    alternativeSuggestion = `“Hai cậu dừng tay lại đi! Đều là bạn bè cùng lớp với nhau cả, đánh nhau là bị phạt cả đội đấy. Ngồi xuống nói chuyện rõ ràng xem nào!”`;
    followUpDialogue = `Phù... Cậu nói đúng, lúc nãy tớ nóng giận mất khôn quá. Cảm ơn cậu đã can tớ lại kịp thời không thì to chuyện rồi.`;
  } else if (titleLower.includes('chép bài') || titleLower.includes('trong giờ')) {
    shortSuggestion = `“Suỵt, thầy cô đang nhìn đấy! Đề này cậu nhớ lại công thức bài 2 xem. Giờ kiểm tra không được đưa bài, lát tan học tớ giảng lại cặn kẽ cho cậu nha!”`;
    alternativeSuggestion = `“Đạt ơi thông cảm cho tớ nha, giám thị đang để ý bàn mình dữ lắm, bị bắt là hủy bài cả hai đó. Cố làm những câu dễ trước đi, lát tớ chỉ lại cho!”`;
    followUpDialogue = `Ừ nhỉ... tý nữa là bị thầy ghi vào sổ đầu bài rồi. Lát ra chơi cậu nhớ giảng lại bài này cho tớ nhé, đội ơn cậu!`;
  } else if (titleLower.includes('từ chối') || titleLower.includes('đá bóng')) {
    shortSuggestion = `“Cảm ơn Đức Anh đã rủ tớ nhé! Chiều nay tớ lỡ hẹn giúp mẹ dọn nhà và ôn thi môn Toán rồi. Chiều thứ Bảy tụi mình đi đá bóng bù được không?”`;
    alternativeSuggestion = `“Tiếc ghê hôm nay tớ bận việc gia đình mất rồi! Cậu đi đá bóng vui vẻ nhé, nhớ ghi bàn thay phần tớ, hẹn cậu cuối tuần này nha!”`;
    followUpDialogue = `Tiếc ghê cơ, nhưng thôi cậu cứ lo học và phụ mẹ đi nhé. Chốt kèo chiều thứ Bảy tụi mình ra sân bóng trường nha!`;
  } else if (titleLower.includes('cô') || titleLower.includes('giảng lại')) {
    shortSuggestion = `“Dạ thưa cô, ở tiết học vừa rồi phần biến đổi hằng đẳng thức ở ví dụ 3 em vẫn chưa nắm vững ạ. Cô có thể bớt chút thời gian giải thích lại bước đó cho em được không ạ?”`;
    alternativeSuggestion = `“Dạ em chào cô ạ! Em đang làm bài tập củng cố nhưng bị vướng ở câu 4. Giờ ra chơi em có thể xin phép nhờ cô hướng dẫn thêm được không ạ?”`;
    followUpDialogue = `Rất hoan nghênh tinh thần chủ động hỏi bài của em! Em mang vở lại đây, cô sẽ chỉ cho em mẹo nhận diện hằng đẳng thức này rất dễ nhớ nhé.`;
  } else if (titleLower.includes('thầy') || titleLower.includes('quên')) {
    shortSuggestion = `“Dạ thưa thầy, tối qua em đã hoàn thành toàn bộ bài tập rồi nhưng sáng nay vội quá em để quên vở trên bàn học ạ. Em xin phép chiều nay hoặc đầu giờ mai nộp bù cho thầy chấm được không ạ?”`;
    alternativeSuggestion = `“Dạ em thành thật xin lỗi thầy vì sự sơ suất này ạ! Em đã làm bài đầy đủ, giờ ra chơi em xin phép gọi nhờ người nhà chụp bài gửi qua hoặc mai em nộp sớm cho thầy ạ.”`;
    followUpDialogue = `Thầy ghi nhận sự thành thật và lễ phép của em. Lần này thầy cho em nộp bù vào đầu giờ sáng mai, nhớ chuẩn bị sách vở cẩn thận từ tối hôm trước nhé!`;
  }

  return {
    criteria: [
      {
        name: 'Rõ ràng',
        score: clearScore,
        detail: clearDetail
      },
      {
        name: 'Lịch sự',
        score: politeScore,
        detail: politeDetail
      },
      {
        name: 'Phù hợp',
        score: fitScore,
        detail: fitDetail
      }
    ],
    strengths,
    improvements,
    shortSuggestion,
    alternativeSuggestion,
    followUpDialogue
  };
}
