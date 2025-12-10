import BadgeBase from './BadgeBase';

export default function InsaneBadge({ size }) {
  return (
    <BadgeBase size={size}>
      <g>
        <path
          d="
            M 0 512 
            L 208.6 312 
            L 256 0 
            L 302.04 310.47 
            L 512 512 
            L 256 404.68 
            L 0 512
          "
          fill="#0028DB"
        />
      </g>
    </BadgeBase>
  );
}
