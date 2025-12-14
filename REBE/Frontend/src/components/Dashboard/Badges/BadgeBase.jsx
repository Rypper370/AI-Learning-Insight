export default function BadgeBase({ children, size = 64, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ display: 'block' }}
    >
      {children}
    </svg>
  );
}
