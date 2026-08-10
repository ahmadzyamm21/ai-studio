export type BackgroundItem = {
  id: string;
  name: string;
  fileSize: number;
  uploadAt: string;
  path: string;
  active: boolean;
};

export const BACKGROUND_STORAGE_KEY = 'ai-studio-backgrounds';
export const BACKGROUND_UPDATED_EVENT = 'ai-studio-backgrounds-updated';

export function getActiveBackground(): BackgroundItem | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(BACKGROUND_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BackgroundItem[];
    if (!Array.isArray(parsed)) return null;
    return parsed.find((item) => item.active) ?? null;
  } catch {
    return null;
  }
}

export function notifyBackgroundsUpdated() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(BACKGROUND_UPDATED_EVENT));
}
