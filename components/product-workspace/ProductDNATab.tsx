import type { ChangeEvent } from 'react';
import { Box, Check, FileText, Layers, Palette, RotateCcw, ShieldCheck } from 'lucide-react';
import AIReadinessCard from '@/components/product-workspace/AIReadinessCard';

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

type Message = {
  type: 'success' | 'error';
  text: string;
};

type ProductDNATabProps = {
  product: Product;
  message: Message | null;
  dnaSku: string;
  dnaBrand: string;
  dnaCategory: string;
  dnaAgeRange: string;
  dnaGender: string;
  dnaMaterial: string;
  dnaFinishing: string;
  dnaVisor: string;
  dnaBuckle: string;
  dnaWeight: string;
  dnaSni: boolean;
  dnaTheme: string;
  dnaPrimaryColor: string;
  dnaSecondaryColor: string;
  dnaAccentColor: string;
  dnaPattern: string;
  dnaLogoPosition: string;
  dnaBrandLock: boolean;
  dnaShapeLock: boolean;
  dnaMaterialLock: boolean;
  dnaGraphicLock: boolean;
  dnaLogoLock: boolean;
  dnaColorLock: boolean;
  dnaNotes: string;
  percentage: number;
  identityScore: number;
  constructionScore: number;
  visualScore: number;
  protectionScore: number;
  imageScore: number;
  aiReadinessScore: number;
  readinessStatus: string;
  readinessBadgeClass: string;
  readinessDotClass: string;
  onSkuChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAgeRangeChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onMaterialChange: (value: string) => void;
  onFinishingChange: (value: string) => void;
  onVisorChange: (value: string) => void;
  onBuckleChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onSniChange: (checked: boolean) => void;
  onThemeChange: (value: string) => void;
  onPrimaryColorChange: (value: string) => void;
  onSecondaryColorChange: (value: string) => void;
  onAccentColorChange: (value: string) => void;
  onPatternChange: (value: string) => void;
  onLogoPositionChange: (value: string) => void;
  onBrandLockChange: (checked: boolean) => void;
  onShapeLockChange: (checked: boolean) => void;
  onMaterialLockChange: (checked: boolean) => void;
  onGraphicLockChange: (checked: boolean) => void;
  onLogoLockChange: (checked: boolean) => void;
  onColorLockChange: (checked: boolean) => void;
  onNotesChange: (value: string) => void;
  onReset: () => void;
  onSave: () => void;
};

