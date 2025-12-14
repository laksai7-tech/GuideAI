import React from 'react';
import { 
  Bot, 
  Send, 
  Menu, 
  X, 
  Plus, 
  MessageSquare, 
  Settings, 
  Zap, 
  Brain, 
  ChevronDown, 
  Check, 
  User,
  Sparkles,
  Terminal,
  PenTool,
  GraduationCap,
  Loader2,
  LogOut
} from 'lucide-react';

// Custom Logo Component matching the "Neon Compass" aesthetic
const GuideAILogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="logo_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />   {/* Light Blue */}
        <stop offset="100%" stopColor="#818cf8" /> {/* Indigo */}
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Outer Ring */}
    <circle cx="50" cy="50" r="40" stroke="url(#logo_gradient)" strokeWidth="2.5" opacity="0.9" />
    
    {/* Compass Points */}
    <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z" fill="url(#logo_gradient)" opacity="0.9" />
    
    {/* Inner detail lines */}
    <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="1" opacity="0.5" />
    <path d="M50 20 L50 35" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    <path d="M50 80 L50 65" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    <path d="M20 50 L35 50" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    <path d="M80 50 L65 50" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

    {/* Center Dot */}
    <circle cx="50" cy="50" r="4" fill="white" />
  </svg>
);

const Google = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.2 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export const Icons = {
  Bot,
  Send,
  Menu,
  Close: X,
  Plus,
  Message: MessageSquare,
  Settings,
  Zap, // For Flash model
  Brain, // For Pro model
  ChevronDown,
  Check,
  User,
  Sparkles,
  Terminal,
  PenTool,
  Education: GraduationCap,
  Loader: Loader2,
  Logo: GuideAILogo,
  Google,
  LogOut
};