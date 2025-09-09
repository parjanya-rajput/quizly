import React, { useState, useEffect } from 'react';
import { Home, RefreshCw, Trophy, Target, Zap, Loader2 } from 'lucide-react';
import { getPerformanceMessage } from '../utils/quizUtils';
// import { generateQuestions } from '../services/geminiService';
// import { QuizSettings } from '../types/Quiz';

interface ResultsPageProps {
  score: number;
  totalQuestions: number;
  // settings: QuizSettings;
  // onPlayAgain: () => void;
  onGoHome: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  score,
  totalQuestions,
  // settings,
  // onPlayAgain,
  onGoHome,
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const maxScore = totalQuestions * 10;
  const percentage = Math.round((score / maxScore) * 100);
  const correctAnswers = score / 10;
  const performanceMessage = getPerformanceMessage(score, totalQuestions);
  // const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Animate score counting up
    const duration = 2000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
        setTimeout(() => setShowStats(true), 500);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  // const handlePlayAgain = async () => {
  //   setIsGenerating(true);
  //   try {
  //     const newQuestions = await generateQuestions(settings);
  //     onPlayAgain(newQuestions);
  //   } catch (err) {
  //     console.error('Failed to regenerate questions:', err);
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  const getPerformanceIcon = () => {
    if (percentage >= 90) return <Trophy className="w-16 h-16" />;
    if (percentage >= 70) return <Target className="w-16 h-16" />;
    return <Zap className="w-16 h-16" />;
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white text-black rounded-full w-24 h-24 flex items-center justify-center">
              {getPerformanceIcon()}
            </div>
          </div>

          <h1 className="text-6xl font-black mb-4 tracking-tight">
            QUIZ COMPLETE
          </h1>
          <p className="text-xl text-gray-300 max-w-md mx-auto">
            {performanceMessage}
          </p>
        </div>

        {/* Score Display */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="mb-8">
            <div className="text-8xl font-black mb-2 animate-bounce">
              {displayScore}
            </div>
            <div className="text-2xl text-gray-400 font-medium">
              / {maxScore} POINTS
            </div>
          </div>

          <div className="text-6xl font-black mb-4">
            {percentage}%
          </div>
          <div className="text-xl text-gray-400 uppercase tracking-wider">
            Accuracy
          </div>
        </div>

        {/* Stats */}
        {showStats && (
          <div className="w-full max-w-2xl mb-16 animate-fade-in">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div className="border-2 border-white p-6" style={{ borderRadius: '0' }}>
                <div className="text-4xl font-black text-white mb-2">
                  {correctAnswers}
                </div>
                <div className="text-sm uppercase tracking-wider text-gray-400">
                  Correct
                </div>
              </div>

              <div className="border-2 border-gray-600 p-6" style={{ borderRadius: '0' }}>
                <div className="text-4xl font-black text-gray-400 mb-2">
                  {totalQuestions - correctAnswers}
                </div>
                <div className="text-sm uppercase tracking-wider text-gray-400">
                  Incorrect
                </div>
              </div>

              <div className="border-2 border-white p-6" style={{ borderRadius: '0' }}>
                <div className="text-4xl font-black text-white mb-2">
                  {totalQuestions}
                </div>
                <div className="text-sm uppercase tracking-wider text-gray-400">
                  Total
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-slide-up">
          <button
            onClick={onGoHome}
            className="flex-1 bg-white text-black py-4 px-8 font-black uppercase tracking-wider transition-all duration-300 hover:bg-gray-200 hover:scale-105 active:scale-95"
            style={{ borderRadius: '0' }}
          >
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="w-5 h-5" />
              <span>Again</span>
            </div>
          </button>

          {/* <button
            onClick={onGoHome}
            className="flex-1 border-2 border-white text-white py-4 px-8 font-black uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 active:scale-95"
            style={{ borderRadius: '0' }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </div>
          </button> */}
        </div>
        {/* <div className="flex space-x-6">
          {/* Play Again */}
        {/* <button
          onClick={handlePlayAgain}
          disabled={isGenerating}
          className={`flex items-center justify-center px-6 py-3 text-lg font-bold uppercase tracking-wider transition-all duration-300 
            ${isGenerating
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95'}`}
          style={{ borderRadius: '0' }}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              Play Again
            </>
          )}
        </button> */}

        {/* Go Home */}
        {/* <button
            onClick={onGoHome}
            className="flex-1 border-2 border-white text-white py-4 px-8 font-black uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 active:scale-95"
            style={{ borderRadius: '0' }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </div>
          </button>
        </div> */}

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 text-gray-500">
            <div className="w-12 h-px bg-gray-500"></div>
            <span className="text-sm uppercase tracking-wider">Challenge completed</span>
            <div className="w-12 h-px bg-gray-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};