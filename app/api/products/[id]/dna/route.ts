import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const dna = await prisma.productDNA.findUnique({
      where: { productId: id },
    });

    return NextResponse.json({ dna: dna ?? null });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Product DNA." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const parseString = (val: unknown): string | null => {
      if (typeof val !== "string") return null;
      const trimmed = val.trim();
      return trimmed === "" ? null : trimmed;
    };

    const parseBoolean = (val: unknown, fallback: boolean): boolean => {
      if (typeof val === "boolean") return val;
      return fallback;
    };

    const sku = parseString(body.sku);
    const brand = parseString(body.brand);
    const category = parseString(body.category);
    const ageRange = parseString(body.ageRange);
    const gender = parseString(body.gender);

    const material = parseString(body.material);
    const finishing = parseString(body.finishing);
    const visor = parseString(body.visor);
    const buckle = parseString(body.buckle);
    const weight = parseString(body.weight);
    const sni = parseBoolean(body.sni, false);

    const theme = parseString(body.theme);
    const primaryColor = parseString(body.primaryColor);
    const secondaryColor = parseString(body.secondaryColor);
    const accentColor = parseString(body.accentColor);
    const pattern = parseString(body.pattern);
    const logoPosition = parseString(body.logoPosition);

    const brandLock = parseBoolean(body.brandLock, true);
    const shapeLock = parseBoolean(body.shapeLock, true);
    const materialLock = parseBoolean(body.materialLock, true);
    const graphicLock = parseBoolean(body.graphicLock, true);
    const logoLock = parseBoolean(body.logoLock, true);
    const colorLock = parseBoolean(body.colorLock, true);

    const notes = parseString(body.notes);

    const dnaData = {
      sku,
      brand,
      category,
      ageRange,
      gender,
      material,
      finishing,
      visor,
      buckle,
      weight,
      sni,
      theme,
      primaryColor,
      secondaryColor,
      accentColor,
      pattern,
      logoPosition,
      brandLock,
      shapeLock,
      materialLock,
      graphicLock,
      logoLock,
      colorLock,
      notes,
    };

    const dna = await prisma.productDNA.upsert({
      where: { productId: id },
      update: dnaData,
      create: {
        productId: id,
        ...dnaData,
      },
    });

    return NextResponse.json({ dna });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save Product DNA." },
      { status: 500 },
    );
  }
}
