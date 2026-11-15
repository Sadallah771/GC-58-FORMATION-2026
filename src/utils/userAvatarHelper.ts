/**
 * Helper to manage user avatar upload, storage, and synchronization across the app.
 */

const AVATAR_EVENT_NAME = 'gc58_avatar_updated';

export const getUserAvatar = (userId?: string | null): string | null => {
  if (!userId) return null;
  try {
    return localStorage.getItem(`gc58_user_avatar_${userId}`);
  } catch {
    return null;
  }
};

export const saveUserAvatar = (userId: string, avatarDataUrl: string): void => {
  try {
    localStorage.setItem(`gc58_user_avatar_${userId}`, avatarDataUrl);
    window.dispatchEvent(new CustomEvent(AVATAR_EVENT_NAME, { detail: { userId, avatarDataUrl } }));
  } catch (err) {
    console.warn('Failed to save avatar to localStorage:', err);
  }
};

export const removeUserAvatar = (userId: string): void => {
  try {
    localStorage.removeItem(`gc58_user_avatar_${userId}`);
    window.dispatchEvent(new CustomEvent(AVATAR_EVENT_NAME, { detail: { userId, avatarDataUrl: null } }));
  } catch (err) {
    console.warn('Failed to remove avatar from localStorage:', err);
  }
};

export const subscribeToAvatarChanges = (userId: string | undefined | null, callback: (avatar: string | null) => void) => {
  if (!userId) return () => {};

  const handler = (e: Event) => {
    const custom = e as CustomEvent<{ userId: string; avatarDataUrl: string | null }>;
    if (custom.detail?.userId === userId) {
      callback(custom.detail.avatarDataUrl);
    }
  };

  window.addEventListener(AVATAR_EVENT_NAME, handler);
  return () => window.removeEventListener(AVATAR_EVENT_NAME, handler);
};
