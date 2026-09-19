export interface Scenario {
  id: string;
  title: string;
  category: string;
  categoryTag: 'friends' | 'team' | 'discussion' | 'apology' | 'refusal' | 'teacher';
  partnerName: string;
  partnerRole: string;
  partnerAvatar: string;
  contextDescription: string;
  initialPrompt: string;
}

export interface CriterionRating {
  name: 'Rõ ràng' | 'Lịch sự' | 'Phù hợp';
  score: 'Cần chú ý' | 'Khá tốt' | 'Rất tốt';
  detail: string;
}

export interface AIFeedback {
  criteria: CriterionRating[];
  strengths: string;
  improvements: string;
  shortSuggestion: string;
  alternativeSuggestion?: string;
  followUpDialogue: string;
}

export interface ChatMessage {
  sender: 'partner' | 'student';
  text: string;
  feedback?: AIFeedback;
  timestamp?: string;
}
