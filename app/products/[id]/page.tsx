'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Lock, Palette, Pencil, ShieldCheck, Sparkles, Trash2, UploadCloud, FileText, Box, Layers, RotateCcw } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReferenceImageCard from '@/components/reference-images/ReferenceImageCard';

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
  'Generated Images',
  'Generated Videos',
  'Marketplace',
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
  const [dnaSni, setDnaSni] = useState('');
  const [dnaTheme, setDnaTheme] = useState('');
  const [dnaPrimaryColor, setDnaPrimaryColor] = useState('');
  const [dnaSecondaryColor, setDnaSecondaryColor] = useState('');
  const [dnaAccentColor, setDnaAccentColor] = useState('');
  const [dnaPattern, setDnaPattern] = useState('');
  const [dnaLogoPosition, setDnaLogoPosition] = useState('');
  const [dnaBrandLock, setDnaBrandLock] = useState(false);
  const [dnaShapeLock, setDnaShapeLock] = useState(false);
  const [dnaMaterialLock, setDnaMaterialLock] = useState(false);
  const [dnaGraphicLock, setDnaGraphicLock] = useState(false);
  const [dnaLogoLock, setDnaLogoLock] = useState(false);
  const [dnaColorLock, setDnaColorLock] = useState(false);
  const [dnaNotes, setDnaNotes] = useState('');

  const uploadInputs = useRef<Record<string, HTMLInputElement | null>>({});

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
                          onSelectFile={(event) => handleFileChange(slot, event)}
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

                  const handleResetDna = () => {
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
                    setDnaSni('');
                    setDnaTheme('');
                    setDnaPrimaryColor('');
                    setDnaSecondaryColor('');
                    setDnaAccentColor('');
                    setDnaPattern('');
                    setDnaLogoPosition('');
                    setDnaBrandLock(false);
                    setDnaShapeLock(false);
                    setDnaMaterialLock(false);
                    setDnaGraphicLock(false);
                    setDnaLogoLock(false);
                    setDnaColorLock(false);
                    setDnaNotes('');
                    setMessage({ type: 'success', text: 'Product DNA berhasil direset.' });
                  };

                  const handleSaveDna = () => {
                    setMessage({ type: 'success', text: 'Product DNA berhasil disimpan (State lokal).' });
                  };

                  return (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-2xl font-semibold text-slate-950">{product.name}</h2>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{product.code}</span>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              <span className={`h-2 w-2 rounded-full ${isComplete ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                              {isComplete ? 'Complete' : 'Incomplete'}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-500">
                            Kelola profil spesifikasi genetik produk untuk presisi AI Generator dan Prompt Factory.
                          </p>
                        </div>
                        <div className="flex flex-col items-start gap-2 sm:items-end">
                          <span className="text-sm font-bold text-slate-900">{percentage}% Completed</span>
                          <div className="w-48 overflow-hidden rounded-full bg-slate-100 sm:w-56">
                            <div className="h-2.5 rounded-full bg-violet-600 transition-all duration-300" style={{ width: `${percentage}%` }} />
                          </div>
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
                              { label: 'SNI', value: dnaSni, setter: setDnaSni, required: false },
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
