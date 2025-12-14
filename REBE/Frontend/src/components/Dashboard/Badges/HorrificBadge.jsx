import BadgeBase from './BadgeBase';

export default function HorrificBadge({ size }) {
  return (
    <BadgeBase size={size}>
      <g>
        <polygon
          fill="#000000"
          stroke="#9691FF"
          strokeWidth="2.65"
          vectorEffect="non-scaling-stroke"
          points="
            -0.36 508.66
            256.17 348.23
            511.64 513.15
            348.97 255.81
            511.64 -0.35
            255.64 165.32
            -0.36 -0.35
            165.31 256.4
            -0.36 508.66
        "
        />
      </g>
    </BadgeBase>
  );
}
