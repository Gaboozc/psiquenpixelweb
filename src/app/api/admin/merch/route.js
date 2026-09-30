import { NextResponse } from 'next/server';
import { readStore, writeStore, normalizeProduct, sanitizeId } from '@/lib/merch';

export const runtime = 'nodejs';

export async function GET() {
  const store = await readStore();
  return NextResponse.json(store);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const product = normalizeProduct(body);

    if (!product.id || !product.name) {
      return NextResponse.json({ error: 'Nombre e ID son obligatorios' }, { status: 400 });
    }

    const store = await readStore();
    if (store.products.some((p) => p.id === product.id)) {
      return NextResponse.json({ error: `Ya existe un producto con ID "${product.id}"` }, { status: 409 });
    }

    store.products.push(product);
    await writeStore(store);
    return NextResponse.json({ ok: true, product });
  } catch {
    return NextResponse.json({ error: 'Error creando producto' }, { status: 500 });
  }
}

// Replace the categories list (used by the categories panel).
export async function PUT(request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body.categories)) {
      return NextResponse.json({ error: 'categories debe ser un array' }, { status: 400 });
    }
    const categories = body.categories
      .map((c) => ({ id: sanitizeId(c.id), label: String(c.label || '').trim() }))
      .filter((c) => c.id && c.label);

    const store = await readStore();
    store.categories = categories;
    await writeStore(store);
    return NextResponse.json({ ok: true, categories });
  } catch {
    return NextResponse.json({ error: 'Error guardando categorías' }, { status: 500 });
  }
}
