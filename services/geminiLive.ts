
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ConnectionStatus, LiveSessionCallbacks } from '../types';

// ط¯ظˆط§ظ„ ط§ظ„طھط±ظ…ظٹط² ط§ظ„ظ…ظˆطµظ‰ ط¨ظ‡ط§ ط±ط³ظ…ظٹط§ظ‹
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export class WebRTCManager {
  private callbacks: LiveSessionCallbacks;
  private localStream: MediaStream | null = null;
  private sessionPromise: Promise<any> | null = null;
  private audioOutContext: AudioContext | null = null;
  private nextStartTime: number = 0;
  private audioSources = new Set<AudioBufferSourceNode>();
  private frameInterval: number | null = null;

  constructor(callbacks: LiveSessionCallbacks) {
    this.callbacks = callbacks;
  }

  public async connectToGemini(stream: MediaStream) {
    this.localStream = stream;
    const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || localStorage.getItem("GEMINI_API_KEY") || "";
    const ai = new GoogleGenAI({ apiKey });
    
    // ط¥ط¹ط¯ط§ط¯ ط³ظٹط§ظ‚ ط§ظ„طµظˆطھ ط¨ظ…ط¹ط¯ظ„ 24000 ظ‡ط±طھط² ظƒظ…ط§ ظٹط·ظ„ط¨ ط§ظ„ظ…ظˆط¯ظٹظ„
    this.audioOutContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    this.sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          this.callbacks.onConnect();
          this.startAudioStreaming();
          this.startVideoStreaming();
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && this.audioOutContext) {
            this.nextStartTime = Math.max(this.nextStartTime, this.audioOutContext.currentTime);
            const audioBuffer = await decodeAudioData(
              decode(base64Audio),
              this.audioOutContext,
              24000,
              1
            );
            const source = this.audioOutContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.audioOutContext.destination);
            source.start(this.nextStartTime);
            this.nextStartTime += audioBuffer.duration;
            this.audioSources.add(source);
            source.onended = () => this.audioSources.delete(source);
          }
          if (message.serverContent?.interrupted) {
            this.stopAllAiAudio();
          }
        },
        onerror: (e) => this.callbacks.onError(new Error("AI Connection Error")),
        onclose: () => this.disconnect()
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
        },
        systemInstruction: 'ط£ظ†طھ Jawr AIطŒ ظ…ط³ط§ط¹ط¯ ظپظٹط¯ظٹظˆ ط°ظƒظٹ. طھط­ط¯ط« ط¨ظ„ظ‡ط¬ط© ط¹ط±ط¨ظٹط© ط¨ظٹط¶ط§ط، ظ…ظپظ‡ظˆظ…ط©طŒ ظƒظ† ط³ط±ظٹط¹ ط§ظ„ط¨ط¯ظٹظ‡ط©طŒ ظˆط§ط³طھط®ط¯ظ… ط§ظ„ظ…ط¹ظ„ظˆظ…ط§طھ ط§ظ„ط¨طµط±ظٹط© ط§ظ„طھظٹ طھط±ط§ظ‡ط§ ظپظٹ ط§ظ„ظپظٹط¯ظٹظˆ ظ„طھط¹ظ„ظٹظ‚ ط°ظƒظٹ.'
      }
    });
  }

  private startAudioStreaming() {
    if (!this.localStream || !this.sessionPromise) return;
    const audioCtx = new AudioContext({ sampleRate: 16000 });
    const source = audioCtx.createMediaStreamSource(this.localStream);
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const int16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        int16[i] = inputData[i] * 32768;
      }
      const pcmBase64 = encode(new Uint8Array(int16.buffer));
      this.sessionPromise?.then(session => {
        session.sendRealtimeInput({
          media: { data: pcmBase64, mimeType: 'audio/pcm;rate=16000' }
        });
      });
    };

    source.connect(processor);
    processor.connect(audioCtx.destination);
  }

  private startVideoStreaming() {
    const video = document.createElement('video');
    video.srcObject = this.localStream;
    video.play();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    this.frameInterval = window.setInterval(() => {
      if (!ctx || video.paused || video.ended) return;
      canvas.width = 480; // ط¬ظˆط¯ط© ط£ط¹ظ„ظ‰ ظ‚ظ„ظٹظ„ط§ظ‹ ظ„ظ„ط¢ظٹظپظˆظ†
      canvas.height = 640;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
      this.sessionPromise?.then(session => {
        session.sendRealtimeInput({
          media: { data: base64Image, mimeType: 'image/jpeg' }
        });
      });
    }, 1000); // ط¥ط·ط§ط± ظˆط§ط­ط¯ ظƒظ„ ط«ط§ظ†ظٹط© ظ„ط¶ظ…ط§ظ† ط§ط³طھظ‚ط±ط§ط± ط§ظ„ط´ط¨ظƒط©
  }

  private stopAllAiAudio() {
    this.audioSources.forEach(s => { try { s.stop(); } catch(e){} });
    this.audioSources.clear();
    this.nextStartTime = 0;
  }

  public disconnect() {
    if (this.frameInterval) clearInterval(this.frameInterval);
    this.sessionPromise?.then(s => s.close());
    this.stopAllAiAudio();
    if (this.audioOutContext) this.audioOutContext.close();
    this.callbacks.onDisconnect();
  }
}
