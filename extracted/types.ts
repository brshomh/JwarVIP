
export interface AudioStreamConfig {
  sampleRate: number;
}

export interface VideoStreamConfig {
  frameRate: number;
  quality: number;
}

export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  isTranscription?: boolean;
}

export interface LiveSessionCallbacks {
  onConnect: () => void;
  onDisconnect: () => void;
  onError: (error: Error) => void;
  onAudioLevel: (level: number) => void;
  onMessage: (msg: ChatMessage) => void; // New callback for chat
}
