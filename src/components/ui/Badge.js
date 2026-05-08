const colorMap = {
  purple: 'text-brand-purple border-brand-purple',
  amber:  'text-brand-amber  border-brand-amber',
  muted:  'text-brand-muted  border-brand-border',
};

const Badge = ({ children, color = 'purple', className = '' }) => (
  <span
    className={`inline-block px-2 py-0.5 text-[8px] tracking-widest border ${
      colorMap[color] ?? colorMap.purple
    } ${className}`}
    style={{ fontFamily: 'var(--font-pixel)' }}
  >
    {children}
  </span>
);

export default Badge;
