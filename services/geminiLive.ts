// services/geminiLive.ts
import { ConnectionStatus } from '../types';

export class WebRTCManager {
  private onConnect: () => void;
  private onDisconnect: () => void;
  private onError: (err: any) => void;

  constructor(callbacks: {
    onConnect: () => void;
    onDisconnect: () => void;
    onError: (err: any) => void;
    onAudioLevel: (level: number) => void;
    onMessage: (msg: any) => void;
  }) {
    this.onConnect = callbacks.onConnect;
    this.onDisconnect = callbacks.onDisconnect;
    this.onError = callbacks.onError;
  }

  async connectToGemini(stream: MediaStream) {
    console.log("Connecting to Gemini Mock...");
    // محاكاة الاتصال (لأننا لم نضع API Key بعد)
    setTimeout(() => {
      this.onConnect();
    }, 2000);
  }

  disconnect() {
    console.log("Disconnecting...");
    this.onDisconnect();
  }
}