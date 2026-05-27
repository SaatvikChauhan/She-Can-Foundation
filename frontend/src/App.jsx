import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPage from './pages/Auth';
import AdminPanel from './pages/Admin';
import HomePage from './pages/Home';
import UserDashboard from './pages/Dashboard';
import VolunteerPage from './pages/Volunteer'; 
import HistoryPage from './pages/History';     
import ToastContainer, { addToast } from './components/Toast';
import { API } from './api/client';

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('scf_session'));
    if (session) setUser(session);
  }, []);

  const handleAuth = (u) => {
    localStorage.setItem('scf_session', JSON.stringify(u));
    setUser(u);
    setPage(u.role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleLogout = async () => {
    await API.logout();
    localStorage.removeItem('scf_session');
    setUser(null);
    setPage('home');
    addToast('Signed out successfully');
  };

  const isUser = user?.role === 'user';
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <Navbar user={user} page={page} setPage={setPage} onLogout={handleLogout} />

      {page === 'auth' && !user && <AuthPage onAuth={handleAuth} />}
      {page === 'admin' && isAdmin && <AdminPanel user={user} />}

      {page === 'dashboard' && isUser && <UserDashboard user={user} setPage={setPage} />}
      {page === 'volunteer' && isUser && <VolunteerPage user={user} setPage={setPage} />}
      {page === 'history' && isUser && <HistoryPage user={user} setPage={setPage} />}

      {page === 'home' && <HomePage user={user} setPage={setPage} />}

      <ToastContainer />
      <footer style={{ background: 'var(--charcoal)', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '28px 24px', fontSize: '0.82rem' }}>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>✦ She Can Foundation</div>
        © 2026 She Can Foundation. All rights reserved.
      </footer>
    </>
  );
}