'use client';

import { Trash2 } from 'lucide-react';

type BackgroundItem = {
  id: string;
  name: string;
  fileSize: number;
  uploadAt: string;
  path: string;
  active: boolean;
};

type BackgroundCardProps = {
  background: BackgroundItem;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  formatFileSize: (size: number) => string;
};

export default function BackgroundCard({
  background,
  isActive,
  onSelect,
  onDelete,
  formatFileSize,
}: BackgroundCardProps) {
  return (
    <div className={`rounded-3xl border p-4 shadow-sm ${isActive ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 bg-white'}`}>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100" style={{ minHeight: '180px' }}>
        <img src={background.path} alt={background.name} className="h-full w-full object-cover" />
        {isActive ? (
          <span className="absolute left-4 top-4 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">Active</span>
        ) : null}
      </div>
      <div className="mt-4 space-y-2">
        <div>
          <p className="text-sm font-semibold text-slate-950">{background.name}</p>
          <p className="text-xs text-slate-500">{formatFileSize(background.fileSize)}</p>
        </div>
        <p className="text-xs text-slate-500">{new Date(background.uploadAt).toLocaleString()}</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className={`inline-flex min-w-[94px] items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-950 text-white hover:bg-slate-800'}`}
          onClick={onSelect}
          disabled={isActive}
        >
          Select
        </button>
        <button
          type="button"
          className="inline-flex min-w-[94px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
