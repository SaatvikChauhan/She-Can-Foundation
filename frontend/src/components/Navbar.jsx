import React from 'react';

export default function Navbar({ user, page, setPage, onLogout }) {
  return (
    <nav className="app-nav">
      
      <div className="nav-logo" style={{ cursor: 'pointer' }} onClick={() => setPage('home')}>
        <img 
          src="/logo.jpg" 
          alt="She Can Foundation Logo" 
          style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
        />
        She Can Foundation
      </div>

      <div className="nav-links">
        {user ? (
          <>
            
            {user.role === 'admin' ? (
              <button className={`nav-btn ${page === 'admin' ? 'primary' : 'ghost'}`} onClick={() => setPage('admin')}>
                 <span>Admin</span>
              </button>
            ) : (
              <button className={`nav-btn ${page === 'dashboard' ? 'primary' : 'ghost'}`} onClick={() => setPage('dashboard')}>
                 <span>My Dashboard</span>
              </button>
            )}

            <div className="nav-user">
              <div className="avatar">{user.name[0].toUpperCase()}</div>
            </div>
            <button className="nav-btn ghost" onClick={onLogout}>Sign out</button>
          </>
        ) : (
          <>
            {page === 'auth' && (
              <button className="nav-btn ghost" onClick={() => setPage('home')}>Home</button>
            )}

            {page === 'home' && (
              <button className="nav-btn outline" onClick={() => setPage('auth')}>Sign in</button>
            )}
          </>
        )}
      </div>
    </nav>
  );
}