export type BackgroundItem = {
  id: string;
  name: string;
  fileSize: number;
  uploadAt: string;
  path: string;
  active: boolean;
};

const STORAGE_KEY = 'ai-studio-backgrounds';

export function getActiveBackground(): BackgroundItem | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BackgroundItem[];
    if (!Array.isArray(parsed)) return null;
    return parsed.find((item) => item.active) ?? null;
  } catch {
    return null;
  }
}
