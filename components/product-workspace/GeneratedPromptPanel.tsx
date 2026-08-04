import { Check, RotateCcw } from 'lucide-react';

type GeneratedPromptPanelProps = {
  promptPlatform: string;
  generatedPromptText: string;
  promptCopyStatus: string | null;
  promptCopyError: string | null;
  onRegeneratePrompt: () => void;
  onCopyPrompt: () => void;
};

export default function GeneratedPromptPanel({
  promptPlatform,
  generatedPromptText,
  promptCopyStatus,
  promptCopyError,
  onRegeneratePrompt,
  onCopyPrompt,
}: GeneratedPromptPanelProps) {
  return (
    <section className="flex flex-col h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Prompt Preview</h3>
          <p className="text-xs text-slate-500">Generated for {promptPlatform}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRegeneratePrompt}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Regenerate
          </button>
          <button
            type="button"
            onClick={onCopyPrompt}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-violet-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-800 shadow-sm"
          >
            <Check className="h-3.5 w-3.5" />
            Copy Prompt
          </button>
        </div>
      </div>

      {promptCopyStatus && (
        <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-medium text-emerald-800">
          {promptCopyStatus}
        </div>
      )}

      {promptCopyError && (
        <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-800">
          {promptCopyError}
        </div>
      )}

      <div className="mt-4 flex-1">
        <textarea
          readOnly
          value={generatedPromptText}
          rows={18}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100 outline-none"
        />
      </div>
    </section>
  );
}
