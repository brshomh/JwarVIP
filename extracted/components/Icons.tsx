
import React from 'react';

// Common props for consistency
const IconBase = ({ children, className }: { children?: React.ReactNode, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const JawrLogo = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logo_grad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="1" stopColor="#1D4ED8" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <rect width="120" height="120" rx="28" fill="url(#logo_grad)" />
    <g transform="rotate(-12 60 60)">
       <path d="M70 30V75C70 86.0457 61.0457 95 50 95C42 95 35 90 32 85" stroke="white" strokeWidth="10" strokeLinecap="round" />
       <circle cx="70" cy="20" r="7" fill="white" />
    </g>
    <circle cx="90" cy="90" r="10" fill="#F97316" stroke="rgba(255,255,255,0.2)" strokeWidth="3">
       <animate attributeName="r" values="10;11;10" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

export const XIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></IconBase>
);

// Added optional className prop to allow styling from parent components
export const MicIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const MicOffIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><line x1="1" x2="23" y1="1" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><path d="M15 9.34V5a3 3 0 0 0-5.94-.6"/><path d="M19 10v2a7 7 0 0 1-2.9 5.69"/><path d="M12 19v3"/><path d="M5 10v2a7 7 0 0 0 2.9 5.69"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const VideoIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const VideoOffIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/><line x1="2" x2="22" y1="2" y2="22"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const PhoneIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const PhoneOffIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" x2="1" y1="1" y2="23"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const GlobeIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const GenderIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const GemIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const NextIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="m9 18 6-6-6-6"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const HistoryIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const StarIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const MagicWandIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13 2 2-2 2-2-2 2-2z"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const GiftIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const ShieldIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const FlagIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const ChatIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const SendIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const EmojiIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const HomeIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const MessageSquareIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const UserIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></IconBase>
);

// Added optional className prop to allow styling from parent components
export const ArrowRightIcon = ({ className }: { className?: string }) => (
  <IconBase className={className}><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></IconBase>
);

export const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.37-1.32 1.56.24 2.59.85 3.54 1.91-3.33 1.63-2.68 5.76.67 7.15-.9 1.91-2.04 3.65-3.66 4.49zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

export const VisaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M10.18 4.5H6.26c-.32 0-.58.24-.69.85L3 20h4.25l.84-5.23h5.27L12.5 20h3.96L19 4.5h-8.82zm1.6 8.52h-3.3l2.05-4.94.86 4.94z"/></svg>
);

export const MasterCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><circle cx="8" cy="12" r="7" fill="#eb001b"/><circle cx="16" cy="12" r="7" fill="#f79e1b" fill-opacity=".8"/></svg>
);
