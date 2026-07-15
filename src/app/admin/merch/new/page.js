import { getCategories } from '@/lib/merch';
import ProductEditor from '@/components/admin/ProductEditor';

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-brand-text text-lg font-body font-bold">Nuevo Producto</h1>
      </div>
      <ProductEditor categories={categories} isNew />
    </div>
  );
}
