import type { ChangeEvent } from 'react';
import ReferenceImageCard from '@/components/reference-images/ReferenceImageCard';

type ProductStatus = 'Active' | 'Draft' | 'Inactive';

type Product = {
  id: string;
  code: string;
  name: string;
  brand: string;
  category: string;
  theme: string | null;
  targetAge: string | null;
  shellMaterial: string | null;
  visor: string | null;
  buckle: string | null;
  status: ProductStatus;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

type ReferenceSlot = {
  readonly slot: string;
  readonly title: string;
  readonly tooltip: string;
  readonly note?: string;
};

type Message = {
  type: 'success' | 'error';
  text: string;
};

type ReferenceImagesTabProps = {
  product: Product;
  images: Record<string, { id: string; slot: string; filename: string; path: string } | null>;
  cacheBusters: Record<string, string>;
  uploadingSlot: string | null;
  deletingSlot: string | null;
  message: Message | null;
  referenceSlots: readonly ReferenceSlot[];
  onFileChange: (slot: string, event: ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: (slot: string) => void;
};

export default function ReferenceImagesTab({
  product,
  images,
  cacheBusters,
  uploadingSlot,
  deletingSlot,
  message,
  referenceSlots,
  onFileChange,
  onDeleteImage,
}: ReferenceImagesTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Reference Images</h2>
            <p className="mt-2 text-sm text-slate-500">
              Preview UI untuk semua slot gambar referensi produk.
            </p>
          </div>
          <div className="text-sm text-slate-500">Saved in public/uploads/products/{product.code}</div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Progress</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {Object.values(images).filter(Boolean).length} / {referenceSlots.length} Completed
              </p>
            </div>
            <div className="w-full max-w-xl">
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-600"
                  style={{ width: `${(Object.values(images).filter(Boolean).length / referenceSlots.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {referenceSlots.map(({ slot, title }) => {
              const hasImage = Boolean(images?.[slot]);
              return (
                <div
                  key={slot}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    hasImage
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-slate-100 text-slate-600'
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
                      hasImage ? 'bg-emerald-700 text-white' : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    ✓
                  </span>
                  <span>{title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {message && (
          <div className={`mt-6 rounded-2xl p-4 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
            {message.text}
          </div>
        )}

        <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {referenceSlots.map(({ slot, title, tooltip, note }) => {
            const image = images?.[slot] ?? null;
            return (
              <ReferenceImageCard
                key={slot}
                slot={slot}
                title={title}
                tooltip={tooltip}
                imageUrl={image?.path ?? undefined}
                cacheBuster={cacheBusters[slot]}
                isUploading={uploadingSlot === slot}
                isDeleting={deletingSlot === slot}
                onSelectFile={(event) => onFileChange(slot, event)}
                onDelete={() => void onDeleteImage(slot)}
                note={note}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
