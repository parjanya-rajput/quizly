# Quizzly - AI-Powered Quiz Application

A modern, minimalist quiz application that generates questions dynamically using Google's Gemini AI.

## Features

- **AI-Generated Questions**: Uses Gemini AI to create custom questions based on any topic
- **Customizable Settings**: Choose topic, number of questions, and difficulty level
- **Real-time Quiz Interface**: 30-second timer per question with smooth animations
- **Performance Analytics**: Detailed results with scoring and performance messages
- **Minimalist Design**: Clean black and white aesthetic with smooth animations

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Gemini API**
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Update the `.env` file with your API key:
     ```
     VITE_GEMINI_API_KEY=your_actual_api_key_here
     ```

3. **Run the Application**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## How It Works

1. **Topic Input**: Enter any topic you want to be quizzed on
2. **Settings**: Choose number of questions (5-20) and difficulty level
3. **AI Generation**: Gemini AI generates custom questions with 4 multiple-choice options
4. **Quiz Interface**: Answer questions within 30 seconds each
5. **Results**: View your score, accuracy, and performance analysis

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Google Generative AI** (Gemini) for question generation
- **Lucide React** for icons
- **Vite** for development and building

## API Integration

The app uses Google's Gemini Pro model to generate questions. The AI is prompted to create:
- Diverse, interesting questions about the specified topic
- Exactly 4 multiple-choice options per question
- Appropriate difficulty levels
- Proper JSON formatting for seamless integration

## Design Philosophy

- **Minimalist Aesthetic**: Pure black and white color scheme
- **Typography-Focused**: Bold, clean fonts with proper hierarchy
- **Smooth Animations**: Subtle transitions and hover effects
- **Responsive Design**: Works perfectly on all device sizes
- **Accessibility**: High contrast and keyboard navigation support