'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import SceneBuilderOutput from '@/components/scene-builder/SceneBuilderOutput';
import SceneCard from '@/components/scene-builder/SceneCard';
import { cameras, lights, scenes } from '@/lib/data';
import { buildScenePrompt } from '@/lib/prompt/buildScenePrompt';
import type {
  BackgroundReference,
  ProductDnaPromptContext,
  PromptProduct,
  SceneDraft,
} from '@/lib/prompt/types';

type SceneBuilderProps = {
  product: PromptProduct;
  dna: ProductDnaPromptContext;
  activeBackground: BackgroundReference | null;
  platform: string;
  aspectRatio: string;
};

const defaultSceneTemplates: Omit<SceneDraft, 'id'>[] = [
  {
    title: 'Product Reveal',
    durationSeconds: 5,
    shotType: 'Product Reveal',
    sceneId: scenes[0].id,
    cameraId: cameras[1]?.id ?? cameras[0].id,
    lightId: lights[1]?.id ?? lights[0].id,
    cameraAngle: 'Eye-level three-quarter angle',
    cameraMovement: 'Slow push in',
    action: 'Reveal the product clearly while preserving the original silhouette, graphics, and logo visibility.',
    environment: '',
    additionalInstruction: '',
  },
  {
    title: 'Product Detail',
    durationSeconds: 5,
    shotType: 'Product Detail',
    sceneId: scenes[0].id,
    cameraId: cameras[2]?.id ?? cameras[0].id,
    lightId: lights[0].id,
    cameraAngle: 'Controlled macro detail angle',
    cameraMovement: 'Slow macro push across visor, trim, decals, and surface finish',
    action: 'Show material, visor, fasteners, trim, and artwork details without changing proportions.',
    environment: '',
    additionalInstruction: '',
  },
  {
    title: 'Hero Shot',
    durationSeconds: 5,
    shotType: 'Hero Shot',
    sceneId: scenes[1]?.id ?? scenes[0].id,
    cameraId: cameras[0].id,
    lightId: lights[3]?.id ?? lights[0].id,
    cameraAngle: 'Low hero three-quarter angle',
    cameraMovement: 'Subtle orbit with stable product framing',
    action: 'End with a premium hero composition that keeps the brand mark, shell shape, and graphics readable.',
    environment: '',
    additionalInstruction: '',
  },
];

function createScene(templateIndex: number): SceneDraft {
  const template = defaultSceneTemplates[templateIndex % defaultSceneTemplates.length];
  return {
    ...template,
    id: `scene-${Date.now()}-${templateIndex}`,
    title: templateIndex < defaultSceneTemplates.length ? template.title : `Scene ${templateIndex + 1}`,
  };
}

export default function SceneBuilder({
  product,
  dna,
  activeBackground,
  platform,
  aspectRatio,
}: SceneBuilderProps) {
  const [sceneDrafts, setSceneDrafts] = useState<SceneDraft[]>(() =>
    defaultSceneTemplates.map((_, index) => createScene(index)),
  );

  const totalDuration = sceneDrafts.reduce((sum, scene) => sum + scene.durationSeconds, 0);

  const scenePrompts = useMemo(() => {
    let cursor = 0;
    return sceneDrafts.map((scene, index) => {
      const startSecond = cursor;
      const endSecond = cursor + scene.durationSeconds;
      cursor = endSecond;

      return buildScenePrompt({
        scene,
        index: index + 1,
        startSecond,
        endSecond,
        product,
        dna,
        platform,
        aspectRatio,
        scenePreset: scenes.find((item) => item.id === scene.sceneId) ?? scenes[0],
        cameraPreset: cameras.find((item) => item.id === scene.cameraId) ?? cameras[0],
        lightPreset: lights.find((item) => item.id === scene.lightId) ?? lights[0],
        activeBackground,
      });
    });
  }, [activeBackground, aspectRatio, dna, platform, product, sceneDrafts]);

  function updateScene(id: string, updates: Partial<SceneDraft>) {
    setSceneDrafts((current) =>
      current.map((scene) => (scene.id === id ? { ...scene, ...updates } : scene)),
    );
  }

  function addScene() {
    setSceneDrafts((current) => [...current, createScene(current.length)]);
  }

  function removeScene(id: string) {
    setSceneDrafts((current) => (current.length > 1 ? current.filter((scene) => scene.id !== id) : current));
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Scene Builder</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">Multi-scene prompt sequence</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Build separate external prompts for Google Flow, Veo, or another platform while keeping Product DNA consistent across every scene.
          </p>
        </div>
        <button
          type="button"
          onClick={addScene}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Scene
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Video Duration</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{totalDuration}s</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Scenes</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{sceneDrafts.length}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Background</p>
          <p className="mt-2 truncate text-sm font-semibold text-slate-950">
            {activeBackground ? activeBackground.name : 'No active background'}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5">
        {sceneDrafts.map((scene, index) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            index={index}
            canRemove={sceneDrafts.length > 1}
            onChange={updateScene}
            onRemove={removeScene}
          />
        ))}
      </div>

      <div className="mt-6">
        <SceneBuilderOutput productCode={product.code} scenePrompts={scenePrompts} />
      </div>
    </section>
  );
}
