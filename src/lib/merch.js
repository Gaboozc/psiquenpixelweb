import { readContent, writeContent } from './siteContent';

export const DEFAULT_CATEGORIES = [
  { id: 'todos',          label: 'TODO EL BOTÍN' },
  { id: 'camisetas',      label: 'CAMISETAS' },
  { id: 'hoodies',        label: 'HOODIES' },
  { id: 'accesorios',     label: 'ACCESORIOS' },
  { id: 'coleccionables', label: 'COLECCIONABLES' },
];

// Read the raw store ({ categories, products }) with a safe fallback.
export async function readStore() {
  const parsed = await readContent('merch');
  return {
    categories: Array.isArray(parsed?.categories) ? parsed.categories : DEFAULT_CATEGORIES,
    products: Array.isArray(parsed?.products) ? parsed.products : [],
  };
}

export async function writeStore(store) {
  await writeContent('merch', store);
}

// Is a discount currently active? Compares YYYY-MM-DD strings lexicographically
// (valid for ISO dates) against today, inclusive of both endpoints.
export function isDiscountActive(discount, today = new Date().toISOString().slice(0, 10)) {
  if (!discount || !discount.percent || !discount.start || !discount.end) return false;
  const pct = Number(discount.percent);
  if (!(pct > 0)) return false;
  return discount.start <= today && today <= discount.end;
}

// Round to 2 decimals.
const money = (n) => Math.round(n * 100) / 100;

// Decorate a product with computed pricing/discount state for public rendering.
export function decorateProduct(product, today) {
  const active = isDiscountActive(product.discount, today);
  const originalPrice = product.price;
  const price = active
    ? money(originalPrice * (1 - Number(product.discount.percent) / 100))
    : originalPrice;
  return {
    ...product,
    originalPrice,
    price,
    discountActive: active,
    discountPercent: active ? Number(product.discount.percent) : null,
    discountEnd: active ? product.discount.end : null,
  };
}

// Public: all products with discounts applied for today, plus categories.
export async function getProducts() {
  const { products } = await readStore();
  const today = new Date().toISOString().slice(0, 10);
  return products.map((p) => decorateProduct(p, today));
}

export async function getCategories() {
  const { categories } = await readStore();
  return categories;
}

export const sanitizeId = (s) =>
  String(s || '').toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

// Normalize an incoming product payload (from the admin editor) into the stored
// shape. Accepts comma-separated strings or arrays for sizes/colors/tags.
export function normalizeProduct(body) {
  const price = Number(body.price);
  const stock = Number.isFinite(Number(body.stock)) ? Number(body.stock) : 0;

  let discount = null;
  if (body.discount && body.discount.percent && body.discount.start && body.discount.end) {
    discount = {
      percent: Number(body.discount.percent),
      start: body.discount.start,
      end: body.discount.end,
    };
  }

  const arr = (v) => {
    if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
    if (typeof v === 'string') return v.split(',').map((x) => x.trim()).filter(Boolean);
    return null;
  };

  return {
    id: sanitizeId(body.id),
    name: String(body.name || '').trim(),
    description: String(body.description || '').trim(),
    price: Number.isFinite(price) ? price : 0,
    category: String(body.category || '').trim(),
    sizes: arr(body.sizes),
    colors: arr(body.colors),
    stock,
    badge: body.badge ? String(body.badge).trim() : null,
    icon: String(body.icon || '📦').trim(),
    tags: arr(body.tags) ?? [],
    discount,
  };
}
