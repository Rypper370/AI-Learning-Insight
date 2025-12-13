import ReactDOM from 'react-dom';

export default function FastLearnerModal({ onClose }) {
  const modalRoot = document.getElementById('modal-root');

  const resources = [
    {
      name: 'Todoist + Time Blocking',
      url: 'https://todoist.com/productivity-methods/time-blocking',
      description: 'Plan sprints in blocks, prioritize MITs, and auto-carry tasks to tomorrow.',
      tag: 'Planning',
    },
    {
      name: 'Motion',
      url: 'https://www.usemotion.com/',
      description: 'AI schedules your day and rearranges tasks when priorities shift.',
      tag: 'Automation',
    },
    {
      name: 'TickTick Pomodoro',
      url: 'https://ticktick.com/',
      description: 'Built-in Pomodoro + calendar view to batch deep work sessions.',
      tag: 'Focus',
    },
    {
      name: 'Forest',
      url: 'https://www.forestapp.cc/',
      description: 'Stay in flow with focus timers and visual progress trees.',
      tag: 'Focus',
    },
    {
      name: 'Superhuman Shortcuts',
      url: 'https://superhuman.com/',
      description: 'Keyboard-first inbox triage to keep your queue near zero.',
      tag: 'Speed',
    },
    {
      name: 'Cron Calendar',
      url: 'https://cron.com/',
      description: 'Fast calendar with timezone support for quick rescheduling and hotkeys.',
      tag: 'Schedule',
    },
    {
      name: 'Roadmap.sh',
      url: 'https://roadmap.sh',
      description: 'Learn developer roadmaps to map future learning',
      tag: 'Roadmap'
    },
    {
      name: 'Leetcode',
      url: 'https://leetcode.com/',
      description: 'Leetcode has lots of challenges for you to learn.',
      tag: 'Beginner to Expert level coding challenges'
    }
  ];

  return ReactDOM.createPortal(
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Fast learner tools">
      <div className="modal-card insight-modal-card">
        <header className="modal-header">
          <p className="eyebrow">Productivity stack</p>
          <h2 className="modal-title outlined-font">Fast Learner</h2>
          <p className="modal-subtitle">
            Move quickly with time-blocked focus, rapid capture, and automation to reduce friction.
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
