import React, { useState, useRef, useEffect } from 'react';
// Removed unused import for uuid
import Sidebar from './components/Layout/Sidebar';
import ModelSelector from './components/Layout/ModelSelector';
import WelcomeScreen from './components/Chat/WelcomeScreen';
import MessageBubble from './components/Chat/MessageBubble';
import { Icons } from './components/ui/Icons';
import { streamChatResponse } from './services/geminiService';
import { Message, Role, ChatSession, AppConfig, ModelType, User } from './types';

// Simple UUID polyfill if package isn't actually installed in environment
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const DEFAULT_CONFIG: AppConfig = {
  model: ModelType.FLASH,
  enableThinking: false
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [user, setUser] = useState<User | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Derive current messages
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession ? currentSession.messages : [];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleStartNewChat = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setSidebarOpen(false);
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
  };

  const updateSessionTitle = (sessionId: string, firstMessage: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId && s.title === 'New Chat') {
        return { ...s, title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '') };
      }
      return s;
    }));
  };

  const handleSignIn = () => {
    // Simulating a Google Sign In process
    const mockUser: User = {
      id: 'usr_' + generateId(),
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    };
    setUser(mockUser);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || isStreaming) return;

    // Ensure we have a session
    let sessionId = currentSessionId;
    let isNewSession = false;
    if (!sessionId) {
      const newSession: ChatSession = {
        id: generateId(),
        title: 'New Chat',
        messages: [],
        createdAt: Date.now()
      };
      setSessions(prev => [newSession, ...prev]);
      sessionId = newSession.id;
      setCurrentSessionId(sessionId);
      isNewSession = true;
    }

    // Add User Message
    const userMessage: Message = {
      id: generateId(),
      role: Role.USER,
      content: text.trim(),
      timestamp: Date.now()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, messages: [...s.messages, userMessage] };
      }
      return s;
    }));

    if (isNewSession || (currentSession && currentSession.messages.length === 0)) {
      updateSessionTitle(sessionId, text.trim());
    }

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsStreaming(true);

    // Create Placeholder AI Message
    const aiMessageId = generateId();
    const aiPlaceholderMessage: Message = {
      id: aiMessageId,
      role: Role.MODEL,
      content: '', // Start empty
      timestamp: Date.now(),
      isStreaming: true
    };

    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, messages: [...s.messages, aiPlaceholderMessage] };
      }
      return s;
    }));

    // Get updated messages list for context including the new user message
    const currentMessages = sessions.find(s => s.id === sessionId)?.messages || [];
    const messagesForContext = [...currentMessages, userMessage];

    // Stream Response
    await streamChatResponse(
      messagesForContext,
      config.model,
      config.enableThinking,
      (textChunk) => {
        setSessions(prev => prev.map(s => {
          if (s.id === sessionId) {
            const updatedMessages = s.messages.map(m => {
              if (m.id === aiMessageId) {
                return { ...m, content: m.content + textChunk };
              }
              return m;
            });
            return { ...s, messages: updatedMessages };
          }
          return s;
        }));
      },
      () => {
        setIsStreaming(false);
        setSessions(prev => prev.map(s => {
          if (s.id === sessionId) {
            const updatedMessages = s.messages.map(m => {
              if (m.id === aiMessageId) {
                return { ...m, isStreaming: false };
              }
              return m;
            });
            return { ...s, messages: updatedMessages };
          }
          return s;
        }));
      },
      (error) => {
        setIsStreaming(false);
        setSessions(prev => prev.map(s => {
            if (s.id === sessionId) {
                const errorMessage: Message = {
                    id: generateId(),
                    role: Role.MODEL,
                    content: `**Error:** ${error.message}. Please try again.`,
                    timestamp: Date.now()
                }
                 const updatedMessages = s.messages.filter(m => m.id !== aiMessageId || m.content.length > 0);
                 if (updatedMessages.length === s.messages.length) {
                     return { ...s, messages: [...updatedMessages, errorMessage]};
                 } else {
                      return { ...s, messages: [...updatedMessages, errorMessage]};
                 }
            }
            return s;
        }));
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        startNewChat={handleStartNewChat}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        
        {/* Header */}
        <header className="flex-shrink-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Icons.Menu className="w-6 h-6" />
            </button>
            <div className="md:hidden font-bold text-slate-900">GuideAI</div>
            <ModelSelector config={config} onConfigChange={(newConfig) => setConfig(prev => ({...prev, ...newConfig}))} />
          </div>
          <div className="flex items-center gap-2">
            {/* Removed Powered by Gemini text */}
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 scroll-smooth">
          <div className="max-w-3xl mx-auto min-h-full flex flex-col">
            {messages.length === 0 ? (
              <WelcomeScreen onSuggestionClick={(text) => handleSendMessage(text)} />
            ) : (
              <>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} className="h-4" />
              </>
            )}
          </div>
        </main>

        {/* Input Area */}
        <footer className="flex-shrink-0 p-4 bg-white border-t border-slate-100">
          <div className="max-w-3xl mx-auto relative">
            <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all shadow-sm">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message GuideAI..."
                className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-48 min-h-[44px] py-2.5 px-3 text-slate-800 placeholder:text-slate-400"
                rows={1}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isStreaming}
                className={`flex-shrink-0 p-2.5 rounded-xl transition-all ${
                  input.trim() && !isStreaming
                    ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isStreaming ? (
                   <Icons.Loader className="w-5 h-5 animate-spin" />
                ) : (
                   <Icons.Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[10px] text-slate-400">
                GuideAI can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}