'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Box, Check, FileText, Layers, Palette, Pencil, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReferenceImageCard from '@/components/reference-images/ReferenceImageCard';
import SceneBuilder from '@/components/scene-builder/SceneBuilder';
import ProductOverviewTab from '@/components/product-workspace/ProductOverviewTab';
import ReferenceImagesTab from '@/components/product-workspace/ReferenceImagesTab';
import ProductDNATab from '@/components/product-workspace/ProductDNATab';
import { BackgroundItem, getActiveBackground } from '@/lib/background/getActiveBackground';

type ProductStatus = 'Active' | 'Draft' | 'Inactive';

type ReferenceSlot = {
  readonly slot: string;
  readonly title: string;
  readonly tooltip: string;
  readonly note?: string;
};

const referenceSlots: readonly ReferenceSlot[] = [
  { slot: 'Front', title: 'Front', tooltip: 'Foto lurus dari depan' },
  { slot: 'Front Left', title: 'Front Left 45°', tooltip: 'Sudut 45° kiri' },
  { slot: 'Left', title: 'Left', tooltip: '90° sisi kiri' },
  { slot: 'Right', title: 'Right', tooltip: '90° sisi kanan' },
  { slot: 'Back', title: 'Back', tooltip: 'Foto lurus belakang' },
  { slot: 'Front Right', title: 'Front Right 45°', tooltip: 'Sudut 45° kanan' },
  {
    slot: 'Top',
    title: 'Top',
    tooltip: 'Foto dari atas. Logo harus terlihat jelas.',
    note: 'Logo dan detail bagian atas harus terlihat jelas.',
  },
];

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

const tabs = [
  'Overview',
  'Reference Images',
  'Product DNA',
  'Prompt Factory',
] as const;

