import React, { useState } from 'react';
import { Play, Brain, Zap, Loader2 } from 'lucide-react';
import { QuizSettings } from '../types/Quiz';
import { generateQuestions } from '../services/geminiService';

interface HomePageProps {
  onStartQuiz: (settings: QuizSettings, questions: any[]) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartQuiz }) => {
  const [settings, setSettings] = useState<QuizSettings>({
    topic: '',
    questionCount: 10,
    difficulty: 'mixed',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = async () => {
    if (!settings.topic.trim()) {
      alert('Please enter a topic for your quiz!');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const questions = await generateQuestions({
        topic: settings.topic.trim(),
        questionCount: settings.questionCount,
        difficulty: settings.difficulty
      });

      onStartQuiz({
        ...settings,
        topic: settings.topic.trim(),
      }, questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 border border-white rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-white rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white text-black rounded-full w-24 h-24 flex items-center justify-center">
              <Brain className="w-12 h-12" />
            </div>
          </div>

          <h1 className="text-7xl font-black mb-4 tracking-tight">
            QUIZZLY
          </h1>
          <div className="flex items-center justify-center space-x-2 text-xl text-gray-300">
            <Zap className="w-6 h-6" />
            <span>Instant Knowledge Testing</span>
            <Zap className="w-6 h-6" />
          </div>
        </div>

        {/* Quiz Setup */}
        <div className="w-full max-w-lg space-y-8 animate-slide-up">
          {/* Topic Input */}
          <div className="relative">
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
              Quiz Topic
            </label>
            <input
              type="text"
              value={settings.topic}
              onChange={(e) => setSettings({ ...settings, topic: e.target.value })}
              placeholder="Enter any topic"
              className="w-full p-6 bg-transparent border-2 border-white text-white text-xl font-medium placeholder-gray-500 focus:outline-none focus:border-gray-300 transition-all duration-300 hover:border-gray-300"
              style={{ borderRadius: '0' }}
            />
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-focus-within:w-full"></div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Question count */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
                Questions
              </label>
              <div className="relative w-full">
                <select
                  value={settings.questionCount}
                  onChange={(e) =>
                    setSettings({ ...settings, questionCount: parseInt(e.target.value) })
                  }
                  className="w-full p-4 pr-10 bg-black border-2 border-white text-white font-medium focus:outline-none focus:border-gray-300 transition-all duration-300 hover:border-gray-300 appearance-none"
                  style={{ borderRadius: '0' }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
                Difficulty
              </label>
              <div className="relative w-full">
                <select
                  value={settings.difficulty}
                  onChange={(e) =>
                    setSettings({ ...settings, difficulty: e.target.value as any })
                  }
                  className="w-full p-4 pr-10 bg-black border-2 border-white text-white font-medium focus:outline-none focus:border-gray-300 transition-all duration-300 hover:border-gray-300 appearance-none"
                  style={{ borderRadius: '0' }}
                >
                  <option value="mixed">Mixed</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>


          {/* Start Button */}
          <button
            onClick={handleStartQuiz}
            disabled={isGenerating}
            className={`w-full py-6 px-8 font-black text-xl uppercase tracking-wider transition-all duration-300 group ${isGenerating
              ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
              : 'bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95'
              }`}
            style={{ borderRadius: '0' }}
          >
            <div className="flex items-center justify-center space-x-3">
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Generating Questions...</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Start Quiz</span>
                </>
              )}
            </div>
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 border-2 border-red-500 text-red-500 text-center animate-fade-in">
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-2 opacity-75">Please check your network and try again.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 text-gray-500">
            <div className="w-12 h-px bg-gray-500"></div>
            <span className="text-sm uppercase tracking-wider">Ready to test your knowledge?</span>
            <div className="w-12 h-px bg-gray-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};