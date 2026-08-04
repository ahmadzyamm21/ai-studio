type PromptTemplateSelectorProps = {
  promptStyle: string;
  promptCamera: string;
  promptLighting: string;
  promptPlatform: string;
  onPromptStyleChange: (value: string) => void;
  onPromptCameraChange: (value: string) => void;
  onPromptLightingChange: (value: string) => void;
  onPromptPlatformChange: (value: string) => void;
};

export default function PromptTemplateSelector({
  promptStyle,
  promptCamera,
  promptLighting,
  promptPlatform,
  onPromptStyleChange,
  onPromptCameraChange,
  onPromptLightingChange,
  onPromptPlatformChange,
}: PromptTemplateSelectorProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-slate-950">2. Generation Parameters</h3>
      <p className="text-xs text-slate-500">Sesuaikan gaya fotografi, kamera, pencahayaan, dan platform AI</p>

      <label className="block space-y-2 text-sm text-slate-700">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Photography Style</span>
        <select
          value={promptStyle}
          onChange={(e) => onPromptStyleChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
        >
          <option>Studio Minimalist</option>
          <option>Lifestyle Kids Room</option>
          <option>Outdoor Urban Daylight</option>
          <option>Neon Cyberpunk Commercial</option>
        </select>
      </label>

      <label className="block space-y-2 text-sm text-slate-700">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Camera</span>
        <select
          value={promptCamera}
          onChange={(e) => onPromptCameraChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
        >
          <option>Eye-level 50mm portrait</option>
          <option>Macro detail close-up shot</option>
          <option>Cinematic 85mm shallow depth</option>
          <option>Low angle hero shot</option>
        </select>
      </label>

      <label className="block space-y-2 text-sm text-slate-700">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Lighting</span>
        <select
          value={promptLighting}
          onChange={(e) => onPromptLightingChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
        >
          <option>Soft Studio Softbox</option>
          <option>Dramatic Rim Light</option>
          <option>Natural Golden Hour Sunlight</option>
          <option>Clean High-Key Commercial</option>
        </select>
      </label>

      <label className="block space-y-2 text-sm text-slate-700">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">AI Platform</span>
        <select
          value={promptPlatform}
          onChange={(e) => onPromptPlatformChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
        >
          <option>Google Imagen</option>
          <option>Google Veo</option>
          <option>ChatGPT Image</option>
          <option>Kling</option>
        </select>
      </label>
    </section>
  );
}