export default function ProductDNATab({
  product,
  message,
  dnaSku,
  dnaBrand,
  dnaCategory,
  dnaAgeRange,
  dnaGender,
  dnaMaterial,
  dnaFinishing,
  dnaVisor,
  dnaBuckle,
  dnaWeight,
  dnaSni,
  dnaTheme,
  dnaPrimaryColor,
  dnaSecondaryColor,
  dnaAccentColor,
  dnaPattern,
  dnaLogoPosition,
  dnaBrandLock,
  dnaShapeLock,
  dnaMaterialLock,
  dnaGraphicLock,
  dnaLogoLock,
  dnaColorLock,
  dnaNotes,
  percentage,
  identityScore,
  constructionScore,
  visualScore,
  protectionScore,
  imageScore,
  aiReadinessScore,
  readinessStatus,
  readinessBadgeClass,
  readinessDotClass,
  onSkuChange,
  onBrandChange,
  onCategoryChange,
  onAgeRangeChange,
  onGenderChange,
  onMaterialChange,
  onFinishingChange,
  onVisorChange,
  onBuckleChange,
  onWeightChange,
  onSniChange,
  onThemeChange,
  onPrimaryColorChange,
  onSecondaryColorChange,
  onAccentColorChange,
  onPatternChange,
  onLogoPositionChange,
  onBrandLockChange,
  onShapeLockChange,
  onMaterialLockChange,
  onGraphicLockChange,
  onLogoLockChange,
  onColorLockChange,
  onNotesChange,
  onReset,
  onSave,
}: ProductDNATabProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-slate-950">{product.name}</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{product.code}</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${readinessBadgeClass}`}>
              <span className={`h-2 w-2 rounded-full ${readinessDotClass}`} />
              AI Readiness: {readinessStatus} ({aiReadinessScore}/100)
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Kelola profil spesifikasi genetik produk untuk presisi AI Generator dan Prompt Factory.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-xs uppercase tracking-wider text-slate-400">Completion</span>
              <span className="text-sm font-bold text-slate-900">{percentage}%</span>
            </div>
            <div className="text-right">
              <span className="block text-xs uppercase tracking-wider text-slate-400">AI Score</span>
              <span className="text-sm font-bold text-violet-700">{aiReadinessScore} / 100</span>
            </div>
          </div>
          <div className="w-48 overflow-hidden rounded-full bg-slate-100 sm:w-56">
            <div className="h-2.5 rounded-full bg-violet-600 transition-all duration-300" style={{ width: `${aiReadinessScore}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <AIReadinessCard
          product={product}
          identityScore={identityScore}
          constructionScore={constructionScore}
          visualScore={visualScore}
          protectionScore={protectionScore}
          imageScore={imageScore}
          aiReadinessScore={aiReadinessScore}
          readinessStatus={readinessStatus}
          readinessBadgeClass={readinessBadgeClass}
          readinessDotClass={readinessDotClass}
        />
      </div>

      {message && (
        <div className={`mt-6 rounded-2xl p-4 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
          {message.text}
        </div>
      )}

      <div className="mt-6 grid gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <Box className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Identity</h3>
              <p className="text-xs text-slate-500">Informasi dasar pengenal produk dan target demografi</p>
            </div>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: 'SKU', value: dnaSku, setter: onSkuChange, required: true },
              { label: 'Brand', value: dnaBrand, setter: onBrandChange, required: true },
              { label: 'Category', value: dnaCategory, setter: onCategoryChange, required: true },
              { label: 'Age Range', value: dnaAgeRange, setter: onAgeRangeChange, required: false },
              { label: 'Gender', value: dnaGender, setter: onGenderChange, required: false },
            ].map(({ label, value, setter, required }) => (
              <label key={label} className="space-y-2 text-sm text-slate-700">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">
                  {label} {required && <span className="text-rose-500">*</span>}
                </span>
                <input
                  type="text"
                  value={value}
                  onChange={(event) => setter(event.target.value)}
                  placeholder={`Masukkan ${label.toLowerCase()}...`}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Construction</h3>
              <p className="text-xs text-slate-500">Spesifikasi material fisik, komponen, dan standar keamanan</p>
            </div>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: 'Material', value: dnaMaterial, setter: onMaterialChange, required: true },
              { label: 'Finishing', value: dnaFinishing, setter: onFinishingChange, required: false },
              { label: 'Visor', value: dnaVisor, setter: onVisorChange, required: false },
              { label: 'Buckle', value: dnaBuckle, setter: onBuckleChange, required: false },
              { label: 'Weight', value: dnaWeight, setter: onWeightChange, required: false },
            ].map(({ label, value, setter, required }) => (
              <label key={label} className="space-y-2 text-sm text-slate-700">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">
                  {label} {required && <span className="text-rose-500">*</span>}
                </span>
                <input
                  type="text"
                  value={value}
                  onChange={(event) => setter(event.target.value)}
                  placeholder={`Masukkan ${label.toLowerCase()}...`}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </label>
            ))}
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition cursor-pointer hover:bg-slate-100/50">
              <span className="text-sm font-semibold text-slate-800">SNI Certified</span>
              <input
                type="checkbox"
                checked={dnaSni}
                onChange={(event) => onSniChange(event.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Visual Identity</h3>
              <p className="text-xs text-slate-500">Skema warna, tema grafis, dan posisi logo</p>
            </div>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: 'Theme', value: dnaTheme, setter: onThemeChange, required: true },
              { label: 'Primary Color', value: dnaPrimaryColor, setter: onPrimaryColorChange, required: true },
              { label: 'Secondary Color', value: dnaSecondaryColor, setter: onSecondaryColorChange, required: false },
              { label: 'Accent Color', value: dnaAccentColor, setter: onAccentColorChange, required: false },
              { label: 'Pattern', value: dnaPattern, setter: onPatternChange, required: false },
              { label: 'Logo Position', value: dnaLogoPosition, setter: onLogoPositionChange, required: false },
            ].map(({ label, value, setter, required }) => (
              <label key={label} className="space-y-2 text-sm text-slate-700">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">
                  {label} {required && <span className="text-rose-500">*</span>}
                </span>
                <input
                  type="text"
                  value={value}
                  onChange={(event) => setter(event.target.value)}
                  placeholder={`Masukkan ${label.toLowerCase()}...`}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">AI Protection</h3>
              <p className="text-xs text-slate-500">Kunci komponen agar konsisten saat dirender AI</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: 'Brand Lock', checked: dnaBrandLock, setter: onBrandLockChange },
              { label: 'Shape Lock', checked: dnaShapeLock, setter: onShapeLockChange },
              { label: 'Material Lock', checked: dnaMaterialLock, setter: onMaterialLockChange },
              { label: 'Graphic Lock', checked: dnaGraphicLock, setter: onGraphicLockChange },
              { label: 'Logo Lock', checked: dnaLogoLock, setter: onLogoLockChange },
              { label: 'Color Lock', checked: dnaColorLock, setter: onColorLockChange },
            ].map(({ label, checked, setter }) => (
              <label key={label} className={`flex items-center justify-between rounded-2xl border p-4 transition cursor-pointer ${checked ? 'border-violet-300 bg-violet-50/50 shadow-sm' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50'}`}>
                <span className="text-sm font-semibold text-slate-800">{label}</span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => setter(event.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">AI Notes</h3>
              <p className="text-xs text-slate-500">Catatan khusus tambahan untuk engine generator AI</p>
            </div>
          </div>
          <div className="mt-5">
            <label className="text-sm text-slate-700">
              <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">Special Generation Notes</span>
              <textarea
                rows={6}
                value={dnaNotes}
                onChange={(event) => onNotesChange(event.target.value)}
                placeholder="Tuliskan catatan khusus, instruksi prompt, atau batasan rendering..."
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </label>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-lg shadow-slate-950/10"
          >
            <Check className="h-4 w-4" />
            Save Product DNA
          </button>
        </div>
      </div>
    </div>
  );
}
