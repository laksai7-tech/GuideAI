import React from 'react';
import { Icons } from '../ui/Icons';
import { ChatSession, User } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  startNewChat: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  toggleSidebar, 
  startNewChat,
  sessions,
  currentSessionId,
  onSelectSession,
  user,
  onSignIn,
  onSignOut
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out flex flex-col border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-800/50">
          <div className="flex items-center gap-2 font-bold text-white text-xl">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-indigo-500/20 shadow-inner">
              <Icons.Logo className="w-6 h-6" />
            </div>
            GuideAI
          </div>
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <Icons.Close className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              startNewChat();
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl transition-all font-medium shadow-lg shadow-indigo-900/20"
          >
            <Icons.Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Recent
          </div>
          {sessions.length === 0 ? (
            <div className="px-3 py-4 text-center text-slate-500 text-sm italic">
              No chat history yet.
            </div>
          ) : (
            sessions.map(session => (
              <button
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  if (window.innerWidth < 768) toggleSidebar();
                }}
                className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  currentSessionId === session.id 
                    ? 'bg-slate-800 text-white' 
                    : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icons.Message className="w-4 h-4 flex-shrink-0" />
                <span className="truncate text-sm">{session.title}</span>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          {user ? (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center border border-indigo-500/30 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <Icons.User className="w-4 h-4 text-indigo-400" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
              <button 
                onClick={onSignOut}
                className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"
                title="Sign Out"
              >
                <Icons.LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onSignIn}
              className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 active:scale-95 transition-all font-medium text-sm shadow-md"
            >
              <Icons.Google className="w-4 h-4" />
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;