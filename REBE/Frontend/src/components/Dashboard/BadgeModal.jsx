import ReactDOM from 'react-dom';
import { badgeRegistry } from './Badges/BadgeRegistry';
import { FaLock } from 'react-icons/fa';

export default function BadgeModal({ onClose, profile }) {
  const modalRoot = document.getElementById('modal-root');
  const userLevel = profile?.level ?? 0;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-card">
        <h2
          className="modal-title outlined-font">
          Your Badges
        </h2>

        <div className="badge-grid">
          {badgeRegistry.map((entry, i) => {
            const { component: BadgeComponent, name, levelReq } = entry;
            const unlocked = userLevel >= levelReq;

            return (
              <div
                key={i}
                className={`badge-item ${unlocked ? 'unlocked' : 'locked'}`}
              >
                {/* Badge graphic */}
                <div className="badge-icon-wrapper">
                  <BadgeComponent size={64} />

                  {/* Overlay only when locked */}
                  {!unlocked && (
                    <div className="badge-locked-overlay">
                      <FaLock className="badge-lock-icon" />
                    </div>
                  )}
                </div>

                <div className="badge-label">
                  {name} (Lv {levelReq})
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="modal-close"
          onClick={onClose}
          style={{
            display: 'block',
            margin: '20px auto 0 auto',
          }}
        >
          Close
        </button>
      </div>
    </div>,
    modalRoot
  );
}
