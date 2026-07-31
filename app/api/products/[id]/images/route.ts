import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

const slotFileNames: Record<string, string> = {
  Front: 'front',
  'Front Left': 'front-left',
  Left: 'left',
  Right: 'right',
  Back: 'back',
  'Front Right': 'front-right',
  Top: 'top',
};

const allowedSlots = new Set(Object.keys(slotFileNames));
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const extensionByMime: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const maxFileSize = 10 * 1024 * 1024;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, code: true, images: true },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  return NextResponse.json({ images: product.images });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const formData = await request.formData();
  const slot = formData.get('slot');
  const file = formData.get('file');

  if (typeof slot !== 'string' || !allowedSlots.has(slot)) {
    return NextResponse.json({ error: 'Invalid slot provided.' }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'File is required.' }, { status: 400 });
  }

  if (file.size > maxFileSize) {
    return NextResponse.json({ error: 'File size must be 10 MB or smaller.' }, { status: 400 });
  }

  const extension = path.extname(file.name).toLowerCase();
  const normalizedExtension = allowedExtensions.has(extension)
    ? extension
    : extensionByMime[file.type] ?? '';

  if (!normalizedExtension || !(allowedMimeTypes.has(file.type) || allowedExtensions.has(extension))) {
    return NextResponse.json({ error: 'Invalid image format. Only jpg, jpeg, png, and webp are accepted.' }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, code: true },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products', product.code);
  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `${slotFileNames[slot]}${normalizedExtension}`;
  const targetPath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  const existing = await prisma.productImage.findUnique({
    where: {
      productId_slot: {
        productId: product.id,
        slot,
      },
    },
  });

  if (existing) {
    const previousPath = path.join(process.cwd(), 'public', existing.path);
    if (previousPath !== targetPath) {
      await fs.unlink(previousPath).catch(() => null);
    }
  }

  await fs.writeFile(targetPath, buffer);

  const filePath = `/uploads/products/${product.code}/${filename}`;

  const image = existing
    ? await prisma.productImage.update({
        where: { id: existing.id },
        data: {
          filename,
          path: filePath,
        },
      })
    : await prisma.productImage.create({
        data: {
          productId: product.id,
          slot,
          filename,
          path: filePath,
        },
      });

  return NextResponse.json({ image });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const url = new URL(request.url);
  const slot = url.searchParams.get('slot');

  if (!slot || !allowedSlots.has(slot)) {
    return NextResponse.json({ error: 'Slot query parameter missing or invalid.' }, { status: 400 });
  }

  const existing = await prisma.productImage.findUnique({
    where: {
      productId_slot: {
        productId: id,
        slot,
      },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Image not found.' }, { status: 404 });
  }

  const absolutePath = path.join(process.cwd(), 'public', existing.path);
  await fs.unlink(absolutePath).catch(() => null);
  await prisma.productImage.delete({ where: { id: existing.id } });

  return NextResponse.json({ success: true });
}
