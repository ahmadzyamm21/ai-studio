import { Sparkles } from 'lucide-react';

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

type AIReadinessCardProps = {
  product: Product;
  identityScore: number;
  constructionScore: number;
  visualScore: number;
  protectionScore: number;
  imageScore: number;
  aiReadinessScore: number;
  readinessStatus: string;
  readinessBadgeClass: string;
  readinessDotClass: string;
};

export default function AIReadinessCard({
  product,
  identityScore,
  constructionScore,
  visualScore,
  protectionScore,
  imageScore,
  aiReadinessScore,
  readinessStatus,
  readinessBadgeClass,
  readinessDotClass,
}: AIReadinessCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
            <p className="mt-2 text-xl font-bold text-slate-950">
              {item.score} <span className="text-xs font-normal text-slate-400">/ {item.max}</span>
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-violet-600 transition-all duration-300" style={{ width: `${(item.score / item.max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
