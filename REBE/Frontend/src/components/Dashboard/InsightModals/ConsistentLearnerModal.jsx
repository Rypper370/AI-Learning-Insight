import ReactDOM from 'react-dom';

export default function ConsistentLearnerModal({ onClose }) {
  const modalRoot = document.getElementById('modal-root');

  const resources = [
    {
      name: 'RoutineHub in Notion',
      url: 'https://www.notion.so/templates/habit-tracker',
      description:
        'Daily and weekly habit tracker with streaks, rollups, and simple dashboards to keep cadence.',
      tag: 'Habits',
    },
    {
      name: 'Loop Habit Tracker',
      url: 'https://loophabittracker.app/',
      description: 'Lightweight tracker with streak strength and reminder nudges to stay on course.',
      tag: 'Habits',
    },
    {
      name: 'Streaks',
      url: 'https://streaksapp.com/',
      description: 'iOS habit companion with widgets and gentle nudges to maintain momentum.',
      tag: 'Habits',
    },
    {
      name: 'Sunsama',
      url: 'https://sunsama.com/',
      description: 'Guided daily review plus kanban + calendar in one view for sustainable pacing.',
      tag: 'Planning',
    },
    {
      name: 'Toggl Track',
      url: 'https://toggl.com/track/',
      description: 'Measure time on tasks to calibrate workload and avoid over-committing.',
      tag: 'Tracking',
    },
    {
      name: 'Calm',
      url: 'https://www.calm.com/',
      description: 'Mindfulness breaks and sleep stories to prevent burnout and keep a steady rhythm.',
      tag: 'Recovery',
    },
  ];

  return ReactDOM.createPortal(
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Consistent learner tools">
      <div className="modal-card insight-modal-card">
        <header className="modal-header">
          <p className="eyebrow">Productivity stack</p>
          <h2 className="modal-title outlined-font">Consistent Learner</h2>
          <p className="modal-subtitle">
            Keep steady progress with habit scaffolds, gentle reminders, and recovery windows.
          </p>
        </header>

        <div className="resource-list">
          {resources.map(({ name, url, description, tag }) => (
            <a
              key={name}
              className="resource-card"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              <div className="resource-card-head">
                <span className="pill neutral">{tag}</span>
                <span className="resource-card-cta">Open →</span>
              </div>
              <div className="resource-card-body">
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
            </a>
          ))}
        </div>

        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    modalRoot
  );
}
