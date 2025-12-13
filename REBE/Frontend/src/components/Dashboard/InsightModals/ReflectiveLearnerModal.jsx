import ReactDOM from 'react-dom';

export default function ReflectiveLearnerModal({ onClose }) {
  const modalRoot = document.getElementById('modal-root');

  const resources = [
    {
      name: 'Notion – Reflection Hub',
      url: 'https://www.notion.so/templates/journal',
      description: 'Weekly review templates with backlinks to connect themes across courses.',
      tag: 'Notes',
    },
    {
      name: 'Obsidian Vault',
      url: 'https://obsidian.md/',
      description: 'Local-first markdown with graph view to map insights and avoid knowledge silos.',
      tag: 'Knowledge Graph',
    },
    {
      name: 'Reflectly',
      url: 'https://www.reflectly.app/',
      description: 'Guided prompts + mood tracking to recap how you learned each day.',
      tag: 'Reflection',
    },
    {
      name: 'Readwise Reader',
      url: 'https://readwise.io/read',
      description: 'Capture highlights everywhere, then resurface them with spaced repetition.',
      tag: 'Review',
    },
    {
      name: 'Miro Boards',
      url: 'https://miro.com/',
      description: 'Visual whiteboarding to synthesize lectures, articles, and project ideas.',
      tag: 'Visual Map',
    },
    {
      name: 'Google Keep',
      url: 'https://keep.google.com/',
      description: 'Ultra-fast capture with labels + reminders for post-class reflections.',
      tag: 'Capture',
    },
  ];

  return ReactDOM.createPortal(
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Reflective learner tools">
      <div className="modal-card insight-modal-card">
        <header className="modal-header">
          <p className="eyebrow">Productivity stack</p>
          <h2 className="modal-title outlined-font">Reflective Learner</h2>
          <p className="modal-subtitle">
            Capture, connect, and revisit your learnings with tools tuned for deliberate reflection.
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
