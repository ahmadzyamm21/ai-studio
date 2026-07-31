import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 }
    );
  }

  const code = typeof body.code === "string" ? body.code.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const brand = typeof body.brand === "string" ? body.brand.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const theme = typeof body.theme === "string" ? body.theme.trim() : undefined;
  const targetAge = typeof body.targetAge === "string" ? body.targetAge.trim() : undefined;
  const shellMaterial = typeof body.shellMaterial === "string" ? body.shellMaterial.trim() : undefined;
  const visor = typeof body.visor === "string" ? body.visor.trim() : undefined;
  const buckle = typeof body.buckle === "string" ? body.buckle.trim() : undefined;
  const status = typeof body.status === "string" ? body.status.trim() : undefined;
  const description = typeof body.description === "string" ? body.description.trim() : undefined;

  const missingFields = [];
  if (!code) missingFields.push("code");
  if (!name) missingFields.push("name");
  if (!brand) missingFields.push("brand");
  if (!category) missingFields.push("category");

  if (missingFields.length > 0) {
    return NextResponse.json(
      {
        error: `Missing required field(s): ${missingFields.join(", ")}.`,
      },
      { status: 400 }
    );
  }

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { code },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product code already exists." },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        code,
        name,
        brand,
        category,
        theme,
        targetAge,
        shellMaterial,
        visor,
        buckle,
        status,
        description,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}
