import type { ProductDnaPromptContext, PromptProduct } from '@/lib/prompt/types';

type BuildProductDnaBlockOptions = {
  product: PromptProduct;
  dna: ProductDnaPromptContext;
};

function fallback(value: string | null | undefined, fallbackValue: string) {
  return value && value.trim() ? value.trim() : fallbackValue;
}

function lockLine(enabled: boolean, text: string) {
  return enabled ? `- ${text}` : '';
}

export function buildProductDnaBlock({ product, dna }: BuildProductDnaBlockOptions) {
  const skuText = fallback(dna.sku, product.code);
  const brandText = fallback(dna.brand, product.brand);
  const categoryText = fallback(dna.category, product.category);
  const ageText = fallback(dna.ageRange, product.targetAge ?? '');
  const themeText = fallback(dna.theme, product.theme ?? 'Standard');
  const materialText = fallback(dna.material, product.shellMaterial ?? 'Premium Material');
  const visorText = fallback(dna.visor, product.visor ?? '');
  const buckleText = fallback(dna.buckle, product.buckle ?? '');
  const primaryColor = fallback(dna.primaryColor, 'Primary');
  const secondaryColor = fallback(dna.secondaryColor, 'Secondary');
  const accentColor = fallback(dna.accentColor, 'Accent');
  const patternText = fallback(dna.pattern, 'Original product graphic');
  const logoPosition = fallback(dna.logoPosition, 'Original reference position');
  const notes = fallback(dna.notes, 'No additional Product DNA notes.');

  return `PRODUCT IDENTITY / DNA
- Product Name: ${product.name}
- SKU / Code: ${skuText}
- Brand: ${brandText}
- Category: ${categoryText}
- Target Demographic / Age: ${ageText || 'Not specified'}
- Theme & Graphics: ${themeText} (${patternText})
- Colors: ${primaryColor} (Primary), ${secondaryColor} (Secondary), ${accentColor} (Accent)

CONSTRUCTION & MATERIALS
- Material / Surface: ${materialText}${dna.finishing ? ` (${dna.finishing})` : ''}
- Visor: ${visorText || 'Preserve as shown in reference images'}
- Buckle / Strap: ${buckleText || 'Preserve as shown in reference images'}
- Weight / Certification: ${dna.weight || 'Standard'} ${dna.sni ? '(Certified)' : ''}

PRODUCT CONSISTENCY LOCKS
${[
  lockLine(dna.brandLock, `Preserve the exact ${brandText} brand identity and spelling.`),
  lockLine(dna.logoLock, `Preserve logo placement at ${logoPosition}; do not distort, remove, or invent logos.`),
  lockLine(dna.shapeLock, 'Preserve exact original shell geometry, proportions, visor mounting points, trim, screw positions, and physical construction.'),
  lockLine(dna.materialLock, `Preserve material response and surface finish: ${materialText}.`),
  lockLine(dna.graphicLock, `Preserve the exact ${themeText} artwork, decal scale, colors, and placement.`),
  lockLine(dna.colorLock, `Preserve the exact color palette: ${primaryColor}, ${secondaryColor}, ${accentColor}.`),
].filter(Boolean).join('\n')}

REFERENCE IMAGE PRIORITY
- Use the supplied reference images as the absolute visual source of truth.
- Front establishes the main shape.
- Front-left and front-right establish three-quarter geometry.
- Left and right establish side graphics.
- Back establishes rear construction.
- Top view establishes upper shell shape and brand-logo placement.

PRODUCT DNA NOTES
${notes}`;
}
