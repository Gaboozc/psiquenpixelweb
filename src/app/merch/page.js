import PageWrapper from '@/components/layout/PageWrapper';
import MerchExplorer from '@/components/merch/MerchExplorer';
import { getProducts, getCategories } from '@/lib/merch';

export const metadata = {
  title: 'Merch',
  description: 'Equipamiento oficial del Héroe de las Mazmorras.',
};

// Render per-request so admin edits and scheduled discount windows apply live.
export const dynamic = 'force-dynamic';

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