type Tab = (typeof tabs)[number];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [error, setError] = useState('');
  const [images, setImages] = useState<Record<string, { id: string; slot: string; filename: string; path: string } | null>>({});
  const [cacheBusters, setCacheBusters] = useState<Record<string, string>>({});
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [deletingSlot, setDeletingSlot] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [dnaSku, setDnaSku] = useState('');
  const [dnaBrand, setDnaBrand] = useState('');
  const [dnaCategory, setDnaCategory] = useState('');
  const [dnaAgeRange, setDnaAgeRange] = useState('');
  const [dnaGender, setDnaGender] = useState('');
  const [dnaMaterial, setDnaMaterial] = useState('');
  const [dnaFinishing, setDnaFinishing] = useState('');
  const [dnaVisor, setDnaVisor] = useState('');
  const [dnaBuckle, setDnaBuckle] = useState('');
  const [dnaWeight, setDnaWeight] = useState('');
  const [dnaSni, setDnaSni] = useState(false);
  const [dnaTheme, setDnaTheme] = useState('');
  const [dnaPrimaryColor, setDnaPrimaryColor] = useState('');
  const [dnaSecondaryColor, setDnaSecondaryColor] = useState('');
  const [dnaAccentColor, setDnaAccentColor] = useState('');
  const [dnaPattern, setDnaPattern] = useState('');
  const [dnaLogoPosition, setDnaLogoPosition] = useState('');
  const [dnaBrandLock, setDnaBrandLock] = useState(true);
  const [dnaShapeLock, setDnaShapeLock] = useState(true);
  const [dnaMaterialLock, setDnaMaterialLock] = useState(true);
  const [dnaGraphicLock, setDnaGraphicLock] = useState(true);
  const [dnaLogoLock, setDnaLogoLock] = useState(true);
  const [dnaColorLock, setDnaColorLock] = useState(true);
  const [dnaNotes, setDnaNotes] = useState('');

  const [dnaLoading, setDnaLoading] = useState(false);
  const [savingDns, setSavingDna] = useState(false);
  const [dnaFetchedOnce, setDnaFetchedOnce] = useState(false);

  // Prompt Factory state
  const [promptStyle, setPromptStyle] = useState('Studio Minimalist');
  const [promptCamera, setPromptCamera] = useState('Eye-level 50mm portrait');
  const [promptLighting, setPromptLighting] = useState('Soft Studio Softbox');
  const [promptPlatform, setPromptPlatform] = useState('Google Imagen');
  const [promptCopyStatus, setPromptCopyStatus] = useState<string | null>(null);
  const [promptCopyError, setPromptCopyError] = useState<string | null>(null);
  const [regenerateVersion, setRegenerateVersion] = useState(0);
  const [activeBackground, setActiveBackground] = useState<BackgroundItem | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    async function fetchProduct() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.status === 404) {
          setProduct(null);
          setError('not-found');
          return;
        }

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error ?? 'Failed to load product.');
        }

        const data = await response.json();
        setProduct(data.product);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    void fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!id || (activeTab !== 'Product DNA' && activeTab !== 'Prompt Factory')) {
      return;
    }

    if (dnaFetchedOnce) {
      return;
    }

    async function fetchDna() {
      setDnaLoading(true);
      setMessage(null);
      try {
        const response = await fetch(`/api/products/${id}/dna`);
        if (!response.ok) {
          throw new Error('Gagal memuat Product DNA.');
        }
        const data = await response.json();
        const dna = data.dna;
        if (dna) {
          setDnaSku(dna.sku ?? '');
          setDnaBrand(dna.brand ?? '');
          setDnaCategory(dna.category ?? '');
          setDnaAgeRange(dna.ageRange ?? '');
          setDnaGender(dna.gender ?? '');
          setDnaMaterial(dna.material ?? '');
          setDnaFinishing(dna.finishing ?? '');
          setDnaVisor(dna.visor ?? '');
          setDnaBuckle(dna.buckle ?? '');
          setDnaWeight(dna.weight ?? '');
          setDnaSni(Boolean(dna.sni));
          setDnaTheme(dna.theme ?? '');
          setDnaPrimaryColor(dna.primaryColor ?? '');
          setDnaSecondaryColor(dna.secondaryColor ?? '');
          setDnaAccentColor(dna.accentColor ?? '');
          setDnaPattern(dna.pattern ?? '');
          setDnaLogoPosition(dna.logoPosition ?? '');
          setDnaBrandLock(dna.brandLock ?? true);
          setDnaShapeLock(dna.shapeLock ?? true);
          setDnaMaterialLock(dna.materialLock ?? true);
          setDnaGraphicLock(dna.graphicLock ?? true);
          setDnaLogoLock(dna.logoLock ?? true);
          setDnaColorLock(dna.colorLock ?? true);
          setDnaNotes(dna.notes ?? '');
        }
        setDnaFetchedOnce(true);
      } catch (err) {
        setMessage({ type: 'error', text: (err as Error).message });
      } finally {
        setDnaLoading(false);
      }
    }

    void fetchDna();
  }, [id, activeTab, dnaFetchedOnce]);

  async function fetchImages(productId: string) {
    const response = await fetch(`/api/products/${productId}/images`);
    if (!response.ok) {
      setMessage({ type: 'error', text: 'Gagal memuat gambar referensi.' });
      return;
    }

    const data = await response.json();
    const mappedImages = (data.images ?? []).reduce(
      (acc: Record<string, { id: string; slot: string; filename: string; path: string }>, image: any) => {
        acc[image.slot] = image;
        return acc;
      },
      {},
    );
    setImages(mappedImages);
  }

  useEffect(() => {
    if (!product?.id) {
      return;
    }

    void fetchImages(product.id);
  }, [product?.id]);

  useEffect(() => {
    if (activeTab !== 'Prompt Factory') {
      return;
    }

    setActiveBackground(getActiveBackground());
  }, [activeTab]);

  async function uploadImage(slot: string, file: File) {
    if (!id) return;
    setMessage(null);
    setUploadingSlot(slot);
    const formData = new FormData();
    formData.append('slot', slot);
    formData.append('file', file);

    try {
      const response = await fetch(`/api/products/${id}/images`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? 'Gagal mengunggah gambar.');
      }

      setImages((current) => ({ ...(current ?? {}), [slot]: data.image }));
      setCacheBusters((current) => ({
        ...current,
        [slot]: `${Date.now()}`,
      }));
      setMessage({ type: 'success', text: `Gambar ${slot} berhasil disimpan.` });
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setUploadingSlot(null);
    }
  }

  async function handleFileChange(slot: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Format tidak diterima. Gunakan JPG, PNG, atau WEBP.' });
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Ukuran file maksimal 10 MB.' });
      event.target.value = '';
      return;
    }

    await uploadImage(slot, file);
    event.target.value = '';
  }

  async function handleDeleteImage(slot: string) {
    if (!id) return;
    const confirmed = window.confirm(`Yakin ingin menghapus gambar ${slot}?`);
    if (!confirmed) return;

    setMessage(null);
    setDeletingSlot(slot);

    try {
      const response = await fetch(`/api/products/${id}/images?slot=${encodeURIComponent(slot)}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? 'Gagal menghapus gambar.');
      }

      setImages((current) => {
        if (!current) return current;
        const next = { ...current };
        delete next[slot];
        return next;
      });
      setCacheBusters((current) => {
        const next = { ...current };
        delete next[slot];
        return next;
      });
      setMessage({ type: 'success', text: `Gambar ${slot} berhasil dihapus.` });
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setDeletingSlot(null);
    }
  }

  const overviewFields = useMemo(
    () =>
      product
        ? [
            { label: 'Code', value: product.code },
            { label: 'Name', value: product.name },
            { label: 'Brand', value: product.brand },
            { label: 'Category', value: product.category },
            { label: 'Theme', value: product.theme ?? '—' },
            { label: 'Target Age', value: product.targetAge ?? '—' },
            { label: 'Shell Material', value: product.shellMaterial ?? '—' },
            { label: 'Visor', value: product.visor ?? '—' },
            { label: 'Buckle', value: product.buckle ?? '—' },
            { label: 'Description', value: product.description ?? '—' },
            { label: 'Created At', value: new Date(product.createdAt).toLocaleString() },
            { label: 'Updated At', value: new Date(product.updatedAt).toLocaleString() },
          ]
        : [],
    [product],
  );

  const dnaFields = [
    dnaSku, dnaBrand, dnaCategory, dnaAgeRange, dnaGender,
    dnaMaterial, dnaFinishing, dnaVisor, dnaBuckle, dnaWeight, dnaSni,
    dnaTheme, dnaPrimaryColor, dnaSecondaryColor, dnaAccentColor, dnaPattern, dnaLogoPosition,
    dnaBrandLock, dnaShapeLock, dnaMaterialLock, dnaGraphicLock, dnaLogoLock, dnaColorLock,
    dnaNotes,
  ];
  const filledCount = dnaFields.filter((val) => typeof val === 'boolean' ? val : Boolean(val && String(val).trim())).length;
  const percentage = Math.round((filledCount / dnaFields.length) * 100);
  const identityScore = [dnaSku, dnaBrand, dnaCategory, dnaAgeRange, dnaGender].reduce(
    (acc, val) => acc + (val.trim() ? 4 : 0),
    0,
  );
  const constructionScore =
    (dnaMaterial.trim() ? 4 : 0) +
    (dnaFinishing.trim() ? 3 : 0) +
    (dnaVisor.trim() ? 3 : 0) +
    (dnaBuckle.trim() ? 3 : 0) +
    (dnaWeight.trim() ? 3 : 0) +
    (dnaSni ? 4 : 0);
  const visualScore =
    (dnaTheme.trim() ? 5 : 0) +
    (dnaPrimaryColor.trim() ? 5 : 0) +
    (dnaSecondaryColor.trim() ? 4 : 0) +
    (dnaAccentColor.trim() ? 3 : 0) +
    (dnaPattern.trim() ? 4 : 0) +
    (dnaLogoPosition.trim() ? 4 : 0);
  const locks = [dnaBrandLock, dnaShapeLock, dnaMaterialLock, dnaGraphicLock, dnaLogoLock, dnaColorLock];
  const activeLocksCount = locks.filter(Boolean).length;
  const protectionScore = Math.round((activeLocksCount / 6) * 10);
  const filledImagesCount = referenceSlots.filter(({ slot }) => Boolean(images?.[slot])).length;
  const imageScore = Math.round((filledImagesCount / 7) * 25);
  const aiReadinessScore = Math.min(100, Math.max(0, identityScore + constructionScore + visualScore + protectionScore + imageScore));
  const readinessStatus = aiReadinessScore >= 80 ? 'Ready' : aiReadinessScore >= 50 ? 'Needs Improvement' : 'Not Ready';
  const readinessBadgeClass = aiReadinessScore >= 80 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : aiReadinessScore >= 50 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-rose-100 text-rose-800 border-rose-200';
  const readinessDotClass = aiReadinessScore >= 80 ? 'bg-emerald-600' : aiReadinessScore >= 50 ? 'bg-amber-600' : 'bg-rose-600';

  const handleResetDna = async () => {
    setDnaLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/products/${id}/dna`);
      if (!response.ok) {
        throw new Error('Gagal mereset Product DNA.');
      }
      const data = await response.json();
      const dna = data.dna;
      if (dna) {
        setDnaSku(dna.sku ?? '');
        setDnaBrand(dna.brand ?? '');
        setDnaCategory(dna.category ?? '');
        setDnaAgeRange(dna.ageRange ?? '');
        setDnaGender(dna.gender ?? '');
        setDnaMaterial(dna.material ?? '');
        setDnaFinishing(dna.finishing ?? '');
        setDnaVisor(dna.visor ?? '');
        setDnaBuckle(dna.buckle ?? '');
        setDnaWeight(dna.weight ?? '');
        setDnaSni(Boolean(dna.sni));
        setDnaTheme(dna.theme ?? '');
        setDnaPrimaryColor(dna.primaryColor ?? '');
        setDnaSecondaryColor(dna.secondaryColor ?? '');
        setDnaAccentColor(dna.accentColor ?? '');
        setDnaPattern(dna.pattern ?? '');
        setDnaLogoPosition(dna.logoPosition ?? '');
        setDnaBrandLock(dna.brandLock ?? true);
        setDnaShapeLock(dna.shapeLock ?? true);
        setDnaMaterialLock(dna.materialLock ?? true);
        setDnaGraphicLock(dna.graphicLock ?? true);
        setDnaLogoLock(dna.logoLock ?? true);
        setDnaColorLock(dna.colorLock ?? true);
        setDnaNotes(dna.notes ?? '');
      } else {
        setDnaSku('');
        setDnaBrand('');
        setDnaCategory('');
        setDnaAgeRange('');
        setDnaGender('');
        setDnaMaterial('');
        setDnaFinishing('');
        setDnaVisor('');
        setDnaBuckle('');
        setDnaWeight('');
        setDnaSni(false);
        setDnaTheme('');
        setDnaPrimaryColor('');
        setDnaSecondaryColor('');
        setDnaAccentColor('');
        setDnaPattern('');
        setDnaLogoPosition('');
        setDnaBrandLock(true);
        setDnaShapeLock(true);
        setDnaMaterialLock(true);
        setDnaGraphicLock(true);
        setDnaLogoLock(true);
        setDnaColorLock(true);
        setDnaNotes('');
      }
      setMessage({ type: 'success', text: 'Product DNA berhasil direset ke data tersimpan.' });
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setDnaLoading(false);
    }
  };

  const handleSaveDna = async () => {
    setSavingDna(true);
    setMessage(null);
    try {
      const payload = {
        sku: dnaSku,
        brand: dnaBrand,
        category: dnaCategory,
        ageRange: dnaAgeRange,
        gender: dnaGender,
        material: dnaMaterial,
        finishing: dnaFinishing,
        visor: dnaVisor,
        buckle: dnaBuckle,
        weight: dnaWeight,
        sni: dnaSni,
        theme: dnaTheme,
        primaryColor: dnaPrimaryColor,
        secondaryColor: dnaSecondaryColor,
        accentColor: dnaAccentColor,
        pattern: dnaPattern,
        logoPosition: dnaLogoPosition,
        brandLock: dnaBrandLock,
        shapeLock: dnaShapeLock,
        materialLock: dnaMaterialLock,
        graphicLock: dnaGraphicLock,
        logoLock: dnaLogoLock,
        colorLock: dnaColorLock,
        notes: dnaNotes,
      };

      const response = await fetch(`/api/products/${id}/dna`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? 'Gagal menyimpan Product DNA.');
      }

      setMessage({ type: 'success', text: 'Product DNA berhasil disimpan ke database.' });
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setSavingDna(false);
    }
  };

  const handleCopyPrompt = async () => {
    setPromptCopyStatus(null);
    setPromptCopyError(null);
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API tidak didukung browser ini.');
      }
      await navigator.clipboard.writeText(generatedPromptText);
      setPromptCopyStatus('Prompt berhasil disalin ke clipboard!');
      setTimeout(() => setPromptCopyStatus(null), 3500);
    } catch (err) {
      setPromptCopyError((err as Error).message || 'Gagal menyalin prompt.');
      setTimeout(() => setPromptCopyError(null), 3500);
    }
  };

  const handleRegeneratePrompt = () => {
    setRegenerateVersion((v) => v + 1);
    setPromptCopyStatus('Prompt berhasil diregenerasi secara deterministik.');
    setTimeout(() => setPromptCopyStatus(null), 3500);
  };

  const generatedPromptText = useMemo(() => {
    if (!product) return '';
    const skuText = dnaSku || product.code;
    const effectiveBrand = dnaBrand.trim() ? dnaBrand : (product.brand?.trim() || '');
    const nameText = product.name || dnaCategory || product.category || 'Product Item';
    const categoryText = dnaCategory || product.category || 'General';
    const ageText = dnaAgeRange || product.targetAge || '';
    const themeText = dnaTheme || product.theme || 'Standard';
    const materialText = dnaMaterial || product.shellMaterial || 'Premium Material';
    const visorText = dnaVisor || product.visor || '';
    const buckleText = dnaBuckle || product.buckle || '';
    const primaryCol = dnaPrimaryColor || 'Primary';
    const secondaryCol = dnaSecondaryColor || 'Secondary';
    const accentCol = dnaAccentColor || 'Accent';
    const patternText = dnaPattern || 'Geometric';
    const notesText = dnaNotes || 'None';

    const brandLine = effectiveBrand ? `- Brand: ${effectiveBrand}` : '';
    const ageLine = ageText ? `- Target Demographic / Age: ${ageText}` : '';
    const visorLine = visorText ? `- Fastening / Attachment / Visor: ${visorText}` : '';
    const buckleLine = buckleText ? `- Hardware / Buckle: ${buckleText}` : '';

    const brandLockText = dnaBrandLock ? 'Strictly preserve brand identity, typography, and styling.' : '';
    const shapeLockText = dnaShapeLock ? 'Preserve exact product geometry, dimensions, and proportions. Do not morph or redesign the product.' : '';
    const materialLockText = dnaMaterialLock ? 'Preserve exact surface finish, texture, and material response.' : '';
    const graphicLockText = dnaGraphicLock ? 'Preserve decal placement, graphics, scale, and artwork.' : '';
    
    let logoLockText = '';
    if (dnaLogoLock) {
      if (effectiveBrand) {
        logoLockText = `Preserve the ${effectiveBrand} logo exactly as shown in the reference images, clearly visible and undistorted.`;
      } else {
        logoLockText = 'Preserve all logos and identifying marks exactly as shown in the reference images.';
      }
    }

    const colorLockText = dnaColorLock ? 'Preserve exact color palette.' : '';

    return `Create a premium, photorealistic commercial product asset for ${promptPlatform}. Use the supplied reference images as the absolute visual source of truth.

PRODUCT IDENTITY & DNA
- Product Name: ${nameText}
- SKU / Code: ${skuText}
${brandLine}
- Category: ${categoryText}
${ageLine}
- Theme & Graphics: ${themeText} (${patternText})
- Colors: ${primaryCol} (Primary), ${secondaryCol} (Secondary), ${accentCol} (Accent)

CONSTRUCTION & MATERIALS
- Material / Surface: ${materialText} (${dnaFinishing || 'Standard finish'})
${visorLine}
${buckleLine}
- Weight / Certification: ${dnaWeight || 'Standard'} ${dnaSni ? '(Certified)' : ''}

PHOTOGRAPHY STYLE & SCENE
- Style: ${promptStyle}
- Camera: ${promptCamera}
- Lighting: ${promptLighting}

AI PROTECTION & LOCKS
- ${brandLockText}
- ${shapeLockText}
- ${materialLockText}
- ${graphicLockText}
- ${logoLockText}
- ${colorLockText}

SPECIAL NOTES
${notesText}

OUTPUT REQUIREMENTS
Commercial grade, photorealistic, ultra-detailed product asset, suitable for marketplace and social-media advertising. [Revision: v${regenerateVersion + 1}]`;
  }, [
    dnaSku, dnaBrand, dnaCategory, dnaAgeRange, dnaTheme, dnaMaterial, dnaFinishing, dnaVisor, dnaBuckle, dnaWeight, dnaSni,
    dnaPrimaryColor, dnaSecondaryColor, dnaAccentColor, dnaPattern, dnaLogoPosition, dnaNotes,
    dnaBrandLock, dnaShapeLock, dnaMaterialLock, dnaGraphicLock, dnaLogoLock, dnaColorLock,
    promptStyle, promptCamera, promptLighting, promptPlatform, product, regenerateVersion
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 sm:p-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/40">
            <p className="text-sm text-slate-500">Loading product details…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error === 'not-found') {
    return (
      <div className="min-h-screen bg-slate-100 p-6 sm:p-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-200/40">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Product not found</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950">Maaf, produk tidak tersedia.</h1>
            <p className="mt-3 text-sm text-slate-500">Periksa kembali link atau kembali ke daftar produk.</p>
            <Link
              href="/products"
              className="mt-8 inline-flex rounded-2xl bg-violet-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              Kembali ke Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 sm:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
              <ArrowLeft className="h-4 w-4" />
              <Link href="/products" className="transition hover:text-violet-700">
                Back to workspace
              </Link>
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-slate-950">{product.name}</h1>
              <p className="mt-2 text-sm text-slate-500">
                Code <span className="font-medium text-slate-900">{product.code}</span> · Brand{' '}
                <span className="font-medium text-slate-900">{product.brand}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                product.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : product.status === 'Inactive' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {product.status.toUpperCase()}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              onClick={() => setActiveTab('Overview')}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
          <nav className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="p-6">
            {activeTab === 'Overview' ? (
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                  <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h2 className="text-xl font-semibold text-slate-950">Product Overview</h2>
                    <p className="mt-2 text-sm text-slate-500">Semua field produk ditampilkan di sini.</p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {overviewFields.map((field) => (
                        <div key={field.label} className="rounded-3xl bg-white px-5 py-4 shadow-sm">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{field.label}</p>
                          <p className="mt-2 text-sm font-semibold text-slate-950">{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
                <div className="space-y-6">
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace insights</p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-950">Product DNA</h3>
                      </div>
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-50 text-violet-700">
                        <Sparkles className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      Overview tab menampilkan semua detail umum. Tab lain akan siap di masa depan untuk asset dan generasi konten.
                    </p>
                  </section>
                  <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Quick links</p>
                    <div className="mt-4 grid gap-3">
                      {tabs.filter((tab) => tab !== 'Overview').map((tab) => (
                        <div key={tab} className="rounded-3xl bg-white px-4 py-4 text-sm text-slate-700 shadow-sm">
                          {tab}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            ) : activeTab === 'Reference Images' ? (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">Reference Images</h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Preview UI untuk semua slot gambar referensi produk.
                      </p>
                    </div>
                    <div className="text-sm text-slate-500">Saved in public/uploads/products/{product.code}</div>
                  </div>

                  <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Progress</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-950">
                          {Object.values(images).filter(Boolean).length} / {referenceSlots.length} Completed
                        </p>
                      </div>
                      <div className="w-full max-w-xl">
                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-emerald-600"
                            style={{ width: `${(Object.values(images).filter(Boolean).length / referenceSlots.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {referenceSlots.map(({ slot, title }) => {
                        const hasImage = Boolean(images?.[slot]);
                        return (
                          <div
                            key={slot}
                            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                              hasImage
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                                : 'border-slate-200 bg-slate-100 text-slate-600'
                            }`}
                          >
                            <span
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
                                hasImage ? 'bg-emerald-700 text-white' : 'bg-slate-300 text-slate-600'
                              }`}
                            >
                              ✓
                            </span>
                            <span>{title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {referenceSlots.map(({ slot, title, tooltip, note }) => {
                      const image = images?.[slot] ?? null;
                      return (
                        <ReferenceImageCard
                          key={slot}
                          slot={slot}
                          title={title}
                          tooltip={tooltip}
                          imageUrl={image?.path ?? undefined}
                          cacheBuster={cacheBusters[slot]}
                          isUploading={uploadingSlot === slot}
                          isDeleting={deletingSlot === slot}
                          onSelectFile={(event: ChangeEvent<HTMLInputElement>) => handleFileChange(slot, event)}
                          onDelete={() => void handleDeleteImage(slot)}
                          note={note}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : activeTab === 'Product DNA' ? (
              <div className="space-y-6">
                {(() => {
                  const dnaFields = [
                    dnaSku, dnaBrand, dnaCategory, dnaAgeRange, dnaGender,
                    dnaMaterial, dnaFinishing, dnaVisor, dnaBuckle, dnaWeight, dnaSni,
                    dnaTheme, dnaPrimaryColor, dnaSecondaryColor, dnaAccentColor, dnaPattern, dnaLogoPosition,
                    dnaBrandLock, dnaShapeLock, dnaMaterialLock, dnaGraphicLock, dnaLogoLock, dnaColorLock,
                    dnaNotes
                  ];
                  const filledCount = dnaFields.filter((val) => typeof val === 'boolean' ? val : Boolean(val && String(val).trim())).length;
                  const totalFields = dnaFields.length;
                  const percentage = Math.round((filledCount / totalFields) * 100);
                  const isComplete = percentage >= 80;

                  // AI Readiness Score Calculation (Total: 100 points)
                  // A. Identity (20 pts): sku, brand, category, ageRange, gender (4 pts each)
                  const identityScore = [dnaSku, dnaBrand, dnaCategory, dnaAgeRange, dnaGender].reduce(
                    (acc, val) => acc + (val.trim() ? 4 : 0),
                    0
                  );

                  // B. Construction (20 pts): material (4), finishing (3), visor (3), buckle (3), weight (3), sni (4)
                  const constructionScore =
                    (dnaMaterial.trim() ? 4 : 0) +
                    (dnaFinishing.trim() ? 3 : 0) +
                    (dnaVisor.trim() ? 3 : 0) +
                    (dnaBuckle.trim() ? 3 : 0) +
                    (dnaWeight.trim() ? 3 : 0) +
                    (dnaSni ? 4 : 0);

                  // C. Visual Identity (25 pts): theme (5), primaryColor (5), secondaryColor (4), accentColor (3), pattern (4), logoPosition (4)
                  const visualScore =
                    (dnaTheme.trim() ? 5 : 0) +
                    (dnaPrimaryColor.trim() ? 5 : 0) +
                    (dnaSecondaryColor.trim() ? 4 : 0) +
                    (dnaAccentColor.trim() ? 3 : 0) +
                    (dnaPattern.trim() ? 4 : 0) +
                    (dnaLogoPosition.trim() ? 4 : 0);

                  // D. AI Protection (10 pts): 6 locks (~1.67 pts each, sum to 10)
                  const locks = [dnaBrandLock, dnaShapeLock, dnaMaterialLock, dnaGraphicLock, dnaLogoLock, dnaColorLock];
                  const activeLocksCount = locks.filter(Boolean).length;
                  const protectionScore = Math.round((activeLocksCount / 6) * 10);

                  // E. Reference Images (25 pts): 7 slots (~3.57 pts each slot, sum to 25)
                  const filledImagesCount = referenceSlots.filter(({ slot }) => Boolean(images?.[slot])).length;
                  const imageScore = Math.round((filledImagesCount / 7) * 25);

                  const aiReadinessScore = Math.min(
                    100,
                    Math.max(0, identityScore + constructionScore + visualScore + protectionScore + imageScore)
                  );

                  const readinessStatus =
                    aiReadinessScore >= 80
                      ? 'Ready'
                      : aiReadinessScore >= 50
                      ? 'Needs Improvement'
                      : 'Not Ready';

                  const readinessBadgeClass =
                    aiReadinessScore >= 80
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : aiReadinessScore >= 50
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-rose-100 text-rose-800 border-rose-200';

                  const readinessDotClass =
                    aiReadinessScore >= 80
                      ? 'bg-emerald-600'
                      : aiReadinessScore >= 50
                      ? 'bg-amber-600'
                      : 'bg-rose-600';

                  const handleResetDna = async () => {
                    setDnaLoading(true);
                    setMessage(null);
                    try {
                      const response = await fetch(`/api/products/${id}/dna`);
                      if (!response.ok) {
                        throw new Error('Gagal mereset Product DNA.');
                      }
                      const data = await response.json();
                      const dna = data.dna;
                      if (dna) {
                        setDnaSku(dna.sku ?? '');
                        setDnaBrand(dna.brand ?? '');
                        setDnaCategory(dna.category ?? '');
                        setDnaAgeRange(dna.ageRange ?? '');
                        setDnaGender(dna.gender ?? '');
                        setDnaMaterial(dna.material ?? '');
                        setDnaFinishing(dna.finishing ?? '');
                        setDnaVisor(dna.visor ?? '');
                        setDnaBuckle(dna.buckle ?? '');
                        setDnaWeight(dna.weight ?? '');
                        setDnaSni(Boolean(dna.sni));
                        setDnaTheme(dna.theme ?? '');
                        setDnaPrimaryColor(dna.primaryColor ?? '');
                        setDnaSecondaryColor(dna.secondaryColor ?? '');
                        setDnaAccentColor(dna.accentColor ?? '');
                        setDnaPattern(dna.pattern ?? '');
                        setDnaLogoPosition(dna.logoPosition ?? '');
                        setDnaBrandLock(dna.brandLock ?? true);
                        setDnaShapeLock(dna.shapeLock ?? true);
                        setDnaMaterialLock(dna.materialLock ?? true);
                        setDnaGraphicLock(dna.graphicLock ?? true);
                        setDnaLogoLock(dna.logoLock ?? true);
                        setDnaColorLock(dna.colorLock ?? true);
                        setDnaNotes(dna.notes ?? '');
                      } else {
                        setDnaSku('');
                        setDnaBrand('');
                        setDnaCategory('');
                        setDnaAgeRange('');
                        setDnaGender('');
                        setDnaMaterial('');
                        setDnaFinishing('');
                        setDnaVisor('');
                        setDnaBuckle('');
                        setDnaWeight('');
                        setDnaSni(false);
                        setDnaTheme('');
                        setDnaPrimaryColor('');
                        setDnaSecondaryColor('');
                        setDnaAccentColor('');
                        setDnaPattern('');
                        setDnaLogoPosition('');
                        setDnaBrandLock(true);
                        setDnaShapeLock(true);
                        setDnaMaterialLock(true);
                        setDnaGraphicLock(true);
                        setDnaLogoLock(true);
                        setDnaColorLock(true);
                        setDnaNotes('');
                      }
                      setMessage({ type: 'success', text: 'Product DNA berhasil direset ke data tersimpan.' });
                    } catch (err) {
                      setMessage({ type: 'error', text: (err as Error).message });
                    } finally {
                      setDnaLoading(false);
                    }
                  };

                  const handleSaveDna = async () => {
                    setSavingDna(true);
                    setMessage(null);
                    try {
                      const payload = {
                        sku: dnaSku,
                        brand: dnaBrand,
                        category: dnaCategory,
                        ageRange: dnaAgeRange,
                        gender: dnaGender,
                        material: dnaMaterial,
                        finishing: dnaFinishing,
                        visor: dnaVisor,
                        buckle: dnaBuckle,
                        weight: dnaWeight,
                        sni: dnaSni,
                        theme: dnaTheme,
                        primaryColor: dnaPrimaryColor,
                        secondaryColor: dnaSecondaryColor,
                        accentColor: dnaAccentColor,
                        pattern: dnaPattern,
                        logoPosition: dnaLogoPosition,
                        brandLock: dnaBrandLock,
                        shapeLock: dnaShapeLock,
                        materialLock: dnaMaterialLock,
                        graphicLock: dnaGraphicLock,
                        logoLock: dnaLogoLock,
                        colorLock: dnaColorLock,
                        notes: dnaNotes,
                      };

                      const response = await fetch(`/api/products/${id}/dna`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                      });

                      const data = await response.json();
                      if (!response.ok) {
                        throw new Error(data?.error ?? 'Gagal menyimpan Product DNA.');
                      }

                      setMessage({ type: 'success', text: 'Product DNA berhasil disimpan ke database.' });
                    } catch (err) {
                      setMessage({ type: 'error', text: (err as Error).message });
                    } finally {
                      setSavingDna(false);
                    }
                  };

                  if (dnaLoading) {
                    return (
                      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <p className="text-sm text-slate-500">Memuat Product DNA dari database...</p>
                      </div>
                    );
                  }

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

                      {/* AI Readiness Breakdown Card */}
                      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-950">AI Readiness Score Breakdown</h3>
                            <p className="text-xs text-slate-500">Evaluasi kelayakan data untuk rendering prompt AI (Target: 80+ Ready)</p>
                          </div>
                        </div>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                          {[
                            { label: 'Identity', score: identityScore, max: 20 },
                            { label: 'Construction', score: constructionScore, max: 20 },
                            { label: 'Visual Identity', score: visualScore, max: 25 },
                            { label: 'AI Protection', score: protectionScore, max: 10 },
                            { label: 'Reference Images', score: imageScore, max: 25 },
                          ].map((item) => (
                            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                              <p className="text-xs font-semibold text-slate-600">{item.label}</p>
                              <p className="mt-2 text-xl font-bold text-slate-950">{item.score} <span className="text-xs font-normal text-slate-400">/ {item.max}</span></p>
                              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                <div className="h-full rounded-full bg-violet-600 transition-all duration-300" style={{ width: `${(item.score / item.max) * 100}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
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
                              { label: 'SKU', value: dnaSku, setter: setDnaSku, required: true },
                              { label: 'Brand', value: dnaBrand, setter: setDnaBrand, required: true },
                              { label: 'Category', value: dnaCategory, setter: setDnaCategory, required: true },
                              { label: 'Age Range', value: dnaAgeRange, setter: setDnaAgeRange, required: false },
                              { label: 'Gender', value: dnaGender, setter: setDnaGender, required: false },
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
                              { label: 'Material', value: dnaMaterial, setter: setDnaMaterial, required: true },
                              { label: 'Finishing', value: dnaFinishing, setter: setDnaFinishing, required: false },
                              { label: 'Visor', value: dnaVisor, setter: setDnaVisor, required: false },
                              { label: 'Buckle', value: dnaBuckle, setter: setDnaBuckle, required: false },
                              { label: 'Weight', value: dnaWeight, setter: setDnaWeight, required: false },
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
                                onChange={(event) => setDnaSni(event.target.checked)}
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
                              { label: 'Theme', value: dnaTheme, setter: setDnaTheme, required: true },
                              { label: 'Primary Color', value: dnaPrimaryColor, setter: setDnaPrimaryColor, required: true },
                              { label: 'Secondary Color', value: dnaSecondaryColor, setter: setDnaSecondaryColor, required: false },
                              { label: 'Accent Color', value: dnaAccentColor, setter: setDnaAccentColor, required: false },
                              { label: 'Pattern', value: dnaPattern, setter: setDnaPattern, required: false },
                              { label: 'Logo Position', value: dnaLogoPosition, setter: setDnaLogoPosition, required: false },
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
                              { label: 'Brand Lock', checked: dnaBrandLock, setter: setDnaBrandLock },
                              { label: 'Shape Lock', checked: dnaShapeLock, setter: setDnaShapeLock },
                              { label: 'Material Lock', checked: dnaMaterialLock, setter: setDnaMaterialLock },
                              { label: 'Graphic Lock', checked: dnaGraphicLock, setter: setDnaGraphicLock },
                              { label: 'Logo Lock', checked: dnaLogoLock, setter: setDnaLogoLock },
                              { label: 'Color Lock', checked: dnaColorLock, setter: setDnaColorLock },
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
                                onChange={(event) => setDnaNotes(event.target.value)}
                                placeholder="Tuliskan catatan khusus, instruksi prompt, atau batasan rendering..."
                                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
                              />
                            </label>
                          </div>
                        </section>

                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                          <button
                            type="button"
                            onClick={handleResetDna}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveDna}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-lg shadow-slate-950/10"
                          >
                            <Check className="h-4 w-4" />
                            Save Product DNA
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : activeTab === 'Prompt Factory' ? (
              <div className="space-y-6">
                {(() => {
                  const dnaFields = [
                    dnaSku, dnaBrand, dnaCategory, dnaAgeRange, dnaGender,
                    dnaMaterial, dnaFinishing, dnaVisor, dnaBuckle, dnaWeight, dnaSni,
                    dnaTheme, dnaPrimaryColor, dnaSecondaryColor, dnaAccentColor, dnaPattern, dnaLogoPosition,
                    dnaBrandLock, dnaShapeLock, dnaMaterialLock, dnaGraphicLock, dnaLogoLock, dnaColorLock,
                    dnaNotes
                  ];
                  const filledCount = dnaFields.filter((val) => typeof val === 'boolean' ? val : Boolean(val && String(val).trim())).length;
                  const totalFields = dnaFields.length;
                  const percentage = Math.round((filledCount / totalFields) * 100);

                  const identityScore = [dnaSku, dnaBrand, dnaCategory, dnaAgeRange, dnaGender].reduce(
                    (acc, val) => acc + (val.trim() ? 4 : 0),
                    0
                  );
                  const constructionScore =
                    (dnaMaterial.trim() ? 4 : 0) +
                    (dnaFinishing.trim() ? 3 : 0) +
                    (dnaVisor.trim() ? 3 : 0) +
                    (dnaBuckle.trim() ? 3 : 0) +
                    (dnaWeight.trim() ? 3 : 0) +
                    (dnaSni ? 4 : 0);
                  const visualScore =
                    (dnaTheme.trim() ? 5 : 0) +
                    (dnaPrimaryColor.trim() ? 5 : 0) +
                    (dnaSecondaryColor.trim() ? 4 : 0) +
                    (dnaAccentColor.trim() ? 3 : 0) +
                    (dnaPattern.trim() ? 4 : 0) +
                    (dnaLogoPosition.trim() ? 4 : 0);
                  const locks = [dnaBrandLock, dnaShapeLock, dnaMaterialLock, dnaGraphicLock, dnaLogoLock, dnaColorLock];
                  const activeLocksCount = locks.filter(Boolean).length;
                  const protectionScore = Math.round((activeLocksCount / 6) * 10);
                  const filledImagesCount = referenceSlots.filter(({ slot }) => Boolean(images?.[slot])).length;
                  const imageScore = Math.round((filledImagesCount / 7) * 25);

                  const aiReadinessScore = Math.min(
                    100,
                    Math.max(0, identityScore + constructionScore + visualScore + protectionScore + imageScore)
                  );



                  const readinessStatus =
                    aiReadinessScore >= 80
                      ? 'Ready'
                      : aiReadinessScore >= 50
                      ? 'Needs Improvement'
                      : 'Not Ready';

                  async function handleCopyPrompt() {
                    setPromptCopyStatus(null);
                    setPromptCopyError(null);
                    try {
                      if (!navigator.clipboard?.writeText) {
                        throw new Error('Clipboard API tidak didukung browser ini.');
                      }
                      await navigator.clipboard.writeText(generatedPromptText);
                      setPromptCopyStatus('Prompt berhasil disalin ke clipboard!');
                      setTimeout(() => setPromptCopyStatus(null), 3500);
                    } catch (err) {
                      setPromptCopyError((err as Error).message || 'Gagal menyalin prompt.');
                      setTimeout(() => setPromptCopyError(null), 3500);
                    }
                  }

                  function handleRegeneratePrompt() {
                    setRegenerateVersion((v) => v + 1);
                    setPromptCopyStatus('Prompt berhasil diregenerasi secara deterministik.');
                    setTimeout(() => setPromptCopyStatus(null), 3500);
                  }

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
                          {/* Left Column: Product Context & Prompt Settings */}
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

                            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                              <h3 className="text-lg font-semibold text-slate-950">2. Generation Parameters</h3>
                              <p className="text-xs text-slate-500">Sesuaikan gaya fotografi, kamera, pencahayaan, dan platform AI</p>

                              <label className="block space-y-2 text-sm text-slate-700">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Photography Style</span>
                                <select
                                  value={promptStyle}
                                  onChange={(e) => setPromptStyle(e.target.value)}
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
                                  onChange={(e) => setPromptCamera(e.target.value)}
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
                                  onChange={(e) => setPromptLighting(e.target.value)}
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
                                  onChange={(e) => setPromptPlatform(e.target.value)}
                                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
                                >
                                  <option>Google Imagen</option>
                                  <option>Google Veo</option>
                                  <option>ChatGPT Image</option>
                                  <option>Kling</option>
                                </select>
                              </label>
                            </section>
                          </div>

                          {/* Right Column: Prompt Preview & Actions */}
                          <div className="space-y-6">
                            <section className="flex flex-col h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-slate-950">Prompt Preview</h3>
                                  <p className="text-xs text-slate-500">Generated for {promptPlatform}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={handleRegeneratePrompt}
                                    className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 shadow-sm"
                                  >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    Regenerate
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCopyPrompt}
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
                          </div>
                        </div>

                        <div className="mt-6">
                          <SceneBuilder
                            product={product}
                            dna={{
                              sku: dnaSku,
                              brand: dnaBrand,
                              category: dnaCategory,
                              ageRange: dnaAgeRange,
                              gender: dnaGender,
                              material: dnaMaterial,
                              finishing: dnaFinishing,
                              visor: dnaVisor,
                              buckle: dnaBuckle,
                              weight: dnaWeight,
                              sni: dnaSni,
                              theme: dnaTheme,
                              primaryColor: dnaPrimaryColor,
                              secondaryColor: dnaSecondaryColor,
                              accentColor: dnaAccentColor,
                              pattern: dnaPattern,
                              logoPosition: dnaLogoPosition,
                              brandLock: dnaBrandLock,
                              shapeLock: dnaShapeLock,
                              materialLock: dnaMaterialLock,
                              graphicLock: dnaGraphicLock,
                              logoLock: dnaLogoLock,
                              colorLock: dnaColorLock,
                              notes: dnaNotes,
                            }}
                            activeBackground={activeBackground}
                            platform={promptPlatform}
                            aspectRatio="1:1"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{activeTab}</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">Page under construction</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Konten untuk tab ini akan tersedia di iterasi berikutnya.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
