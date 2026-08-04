'use client';

import { useEffect, useMemo, useState } from 'react';
import BackgroundCard from '@/components/background-library/BackgroundCard';
import UploadBackground from '@/components/background-library/UploadBackground';

type BackgroundItem = {
  id: string;
  name: string;
  fileSize: number;
  uploadAt: string;
  path: string;
  active: boolean;
};

const STORAGE_KEY = 'ai-studio-backgrounds';

function loadBackgrounds(): BackgroundItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BackgroundItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBackgrounds(items: BackgroundItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (size >= 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${size} B`;
}

export default function BackgroundLibrary() {
  const [backgrounds, setBackgrounds] = useState<BackgroundItem[]>([]);

  useEffect(() => {
    setBackgrounds(loadBackgrounds());
  }, []);

  const activeBackgroundId = useMemo(
    () => backgrounds.find((item) => item.active)?.id,
    [backgrounds],
  );

  const handleSelect = (id: string) => {
    setBackgrounds((current) => {
      const updated = current.map((item) => ({
        ...item,
        active: item.id === id,
      }));
      saveBackgrounds(updated);
      return updated;
    });
  };

  const handleDelete = (id: string) => {
    setBackgrounds((current) => {
      const updated = current.filter((item) => item.id !== id);
      saveBackgrounds(updated);
      return updated;
    });
  };

  const handleUpload = (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    const supported = ['image/png', 'image/jpeg', 'image/webp'];
    if (!supported.includes(file.type)) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') return;

      const newBackground: BackgroundItem = {
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        fileSize: file.size,
        uploadAt: new Date().toISOString(),
        path: result,
        active: backgrounds.length === 0,
      };

      setBackgrounds((current) => {
        const updated = current.map((item) => ({ ...item, active: false }));
        const next = [...updated, newBackground];
        saveBackgrounds(next);
        return next;
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div className="grid" style={{ gap: '16px' }}>
        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-8 shadow-xl shadow-slate-200/10">
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-white">Background Library</h2>
              <p className="mt-2 text-sm text-slate-400">
                Unggah background lokal Anda untuk digunakan pada tahap berikutnya.
              </p>
            </div>
            <UploadBackground onUpload={handleUpload} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Your backgrounds</h3>
              <p className="mt-1 text-sm text-slate-500">
                Pilih satu background sebagai active default.
              </p>
            </div>
            <span className="badge">{backgrounds.length} saved</span>
          </div>

          {backgrounds.length === 0 ? (
            <div className="empty-state rounded-3xl border border-dashed border-slate-300 p-10 text-slate-500">
              <p className="text-lg font-semibold text-slate-900">Belum ada background</p>
              <p className="mt-3 text-sm">Unggah background untuk mulai membangun library Anda.</p>
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {backgrounds.map((background) => (
                <BackgroundCard
                  key={background.id}
                  background={background}
                  isActive={background.active}
                  onSelect={() => handleSelect(background.id)}
                  onDelete={() => handleDelete(background.id)}
                  formatFileSize={formatFileSize}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
