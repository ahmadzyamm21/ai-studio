'use client';

import { useState } from 'react';
import { Check, FileDown } from 'lucide-react';
import ScenePromptPanel from '@/components/scene-builder/ScenePromptPanel';
import type { ScenePrompt } from '@/lib/prompt/types';

type SceneBuilderOutputProps = {
  productCode: string;
  scenePrompts: ScenePrompt[];
};

function formatAllScenes(scenePrompts: ScenePrompt[]) {
  return scenePrompts
    .map((scenePrompt) => `SCENE ${scenePrompt.index} - ${scenePrompt.startSecond}-${scenePrompt.endSecond}s\n${scenePrompt.prompt}`)
    .join('\n\n---\n\n');
}

export default function SceneBuilderOutput({
  productCode,
  scenePrompts,
}: SceneBuilderOutputProps) {
  const [notice, setNotice] = useState<string | null>(null);
  const allScenesText = formatAllScenes(scenePrompts);

  async function copyAllScenes() {
    await navigator.clipboard.writeText(allScenesText);
    setNotice('All scene prompts copied.');
    setTimeout(() => setNotice(null), 2500);
  }

  function exportTxt() {
    const url = URL.createObjectURL(new Blob([allScenesText], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${productCode}-scene-builder.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Scene prompt TXT exported.');
    setTimeout(() => setNotice(null), 2500);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Scene Prompt Output</h3>
          <p className="mt-1 text-xs text-slate-500">Copy per scene or export the full sequence.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyAllScenes}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-violet-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-800"
          >
            <Check className="h-3.5 w-3.5" />
            Copy All Scenes
          </button>
          <button
            type="button"
            onClick={exportTxt}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <FileDown className="h-3.5 w-3.5" />
            Export TXT
          </button>
        </div>
      </div>

      {notice ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
          {notice}
        </div>
      ) : null}

      <div className="mt-5 grid gap-5">
        {scenePrompts.map((scenePrompt) => (
          <ScenePromptPanel key={scenePrompt.sceneId} scenePrompt={scenePrompt} />
        ))}
      </div>
    </section>
  );
}
