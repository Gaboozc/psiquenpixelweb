import { readStore } from '@/lib/merch';
import MerchTable from '@/components/admin/MerchTable';

// Always reflect current data in the admin.
export const dynamic = 'force-dynamic';

export default async function AdminMerchPage() {
  const { products, categories } = await readStore();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-brand-text text-lg font-body font-bold">Merch</h1>
        <p className="text-brand-muted text-sm font-body">
          Productos de la tienda. Crea, edita, borra y programa descuentos.
        </p>
      </div>
      <MerchTable products={products} categories={categories} />
    </div>
  );
}
