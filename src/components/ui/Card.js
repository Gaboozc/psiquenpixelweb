const Card = ({ children, className = '', hover = true }) => (
  <div
    className={`bg-brand-surface pixel-border transition-all duration-150 ${
      hover ? 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:pixel-border-purple' : ''
    } ${className}`}
  >
    {children}
  </div>
);

export default Card;
