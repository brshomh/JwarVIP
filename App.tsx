import React, { useState, useRef, useEffect } from 'react';
import { ConnectionStatus, ChatMessage } from './types';
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
  
  // Custom API key state
  const [apiKeyInput, setApiKeyInput] = useState(localStorage.getItem('GEMINI_API_KEY') || '');
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rtcManager = useRef<WebRTCManager | null>(null);

  // Mock chats data with local persistence
  const [chats, setChats] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('jawr_chats_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading chats history", e);
      }
    }
    return [
      { id: '1', sender: 'user', text: 'مرحباً، هل يمكنك رؤيتي؟', timestamp: Date.now() - 3600000 },
      { id: '2', sender: 'ai', text: 'أهلاً بك! نعم، الكاميرا تعمل وأستطيع رؤية محيطك الآن. كيف يمكنني مساعدتك اليوم؟', timestamp: Date.now() - 3590000 },
      { id: '3', sender: 'user', text: 'أريد تحليل هذا الكتاب الذي أمامي.', timestamp: Date.now() - 1800000 },
      { id: '4', sender: 'ai', text: 'بالتأكيد! يظهر لي كتاب بعنوان "الذكاء الاصطناعي ومستقبل البشرية". إنه يتحدث عن التطور المتسارع للتقنيات وكيف يمكنها تحسين جودة حياتنا اليومية.', timestamp: Date.now() - 1790000 }
    ];
  });

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('jawr_chats_history', JSON.stringify(chats));
  }, [chats]);

  // --- FlutterFlow Bridge ---
  useEffect(() => {
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
    if ((window as any).FlutterFlowBridge) {
      (window as any).FlutterFlowBridge.postMessage(JSON.stringify(data));
    }
    if ((window as any).webkit?.messageHandlers?.flutterControl) {
      (window as any).webkit.messageHandlers.flutterControl.postMessage(JSON.stringify(data));
    }
  };

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
      onMessage: (msg: ChatMessage) => {
        setChats(prev => [...prev, msg]);
      }
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

  const saveApiKey = () => {
    localStorage.setItem('GEMINI_API_KEY', apiKeyInput.trim());
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2000);
  };

  // Auto-login if no user exists (for seamless first-time experience)
  useEffect(() => {
    if (!currentUser) {
      const autoLogin = async () => {
        const res = await AuthService.register({ email: `user_${Date.now()}@jawr.com`, password: '1', name: 'مستخدم جوار', age: 25, gender: 'male' });
        if (res.success) {
          setCurrentUser(res.user!);
          sendToFlutter({ event: 'LOGIN_SUCCESS', user: res.user });
        }
      };
      autoLogin();
    }
  }, [currentUser]);

  if (!currentUser) return (
    <div className="h-full bg-black flex flex-col items-center justify-center p-10 safe-top safe-bottom">
      <JawrLogo className="w-40 h-40 animate-pulse-slow" />
      <h1 className="text-4xl font-black text-white mt-8 tracking-tighter">JAWR PRO</h1>
      <p className="text-zinc-500 mt-2 text-center font-medium font-tajawal">جاري التحميل...</p>
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
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isAiMode ? 'opacity-100' : 'opacity-20 blur-2xl'}`}
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
                 <h2 className="text-2xl font-bold font-tajawal">مساعد Jawr الذكي</h2>
                 <p className="text-blue-300 opacity-60 font-medium font-tajawal">تحدث معه، هو يراك الآن</p>
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
          <div className="absolute inset-0 flex flex-col justify-between p-6 safe-top safe-bottom">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <JawrLogo className="w-10 h-10" />
                <div>
                  <h1 className="text-xl font-black tracking-tight">JAWR PRO</h1>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">AI Agent</span>
                </div>
              </div>
              {currentUser.isVip && (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">VIP MEMBER</span>
              )}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 flex flex-col justify-center overflow-y-auto my-6">
              {activeTab === 'home' && (
                <div className="text-center">
                  <div className="relative mb-6 inline-block">
                     <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse"></div>
                     <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center bg-zinc-900/50 backdrop-blur-xl relative">
                        <MagicWandIcon className="w-16 h-16 text-blue-500" />
                     </div>
                  </div>
                  <h2 className="text-3xl font-black mb-2 leading-tight font-tajawal">تواصل ذكي بالعين والصوت</h2>
                  <p className="text-zinc-500 max-w-sm mx-auto mb-10 text-sm font-medium font-tajawal">ابدأ تجربة محادثة مباشرة مرئية، حيث يمكن لمساعد الذكاء الاصطناعي رؤية بيئتك والإجابة على أسئلتك بصوت طبيعي.</p>
                  
                  <button 
                    onClick={startAiCall}
                    className="w-full py-5 bg-white text-black rounded-[28px] font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.08)]"
                  >
                    <MagicWandIcon className="w-6 h-6" /> ابدأ المكالمة الآن
                  </button>
                </div>
              )}

              {activeTab === 'chats' && (
                <div className="h-full flex flex-col justify-start">
                  <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                    <h3 className="text-lg font-black text-zinc-400 font-tajawal">سجل المحادثات</h3>
                    {chats.length > 0 && (
                      <button 
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف سجل المحادثات؟')) {
                            setChats([]);
                          }
                        }}
                        className="text-xs text-red-500 hover:text-red-400 font-bold font-tajawal active:scale-95 transition-transform"
                      >
                        مسح السجل
                      </button>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {chats.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-500 font-tajawal py-10">
                        <p>لا يوجد سجل محادثات حالياً</p>
                      </div>
                    ) : (
                      chats.map(chat => (
                        <div key={chat.id} className={`flex flex-col ${chat.sender === 'user' ? 'items-start' : 'items-end'}`}>
                          <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-tajawal ${chat.sender === 'user' ? 'bg-zinc-800 text-zinc-100 rounded-tr-none' : 'bg-blue-600/20 border border-blue-500/20 text-blue-200 rounded-tl-none'}`}>
                            <p className="leading-relaxed">{chat.text}</p>
                          </div>
                          <span className="text-[9px] text-zinc-600 mt-1 px-1">{new Date(chat.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Account Summary Card */}
                  <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-3xl flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-2xl font-black">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold font-tajawal">{currentUser.name}</h3>
                      <p className="text-xs text-zinc-500">{currentUser.email}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md text-[10px] font-bold font-tajawal">مستوى {currentUser.level}</span>
                        <span className="text-zinc-500 text-[10px] font-medium font-tajawal">{currentUser.gems} جواهر</span>
                      </div>
                    </div>
                  </div>

                  {/* API Key Settings Card */}
                  <div className="p-5 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-3">
                    <h4 className="text-sm font-black text-zinc-300 font-tajawal">إعدادات Gemini API Key</h4>
                    <p className="text-xs text-zinc-500 leading-normal font-tajawal">أدخل مفتاح الـ API الخاص بك لتشغيل التطبيق والاتصال المباشر بخدمة الذكاء الاصطناعي.</p>
                    <div className="flex gap-2">
                      <input 
                        type="password" 
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="AIzaSy..." 
                        className="flex-1 bg-black border border-white/10 rounded-2xl px-4 py-3 text-sm font-mono text-zinc-300 focus:border-blue-500 transition-colors"
                      />
                      <button 
                        onClick={saveApiKey}
                        className={`px-6 rounded-2xl font-bold text-sm transition-all ${apiKeySaved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white active:scale-95'}`}
                      >
                        {apiKeySaved ? 'تم الحفظ' : 'حفظ'}
                      </button>
                    </div>
                  </div>

                  {/* Settings toggles */}
                  <div className="p-5 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400 font-tajawal">لغة الواجهة</span>
                      <button 
                        onClick={() => {
                          const nextLang = currentUser.language === 'ar' ? 'en' : 'ar';
                          AuthService.setLanguage(currentUser.email, nextLang);
                          setCurrentUser({ ...currentUser, language: nextLang });
                        }}
                        className="bg-zinc-800 px-3 py-1.5 rounded-xl font-bold text-xs"
                      >
                        {currentUser.language === 'ar' ? 'العربية' : 'English'}
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400 font-tajawal">العملة الافتراضية</span>
                      <button 
                        onClick={() => {
                          const nextCurrency = currentUser.currency === 'USD' ? 'SAR' : 'USD';
                          AuthService.setCurrency(currentUser.email, nextCurrency);
                          setCurrentUser({ ...currentUser, currency: nextCurrency });
                        }}
                        className="bg-zinc-800 px-3 py-1.5 rounded-xl font-bold text-xs"
                      >
                        {currentUser.currency}
                      </button>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button 
                    onClick={() => {
                      AuthService.logout();
                      setCurrentUser(null);
                      sendToFlutter({ event: 'LOGGED_OUT' });
                    }}
                    className="w-full py-4 border border-red-500/20 text-red-500 hover:bg-red-500/5 rounded-2xl text-sm font-bold active:scale-95 transition-all font-tajawal"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!isAiMode && (
        <nav className="h-24 ios-blur border-t border-white/5 flex items-start justify-around px-8 pt-4 safe-bottom">
          <button onClick={() => { setActiveTab('home'); triggerHaptic(); }} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab==='home'?'text-blue-500':'text-zinc-600'}`}>
            <HomeIcon className={`w-7 h-7 ${activeTab==='home'?'drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]':''}`} />
            <span className="text-[10px] font-bold font-tajawal">الرئيسية</span>
          </button>
          <button onClick={() => { setActiveTab('chats'); triggerHaptic(); }} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab==='chats'?'text-blue-500':'text-zinc-600'}`}>
            <MessageSquareIcon className={`w-7 h-7 ${activeTab==='chats'?'drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]':''}`} />
            <span className="text-[10px] font-bold font-tajawal">الدردشات</span>
          </button>
          <button onClick={() => { setActiveTab('profile'); triggerHaptic(); }} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab==='profile'?'text-blue-500':'text-zinc-600'}`}>
            <UserIcon className={`w-7 h-7 ${activeTab==='profile'?'drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]':''}`} />
            <span className="text-[10px] font-bold font-tajawal">حسابي</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
