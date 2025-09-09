export interface Question {
  id: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correct: number;
}

export interface QuizSettings {
  topic: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  timeLeft: number;
  isActive: boolean;
  isCompleted: boolean;
  userAnswers: (number | null)[];
}

export type Theme = 'light' | 'dark';