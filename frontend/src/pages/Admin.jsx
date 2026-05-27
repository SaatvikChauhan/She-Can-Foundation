import React, { useState, useEffect } from 'react';
import { API } from '../api/client';
import { addToast } from '../components/Toast';
import { Spinner, StatusBadge } from '../components/Shared';

function MessageModal({ msg, onClose, onStatusChange }) {
  const [status, setStatus] = useState(msg.status);
  const [saving, setSaving] = useState(false);

  const save = async (s) => {
    setSaving(true);
    try {
      await API.updateMessageStatus(msg._id || msg.id, s);
      setStatus(s);
      onStatusChange(msg._id || msg.id, s);
      addToast('Status updated');
    } catch (e) {
      addToast('Failed to update status', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Message Details</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:20}}>
            <div className="avatar" style={{width:38,height:38,fontSize:'1rem'}}>{msg.name[0]}</div>
            <div>
              <div style={{fontWeight:500}}>{msg.name}</div>
              <div style={{fontSize:'0.82rem',color:'var(--warm-gray)'}}>{msg.email}</div>
            </div>
            <StatusBadge status={status} style={{marginLeft:'auto'}} />
          </div>
          <div style={{background:'var(--cream)',borderRadius:8,padding:'14px 16px',marginBottom:20,fontSize:'0.9rem',lineHeight:1.7,color:'var(--charcoal)'}}>
            {msg.message}
          </div>
          <div style={{fontSize:'0.78rem',color:'var(--warm-gray)',marginBottom:20}}>
            Received: {new Date(msg.createdAt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' })}
          </div>
          <div className="divider"></div>
          <div style={{fontSize:'0.82rem',fontWeight:500,marginBottom:10,color:'var(--charcoal)'}}>Update Status:</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['new','read','replied'].map(s => (
              <button key={s} className="btn btn-sm"
                style={{background: status === s ? 'var(--rose)' : 'var(--sand)', color: status === s ? 'white' : 'var(--charcoal)', opacity: saving ? 0.7 : 1}}
                onClick={() => save(s)} disabled={saving || status === s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel({ user }) {
  const [view, setView] = useState('dashboard');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [msgs, usrs] = await Promise.all([API.getMessages(), API.getUsers()]);
      setMessages(msgs);
      setUsers(usrs);
    } catch (e) {
      addToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load() }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await API.deleteMessage(id);
      setMessages(p => p.filter(m => (m._id || m.id) !== id));
      addToast('Message deleted');
    } catch (e) {
      addToast('Failed to delete message', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusChange = (id, status) => {
    setMessages(p => p.map(m => (m._id || m.id) === id ? { ...m, status } : m));
  };

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
  };

  const sideItems = [
    { id: 'dashboard', icon: '◈', label: 'Dashboard' },
    { id: 'messages', icon: '✉', label: 'Messages', count: stats.new },
    { id: 'users', icon: '◎', label: 'Users' },
    { id: 'api', icon: '⬡', label: 'API Info' },
  ];

  return (
    <div className="admin-layout" style={{paddingTop:64}}>
      <aside className="admin-sidebar">
        <div className="sidebar-section">
          <div className="sidebar-label">Navigation</div>
          {sideItems.map(item => (
            <button key={item.id} className={`sidebar-item ${view === item.id ? 'active' : ''}`} onClick={() => setView(item.id)}>
              <span>{item.icon}</span>
              {item.label}
              {item.count > 0 && <span style={{marginLeft:'auto',background:'var(--rose)',color:'white',borderRadius:50,width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem'}}>{item.count}</span>}
            </button>
          ))}
        </div>
        <div className="sidebar-section" style={{paddingTop:12,borderTop:'1px solid var(--sand)'}}>
          <div style={{padding:'8px 12px',fontSize:'0.8rem',color:'var(--warm-gray)'}}>
            <div style={{fontWeight:500,color:'var(--charcoal)'}}>{user.name}</div>
            <div style={{marginTop:2}}>{user.role}</div>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        {loading ? (
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:200}}>
            <Spinner dark />
          </div>
        ) : (
          <>
            {view === 'dashboard' && (
              <div className="fade-up">
                <h2 className="section-title">Dashboard</h2>
                <p className="text-muted" style={{marginBottom:24}}>Overview of She Can Foundation's outreach activity</p>
                <div className="stat-grid">
                  <div className="stat-card"><div className="stat-card-num">{stats.total}</div><div className="stat-card-label">Total Messages</div><div className="stat-card-change">↑ Active</div></div>
                  <div className="stat-card"><div className="stat-card-num" style={{color:'#1e40af'}}>{stats.new}</div><div className="stat-card-label">New / Unread</div></div>
                  <div className="stat-card"><div className="stat-card-num" style={{color:'var(--success)'}}>{stats.replied}</div><div className="stat-card-label">Replied</div></div>
                  <div className="stat-card"><div className="stat-card-num">{users.length}</div><div className="stat-card-label">Registered Users</div></div>
                </div>
                <div className="card" style={{marginBottom:24}}>
                  <div className="card-header"><h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.2rem',fontWeight:400}}>Recent Messages</h3></div>
                  <div className="card-body" style={{padding:0}}>
                    <div className="table-wrap" style={{borderRadius:0,border:'none'}}>
                      <table>
                        <thead><tr><th>Sender</th><th>Preview</th><th>Status</th><th>Date</th></tr></thead>
                        <tbody>
                          {messages.slice(0,5).map(m => (
                            <tr key={m._id || m.id} style={{cursor:'pointer'}} onClick={() => setSelectedMsg(m)}>
                              <td><strong>{m.name}</strong><div style={{fontSize:'0.77rem',color:'var(--warm-gray)'}}>{m.email}</div></td>
                              <td style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'var(--warm-gray)',fontSize:'0.84rem'}}>{m.message}</td>
                              <td><StatusBadge status={m.status} /></td>
                              <td style={{fontSize:'0.8rem',color:'var(--warm-gray)',whiteSpace:'nowrap'}}>{new Date(m.createdAt).toLocaleDateString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'messages' && (
              <div className="fade-up">
                <div className="flex justify-between items-center" style={{marginBottom:20}}>
                  <div>
                    <h2 className="section-title mb-0">Messages</h2>
                    <p className="text-muted">{stats.new} new message{stats.new !== 1 ? 's' : ''}</p>
                  </div>
                  <button className="btn btn-sm" style={{background:'var(--sand)',color:'var(--charcoal)'}} onClick={load}>↻ Refresh</button>
                </div>
                <div className="card">
                  <div className="table-wrap" style={{border:'none',borderRadius:0}}>
                    <table>
                      <thead><tr><th>Name</th><th>Email</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                      <tbody>
                        {messages.length === 0 && (
                          <tr><td colSpan={6} style={{textAlign:'center',color:'var(--warm-gray)',padding:32}}>No messages yet</td></tr>
                        )}
                        {messages.map(m => (
                          <tr key={m._id || m.id}>
                            <td style={{fontWeight:500}}>{m.name}</td>
                            <td style={{fontSize:'0.83rem',color:'var(--warm-gray)'}}>{m.email}</td>
                            <td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'0.84rem',color:'var(--warm-gray)'}}>{m.message}</td>
                            <td><StatusBadge status={m.status} /></td>
                            <td style={{fontSize:'0.79rem',color:'var(--warm-gray)',whiteSpace:'nowrap'}}>{new Date(m.createdAt).toLocaleDateString('en-IN')}</td>
                            <td>
                              <div style={{display:'flex',gap:6}}>
                                <button className="btn btn-sm" style={{background:'var(--sand)',color:'var(--charcoal)'}} onClick={() => setSelectedMsg(m)}>View</button>
                                <button className="btn btn-danger btn-sm" disabled={deleting === (m._id || m.id)} onClick={() => handleDelete(m._id || m.id)}>{deleting === (m._id || m.id) ? '…' : 'Del'}</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {view === 'users' && (
              <div className="fade-up">
                <h2 className="section-title">Users</h2>
                <p className="text-muted" style={{marginBottom:20}}>{users.length} registered account{users.length !== 1 ? 's' : ''}</p>
                <div className="card">
                  <div className="table-wrap" style={{border:'none',borderRadius:0}}>
                    <table>
                      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u._id || u.id}>
                            <td>
                              <div style={{display:'flex',alignItems:'center',gap:10}}>
                                <div className="avatar" style={{width:28,height:28,fontSize:'0.75rem'}}>{u.name[0]}</div>
                                {u.name}
                              </div>
                            </td>
                            <td style={{fontSize:'0.84rem',color:'var(--warm-gray)'}}>{u.email}</td>
                            <td><span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{u.role}</span></td>
                            <td style={{fontSize:'0.79rem',color:'var(--warm-gray)'}}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {view === 'api' && (
              <div className="fade-up">
                <h2 className="section-title">API Reference</h2>
                <p className="text-muted" style={{marginBottom:20}}>MERN stack REST API endpoints for She Can Foundation</p>
                {[
                  { method:'POST', path:'/api/auth/login', desc:'Authenticate user and return JWT token', body:'{email, password}' },
                  { method:'POST', path:'/api/auth/register', desc:'Register a new user account', body:'{name, email, password}' },
                  { method:'POST', path:'/api/auth/logout', desc:'Invalidate the current session token', body:'—' },
                  { method:'POST', path:'/api/contact', desc:'Submit a contact form message', body:'{name, email, message}' },
                  { method:'GET', path:'/api/messages', desc:'List all messages (admin only)', body:'—' },
                  { method:'PATCH', path:'/api/messages/:id', desc:'Update message status', body:'{status}' },
                  { method:'DELETE', path:'/api/messages/:id', desc:'Delete a message (admin only)', body:'—' },
                  { method:'GET', path:'/api/users', desc:'List all registered users (admin only)', body:'—' },
                ].map((ep, i) => (
                  <div key={i} className="card" style={{marginBottom:12,padding:'14px 20px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                      <span style={{
                        background: ep.method === 'GET' ? '#dbeafe' : ep.method === 'POST' ? '#d1fae5' : ep.method === 'PATCH' ? '#fef3c7' : '#fee2e2',
                        color: ep.method === 'GET' ? '#1e40af' : ep.method === 'POST' ? '#065f46' : ep.method === 'PATCH' ? '#92400e' : '#991b1b',
                        padding:'3px 9px',borderRadius:4,fontSize:'0.74rem',fontWeight:700,fontFamily:'monospace',flexShrink:0
                      }}>{ep.method}</span>
                      <code style={{fontSize:'0.87rem',color:'var(--rose-dark)',fontFamily:'monospace',flexShrink:0}}>{ep.path}</code>
                      <span style={{fontSize:'0.84rem',color:'var(--warm-gray)',flex:1}}>{ep.desc}</span>
                      {ep.body !== '—' && <code style={{fontSize:'0.78rem',background:'var(--sand)',padding:'2px 8px',borderRadius:4,color:'var(--charcoal)'}}>{ep.body}</code>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {selectedMsg && (
        <MessageModal
          msg={selectedMsg}
          onClose={() => setSelectedMsg(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}