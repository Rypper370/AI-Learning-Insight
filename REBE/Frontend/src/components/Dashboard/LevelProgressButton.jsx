import { useState } from 'react';
import BadgeModal from './BadgeModal';

export default function LevelProgressButton({ profile }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        style={{ marginBlock: '0.75px' }}
        className="outlined-font carbon-button"
        onClick={() => setOpen(true)}
      >
        Level Progress
      </button>

      {open && <BadgeModal onClose={() => setOpen(false)} profile={profile} />}
    </>
  );
}
