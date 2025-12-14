import React from 'react';
import { Icons } from '../ui/Icons';

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
}

const suggestions = [
  {
    icon: Icons.PenTool,
    title: "Draft an email",
    prompt: "Write a professional email to a client explaining a project delay due to unforeseen circumstances."
  },
  {
    icon: Icons.Terminal,
    title: "Debug code",
    prompt: "I have a React useEffect hook that is causing an infinite loop. Here is the code..."
  },
  {
    icon: Icons.Sparkles,
    title: "Brainstorm ideas",
    prompt: "Give me 5 creative marketing ideas for a new eco-friendly coffee brand."
  },
  {
    icon: Icons.Education,
    title: "Learn a topic",
    prompt: "Explain the concept of Quantum Computing to me like I'm 12 years old."
  }
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-6 py-12 text-center">
      <div className="p-4 rounded-3xl mb-8 bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl shadow-indigo-900/10 border border-slate-700/50">
        <Icons.Logo className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
        Welcome to GuideAI
      </h1>
      <p className="text-lg text-slate-600 mb-12 max-w-2xl">
        Your intelligent professional assistant. I can help you write, code, learn, and solve complex problems with precision.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s.prompt)}
            className="flex items-start gap-4 p-4 text-left bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group"
          >
            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
              <s.icon className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700">{s.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mt-1">{s.prompt}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;