import React, { useState, useEffect } from 'react';
import { API } from '../api/client';
import { validate } from '../utils/validators';
import { addToast } from '../components/Toast';
import { Field, Spinner } from '../components/Shared';

function AnimatedStat({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      // Calculate how much time has passed (0 to 1)
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function (easeOutQuart) so it slows down elegantly at the end
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count}{suffix}</>;
}

export function ContactForm({ user }) {
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: '' }));
  };

  const submit = async () => {
    const errs = {
      name: validate.name(form.name),
      email: validate.email(form.email),
      message: validate.message(form.message)
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    setLoading(true);
    try {
      await API.submitContact(form);
      setSuccess(true);
      addToast('Message sent! We\'ll be in touch soon.');
      setForm({ name: user?.name || '', email: user?.email || '', message: '' });
    } catch (e) {
      addToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="form-section fade-up" style={{ paddingTop: 48 }}>
        <div className="card text-center" style={{ padding: '52px 32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🌸</div>
          <h2 className="form-title" style={{ marginBottom: 8 }}>Form Submitted Successfully</h2>
          <p className="text-muted" style={{ marginBottom: 28, lineHeight: 1.7 }}>
            Thank you for reaching out! Our team will review your message and get back to you within 24–48 hours.
          </p>
          <div style={{ width: 48, height: 3, background: 'var(--rose)', borderRadius: 2, margin: '0 auto 28px' }}></div>
          <button className="btn btn-primary" style={{ maxWidth: 220, margin: '0 auto' }} onClick={() => setSuccess(false)}>
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-section fade-up" style={{ paddingTop: 48 }}>
      <div className="card">
        <div className="card-header">
          <h2 className="form-title">Get in Touch</h2>
          <p className="form-subtitle">We'd love to hear from you. Every message matters.</p>
        </div>
        <div className="card-body">
          <Field label="Your Name" required error={errors.name}>
            <input className={errors.name ? 'err' : ''} placeholder="Priya Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
          </Field>
          <Field label="Email Address" required error={errors.email}>
            <input type="email" className={errors.email ? 'err' : ''} placeholder="priya@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </Field>
          <Field label="Your Message" required error={errors.message}>
            <textarea className={errors.message ? 'err' : ''} placeholder="Share your thoughts, questions, or how you'd like to get involved…" value={form.message} onChange={e => set('message', e.target.value)} rows={5} />
          </Field>
          <div style={{ fontSize: '0.78rem', color: 'var(--warm-gray)', marginBottom: 16 }}>
            <span>🔒</span> Your information is secure and will never be shared with third parties.
          </div>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading ? <><Spinner /> Sending…</> : '→ Send Message'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ user, setPage }) {
  return (
    <div className="page">
      <div className="hero fade-up">
        <div className="hero-inner">
          <div className="hero-tag">✦ Empowering women, transforming communities</div>
          <h1>Every woman <em>deserves</em> the chance to thrive</h1>
          <p>She Can Foundation is an NGO, registered under the Indian Society Registration Act of 1860, dedicated to uplifting and empowering underprivileged women. Our mission is to provide education, training, and resources to help women from marginalized communities overcome obstacles and achieve their full potential. Join us in our mission to empower women and help build a brighter future for all.</p>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num">
                <AnimatedStat end={12} suffix="K+" />
              </div>
              <div className="stat-label">Women Supported</div>
            </div>
            <div className="stat">
              <div className="stat-num">
                <AnimatedStat end={48} duration={2200} />
              </div>
              <div className="stat-label">Districts Reached</div>
            </div>
            <div className="stat">
              <div className="stat-num">
                <AnimatedStat end={96} duration={2500} suffix="%" />
              </div>
              <div className="stat-label">Program Success</div>
            </div>
          </div>
          {!user && (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ width: 'auto', padding: '12px 28px' }} onClick={() => setPage('auth')}>
                Join Our Community
              </button>
              <button
                className="btn"
                style={{ background: 'var(--sand)', color: 'var(--charcoal)', padding: '12px 28px' }}
                onClick={() => {
                  document.querySelector('.bottom')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More ↓
              </button>
            </div>
          )}
        </div>
      </div>
      <ContactForm user={user} />
      <div className="bottom" style={{ padding: '0 24px 80px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {[
            { icon: '📚', label: 'Education', desc: 'Scholarships & skill training for 5,000+ women annually' },
            { icon: '🏥', label: 'Healthcare', desc: 'Free health camps reaching rural communities monthly' },
            { icon: '💼', label: 'Livelihood', desc: 'Micro-finance and entrepreneurship support programs' },
          ].map(item => (
            <div
              key={item.label}
              className="card feature-card"
              style={{ padding: '28px 20px', textAlign: 'center' }}
            >
              <div className="feature-icon" style={{ fontSize: '2.2rem', marginBottom: 14 }}>
                {item.icon}
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600, marginBottom: 8, color: 'var(--rose-dark)' }}>
                {item.label}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--warm-gray)', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}