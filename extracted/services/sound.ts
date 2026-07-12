export class SoundService {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  public playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio errors (user interaction policy etc)
    }
  }

  public playSonarPing() {
    this.playTone(800, 'sine', 0.1, 0.05);
    setTimeout(() => this.playTone(1200, 'sine', 0.4, 0.02), 50);
  }

  public playClick() {
    this.playTone(400, 'square', 0.05, 0.02);
  }

  public playConnect() {
    this.playTone(400, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(600, 'sine', 0.1, 0.1), 100);
    setTimeout(() => this.playTone(1000, 'sine', 0.3, 0.1), 200);
  }

  public playError() {
    this.playTone(150, 'sawtooth', 0.3, 0.2);
    setTimeout(() => this.playTone(100, 'sawtooth', 0.3, 0.2), 150);
  }

  public playWarning() {
    this.playTone(600, 'square', 0.1, 0.05);
    setTimeout(() => this.playTone(500, 'square', 0.1, 0.05), 150);
  }
}

export const sounds = new SoundService();