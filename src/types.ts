export type ScenarioId = 
  | 'make-friends'
  | 'group-work'
  | 'disagree-politely'
  | 'apologize'
  | 'refuse-politely';

export interface Scenario {
  id: ScenarioId;
  title: string;
  category: string;
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
  followUpDialogue: string;
}
