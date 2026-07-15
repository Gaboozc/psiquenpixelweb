import PageWrapper from '@/components/layout/PageWrapper';
import MerchExplorer from '@/components/merch/MerchExplorer';
import { getProducts, getCategories } from '@/lib/merch';

export const metadata = {
  title: 'Merch',
  description: 'Equipamiento oficial del Héroe de las Mazmorras.',
};

// Re-evaluate scheduled discount windows periodically.
export const revalidate = 3600;

export default async function MerchPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <PageWrapper
      title="La Forja"
      subtitle="Equipamiento oficial del Héroe de las Mazmorras"
      accentColor="amber"
    >
      <MerchExplorer products={products} categories={categories} />
    </PageWrapper>
  );
}
