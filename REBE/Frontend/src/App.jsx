import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { getUserLogged, putAccessToken } from "./utils/api";
import Loading from "./components/Loading";
import AuthPage from "./Pages/AuthPage";

function App() {
  const [authedUser, setAuthedUser] = React.useState(null);
  const [initializing, setInitializing] = React.useState(true);

  // theme state
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'light')
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  // get logged user saat pertama kali load
  React.useEffect(() => {
    async function fetchUser() {
      const { data } = await getUserLogged();
      setAuthedUser(data);
      setInitializing(false);
    };
    fetchUser();
  }, []);

  // update tema dihtml
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const themeContextValue = React.useMemo(() => ({ theme, toggleTheme }), [theme]);

  // login handler
  async function onLoginSuccess({ accessToken }) {
    putAccessToken(accessToken);
    const { data } = await getUserLogged();
    setAuthedUser(data);
  }

  // logout handler
  function onLogout() {
    putAccessToken('');
    setAuthedUser(null);
  }

  // render loading
  if (initializing) {
    return <Loading message="Loading..." />
  }

  // render belum login
  if (authedUser === null) {
    return (
      <ThemeProvider value={themeContextValue}>
        <div className="app-container">
          <main>
            <Routes>
              <Route path="/*" element={<AuthPage loginSuccess={onLoginSuccess} />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    )
  }

  // render sudah login
  if (authedUser !== null) {
    return (
      <ThemeProvider value={themeContextValue}>
        <div className="app-container">
          <header style={{
            background: '#3b82f6',
            color: 'white',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <h1>AI Learning Insight</h1>
          </header>
          <main style={{ padding: '2rem' }}>
            <Routes>
              <Route path="/" element={
                <div>
                  <h2>Welcome, {authedUser.name}!</h2>
                  <p>Email: {authedUser.email}</p>
                  <button
                    onClick={onLogout}
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Logout
                  </button>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;