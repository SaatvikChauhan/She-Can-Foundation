import React, { useState, useEffect } from 'react';
import { API } from '../api/client';
import { Spinner, StatusBadge } from '../components/Shared';

export default function HistoryPage({ user, setPage }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyHistory = async () => {
            try {
                const allMessages = await API.getMessages();
                // Filter messages so the user only sees their own
                const myMessages = allMessages.filter(m => m.email === user.email);
                setMessages(myMessages);
            } catch (err) {
                console.error("Failed to fetch history");
            } finally {
                setLoading(false);
            }
        };
        fetchMyHistory();
    }, [user.email]);

    return (
        <div className="page" style={{ paddingTop: 100, paddingBottom: 80 }}>
            <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>

                <div className="flex justify-between items-center fade-up" style={{ marginBottom: 24 }}>
                    <div>
                        <button className="btn btn-ghost" style={{ padding: '0 0 12px 0' }} onClick={() => setPage('dashboard')}>
                            ← Back to Dashboard
                        </button>
                        <h2 className="section-title mb-0">My Inquiries</h2>
                        <p className="text-muted">Track the status of your sent messages.</p>
                    </div>
                </div>

                <div className="card fade-up" style={{ animationDelay: '0.1s' }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                            <Spinner dark />
                        </div>
                    ) : (
                        <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Message Snippet</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.length === 0 && (
                                        <tr>
                                            <td colSpan={3} style={{ textAlign: 'center', color: 'var(--warm-gray)', padding: 40 }}>
                                                You haven't sent any messages yet.
                                            </td>
                                        </tr>
                                    )}
                                    {messages.map(m => (
                                        <tr key={m._id || m.id}>
                                            <td style={{ fontSize: '0.85rem', color: 'var(--warm-gray)', whiteSpace: 'nowrap' }}>
                                                {new Date(m.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
                                                {m.message}
                                            </td>
                                            <td><StatusBadge status={m.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}