import React, { useRef, useState, useEffect } from 'react';

const API_KEY = "AIzaSyCT_v_qXMZcezQholeLo1jP6kiOifgrunA"; 

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [result, setResult] = useState("جاري تشغيل الكاميرا...");

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setResult("المساعد جاهز، اضغط لتحليل ما تراه العين");
      } catch (err) {
        setResult("خطأ: يرجى تفعيل صلاحية الكاميرا في إعدادات التطبيق");
      }
    }
    setupCamera();
  }, []);

  const captureAndAnalyze = async () => {
    setResult("جاري التحليل... انتظر لحظة");
    // هنا سيتم إضافة منطق إرسال الصورة لـ Gemini لاحقاً
    setResult("تم التقاط الصورة! (سيتم تفعيل الرد الصوتي في الخطوة القادمة)");
  };

  return (
    <div style={{ backgroundColor: '#000', height: '100vh', color: '#fff', textAlign: 'center', padding: '20px' }}>
      <h2 style={{ color: '#9d4edd' }}>Jawr Pro AI</h2>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '15px', border: '2px solid #9d4edd' }} />
      <div style={{ margin: '20px', padding: '15px', background: '#1a1a1a', borderRadius: '10px' }}>{result}</div>
      <button onClick={captureAndAnalyze} style={{ padding: '15px 30px', borderRadius: '50px', backgroundColor: '#9d4edd', color: '#fff', border: 'none', fontSize: '18px' }}>
        تحليل الآن 👁️
      </button>
    </div>
  );
}

export default App;
