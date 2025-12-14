import BadgeBase from './BadgeBase';

export default function ExtremeBadge({ size }) {
  return (
    <BadgeBase size={size}>
      <g>
        <polyline
          fill="#327DFF"
          stroke="none"
          strokeWidth="0"
          strokeMiterlimit="10"
          points="0 256 207.28 301.79 256 509.87 300.72 305.87 512 256 300.57 200.84 256 0 206.31 202.1 0 256"
        />
      </g>
    </BadgeBase>
  );
}
