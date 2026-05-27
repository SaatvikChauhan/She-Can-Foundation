import React from 'react';

export function Spinner({ dark }) {
  return <div className={`spinner ${dark ? 'spinner-dark' : ''}`}></div>;
}

export function Field({ label, required, error, children }) {
  return (
    <div className="field">
      <label>{label}{required && <span className="req"> *</span>}</label>
      {children}
      {error && <div className="err-msg"><span>⚠</span>{error}</div>}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = { new: 'badge-new', read: 'badge-read', replied: 'badge-replied' };
  const icons = { new: '●', read: '○', replied: '✓' };
  return <span className={`badge ${map[status] || 'badge-read'}`}>{icons[status]} {status}</span>;
}