import { Question, QuizSettings } from '../types/Quiz';
import questionsData from '../data/questions.json';

export const getFilteredQuestions = (settings: QuizSettings): Question[] => {
  let filtered = questionsData as Question[];

  // Filter by custom topic (case-insensitive partial matching)
  if (settings.topic && settings.topic.toLowerCase() !== 'mixed') {
    const topicLower = settings.topic.toLowerCase();
    filtered = filtered.filter(q => 
      q.topic.toLowerCase().includes(topicLower) ||
      q.question.toLowerCase().includes(topicLower)
    );
  }

  // Filter by difficulty
  if (settings.difficulty !== 'mixed') {
    filtered = filtered.filter(q => q.difficulty === settings.difficulty);
  }

  // If no questions match the custom topic, return a random selection
  if (filtered.length === 0) {
    filtered = questionsData as Question[];
  }

  // Shuffle and limit
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(settings.questionCount, shuffled.length));
};

export const calculateScore = (userAnswers: (number | null)[], questions: Question[]): number => {
  return userAnswers.reduce((score, answer, index) => {
    if (answer === questions[index]?.correct) {
      return score + 10; // 10 points per correct answer
    }
    return score;
  }, 0);
};

export const getPerformanceMessage = (score: number, totalQuestions: number): string => {
  const percentage = (score / (totalQuestions * 10)) * 100;
  
  if (percentage >= 90) return "EXCEPTIONAL PERFORMANCE";
  if (percentage >= 80) return "OUTSTANDING KNOWLEDGE";
  if (percentage >= 70) return "SOLID UNDERSTANDING";
  if (percentage >= 60) return "GOOD FOUNDATION";
  if (percentage >= 50) return "ROOM FOR GROWTH";
  return "KEEP PUSHING FORWARD";
};

export const getAvailableTopics = (): string[] => {
  const topics = new Set<string>();
  questionsData.forEach(q => topics.add(q.topic));
  return Array.from(topics).sort();
};