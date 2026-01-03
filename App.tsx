
import React, { useState, useRef, useEffect } from 'react';
import { ConnectionStatus } from './types';
import { WebRTCManager } from './services/geminiLive'; 
import { AuthService, UserProfile } from './services/auth';
import { sounds } from './services/sound';
import { 
  VideoIcon, JawrLogo, 
  HomeIcon, MessageSquareIcon, UserIcon,
  PhoneOffIcon, MagicWandIcon, ArrowRightIcon,
  MicIcon, MicOffIcon
} from './components/Icons';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(AuthService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'home' | 'chats' | 'profile'>('home');
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [isAiMode, setIsAiMode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rtcManager = useRef<WebRTCManager | null>(null);

  // --- FlutterFlow Bridge ---
  useEffect(() => {
    // استقبال الأوامر من FlutterFlow
    const handleFlutterMessage = (event: any) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.command === 'START_AI_CALL') startAiCall();
        if (data.command === 'END_CALL') endCall();
        if (data.command === 'LOGOUT') {
           AuthService.logout();
           setCurrentUser(null);
        }
      } catch (e) {
        console.error("FlutterFlow Bridge Error:", e);
      }
    };

    window.addEventListener('message', handleFlutterMessage);
    return () => window.removeEventListener('message', handleFlutterMessage);
  }, []);

  const sendToFlutter = (data: any) => {
    // إرسال البيانات إلى FlutterFlow عبر WebView Javascript Handler
    if ((window as any).FlutterFlowBridge) {
      (window as any).FlutterFlowBridge.postMessage(JSON.stringify(data));
    }
    // دعم عام للـ WebView
    if ((window as any).webkit?.messageHandlers?.flutterControl) {
      (window as any).webkit.messageHandlers.flutterControl.postMessage(JSON.stringify(data));
    }
  };
  // --------------------------

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (navigator.vibrate) {
      const patterns = { light: 10, medium: 20, heavy: 50 };
      navigator.vibrate(patterns[type]);
    }
  };

  const initStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      return true;
    } catch (err) {
      sendToFlutter({ event: 'ERROR', message: 'Camera permission denied' });
      return false;
    }
  };

  const startAiCall = async () => {
    triggerHaptic('medium');
    sounds.playClick();
    const ready = await initStream();
    if (!ready) return;

    setIsConnecting(true);
    setIsAiMode(true);
    sendToFlutter({ event: 'CALL_STARTED' });

    const manager = new WebRTCManager({
      onConnect: () => {
        setStatus(ConnectionStatus.CONNECTED);
        setIsConnecting(false);
        sounds.playConnect();
        sendToFlutter({ event: 'AI_CONNECTED' });
      },
      onDisconnect: () => {
        setStatus(ConnectionStatus.DISCONNECTED);
        setIsAiMode(false);
        sendToFlutter({ event: 'CALL_ENDED' });
      },
      onError: () => {
        setStatus(ConnectionStatus.ERROR);
        setIsConnecting(false);
        sounds.playError();
        sendToFlutter({ event: 'ERROR', message: 'Gemini connection failed' });
      },
      onAudioLevel: () => {},
      onMessage: () => {}
    });

    rtcManager.current = manager;
    await manager.connectToGemini(streamRef.current!);
  };

  const endCall = () => {
    triggerHaptic('heavy');
    rtcManager.current?.disconnect();
    setIsAiMode(false);
    sendToFlutter({ event: 'CALL_ENDED' });
  };

  if (!currentUser) return (
    <div className="h-full bg-black flex flex-col items-center justify-center p-10 safe-top safe-bottom">
      <JawrLogo className="w-40 h-40 animate-pulse-slow" />
      <h1 className="text-4xl font-black text-white mt-8 tracking-tighter">JAWR PRO</h1>
      <p className="text-zinc-500 mt-2 text-center font-medium">الجيل القادم من التواصل المرئي</p>
      <button 
        onClick={async () => {
          const res = await AuthService.register({ email: `ff_${Date.now()}@jawr.com`, password: '1', name: 'FlutterFlow User', age: 25, gender: 'male' });
          if (res.success) {
            setCurrentUser(res.user!);
            sendToFlutter({ event: 'LOGIN_SUCCESS', user: res.user });
          }
        }}
        className="mt-20 w-full py-5 bg-blue-600 text-white font-bold rounded-3xl text-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl shadow-blue-500/20"
      >
        دخول سريع <ArrowRightIcon className="w-6 h-6" />
      </button>
    </div>
  );

  return (
    <div className="h-full bg-black text-white flex flex-col overflow-hidden">
      <div className="flex-1 relative">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isAiMode ? 'opacity-100' : 'opacity-30 blur-2xl'}`}
          style={{ transform: 'scaleX(-1)' }}
        />

        {isAiMode ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-between p-8 safe-top safe-bottom">
             <div className="ios-blur px-5 py-2 rounded-full border border-white/10 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isConnecting ? 'bg-yellow-400 animate-ping' : 'bg-green-500'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest">{isConnecting ? 'جاري الاتصال بـ Gemini' : 'متصل الآن'}</span>
             </div>

             {!isConnecting && (
               <div className="text-center animate-fadeIn">
                 <div className="w-24 h-24 rounded-full bg-blue-500/20 border border-blue-500/50 mx-auto flex items-center justify-center mb-4 backdrop-blur-md">
                    <MagicWandIcon className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,1)]" />
                 </div>
                 <h2 className="text-2xl font-bold">مساعد Jawr الذكي</h2>
                 <p className="text-blue-300 opacity-60 font-medium">تحدث معه، هو يراك الآن</p>
               </div>
             )}

             <div className="flex items-center gap-10 mb-4">
                <button onClick={() => { setIsMuted(!isMuted); triggerHaptic(); }} className={`w-16 h-16 rounded-full flex items-center justify-center ios-blur border border-white/10 ${isMuted ? 'text-red-500' : 'text-white'}`}>
                   {isMuted ? <MicOffIcon className="w-7 h-7" /> : <MicIcon className="w-7 h-7" />}
                </button>
                <button onClick={endCall} className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40 active:scale-90 transition-transform">
                   <PhoneOffIcon className="w-10 h-10" />
                </button>
                <div className="w-16 h-16 rounded-full ios-blur border border-white/10 flex items-center justify-center">
                   <VideoIcon className="w-7 h-7" />
                </div>
             </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
            <div className="relative mb-6">
               <div className="absolute inset-0 bg-blue-500/30 blur-3xl animate-pulse"></div>
               <JawrLogo className="w-32 h-32 relative" />
            </div>
            <h2 className="text-3xl font-black mb-2 text-center leading-tight">أهلاً بك في المستقبل</h2>
            <p className="text-zinc-500 text-center mb-12 font-medium">تطبيق Jawr Pro مدمج الآن مع FlutterFlow</p>
            <button 
              onClick={startAiCall}
              className="w-full h-20 bg-white text-black rounded-[35px] font-black text-xl flex items-center justify-center gap-4 active:scale-95 transition-transform shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
              <MagicWandIcon className="w-7 h-7" /> ابدأ المكالمة الآن
            </button>
          </div>
        )}
      </div>

      {!isAiMode && (
        <nav className="h-24 ios-blur border-t border-white/5 flex items-start justify-around px-8 pt-4 safe-bottom">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab==='home'?'text-blue-500':'text-zinc-600'}`}>
            <HomeIcon className={`w-7 h-7 ${activeTab==='home'?'drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]':''}`} />
            <span className="text-[10px] font-bold">الرئيسية</span>
          </button>
          <button onClick={() => setActiveTab('chats')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab==='chats'?'text-blue-500':'text-zinc-600'}`}>
            <MessageSquareIcon className="w-7 h-7" />
            <span className="text-[10px] font-bold">الدردشات</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab==='profile'?'text-blue-500':'text-zinc-600'}`}>
            <UserIcon className="w-7 h-7" />
            <span className="text-[10px] font-bold">حسابي</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
