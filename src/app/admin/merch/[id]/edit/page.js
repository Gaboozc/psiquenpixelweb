import { notFound } from 'next/navigation';
import { readStore } from '@/lib/merch';
import ProductEditor from '@/components/admin/ProductEditor';

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const { products, categories } = await readStore();
  const product = products.find((p) => p.id === id);

  if (!product) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-brand-text text-lg font-body font-bold">Editar Producto</h1>
        <p className="text-brand-muted text-sm font-body">{product.name}</p>
      </div>
      <ProductEditor initial={product} categories={categories} />
    </div>
  );
}
