import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { QuizPage } from './components/QuizPage';
import { ResultsPage } from './components/ResultsPage';
import { QuizSettings, Question } from './types/Quiz';

type AppState = 'home' | 'quiz' | 'results';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [quizResults, setQuizResults] = useState<{ score: number; totalQuestions: number } | null>(null);

  const handleStartQuiz = (settings: QuizSettings, questions: Question[]) => {
    setQuizSettings(settings);
    setGeneratedQuestions(questions);
    setCurrentState('quiz');
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    setQuizResults({ score, totalQuestions });
    setCurrentState('results');
  };

  const handlePlayAgain = () => {
    setCurrentState('quiz');
  };

  const handleGoHome = () => {
    setCurrentState('home');
    setQuizSettings(null);
    setGeneratedQuestions([]);
    setQuizResults(null);
  };

  return (
    <div className="relative">
      {currentState === 'home' && (
        <HomePage onStartQuiz={handleStartQuiz} />
      )}

      {currentState === 'quiz' && quizSettings && (
        <QuizPage
          settings={quizSettings}
          questions={generatedQuestions}
          onComplete={handleQuizComplete}
        />
      )}

      {currentState === 'results' && quizResults && (
        <ResultsPage
          score={quizResults.score}
          totalQuestions={quizResults.totalQuestions}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
}

export default App;