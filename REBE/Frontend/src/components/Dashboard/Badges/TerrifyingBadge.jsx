import BadgeBase from './BadgeBase';

export default function TerrifyingBadge({ size }) {
  return (
    <BadgeBase size={size}>
      <g>
        <polyline
          fill="#00FFFF"
          stroke=""
          strokeWidth="0"
          strokeMiterlimit="10"
          points="
            100.38 512
            256 387.57
            414.43 509.87
            351.11 312.51
            512 194.04
            313.32 194.04
            256 0
            197.91 197.11
            0 197.11
            160.64 314.55
            100.38 512
            "
        />
      </g>
    </BadgeBase>
  );
}
