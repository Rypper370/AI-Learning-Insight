import { useEffect, useState } from 'react';
import { badgeRegistry } from './Badges/BadgeRegistry';

function getHighestBadge(level) {
    const unlocked = badgeRegistry.filter(b => level >= b.levelReq);
    return unlocked.length > 0 ? unlocked[unlocked.length - 1]: null;
}

function normalizeName(name) {
  return name
    .trim()
    .split(/\s+/)
    .map(word =>
      word
        .toLowerCase()
        .replace(/^[a-z]/, c => c.toUpperCase())
    )
    .join(" ");
}

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 30;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      `${import.meta.env.VITE_API_URL}/api/leaderboard?page=${page}&per_page=${perPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="leaderboard-subcontainer">
      <h3>Leaderboard</h3>

      {loading && <p>Loading...</p>}

      <div className="leaderboard-table-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>City</th>
              <th>Level</th>
              <th>XP</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => {
              const rank = (page - 1) * perPage + i + 1;

              const highestBadge = getHighestBadge(u.level);
              const BadgeComponent = highestBadge?.component;

              return (
                <tr key={u.id}>
                  <td>{rank}</td>
                  <td className="player-cell">
                    <img
                      src={u.resolved_profile_picture_url || '/default-avatar.png'}
                      alt=""
                      className="avatar"
                    />
                    <span>{normalizeName(u.name)}</span>
                  </td>
                  <td>{u.city}</td>
                  <td className='level-badge-cell'>
                    <span className='level-text'>Lvl. {u.level}</span>
                    {BadgeComponent && (
                        <div className='badge-inline'>
                            <BadgeComponent />
                        </div>
                    )}
                  </td>
                  <td>{u.xp}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="leaderboard-pagination">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
