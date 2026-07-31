'use client';

import { ChangeEvent, useRef } from 'react';
import { Trash2, UploadCloud } from 'lucide-react';

type ReferenceImageCardProps = {
  slot: string;
  title: string;
  imageUrl?: string;
  cacheBuster?: string;
  isUploading?: boolean;
  isDeleting?: boolean;
  onSelectFile: (event: ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
};

export default function ReferenceImageCard({
  slot,
  title,
  imageUrl,
  cacheBuster,
  isUploading = false,
  isDeleting = false,
  onSelectFile,
  onDelete,
}: ReferenceImageCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasImage = Boolean(imageUrl);
  const isBusy = isUploading || isDeleting;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">250x250</span>
      </div>
      <div className="mt-4 flex h-[250px] items-center justify-center overflow-hidden rounded-3xl bg-slate-100 text-slate-400">
        {hasImage ? (
          <img
            src={`${imageUrl}${cacheBuster ? `?cb=${cacheBuster}` : ''}`}
            alt={`${title} preview`}
            className="h-full w-full object-cover"
          />
        ) : (
          <UploadCloud className="h-12 w-12" />
        )}
      </div>
      <div className="mt-5 space-y-3">
        <button
          type="button"
          className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-semibold transition ${
            !hasImage && !isBusy
              ? 'bg-slate-950 text-white hover:bg-slate-800'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
          disabled={hasImage || isBusy}
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className="h-4 w-4" />
          Upload
        </button>
        <button
          type="button"
          className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-semibold transition ${
            hasImage && !isBusy
              ? 'bg-slate-950 text-white hover:bg-slate-800'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
          disabled={!hasImage || isBusy}
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className="h-4 w-4" />
          Replace
        </button>
        <button
          type="button"
          className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-semibold transition ${
            hasImage && !isBusy
              ? 'bg-rose-600 text-white hover:bg-rose-700'
              : 'bg-rose-100 text-rose-400 cursor-not-allowed'
          }`}
          disabled={!hasImage || isBusy}
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onSelectFile}
        />
      </div>
    </div>
  );
}
