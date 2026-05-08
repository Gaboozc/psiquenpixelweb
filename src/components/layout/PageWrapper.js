import PixelDivider from '@/components/ui/PixelDivider';

const PageWrapper = ({ title, subtitle, children }) => (
  <div className="min-h-screen">
    {/* Page header */}
    {title && (
      <div className="bg-brand-surface border-b border-brand-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-brand-text text-lg md:text-2xl mb-3"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-brand-muted font-body text-sm md:text-base">{subtitle}</p>
          )}
        </div>
      </div>
    )}

    <PixelDivider />

    {/* Page content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {children}
    </div>
  </div>
);

export default PageWrapper;
