import React, { useState, useEffect } from 'react';

let _toastId = 0;
const toastListeners = new Set();

export const addToast = (msg, type = 'success') => {
  const id = ++_toastId;
  toastListeners.forEach(fn => fn({ id, msg, type }));
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  
  useEffect(() => {
    const handler = (t) => {
      setToasts(p => [...p, t]);
      setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 3200);
    };
    toastListeners.add(handler);
    return () => toastListeners.delete(handler);
  }, []);
  
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.type === 'success' ? '✓' : '✕'}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}