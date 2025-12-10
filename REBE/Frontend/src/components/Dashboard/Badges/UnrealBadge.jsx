import BadgeBase from './BadgeBase';

export default function UnrealBadge({ size }) {
  return (
    <BadgeBase size={size}>
      <g>
        <polyline
          fill="#000000"
          stroke="#5751caff"
          strokeWidth="0.75"
          strokeMiterlimit="10"
          points="
          256 5.51
          293.42 171.17
          437.02 80.49
          346.34 224.09
          512 261.51
          346.34 298.93
          437.02 442.53
          293.42 351.85
          256 517.51
          218.58 351.85
          74.98 442.53
          165.66 298.93
          0 261.51
          165.66 224.09
          74.98 80.49
          218.58 171.17
          256 5.51
        "
        />
      </g>
    </BadgeBase>
  );
}
