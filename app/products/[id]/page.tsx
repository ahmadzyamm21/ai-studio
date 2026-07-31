'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Pencil, Sparkles, Trash2, UploadCloud } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type ProductStatus = 'Active' | 'Draft' | 'Inactive';

const imageSlots = [
  'Front',
  'Front Left',
  'Left',
  'Right',
  'Back',
  'Front Right',
  'Top',
] as const;

type ImageSlot = (typeof imageSlots)[number];

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
  const [images, setImages] = useState<Record<string, { id: string; slot: string; filename: string; path: string }> | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
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
    setUploadingSlot(slot);
    const formData = new FormData();
    formData.append('slot', slot);
    formData.append('file', file);

    try {
      const response = await fetch(`/api/products/${id}/images`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? 'Failed to upload image.');
      }

      const data = await response.json();
      setImages((current) => ({ ...(current ?? {}), [slot]: data.image }));
    } finally {
      setUploadingSlot(null);
    }
  }

  async function handleFileChange(slot: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadImage(slot, file);
    event.target.value = '';
  }

  async function handleDeleteImage(slot: string) {
    if (!id) return;
    const response = await fetch(`/api/products/${id}/images?slot=${encodeURIComponent(slot)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return;
    }

    setImages((current) => {
      if (!current) return current;
      const next = { ...current };
      delete next[slot];
      return next;
    });
  }

  const referenceImagesContent = (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Reference Images</h2>
            <p className="mt-2 text-sm text-slate-500">
              Upload gambar referensi untuk setiap sudut produk.
            </p>
          </div>
          <div className="text-sm text-slate-500">Saved in public/uploads/products/{product?.code}</div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {imageSlots.map((slot) => {
            const image = images?.[slot];
            return (
              <div key={slot} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
                  {image ? (
                    <img
                      src={image.path}
                      alt={`${slot} preview`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-slate-400">
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-200 text-slate-500">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <div className="text-sm font-semibold">{slot}</div>
                      <p className="text-xs text-slate-500">No image uploaded</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                      onClick={() => uploadInputs.current[slot]?.click()}
                      disabled={uploadingSlot === slot}
                    >
                      <UploadCloud className="h-4 w-4" />
                      {image ? 'Replace' : 'Upload'}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => handleDeleteImage(slot)}
                      disabled={!image || uploadingSlot === slot}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                  <input
                    ref={(element) => {
                      uploadInputs.current[slot] = element;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleFileChange(slot, event)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

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
                        Upload gambar referensi untuk setiap sudut produk.
                      </p>
                    </div>
                    <div className="text-sm text-slate-500">Saved in public/uploads/products/{product.code}</div>
                  </div>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {imageSlots.map((slot) => {
                      const image = images?.[slot];
                      return (
                        <div key={slot} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
                            {image ? (
                              <img src={image.path} alt={`${slot} preview`} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-slate-400">
                                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-200 text-slate-500">
                                  <UploadCloud className="h-6 w-6" />
                                </div>
                                <div className="text-sm font-semibold">{slot}</div>
                                <p className="text-xs text-slate-500">No image uploaded</p>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                                onClick={() => uploadInputs.current[slot]?.click()}
                                disabled={uploadingSlot === slot}
                              >
                                <UploadCloud className="h-4 w-4" />
                                {image ? 'Replace' : 'Upload'}
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={() => handleDeleteImage(slot)}
                                disabled={!image || uploadingSlot === slot}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                            <input
                              ref={(element) => {
                                uploadInputs.current[slot] = element;
                              }}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => handleFileChange(slot, event)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
