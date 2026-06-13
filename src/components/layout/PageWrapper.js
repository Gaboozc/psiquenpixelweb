import PixelDivider from '@/components/ui/PixelDivider';

const accentMap = {
  purple: {
    label: 'text-brand-purple',
    bar:   'bg-brand-purple',
  },
  amber: {
    label: 'text-brand-amber',
    bar:   'bg-brand-amber',
  },
};

const PageWrapper = ({ title, subtitle, children, accentColor = 'purple' }) => {
  const accent = accentMap[accentColor] ?? accentMap.purple;

  return (
    <div className="min-h-screen">
      {/* Page header */}
      {title && (
        <div className="dungeon-surface border-b border-brand-border py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-1 h-8 ${accent.bar}`} />
              <h1
                className="text-brand-text text-lg md:text-2xl"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className={`text-brand-muted font-body text-sm md:text-base ml-4 ${accent.label}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <PixelDivider />

      {/* Page content */}
      <div className="dungeon-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageWrapper;
