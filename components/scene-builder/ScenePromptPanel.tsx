'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import type { ScenePrompt } from '@/lib/prompt/types';

type ScenePromptPanelProps = {
  scenePrompt: ScenePrompt;
};

export default function ScenePromptPanel({ scenePrompt }: ScenePromptPanelProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  async function copyScene() {
    await navigator.clipboard.writeText(scenePrompt.prompt);
    setCopyStatus('Scene prompt copied.');
    setTimeout(() => setCopyStatus(null), 2500);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            SCENE {scenePrompt.index} - {scenePrompt.startSecond}-{scenePrompt.endSecond}s
          </p>
          <h4 className="mt-1 text-base font-semibold text-slate-950">{scenePrompt.title}</h4>
        </div>
        <button
          type="button"
          onClick={copyScene}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-violet-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-800"
        >
          <Check className="h-3.5 w-3.5" />
          Copy Scene
        </button>
      </div>

      {copyStatus ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
          {copyStatus}
        </div>
      ) : null}

      <textarea
        readOnly
        value={scenePrompt.prompt}
        rows={16}
        className="mt-4 w-full resize-y rounded-2xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100 outline-none"
      />
    </section>
  );
}
