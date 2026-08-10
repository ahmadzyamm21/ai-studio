import type { ChangeEvent } from 'react';

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

type OverviewField = {
  label: string;
  value: string;
};

type ProductOverviewTabProps = {
  product: Product;
  overviewFields: OverviewField[];
};

export default function ProductOverviewTab({ product, overviewFields }: ProductOverviewTabProps) {
  return (
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M12 3l7 4v5c0 4.3-2.6 7.8-7 9-4.4-1.2-7-4.7-7-9V7l7-4Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Overview tab menampilkan semua detail umum. Lengkapi reference images dan Product DNA sebelum menyusun prompt final.
          </p>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Quick links</p>
          <div className="mt-4 grid gap-3">
            {['Reference Images', 'Product DNA', 'Prompt Factory'].map((tab) => (
              <div key={tab} className="rounded-3xl bg-white px-4 py-4 text-sm text-slate-700 shadow-sm">
                {tab}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
