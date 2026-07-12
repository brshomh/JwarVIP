
type ActivityState = 'active' | 'idle' | 'hidden' | 'visible';

type ActivityCallback = (state: ActivityState) => void;

export class ActivityMonitor {
  private idleTimer: number | null = null;
  private idleThreshold: number = 20000; // 20 seconds to consider idle
  private callback: ActivityCallback;
  private state: ActivityState = 'active';

  constructor(callback: ActivityCallback) {
    this.callback = callback;
  }

  public start() {
    // User Interaction Events
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];
    events.forEach(evt => window.addEventListener(evt, this.resetIdleTimer));

    // Tab Visibility Events
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    this.resetIdleTimer();
  }

  public stop() {
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];
    events.forEach(evt => window.removeEventListener(evt, this.resetIdleTimer));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    if (this.idleTimer) clearTimeout(this.idleTimer);
  }

  private resetIdleTimer = () => {
    if (this.state === 'idle') {
      this.state = 'active';
      this.callback('active');
    }

    if (this.idleTimer) clearTimeout(this.idleTimer);

    this.idleTimer = window.setTimeout(() => {
      if (this.state !== 'hidden') {
        this.state = 'idle';
        this.callback('idle');
      }
    }, this.idleThreshold);
  };

  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.state = 'hidden';
      this.callback('hidden');
      if (this.idleTimer) clearTimeout(this.idleTimer);
    } else {
      this.state = 'visible';
      this.callback('visible');
      this.resetIdleTimer();
    }
  };
}
