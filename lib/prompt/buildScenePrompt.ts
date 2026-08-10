import { buildProductDnaBlock } from '@/lib/prompt/buildProductDnaBlock';
import type {
  BackgroundReference,
  ProductDnaPromptContext,
  PromptPreset,
  PromptProduct,
  SceneDraft,
  ScenePrompt,
} from '@/lib/prompt/types';

type BuildScenePromptOptions = {
  scene: SceneDraft;
  index: number;
  startSecond: number;
  endSecond: number;
  product: PromptProduct;
  dna: ProductDnaPromptContext;
  platform: string;
  aspectRatio: string;
  scenePreset: PromptPreset;
  cameraPreset: PromptPreset;
  lightPreset: PromptPreset;
  activeBackground: BackgroundReference | null;
};

function optionalLine(label: string, value: string) {
  return value.trim() ? `- ${label}: ${value.trim()}` : '';
}

function buildBackgroundBlock(activeBackground: BackgroundReference | null, environment: string) {
  const activeBackgroundBlock = activeBackground
    ? `ACTIVE BACKGROUND REFERENCE
- Use the selected background "${activeBackground.name}" as the main environment reference.
- Preserve its layout, floor, wall, furniture, perspective, lighting direction, depth, and shadows.
- Do not recreate or redesign the active background.
- Integrate the product naturally into the supplied background composition.`
    : `ACTIVE BACKGROUND REFERENCE
- No active background is selected. Use the scene environment instruction below.`;

  const sceneEnvironment = environment.trim()
    ? `\n\nSCENE ENVIRONMENT ADDITION\n- ${environment.trim()}`
    : '';

  return `${activeBackgroundBlock}${sceneEnvironment}`;
}

export function buildScenePrompt({
  scene,
  index,
  startSecond,
  endSecond,
  product,
  dna,
  platform,
  aspectRatio,
  scenePreset,
  cameraPreset,
  lightPreset,
  activeBackground,
}: BuildScenePromptOptions): ScenePrompt {
  const productBlock = buildProductDnaBlock({ product, dna });
  const backgroundBlock = buildBackgroundBlock(activeBackground, scene.environment);

  const prompt = `SCENE ${index} - ${startSecond}-${endSecond}s
Title: ${scene.title}

Create a premium, photorealistic commercial product video scene for ${platform}.
This scene is part of a multi-scene concept. Keep the same product identity, materials, proportions, graphics, brand locks, and color palette across every scene.

${productBlock}

${backgroundBlock}

SCENE DIRECTION
- Timeline: ${startSecond}-${endSecond}s
- Duration: ${scene.durationSeconds}s
- Shot Type: ${scene.shotType}
- Scene Preset: ${scenePreset.name} - ${scenePreset.text}
- Camera: ${cameraPreset.name} - ${cameraPreset.text}
${optionalLine('Camera Angle', scene.cameraAngle)}
${optionalLine('Camera Movement', scene.cameraMovement)}
- Lighting: ${lightPreset.name} - ${lightPreset.text}
${optionalLine('Action / Visual Direction', scene.action)}
${optionalLine('Additional Instruction', scene.additionalInstruction)}

MOTION & PHYSICS LOCK
- The product is rigid and physically accurate.
- No morphing, stretching, wobbling, inconsistent reflections, floating straps, or independent movement of parts.
- The visor and structural parts remain consistent unless the scene instruction explicitly says otherwise.

NEGATIVE PROMPT
No redesign, changed logo, misspelled text, altered decal, extra vents, missing screws, duplicated parts, warped visor, changed shell shape, floating strap, hands, watermark, subtitles, random text, flicker, jitter, or visual artifacts.

OUTPUT
Commercial quality, photorealistic, sharp product detail, ${aspectRatio} aspect ratio, scene ${index} only.`;

  return {
    sceneId: scene.id,
    index,
    startSecond,
    endSecond,
    title: scene.title,
    prompt,
  };
}
