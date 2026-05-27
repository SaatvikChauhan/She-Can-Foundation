import React, { useState } from 'react';
import { Field, Spinner } from '../components/Shared';
import { addToast } from '../components/Toast';

export default function VolunteerPage({ user, setPage }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            addToast('Volunteer application submitted successfully!');
        }, 1000);
    };

    return (
        <div className="page" style={{ paddingTop: 100, paddingBottom: 80 }}>
            <div className="form-section fade-up">

                <button className="btn btn-ghost" style={{ marginBottom: 20 }} onClick={() => setPage('dashboard')}>
                    ← Back to Dashboard
                </button>

                <div className="card">
                    <div className="card-header">
                        <h2 className="form-title">Become a Volunteer</h2>
                        <p className="form-subtitle">Join us on the ground and help make a direct impact in your community.</p>
                    </div>

                    {success ? (
                        <div className="card-body text-center" style={{ padding: '60px 32px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🙌</div>
                            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', marginBottom: 10 }}>Application Received</h3>
                            <p className="text-muted">Thank you, {user.name.split(' ')[0]}! Our volunteer coordinator will reach out to you within 3-5 business days.</p>
                        </div>
                    ) : (
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <Field label="Full Name" required>
                                    <input type="text" defaultValue={user.name} disabled style={{ background: 'var(--sand)', opacity: 0.7 }} />
                                </Field>
                                <Field label="Email Address" required>
                                    <input type="email" defaultValue={user.email} disabled style={{ background: 'var(--sand)', opacity: 0.7 }} />
                                </Field>
                                <Field label="Area of Interest" required>
                                    <select required defaultValue="">
                                        <option value="" disabled>Select a program...</option>
                                        <option value="education">Education & Teaching</option>
                                        <option value="healthcare">Healthcare & Camp Support</option>
                                        <option value="livelihood">Skill Development & Mentoring</option>
                                    </select>
                                </Field>
                                <Field label="Why do you want to volunteer?" required>
                                    <textarea rows={4} required placeholder="Tell us a little bit about yourself and your motivation..." />
                                </Field>

                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? <Spinner /> : 'Submit Application'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}