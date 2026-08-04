'use client';

type UploadBackgroundProps = {
  onUpload: (files: FileList | null) => void;
};

export default function UploadBackground({ onUpload }: UploadBackgroundProps) {
  return (
    <label className="inline-flex w-full cursor-pointer items-center justify-between rounded-3xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm text-slate-100 transition hover:border-slate-500">
      <div>
        <p className="font-semibold text-white">Upload background baru</p>
        <p className="mt-1 text-sm text-slate-400">PNG, JPG, JPEG, WEBP</p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-sm text-white">
        Browse
      </div>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => onUpload(event.target.files)}
      />
    </label>
  );
}
