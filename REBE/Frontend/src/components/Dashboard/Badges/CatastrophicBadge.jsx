import BadgeBase from './BadgeBase';

export default function CatastrophicBadge({ size }) {
  return (
    <BadgeBase size={size}>
      <g>
        <polygon
          fill="#ffffff"
          stroke="#000"
          strokeWidth="5"
          strokeMiterlimit="10"
          points="
            256 0
            312.46 171.32
            512 128
            368.91 256
            512 384
            312.46 340.68
            256 512
            199.54 340.68
            0 384
            143.09 256
            0 128
            199.54 171.32
            256 0
        "
        />
      </g>
    </BadgeBase>
  );
}
