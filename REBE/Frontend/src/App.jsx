import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, clearProfile } from './store/slices/profileSlice';
import { ThemeProvider } from './context/ThemeContext';
import { getAccessToken, putAccessToken } from './utils/api';
import Loading from './components/Loading';
import AuthPage from './Pages/AuthPage';
import DashboardPage from './Pages/DashboardPage';

function App() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.data);
  const profileStatus = useSelector((state) => state.profile.status);
  const profileError = useSelector((state) => state.profile.error);
  const [initializing, setInitializing] = React.useState(true);

  // theme state
  const [theme, setTheme] = React.useState(
    localStorage.getItem('theme') || 'light'
  );
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // get logged user saat pertama kali load
  React.useEffect(() => {
    async function init() {
      const token = getAccessToken();

      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        await dispatch(getProfile()).unwrap();
      } catch (err) {
        putAccessToken('');
        dispatch(clearProfile());
      } finally {
        setInitializing(false);
      }
    }

    init();
  }, [dispatch]);

  // update tema di html
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const themeContextValue = React.useMemo(
    () => ({ theme, toggleTheme }),
    [theme]
  );

  // login handler
  async function onLoginSuccess(accessToken) {
    putAccessToken(accessToken);
    try {
      await dispatch(getProfile()).unwrap();
    } catch (err) {
      console.error('Gagal mendapatkan profile setelah login:', err);
    }
  }

  // logout handler
  function onLogout() {
    putAccessToken('');
    dispatch(clearProfile());
  }

  // render loading
  if (initializing || profileStatus === 'loading') {
    return <Loading message="Loading..." />;
  }

  // render ketika tidak login
  if (!profile) {
    return (
      <ThemeProvider value={themeContextValue}>
        <div className="app-container">
          <main>
            <Routes>
              <Route
                path="/*"
                element={<AuthPage loginSuccess={onLoginSuccess} />}
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    );
  }

  // render ketika SUDAH login
  return (
    <ThemeProvider value={themeContextValue}>
      <div className="app-container">
        <header
          style={{
            background: '#091830ff',
            color: 'white',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          <h1>AI Learning Insight</h1>
        </header>
        <main style={{ padding: '2rem' }}>
          <Routes>
            <Route
              path="/"
              element={<DashboardPage profile={profile} onLogout={onLogout}/>}
            />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
