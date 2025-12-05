import '../styles/dashboard.css';

export default function DashboardPage({ profile, onLogout }) {
  return (
    <div className="dashboard-container">
      <aside className="side-container">
        <h2 className="headings-1">Welcome, {profile.name}!</h2>
        <img
          src="https://placehold.co/128"
          alt=""
          className="profile-picture-image"
        />
        <p className="focus-font">
          Asal Kota:{' '}
          <span className="focus-font-heavierer">{profile.city}</span>
        </p>
        <p className="focus-font">
          Email: <span className="hyperlink-style">{profile.email}</span>
        </p>
        <p className="focus-font">
          Learning Type: <span>Consistent Learner</span>
        </p>
        <p className="focus-font">Level:</p>
        <button onClick={onLogout} className="button-hazard">
          Logout
        </button>
      </aside>
      <main className="main-container">
        <div className="insight-subcontainer">
          <h3>AI Learning Insight</h3>
          <ul>
            <li>Completed 5 lessons this week</li>
            <li>Average quiz score: 87%</li>
            <li>Time spent learning: 4h 32m</li>
          </ul>
        </div>

        <div className="leaderboard-subcontainer">
          <h3>Leaderboard</h3>
          <ul>
            <li>1. Alice - 1240 pts</li>
            <li>2. Bob - 1190 pts</li>
            <li>3. You - 1150 pts</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
