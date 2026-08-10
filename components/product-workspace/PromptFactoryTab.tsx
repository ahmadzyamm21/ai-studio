import GeneratedPromptPanel from '@/components/product-workspace/GeneratedPromptPanel';
import PromptTemplateSelector from '@/components/product-workspace/PromptTemplateSelector';

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

type PromptFactoryTabProps = {
  product: Product;
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
  promptStyle: string;
  promptCamera: string;
  promptLighting: string;
  promptPlatform: string;
  promptCopyStatus: string | null;
  promptCopyError: string | null;
  regenerateVersion: number;
  generatedPromptText: string;
  aiReadinessScore: number;
  readinessStatus: string;
  readinessBadgeClass: string;
  readinessDotClass: string;
  identityScore: number;
  constructionScore: number;
  visualScore: number;
  protectionScore: number;
  imageScore: number;
  onPromptStyleChange: (value: string) => void;
  onPromptCameraChange: (value: string) => void;
  onPromptLightingChange: (value: string) => void;
  onPromptPlatformChange: (value: string) => void;
  onCopyPrompt: () => void;
  onRegeneratePrompt: () => void;
};

export default function PromptFactoryTab({
  product,
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
  promptStyle,
  promptCamera,
  promptLighting,
  promptPlatform,
  promptCopyStatus,
  promptCopyError,
  regenerateVersion,
  generatedPromptText,
  aiReadinessScore,
  readinessStatus,
  readinessBadgeClass,
  readinessDotClass,
  identityScore,
  constructionScore,
  visualScore,
  protectionScore,
  imageScore,
  onPromptStyleChange,
  onPromptCameraChange,
  onPromptLightingChange,
  onPromptPlatformChange,
  onCopyPrompt,
  onRegeneratePrompt,
}: PromptFactoryTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        {aiReadinessScore < 80 && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200 font-bold text-amber-800 text-xs">!</span>
              <div>
                <strong className="font-semibold">AI Readiness Score: {aiReadinessScore}/100 ({readinessStatus}).</strong>{' '}
                Data Product DNA atau gambar referensi belum lengkap (di bawah 80). Prompt tetap dapat dihasilkan, namun kualitas hasil render AI mungkin lebih rendah.
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">1. Product Context (Read Only)</h3>
              <p className="mt-1 text-xs text-slate-500">Sumber data dari Product DNA aktif</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <span className="block text-xs uppercase tracking-wider text-slate-400">SKU / Code</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-900">{dnaSku || product.code}</span>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <span className="block text-xs uppercase tracking-wider text-slate-400">Brand</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-900">{dnaBrand || product.brand}</span>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <span className="block text-xs uppercase tracking-wider text-slate-400">Theme</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-900">{dnaTheme || product.theme || '—'}</span>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <span className="block text-xs uppercase tracking-wider text-slate-400">Material</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-900">{dnaMaterial || product.shellMaterial || '—'}</span>
                </div>
              </div>
            </section>

            <PromptTemplateSelector
              promptStyle={promptStyle}
              promptCamera={promptCamera}
              promptLighting={promptLighting}
              promptPlatform={promptPlatform}
              onPromptStyleChange={onPromptStyleChange}
              onPromptCameraChange={onPromptCameraChange}
              onPromptLightingChange={onPromptLightingChange}
              onPromptPlatformChange={onPromptPlatformChange}
            />
          </div>

          <div className="space-y-6">
            <GeneratedPromptPanel
              promptPlatform={promptPlatform}
              generatedPromptText={generatedPromptText}
              promptCopyStatus={promptCopyStatus}
              promptCopyError={promptCopyError}
              onRegeneratePrompt={onRegeneratePrompt}
              onCopyPrompt={onCopyPrompt}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
