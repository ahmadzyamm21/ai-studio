import { cameras, lights, scenes } from '@/lib/data';
import type { SceneDraft } from '@/lib/prompt/types';

type SceneCardProps = {
  scene: SceneDraft;
  index: number;
  canRemove: boolean;
  onChange: (id: string, updates: Partial<SceneDraft>) => void;
  onRemove: (id: string) => void;
};

const shotTypes = [
  'Product Reveal',
  'Product Detail',
  'Hero Shot',
  'Lifestyle Context',
  'Material Close-Up',
  'Brand / Logo Focus',
];

export default function SceneCard({
  scene,
  index,
  canRemove,
  onChange,
  onRemove,
}: SceneCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Scene {index + 1}
          </p>
          <h4 className="mt-1 text-base font-semibold text-slate-950">{scene.title}</h4>
        </div>
        <button
          type="button"
          onClick={() => onRemove(scene.id)}
          disabled={!canRemove}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Remove
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block space-y-2 text-sm text-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Title</span>
          <input
            value={scene.title}
            onChange={(event) => onChange(scene.id, { title: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </label>

        <label className="block space-y-2 text-sm text-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Duration</span>
          <input
            type="number"
            min={1}
            value={scene.durationSeconds}
            onChange={(event) =>
              onChange(scene.id, {
                durationSeconds: Math.max(1, Number(event.target.value) || 1),
              })
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </label>

        <label className="block space-y-2 text-sm text-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Shot Type</span>
          <select
            value={scene.shotType}
            onChange={(event) => onChange(scene.id, { shotType: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
          >
            {shotTypes.map((shotType) => (
              <option key={shotType}>{shotType}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-2 text-sm text-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Scene Preset</span>
          <select
            value={scene.sceneId}
            onChange={(event) => onChange(scene.id, { sceneId: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
          >
            {scenes.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-2 text-sm text-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Camera</span>
          <select
            value={scene.cameraId}
            onChange={(event) => onChange(scene.id, { cameraId: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
          >
            {cameras.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-2 text-sm text-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Lighting</span>
          <select
            value={scene.lightId}
            onChange={(event) => onChange(scene.id, { lightId: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
          >
            {lights.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-2 text-sm text-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Camera Angle</span>
          <input
            value={scene.cameraAngle}
            onChange={(event) => onChange(scene.id, { cameraAngle: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </label>

        <label className="block space-y-2 text-sm text-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Camera Movement</span>
          <input
            value={scene.cameraMovement}
            onChange={(event) => onChange(scene.id, { cameraMovement: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </label>

        <label className="block space-y-2 text-sm text-slate-700 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Action / Visual Direction</span>
          <textarea
            value={scene.action}
            onChange={(event) => onChange(scene.id, { action: event.target.value })}
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </label>

        <label className="block space-y-2 text-sm text-slate-700 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Environment Override</span>
          <textarea
            value={scene.environment}
            onChange={(event) => onChange(scene.id, { environment: event.target.value })}
            rows={2}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-violet-100"
          />
        </label>

        <label className="block space-y-2 text-sm text-slate-700 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Additional Instruction</span>
          <textarea
            value={scene.additionalInstruction}
            onChange={(event) => onChange(scene.id, { additionalInstruction: event.target.value })}
            rows={2}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </label>
      </div>
    </section>
  );
}
