
import React, { useEffect, useRef } from 'react';

interface GoogleAdProps {
  slotId: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  onClose: () => void;
}

const GoogleAd: React.FC<GoogleAdProps> = ({ slotId, format = 'auto', onClose }) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    let isMounted = true;

    try {
      // Initialize AdSense script if missing
      if (typeof window !== 'undefined' && !(window as any).adsbygoogle) {
         const script = document.createElement('script');
         script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7630019563882031"; 
         script.async = true;
         script.crossOrigin = "anonymous";
         document.head.appendChild(script);
      }

      // Safe push with delay and checks
      const timer = setTimeout(() => {
         if (!isMounted) return;
         // Only attempt push if ref exists and is empty (to prevent double-fill)
         if (adRef.current && adRef.current.innerHTML.trim() === "") {
             try {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                pushedRef.current = true;
             } catch (e: any) {
                // Suppress "already have ads" error common in React Strict Mode / SPA re-renders
                if (!e.message?.includes('already have ads')) {
                    console.error("AdSense push error:", e);
                }
             }
         }
      }, 300);

      return () => {
          isMounted = false;
          clearTimeout(timer);
      };
    } catch (e) {
      console.error("AdSense init error", e);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl relative flex flex-col">
        
        {/* Ad Header */}
        <div className="bg-gray-100 p-2 flex justify-between items-center border-b">
           <span className="text-xs text-gray-500 font-bold px-2 border border-gray-300 rounded">AD</span>
           <div className="text-xs text-gray-400">إعلان ممول</div>
        </div>

        {/* Ad Container */}
        <div className="min-h-[250px] flex items-center justify-center bg-gray-50 relative">
             <ins ref={adRef} className="adsbygoogle"
                 style={{ display: 'block', width: '100%' }}
                 data-ad-client="ca-pub-7630019563882031"
                 data-ad-slot={slotId}
                 data-ad-format={format}
                 data-full-width-responsive="true"></ins>
                 
             {!pushedRef.current && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none opacity-20 z-0">
                     <span className="text-6xl">📢</span>
                     <p className="font-bold mt-2">Google Ads Space</p>
                 </div>
             )}
        </div>

        {/* Close Button Area */}
        <div className="p-4 bg-white border-t">
            <button 
                onClick={onClose}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
                إغلاق الإعلان والمتابعة
            </button>
        </div>

      </div>
    </div>
  );
};

export default GoogleAd;
