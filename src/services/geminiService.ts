import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question } from '../types/Quiz';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface GenerateQuestionsRequest {
  topic: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

export const generateQuestions = async ({
  topic,
  questionCount,
  difficulty
}: GenerateQuestionsRequest): Promise<Question[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const difficultyInstruction = difficulty === 'mixed'
      ? 'Mix of easy, medium, and hard questions'
      : `All questions should be ${difficulty} difficulty`;

    const prompt = `Generate exactly ${questionCount} multiple choice questions about "${topic}".

Requirements:
- ${difficultyInstruction}
- Each question must have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Questions should be diverse and interesting
- Avoid repetitive or overly similar questions

Return the response as a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "topic": "${topic}",
    "difficulty": "easy|medium|hard",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0
  }
]

Important:
- The "correct" field should be the index (0-3) of the correct answer in the options array
- Make sure the JSON is valid and properly formatted
- Do not include any text before or after the JSON array
- Each question should have a unique id starting from 1`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to extract JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini API');
    }

    const questions: Question[] = JSON.parse(jsonMatch[0]);

    // Validate the response structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions generated');
    }

    // Ensure all questions have the required structure
    const validatedQuestions = questions.map((q, index) => ({
      id: q.id || index + 1,
      topic: q.topic || topic,
      difficulty: q.difficulty || (difficulty === 'mixed' ? ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] : difficulty),
      question: q.question || '',
      options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: typeof q.correct === 'number' && q.correct >= 0 && q.correct <= 3 ? q.correct : 0
    }));

    return validatedQuestions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions. Please try again.');
  }
};