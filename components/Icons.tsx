// components/Icons.tsx
import React from 'react';
import { 
  Video, Mic, MicOff, PhoneOff, Home, 
  MessageSquare, User, Wand2, ArrowRight,
  Activity // بديل للوجو
} from 'lucide-react';

export const VideoIcon = Video;
export const MicIcon = Mic;
export const MicOffIcon = MicOff;
export const PhoneOffIcon = PhoneOff;
export const HomeIcon = Home;
export const MessageSquareIcon = MessageSquare;
export const UserIcon = User;
export const MagicWandIcon = Wand2;
export const ArrowRightIcon = ArrowRight;

// شعار مؤقت
export const JawrLogo = ({ className }: { className?: string }) => (
  <Activity className={className} />
);