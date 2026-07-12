
import { UserProfile } from './auth';

export class SmartNotificationService {
  private lastNotificationTime: number = 0;
  private notificationCooldown: number = 60000; 

  constructor() {
  }

  public async triggerEngagement(user: UserProfile, reason: 'idle' | 'hidden' | 'welcome'): Promise<string | null> {
    const now = Date.now();
    if (now - this.lastNotificationTime < this.notificationCooldown && reason !== 'welcome') {
      return null;
    }

    this.lastNotificationTime = now;
    
    let text = "";
    if (reason === 'idle') {
        text = "هناك 15 مستخدم نشط بالقرب منك الآن";
    } else if (reason === 'hidden') {
        text = "فقدنا الاتصال بالفيديو، يرجى العودة للتطبيق";
    } else if (reason === 'welcome') {
        text = `أهلاً ${user.name}، الشبكة متصلة وجاهزة`;
    }

    this.speak(text); 
    return text;
  }

  private speak(text: string) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.includes('ar'));
    if (arabicVoice) {
        utterance.voice = arabicVoice;
    }
    window.speechSynthesis.speak(utterance);
  }
}

export const smartNotifier = new SmartNotificationService();
