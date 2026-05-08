'use client';

const variantStyles = {
  primary: {
    base: 'bg-brand-purple text-white border-2 border-brand-purple',
    shadow: '4px 4px 0 #6b3bbf',
    hoverShadow: '6px 6px 0 #6b3bbf',
  },
  secondary: {
    base: 'bg-transparent text-brand-amber border-2 border-brand-amber',
    shadow: '4px 4px 0 #a8621a',
    hoverShadow: '6px 6px 0 #a8621a',
  },
};

const Button = ({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  ...props
}) => {
  const v = variantStyles[variant] ?? variantStyles.primary;

  const baseClass = `
    inline-block px-5 py-3 text-[9px] tracking-widest
    cursor-pointer select-none transition-all duration-75
    active:translate-x-0.5 active:translate-y-0.5
    ${v.base} ${className}
  `.trim();

  const style = { fontFamily: 'var(--font-pixel)', boxShadow: v.shadow };

  const handleHover  = (e) => { e.currentTarget.style.boxShadow = v.hoverShadow; e.currentTarget.style.transform = 'translate(-2px, -2px)'; };
  const handleLeave  = (e) => { e.currentTarget.style.boxShadow = v.shadow;      e.currentTarget.style.transform = ''; };
  const handleActive = (e) => { e.currentTarget.style.boxShadow = 'none';        e.currentTarget.style.transform = 'translate(2px, 2px)'; };

  const handlers = {
    onMouseEnter:  handleHover,
    onMouseLeave:  handleLeave,
    onMouseDown:   handleActive,
    onMouseUp:     handleHover,
  };

  if (href) {
    return (
      <a href={href} className={baseClass} style={style} {...handlers} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClass} style={style} {...handlers} {...props}>
      {children}
    </button>
  );
};

export default Button;
