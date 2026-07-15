import { NextResponse } from 'next/server';
import { readStore, writeStore, normalizeProduct } from '@/lib/merch';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  const { id } = await params;
  const store = await readStore();
  const product = store.products.find((p) => p.id === id);
  if (!product) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const store = await readStore();
    const idx = store.products.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    // Keep the original id (renaming the id is not supported via edit).
    const updated = { ...normalizeProduct(body), id };
    if (!updated.name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }
    store.products[idx] = updated;
    await writeStore(store);
    return NextResponse.json({ ok: true, product: updated });
  } catch {
    return NextResponse.json({ error: 'Error actualizando producto' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const store = await readStore();
    const next = store.products.filter((p) => p.id !== id);
    if (next.length === store.products.length) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    store.products = next;
    await writeStore(store);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error borrando producto' }, { status: 500 });
  }
}
