import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // هذه الوظيفة ترسل رسالة إلى FlutterFlow عند فتح الكاميرا أو حدوث حدث
  const sendMessageToFlutterFlow = (data: any) => {
    if ((window as any).ReactNativeWebView) {
      (window as any).ReactNativeWebView.postMessage(JSON.stringify(data));
    }
  };

  useEffect(() => {
    sendMessageToFlutterFlow({ status: 'webview_ready', message: 'مرحباً بك في جوهر برو' });
  }, []);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'Arial'
    }}>
      <h1 style={{ color: '#9d4edd' }}>Jawr Pro</h1>
      <p>المساعد الذكي جاهز للعمل</p>
      
      {/* هنا سيظهر فيديو الكاميرا لاحقاً */}
      <div style={{
        width: '90%',
        height: '60%',
        border: '2px dashed #9d4edd',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>جاري الاتصال بالكاميرا...</p>
      </div>

      <button 
        onClick={() => sendMessageToFlutterFlow({ action: 'start_ai' })}
        style={{
          marginTop: '20px',
          padding: '15px 30px',
          borderRadius: '30px',
          border: 'none',
          backgroundColor: '#9d4edd',
          color: 'white',
          fontWeight: 'bold'
        }}>
        ابدأ التحليل الآن
      </button>
    </div>
  );
}

export default App;
