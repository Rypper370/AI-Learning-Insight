export default function LevelBar({ value, max }) {
  const percentage = Math.min(Math.max(value / max, 0), 1) * 100;
  return (
    <div className="level-bar">
      <div className="level-bar-fill" style={{ width: `${percentage}%` }} />
    </div>
  );
}
