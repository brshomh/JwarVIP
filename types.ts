// types.ts
export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}