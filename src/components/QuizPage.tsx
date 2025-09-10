import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import { QuizSettings, Question } from '../types/Quiz';

interface QuizPageProps {
  settings: QuizSettings;
  questions: Question[];
  onComplete: (score: number, totalQuestions: number) => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({ settings, questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));

  // Get timer duration based on difficulty
  const getTimerDuration = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 30;
      case 'medium': return 45;
      case 'hard': return 60;
      default: return 30;
    }
  };

  useEffect(() => {
    // Reset timer when question changes
    const duration = getTimerDuration(questions[currentQuestionIndex]?.difficulty || 'easy');
    setTimeLeft(duration);
  }, [currentQuestionIndex]);

  useEffect(() => {
    // Timer countdown
    if (timeLeft > 0 && !showFeedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      // Time's up, auto-select no answer and show feedback
      setShowFeedback(true);
    }
  }, [timeLeft, showFeedback]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answerIndex);
      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentQuestionIndex] = answerIndex;
      setUserAnswers(newUserAnswers);
      setShowFeedback(true);

      // Update score if correct
      if (answerIndex === questions[currentQuestionIndex].correct) {
        setScore(score + 10);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz completed
      onComplete(score, questions.length);
    }
  };

  const resetForNextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    handleNext();
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-xl font-medium">Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-px bg-white animate-pulse"></div>
        <div className="absolute top-20 right-10 w-32 h-px bg-white animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-48 h-px bg-white animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="text-2xl font-black tracking-wider">QUIZZLY</div>
            <div className="text-right">
              <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">Topic</div>
              <div className="text-xl font-bold">{settings.topic}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-1 bg-gray-800">
              <div
                className="h-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>Question {currentQuestionIndex + 1}</span>
              <span>{questions.length} Total</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Timer Section */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-800"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    className="text-white transition-all duration-1000 ease-linear"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeLeft / getTimerDuration(currentQuestion.difficulty))}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-black">{timeLeft}</span>
                </div>
              </div>

              <div className="text-center">
                <span>Question {currentQuestionIndex + 1}</span>
                <span>{questions.length} Total</span>
              </div>
            </div>

            {/* Question Section */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-wider">
                    {currentQuestion.difficulty}
                  </div>
                  <div className="px-3 py-1 border border-white text-xs font-bold uppercase tracking-wider">
                    {currentQuestion.topic}
                  </div>
                </div>

                <h2 className="text-3xl font-bold leading-tight mb-8 animate-fade-in">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Answer Options */}
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correct;
                  const showCorrect = showFeedback && isCorrect;
                  const showIncorrect = showFeedback && isSelected && !isCorrect;
                  const showCorrectHighlight = showFeedback && isCorrect && !isSelected;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showFeedback}
                      className={`w-full p-6 text-left font-medium text-lg transition-all duration-300 hover:scale-105 active:scale-95 relative group ${showCorrect
                          ? 'bg-green-100 text-green-900 border-2 border-green-300'
                          : showIncorrect
                            ? 'bg-red-100 text-red-900 border-2 border-red-300'
                            : showCorrectHighlight
                              ? 'bg-green-50 text-green-800 border-2 border-green-200'
                              : isSelected
                                ? 'bg-gray-900 text-white border-2 border-white'
                                : 'bg-transparent text-white border-2 border-gray-600 hover:border-white'
                        }`}
                      style={{ borderRadius: '0' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 border-2 flex items-center justify-center font-black ${showCorrect || showIncorrect || showCorrectHighlight ? 'border-current' : 'border-gray-600 group-hover:border-white'
                            }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option}</span>
                        </div>
                        {showCorrect && <CheckCircle2 className="w-6 h-6" />}
                        {showIncorrect && <X className="w-6 h-6" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              {showFeedback && (
                <button
                  onClick={resetForNextQuestion}
                  className="w-full mt-8 bg-white text-black py-4 px-8 font-black text-xl uppercase tracking-wider transition-all duration-300 hover:bg-gray-200 hover:scale-105 active:scale-95 animate-slide-up"
                  style={{ borderRadius: '0' }}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span>
                      {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                    </span>
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};