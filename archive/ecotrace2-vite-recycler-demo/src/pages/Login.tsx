import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!phone || !password) {
            setError('Please enter mobile number and password.');
            return;
        }

        setIsSubmitting(true);
        try {
            await login(phone, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err?.message || 'Invalid login credentials. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>Facility Login</h2>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Access available only for verified facilities.</p>
            </div>

            {error && (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div className="form-group">
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

                <div className="form-group">
                    <label className="form-label" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-full mt-4" disabled={isSubmitting}>
                    {isSubmitting ? 'Verifying...' : 'Access Dashboard'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                <span className="text-muted">Don't have an account? </span>
                <Link to="/signup" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>Sign Up</Link>
            </div>
        </>
    );
}
