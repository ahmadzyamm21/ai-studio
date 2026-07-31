'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

type ProductStatus = 'Active' | 'Draft' | 'Inactive';

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

type ProductForm = {
  code: string;
  name: string;
  brand: string;
  category: string;
  theme: string;
  targetAge: string;
  shellMaterial: string;
  visor: string;
  buckle: string;
  status: ProductStatus;
  description: string;
};

const emptyProductForm: ProductForm = {
  code: '',
  name: '',
  brand: '',
  category: '',
  theme: '',
  targetAge: '',
  shellMaterial: '',
  visor: '',
  buckle: '',
  status: 'Active',
  description: '',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyProductForm);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  async function fetchProducts() {
    setLoading(true);
    setNotice('');

    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error ?? 'Gagal memuat produk.');
      }
      const result = await response.json();
      setProducts(result.products ?? []);
    } catch (error) {
      setNotice((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return products;

    return products.filter((product) =>
      [product.code, product.name, product.brand, product.category]
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [products, search]);

  function updateForm<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyProductForm);
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingId(product.id);
    setForm({
      code: product.code,
      name: product.name,
      brand: product.brand,
      category: product.category,
      theme: product.theme ?? '',
      targetAge: product.targetAge ?? '',
      shellMaterial: product.shellMaterial ?? '',
      visor: product.visor ?? '',
      buckle: product.buckle ?? '',
      status: product.status,
      description: product.description ?? '',
    });
    setShowForm(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('');

    if (!form.code.trim() || !form.name.trim() || !form.brand.trim() || !form.category.trim()) {
      setNotice('Code, Name, Brand, dan Category wajib diisi.');
      return;
    }

    setSaving(true);

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error ?? 'Gagal menyimpan produk.');
      }

      setForm(emptyProductForm);
      setShowForm(false);
      setEditingId(null);
      setNotice(editingId ? 'Produk berhasil diperbarui.' : 'Produk berhasil ditambahkan.');
      await fetchProducts();
    } catch (error) {
      setNotice((error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(`Hapus produk “${product.name}”?`);
    if (!confirmed) return;

    setSaving(true);
    setNotice('');

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error ?? 'Gagal menghapus produk.');
      }

      setNotice('Produk berhasil dihapus.');
      await fetchProducts();
    } catch (error) {
      setNotice((error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 sm:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Product Management</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-950">Dashboard Produk</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Kelola semua produk secara cepat dan responsif, lengkap dengan statistik dan pencarian modern.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={openAddForm}
                className="inline-flex items-center justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200/40 transition hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Produk
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Total Products</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{products.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Active</p>
              <p className="mt-3 text-3xl font-semibold text-emerald-700">{products.filter((product) => product.status === 'Active').length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Inactive</p>
              <p className="mt-3 text-3xl font-semibold text-slate-500">{products.filter((product) => product.status === 'Inactive').length}</p>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products by code, name, brand, or category..."
              className="w-full rounded-3xl border border-slate-200 bg-white px-12 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-violet-50 text-violet-600 shadow-sm">
                <Search className="h-8 w-8" />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-slate-950">Produk tidak ditemukan</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Tidak ada produk yang sesuai dengan pencarian saat ini. Tambahkan produk baru atau periksa kembali kata kunci Anda.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="sticky top-0 z-10 whitespace-nowrap bg-slate-950 px-6 py-4 text-left font-semibold uppercase tracking-[0.12em] text-slate-200">
                      Code
                    </th>
                    <th className="sticky top-0 z-10 whitespace-nowrap bg-slate-950 px-6 py-4 text-left font-semibold uppercase tracking-[0.12em] text-slate-200">
                      Name
                    </th>
                    <th className="sticky top-0 z-10 whitespace-nowrap bg-slate-950 px-6 py-4 text-left font-semibold uppercase tracking-[0.12em] text-slate-200">
                      Brand
                    </th>
                    <th className="sticky top-0 z-10 whitespace-nowrap bg-slate-950 px-6 py-4 text-left font-semibold uppercase tracking-[0.12em] text-slate-200">
                      Category
                    </th>
                    <th className="sticky top-0 z-10 whitespace-nowrap bg-slate-950 px-6 py-4 text-left font-semibold uppercase tracking-[0.12em] text-slate-200">
                      Status
                    </th>
                    <th className="sticky top-0 z-10 whitespace-nowrap bg-slate-950 px-6 py-4 text-left font-semibold uppercase tracking-[0.12em] text-slate-200">
                      Created At
                    </th>
                    <th className="sticky top-0 z-10 whitespace-nowrap bg-slate-950 px-6 py-4 text-left font-semibold uppercase tracking-[0.12em] text-slate-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-slate-200 transition hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-5 text-slate-900">{product.code}</td>
                      <td className="px-6 py-5 text-slate-900">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-semibold text-slate-900 transition hover:text-violet-700"
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-6 py-5 text-slate-900">{product.brand}</td>
                      <td className="px-6 py-5 text-slate-900">{product.category}</td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            product.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : product.status === 'Inactive'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {product.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-slate-500">{new Date(product.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-700"
                            onClick={() => openEditForm(product)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showForm ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit Produk' : 'Tambah Produk'}</h2>
                  <p className="mt-1 text-sm text-slate-500">Isi informasi produk lalu tekan Simpan.</p>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  aria-label="Tutup dialog"
                >
                  ×
                </button>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Code</span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      value={form.code}
                      onChange={(event) => updateForm('code', event.target.value)}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Name</span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      value={form.name}
                      onChange={(event) => updateForm('name', event.target.value)}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Brand</span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      value={form.brand}
                      onChange={(event) => updateForm('brand', event.target.value)}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Category</span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      value={form.category}
                      onChange={(event) => updateForm('category', event.target.value)}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Theme</span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      value={form.theme}
                      onChange={(event) => updateForm('theme', event.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Target Age</span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      value={form.targetAge}
                      onChange={(event) => updateForm('targetAge', event.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Shell Material</span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      value={form.shellMaterial}
                      onChange={(event) => updateForm('shellMaterial', event.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Visor</span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      value={form.visor}
                      onChange={(event) => updateForm('visor', event.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Buckle</span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      value={form.buckle}
                      onChange={(event) => updateForm('buckle', event.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Status</span>
                    <select
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      value={form.status}
                      onChange={(event) => updateForm('status', event.target.value as ProductStatus)}
                    >
                      <option>Active</option>
                      <option>Draft</option>
                      <option>Inactive</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Description</span>
                  <textarea
                    className="mt-2 min-h-[120px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    value={form.description}
                    onChange={(event) => updateForm('description', event.target.value)}
                  />
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={saving}
                  >
                    {saving ? 'Menyimpan...' : editingId ? 'Perbarui Product' : 'Simpan Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
