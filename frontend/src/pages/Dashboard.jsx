import React from 'react';
import { ContactForm } from './Home';

export default function UserDashboard({ user, setPage }) {
  return (
    <div className="page" style={{ paddingTop: 100, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>

        <div className="fade-up" style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', marginBottom: 8 }}>
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-muted">Manage your community involvement and track your impact.</p>
        </div>

        <div className="stat-grid fade-up" style={{ animationDelay: '0.1s', marginBottom: 48 }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>🤝</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: 6 }}>Volunteer Status</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>You have not submitted a volunteer application yet.</p>
            <button className="btn btn-sm" style={{ marginTop: 12, background: 'var(--sand)' }} onClick={() => setPage('volunteer')}>Apply Now</button>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>💌</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: 6 }}>My Inquiries</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Track the status of messages you've sent to our team.</p>
            <button className="btn btn-sm" style={{ marginTop: 12, background: 'var(--sand)' }} onClick={() => setPage('history')}>View History</button>
          </div>
        </div>


        <div className="fade-up" style={{ animationDelay: '0.2s', marginBottom: 48 }}>
          <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: 20 }}>Our Impact Areas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { icon: '📚', label: 'Education', desc: 'Scholarships & skill training for 5,000+ women annually' },
              { icon: '🏥', label: 'Healthcare', desc: 'Free health camps reaching rural communities monthly' },
              { icon: '💼', label: 'Livelihood', desc: 'Micro-finance and entrepreneurship support programs' },
            ].map(item => (
              <div key={item.label} className="card feature-card" style={{ padding: '28px 20px', textAlign: 'center' }}>
                <div className="feature-icon" style={{ fontSize: '2.2rem', marginBottom: 14 }}>{item.icon}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600, marginBottom: 8, color: 'var(--rose-dark)' }}>{item.label}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--warm-gray)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fade-up" style={{ animationDelay: '0.3s' }}>
          <ContactForm user={user} />
        </div>

      </div>
    </div>
  );
}