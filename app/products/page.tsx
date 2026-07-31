'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

type ProductStatus = 'Active' | 'Draft' | 'Inactive';

type Product = {
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
  status: ProductStatus;
  description: string;
  images: Record<string, string>;
  referenceFiles: Record<string, string>;
};

const imageSlots = [
  ['front', 'Front'],
  ['frontLeft', 'Front Left 45°'],
  ['left', 'Left'],
  ['right', 'Right'],
  ['back', 'Back'],
  ['frontRight', 'Front Right 45°'],
  ['top', 'Top + Logo'],
] as const;

const starterProducts: Product[] = [
  {
    id: 'captain-america',
    code: 'RR-KID-CAP01',
    name: 'Helm Anak Captain America',
    brand: 'RetroRide',
    category: 'Kids Half Face Helmet',
    targetAge: '5–8 tahun',
    theme: 'Captain America',
    shellMaterial: 'ABS Glossy',
    visor: 'Smoke Polycarbonate',
    buckle: 'Quick Release Orange',
    status: 'Active',
    description: 'Helm anak SNI dengan motif Captain America dan logo RetroRide pada bagian atas.',
    images: {},
    referenceFiles: {},
  },
];

const emptyProduct: Omit<Product, 'id' | 'images'> = {
  code: '',
  name: '',
  brand: 'RetroRide',
  category: 'Kids Half Face Helmet',
  targetAge: '5–8 tahun',
  theme: '',
  shellMaterial: 'ABS Glossy',
  visor: 'Smoke Polycarbonate',
  buckle: 'Quick Release',
  status: 'Active',
  description: '',
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(starterProducts);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProductStatus>('All');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem('ai-studio-products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved).map((product: Product) => ({ ...product, images: product.images ?? {}, referenceFiles: product.referenceFiles ?? {} })));
      } catch {
        setProducts(starterProducts);
      }
    }
  }, []);

  useEffect(() => {
    const lightweightProducts = products.map((product) => ({ ...product, images: {}, referenceFiles: product.referenceFiles ?? {} }));
    window.localStorage.setItem('ai-studio-products', JSON.stringify(lightweightProducts));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const keyword = query.toLowerCase().trim();
    return products.filter((product) => {
      const matchesKeyword =
        !keyword ||
        [product.name, product.code, product.theme, product.brand]
          .join(' ')
          .toLowerCase()
          .includes(keyword);
      const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
      return matchesKeyword && matchesStatus;
    });
  }, [products, query, statusFilter]);

  const selectedProduct = products.find((product) => product.id === selectedId) ?? null;

  function openAddForm() {
    setEditingId(null);
    setForm(emptyProduct);
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingId(product.id);
    setForm({
      code: product.code,
      name: product.name,
      brand: product.brand,
      category: product.category,
      targetAge: product.targetAge,
      theme: product.theme,
      shellMaterial: product.shellMaterial,
      visor: product.visor,
      buckle: product.buckle,
      status: product.status,
      description: product.description,
    });
    setShowForm(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      setNotice('Nama dan kode produk wajib diisi.');
      return;
    }

    if (editingId) {
      setProducts((current) =>
        current.map((product) => (product.id === editingId ? { ...product, ...form } : product)),
      );
      setNotice('Produk berhasil diperbarui.');
    } else {
      const baseId = slugify(form.code || form.name) || crypto.randomUUID();
      const id = products.some((product) => product.id === baseId)
        ? `${baseId}-${Date.now()}`
        : baseId;
      setProducts((current) => [...current, { ...form, id, images: {}, referenceFiles: {} }]);
      setNotice('Produk berhasil ditambahkan.');
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyProduct);
  }

  function deleteProduct(product: Product) {
    const approved = window.confirm(`Hapus produk “${product.name}”?`);
    if (!approved) return;
    setProducts((current) => current.filter((item) => item.id !== product.id));
    if (selectedId === product.id) setSelectedId(null);
    setNotice('Produk berhasil dihapus.');
  }

  function handleImageUpload(slot: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !selectedProduct) return;
    if (!file.type.startsWith('image/')) {
      setNotice('File harus berupa gambar.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setNotice('Ukuran gambar maksimal 3 MB untuk penyimpanan lokal.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result);
      setProducts((current) =>
        current.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, images: { ...product.images, [slot]: value }, referenceFiles: { ...(product.referenceFiles ?? {}), [slot]: file.name } }
            : product,
        ),
      );
      setNotice('Foto referensi berhasil dimuat untuk sesi ini. Penyimpanan permanen akan memakai Supabase Storage.');
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <div className="header">
        <div>
          <h1>Products</h1>
          <div className="muted">Kelola Product DNA dan tujuh foto referensi.</div>
        </div>
        <button className="btn" onClick={openAddForm}>+ Add Product</button>
      </div>

      {notice && (
        <div className="notice" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} aria-label="Tutup notifikasi">×</button>
        </div>
      )}

      <div className="card toolbar">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nama, kode, merek, atau tema…"
          aria-label="Cari produk"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'All' | ProductStatus)}
          aria-label="Filter status"
        >
          <option>All</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <article className="card product-card" key={product.id}>
            <div className="product-card-top">
              <div className="product-thumb">
                {product.images.front ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images.front} alt={product.name} />
                ) : (
                  <span>🪖</span>
                )}
              </div>
              <span className={`badge ${product.status.toLowerCase()}`}>{product.status}</span>
            </div>
            <h2>{product.name}</h2>
            <div className="product-code">{product.code}</div>
            <dl className="product-meta">
              <div><dt>Theme</dt><dd>{product.theme || '—'}</dd></div>
              <div><dt>Age</dt><dd>{product.targetAge || '—'}</dd></div>
              <div><dt>References</dt><dd>{Object.keys(product.referenceFiles ?? {}).length}/7</dd></div>
            </dl>
            <div className="card-actions">
              <button className="btn secondary" onClick={() => setSelectedId(product.id)}>Open</button>
              <button className="text-btn" onClick={() => openEditForm(product)}>Edit</button>
              <button className="text-btn danger" onClick={() => deleteProduct(product)}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="card empty-state">
          <h2>Produk tidak ditemukan</h2>
          <p className="muted">Ubah kata pencarian atau tambahkan produk baru.</p>
        </div>
      )}

      {showForm && (
        <div className="modal-backdrop" onMouseDown={() => setShowForm(false)}>
          <section className="modal" onMouseDown={(event) => event.stopPropagation()} aria-modal="true">
            <div className="modal-header">
              <div>
                <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
                <p className="muted">Isi Product DNA utama. Data teks tersimpan lokal untuk tahap V1.</p>
              </div>
              <button className="icon-btn" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>Product Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                <label>Product Code<input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} /></label>
                <label>Brand<input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></label>
                <label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
                <label>Target Age<input value={form.targetAge} onChange={(e) => setForm({ ...form, targetAge: e.target.value })} /></label>
                <label>Theme<input value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} /></label>
                <label>Shell Material<input value={form.shellMaterial} onChange={(e) => setForm({ ...form, shellMaterial: e.target.value })} /></label>
                <label>Visor<input value={form.visor} onChange={(e) => setForm({ ...form, visor: e.target.value })} /></label>
                <label>Buckle<input value={form.buckle} onChange={(e) => setForm({ ...form, buckle: e.target.value })} /></label>
                <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}><option>Active</option><option>Draft</option><option>Inactive</option></select></label>
              </div>
              <label className="full-label">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn" type="submit">Save Product</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {selectedProduct && (
        <div className="modal-backdrop" onMouseDown={() => setSelectedId(null)}>
          <section className="modal detail-modal" onMouseDown={(event) => event.stopPropagation()} aria-modal="true">
            <div className="modal-header">
              <div>
                <div className="eyebrow">{selectedProduct.code}</div>
                <h2>{selectedProduct.name}</h2>
                <p className="muted">Product DNA dan standar tujuh foto referensi.</p>
              </div>
              <button className="icon-btn" onClick={() => setSelectedId(null)}>×</button>
            </div>

            <div className="dna-grid">
              <div><span>Brand</span><strong>{selectedProduct.brand}</strong></div>
              <div><span>Category</span><strong>{selectedProduct.category}</strong></div>
              <div><span>Theme</span><strong>{selectedProduct.theme}</strong></div>
              <div><span>Target Age</span><strong>{selectedProduct.targetAge}</strong></div>
              <div><span>Shell</span><strong>{selectedProduct.shellMaterial}</strong></div>
              <div><span>Visor</span><strong>{selectedProduct.visor}</strong></div>
              <div><span>Buckle</span><strong>{selectedProduct.buckle}</strong></div>
              <div><span>Status</span><strong>{selectedProduct.status}</strong></div>
            </div>

            <div className="section-heading">
              <div>
                <h3>Reference Images</h3>
                <p className="muted">Gunakan foto konsisten. Slot Top wajib memperlihatkan logo merek.</p>
              </div>
              <strong>{Object.keys(selectedProduct.referenceFiles ?? {}).length}/7 uploaded</strong>
            </div>

            <div className="upload-grid">
              {imageSlots.map(([slot, label]) => (
                <label className="upload-slot" key={slot}>
                  {selectedProduct.images[slot] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selectedProduct.images[slot]} alt={`${selectedProduct.name} ${label}`} />
                  ) : (
                    <div className="upload-placeholder"><span>＋</span><small>Upload image</small></div>
                  )}
                  <div className="upload-caption">
                    <strong>{label}</strong>
                    <span>{selectedProduct.referenceFiles?.[slot] ? selectedProduct.referenceFiles[slot] : 'PNG/JPG maks. 3 MB'}</span>
                  </div>
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleImageUpload(slot, event)} />
                </label>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
