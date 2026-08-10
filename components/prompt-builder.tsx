'use client';

import { useEffect, useMemo, useState } from 'react';
import SceneBuilder from '@/components/scene-builder/SceneBuilder';
import { cameras, lights, scenes } from '@/lib/data';
import { BackgroundItem, getActiveBackground } from '@/lib/background/getActiveBackground';

type StoredProduct = {
  id: string;
  code: string;
  name: string;
  brand: string;
  category: string;
  targetAge: string;
  theme: string;
  shellMaterial: string;
  visor: string;
  buckle: string;
  status: string;
  description: string;
  referenceFiles?: Record<string, string>;
};

const fallbackProduct: StoredProduct = {
  id: 'captain-america',
  code: 'RR-KID-CAP01',
  name: 'Helm Anak Captain America',
  brand: 'RetroRide',
  category: 'Kids Half Face Helmet',
  targetAge: '5Ã¢â‚¬â€œ8 tahun',
  theme: 'Captain America',
  shellMaterial: 'ABS Glossy',
  visor: 'Smoke Polycarbonate',
  buckle: 'Quick Release Orange',
  status: 'Active',
  description: 'Helm anak dengan logo RetroRide pada bagian atas.',
  referenceFiles: {},
};

export function PromptBuilder() {
  const [products, setProducts] = useState<StoredProduct[]>([fallbackProduct]);
  const [productId, setProductId] = useState(fallbackProduct.id);
  const [sceneId, setSceneId] = useState(scenes[0].id);
  const [cameraId, setCameraId] = useState(cameras[0].id);
  const [lightId, setLightId] = useState(lights[0].id);
  const [platform, setPlatform] = useState('Google Flow / Veo');
  const [aspect, setAspect] = useState('1:1');
  const [duration, setDuration] = useState('8 seconds');
  const [notice, setNotice] = useState('');
  const [activeBackground, setActiveBackground] = useState<BackgroundItem | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('ai-studio-products');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as StoredProduct[];
      if (parsed.length) {
        setProducts(parsed);
        setProductId(parsed[0].id);
      }
    } catch {
      setProducts([fallbackProduct]);
    }
  }, []);

  useEffect(() => {
    setActiveBackground(getActiveBackground());
  }, []);

  const product = products.find((item) => item.id === productId) ?? products[0];
  const scene = scenes.find((item) => item.id === sceneId) ?? scenes[0];
  const camera = cameras.find((item) => item.id === cameraId) ?? cameras[0];
  const light = lights.find((item) => item.id === lightId) ?? lights[0];
  const referenceCount = Object.keys(product?.referenceFiles ?? {}).length;

  const prompt = useMemo(() => {
    if (!product) return '';
    const backgroundInstruction = activeBackground
      ? `\n\nBACKGROUND REFERENCE\nUse the selected background image as the exact environment.\nPreserve:\n- room layout\n- floor\n- wall\n- furniture\n- perspective\n- lighting direction\n- depth\n- shadows\n\nDo not recreate or redesign the environment.\n\nThe product must integrate naturally into the supplied background while preserving the original background composition.`
      : '';

    return `Create a premium, photorealistic commercial product video for ${platform}. Use the seven supplied reference images as the only visual source of truth.${backgroundInstruction}

PRODUCT IDENTITY
Product: ${product.name}
Code: ${product.code}
Brand: ${product.brand}
Category: ${product.category}
Target age: ${product.targetAge}
Theme: ${product.theme}

PRODUCT LOCK
Preserve the exact original shell geometry, proportions, ${product.shellMaterial}, black trim, screw positions, visor mounting points, strap and ${product.buckle}. Keep the ${product.visor} visor closed and physically accurate.

GRAPHIC & BRAND LOCK
Preserve the exact ${product.theme} artwork, colors, decal scale and placement. Preserve the RetroRide logo on the top of the helmet exactly as shown in the top-view reference. The logo must remain visible, correctly spelled, undistorted and in its original position. Do not invent, remove or reposition any graphic.

REFERENCE PRIORITY
Front establishes the main shape. Front-left and front-right establish three-quarter geometry. Left and right establish side graphics. Back establishes rear construction. Top view establishes the upper shell shape and brand-logo placement.

SCENE
${scene.text}. The environment must support the product and never cover the helmet, visor, graphics or logo.

CAMERA
${camera.text}. Use smooth, stable movement and a realistic focal length. No wide-angle deformation.

LIGHTING
${light.text}. Preserve the real product colors, gloss and material response. Avoid blown highlights that hide the logo or graphics.

MOTION & PHYSICS LOCK
The helmet is rigid. No morphing, stretching, wobbling or independent movement of parts. The visor stays closed. Reflections move naturally with the camera and lighting.

NEGATIVE PROMPT
No redesign, changed logo, misspelled text, altered decal, extra vents, missing screws, duplicated parts, warped visor, changed shell shape, floating strap, hands, watermark, subtitles, random text, flicker, jitter or visual artifacts.

OUTPUT
Commercial quality, photorealistic, sharp product detail, ${aspect} aspect ratio, ${duration}, suitable for marketplace and social-media advertising.`;
  }, [activeBackground, product, scene, camera, light, platform, aspect, duration]);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setNotice('Prompt berhasil disalin.');
  }

  function exportTxt() {
    const url = URL.createObjectURL(new Blob([prompt], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.code}-${scene.id}-${camera.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice('File TXT berhasil dibuat.');
  }

  if (!product) return null;

  return (
    <div className="space-y-6">
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <section className="card">
            <div className="form-grid">
              <label>
                Product
                <select value={productId} onChange={(event) => setProductId(event.target.value)}>
                  {products.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Platform
                <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
                  <option>Google Flow / Veo</option>
                  <option>Imagen</option>
                  <option>ChatGPT Image</option>
                  <option>Kling</option>
                </select>
              </label>

              <label>
                Scene
                <select value={sceneId} onChange={(event) => setSceneId(event.target.value)}>
                  {scenes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Camera
                <select value={cameraId} onChange={(event) => setCameraId(event.target.value)}>
                  {cameras.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Lighting
                <select value={lightId} onChange={(event) => setLightId(event.target.value)}>
                  {lights.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Aspect Ratio
                <select value={aspect} onChange={(event) => setAspect(event.target.value)}>
                  <option>1:1</option>
                  <option>9:16</option>
                  <option>16:9</option>
                </select>
              </label>

              <label>
                Duration
                <select value={duration} onChange={(event) => setDuration(event.target.value)}>
                  <option>6 seconds</option>
                  <option>8 seconds</option>
                  <option>10 seconds</option>
                </select>
              </label>
            </div>

            <div
              className={`reference-status ${referenceCount === 7 ? 'complete' : ''}`}
              style={{ marginTop: 24 }}
            >
              <div>
                <strong>Reference readiness</strong>
                <span>{referenceCount}/7 photos recorded</span>
              </div>

              <div className="progress-track">
                <span style={{ width: `${(referenceCount / 7) * 100}%` }} />
              </div>

              <small>
                {referenceCount === 7
                  ? 'Semua sudut sudah lengkap.'
                  : 'Lengkapi 7 foto pada menu Products. Top view wajib menampilkan logo.'}
              </small>
            </div>
          </section>

          <section className="card prompt-output">
            <div className="prompt-output-header">
              <div>
                <div className="eyebrow">Generated prompt</div>
                <strong>{product.code}</strong>
              </div>

              <div className="prompt-actions">
                <button className="btn" onClick={copyPrompt}>
                  Copy Prompt
                </button>
                <button className="btn secondary" onClick={exportTxt}>
                  Export TXT
                </button>
              </div>
            </div>

            {notice && <div className="inline-notice">{notice}</div>}

            <textarea
              readOnly
              value={prompt}
              aria-label="Generated prompt"
              style={{ minHeight: 360, maxHeight: 520, overflowY: 'auto' }}
            />
          </section>
        </div>

        <div className="space-y-6">
          <section className="card prompt-output">
            <div className="prompt-output-header">
              <div>
                <div className="eyebrow">Background</div>
                <strong>Active background</strong>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              {activeBackground ? (
                <div className="flex flex-col gap-4">
                  <img
                    src={activeBackground.path}
                    alt={activeBackground.name}
                    className="w-full rounded-3xl object-cover"
                    style={{ maxHeight: 500 }}
                  />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-950">{activeBackground.name}</p>
                    <p className="text-sm text-slate-500">Active background selected</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No active background selected.</p>
              )}
            </div>
          </section>
        </div>
      </div>

      <SceneBuilder
        product={{
          id: product.id,
          code: product.code,
          name: product.name,
          brand: product.brand,
          category: product.category,
          theme: product.theme,
          targetAge: product.targetAge,
          shellMaterial: product.shellMaterial,
          visor: product.visor,
          buckle: product.buckle,
          description: product.description,
        }}
        dna={{
          sku: product.code,
          brand: product.brand,
          category: product.category,
          ageRange: product.targetAge,
          gender: '',
          material: product.shellMaterial,
          finishing: '',
          visor: product.visor,
          buckle: product.buckle,
          weight: '',
          sni: false,
          theme: product.theme,
          primaryColor: '',
          secondaryColor: '',
          accentColor: '',
          pattern: product.theme,
          logoPosition: 'Top reference image',
          brandLock: true,
          shapeLock: true,
          materialLock: true,
          graphicLock: true,
          logoLock: true,
          colorLock: true,
          notes: product.description,
        }}
        activeBackground={activeBackground}
        platform={platform}
        aspectRatio={aspect}
      />
    </div>
  );
}
