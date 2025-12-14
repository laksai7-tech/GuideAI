import React from 'react';
import { Message, Role } from '../../types';
import { Icons } from '../ui/Icons';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] lg:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
            ? 'bg-indigo-600' 
            : 'bg-slate-900 border border-indigo-500/30'
          } shadow-sm overflow-hidden`}>
          {isUser ? (
            <Icons.User className="w-5 h-5 text-white" />
          ) : (
            <Icons.Logo className="w-6 h-6" />
          )}
        </div>

        {/* Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className="text-xs text-slate-400 mb-1 px-1">
            {isUser ? 'You' : 'GuideAI'}
          </div>
          
          <div 
            className={`relative rounded-2xl px-5 py-4 shadow-sm ${
              isUser 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm shadow-md'
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            ) : (
              <div className={message.content === '' && message.isStreaming ? 'animate-pulse' : ''}>
                 {message.content === '' && message.isStreaming ? (
                   <span className="flex items-center gap-2 text-slate-500">
                     <Icons.Loader className="w-4 h-4 animate-spin" /> Thinking...
                   </span>
                 ) : (
                   <MarkdownRenderer content={message.content} />
                 )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;