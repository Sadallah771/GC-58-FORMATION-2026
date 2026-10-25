// Notification & Audio Helper for GC58 FORMATIONS

/**
 * Play a modern, soft chime using Web Audio API (zero external assets needed)
 */
export function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Oscillator 1 (D5 - 587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.2, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Oscillator 2 (A5 - 880 Hz, harmonizes with D5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.25, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (err) {
    // Audio context may be restricted by browser until user gesture
    console.debug('Notification audio note:', err);
  }
}

/**
 * Request system desktop notification permissions
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return 'denied';
  }
}

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current notification permission
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Fire an operating system / desktop native push notification
 */
export async function sendDesktopNotification(
  title: string,
  message: string,
  link?: string,
  tag = 'gc58-notification'
) {
  // Play soft chime sound
  playNotificationSound();

  if (!isNotificationSupported()) return;

  if (Notification.permission === 'granted') {
    try {
      // Try service worker notification first (better background display & mobile support)
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && typeof (registration as any).showNotification === 'function') {
          await (registration as any).showNotification(title, {
            body: message,
            icon: '/icon.svg',
            badge: '/favicon.svg',
            tag,
            vibrate: [200, 100, 200],
            data: { url: link || '/' },
          });
          return;
        }
      }

      // Fallback to standard Window Notification API
      const notif = new Notification(title, {
        body: message,
        icon: '/icon.svg',
        tag,
      });

      if (link) {
        notif.onclick = () => {
          window.focus();
          window.location.href = link;
          notif.close();
        };
      }
    } catch (e) {
      console.warn('Desktop notification dispatch notice:', e);
    }
  }
}

// Local storage management for read notifications
const READ_NOTIFICATIONS_KEY = 'gc58_read_notifications';

export function getReadNotificationIds(): string[] {
  try {
    const stored = localStorage.getItem(READ_NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function markNotificationAsRead(id: string) {
  try {
    const current = getReadNotificationIds();
    if (!current.includes(id)) {
      const updated = [...current, id];
      localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn('Error saving read notification:', err);
  }
}

export function markAllNotificationsAsRead(ids: string[]) {
  try {
    const current = getReadNotificationIds();
    const merged = Array.from(new Set([...current, ...ids]));
    localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(merged));
  } catch (err) {
    console.warn('Error saving read notifications:', err);
  }
}
