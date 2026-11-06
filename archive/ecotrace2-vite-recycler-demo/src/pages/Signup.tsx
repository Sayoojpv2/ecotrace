import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Signup() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !phone || !password) {
            setError('All fields are required.');
            return;
        }

        if (password.length < 4) {
            setError('Password must be at least 4 characters.');
            return;
        }

        setIsSubmitting(true);
        try {
            await signup(name, phone, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>Create Account</h2>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Sign up to access the EcoTrace dashboard.</p>
            </div>

            {error && (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="name">Your Name</label>
                    <input
                        id="name"
                        type="text"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                    />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="phone">Mobile Number</label>
                    <input
                        id="phone"
                        type="text"
                        className="form-input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                    />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 4 characters"
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                <span className="text-muted">Already have an account? </span>
                <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>Log In</Link>
            </div>
        </>
    );
}
