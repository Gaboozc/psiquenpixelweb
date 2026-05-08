const PixelDivider = ({ className = '' }) => (
  <div
    aria-hidden="true"
    className={`w-full h-1 ${className}`}
    style={{
      background: `repeating-linear-gradient(
        90deg,
        #9b59f7 0px,   #9b59f7 8px,
        transparent    8px,  transparent 12px,
        #e8903a        12px, #e8903a     16px,
        transparent    16px, transparent 20px
      )`,
    }}
  />
);

export default PixelDivider;
