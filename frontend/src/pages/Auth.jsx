import React, { useState } from 'react';
import { API } from '../api/client';
import { validate } from '../utils/validators';
import { addToast } from '../components/Toast';
import { Field, Spinner } from '../components/Shared';

export default function AuthPage({ onAuth }) {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr] = useState('');

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: '' }));
    setApiErr('');
  };

  const submit = async (e) => {
    // Prevent the default form submission page reload
    if (e) e.preventDefault();

    const errs = {};
    if (tab === 'register') errs.name = validate.name(form.name);
    errs.email = validate.email(form.email);
    errs.password = tab === 'login' ? (!form.password ? 'Password is required' : '') : validate.password(form.password);

    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    setLoading(true);
    try {
      const user = tab === 'login'
        ? await API.login({ email: form.email, password: form.password })
        : await API.register({ name: form.name, email: form.email, password: form.password });
      addToast(`Welcome${tab === 'login' ? ' back' : ''}, ${user.name.split(' ')[0]}!`);
      onAuth(user);
    } catch (e) {
      setApiErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <div className="auth-logo">
          <div className="auth-logo-text">✦ She Can Foundation</div>
          <div className="auth-logo-sub">Empowering women, transforming communities</div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="auth-tabs">
              <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setErrors({}); setApiErr(''); }}>Sign In</button>
              <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setErrors({}); setApiErr(''); }}>Register</button>
            </div>

            {apiErr && <div className="alert alert-error" style={{ marginBottom: 16 }}><span className="alert-icon">✕</span>{apiErr}</div>}

            
            <form onSubmit={submit}>
              {tab === 'register' && (
                <Field label="Full Name" required error={errors.name}>
                  <input className={errors.name ? 'err' : ''} value={form.name} onChange={e => set('name', e.target.value)} />
                </Field>
              )}
              <Field label="Email Address" required error={errors.email}>
                <input type="email" className={errors.email ? 'err' : ''} value={form.email} onChange={e => set('email', e.target.value)} />
              </Field>
              <Field label="Password" required error={errors.password}>
                <input type="password" className={errors.password ? 'err' : ''} value={form.password} onChange={e => set('password', e.target.value)} />
              </Field>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 4 }}>
                {loading ? <Spinner /> : (tab === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            {/* Demo Credentials */}
            {tab === 'login' && (
              <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--warm-gray)' }}>
                <p style={{ marginBottom: '4px' }}>Demo Admin Account:</p>
                <p><strong>admin@shecan.org</strong> / <strong>Admin@123</strong></p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}