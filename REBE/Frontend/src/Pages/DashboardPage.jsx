import ProfilePicture from '../components/Dashboard/ProfilePicture';
import LevelBar from '../components/Dashboard/LevelBar';
import LevelProgressButton from '../components/Dashboard/LevelProgressButton';
import '../styles/dashboard.css';
import Leaderboard from '../components/Dashboard/Leaderboard';

export default function DashboardPage({ profile, onLogout }) {
  return (
    <div className="dashboard-container">
      <aside className="side-container">
        <h2 className="headings-1">Welcome, {profile.name}!</h2>
        <ProfilePicture size={128} />
        <p className="focus-font">
          Asal Kota:{' '}
          <span className="focus-font-heavierer">{profile.city}</span>
        </p>
        <p className="focus-font">
          Email: <span className="hyperlink-style">{profile.email}</span>
        </p>
        <p className="focus-font">
          Learner Type: <span>Consistent Learner</span>
        </p>
        <p className="focus-font">
          Level: <span>{profile.level}</span>
        </p>
        <LevelBar value={profile.xp} max={profile.required_xp} />
        <LevelProgressButton profile={profile}/>
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
          <Leaderboard />
        </div>
      </main>
    </div>
  );
}
