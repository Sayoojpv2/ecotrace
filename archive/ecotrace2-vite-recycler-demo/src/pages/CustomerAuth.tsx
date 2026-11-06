import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';
import { getCustomerUsers, saveCustomerUser, setCustomerSession } from '../lib/store';

export default function CustomerAuth() {
    const navigate = useNavigate();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const users = getCustomerUsers();

        if (mode === 'signup') {
            if (!name || !phone || !password) { setError('All fields are required.'); return; }
            if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
            if (users[phone]) { setError('An account with this number already exists. Please login.'); return; }
            saveCustomerUser(phone, name, password);
            setCustomerSession(name, phone);
            navigate('/customer/dashboard');
        } else {
            if (!phone || !password) { setError('Phone and password are required.'); return; }
            const user = users[phone];
            if (!user) { setError('No account found. Please sign up first.'); return; }
            if (user.password !== password) { setError('Incorrect password.'); return; }
            setCustomerSession(user.name, phone);
            navigate('/customer/dashboard');
        }
    };

    const tabStyle = (active: boolean) => ({
        flex: 1, padding: '0.7rem', background: 'none', border: 'none', cursor: 'pointer',
        fontWeight: 600 as const, fontSize: '0.9rem', fontFamily: 'inherit',
        color: active ? '#10b981' : '#94a3b8',
        borderBottom: active ? '2.5px solid #10b981' : '2.5px solid transparent',
        marginBottom: '-1px', transition: 'all 0.2s'
    });

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #064e3b 0%, #0f2b3c 50%, #1a4563 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Decorative bg */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', top: '10%', right: '15%',
                    width: '300px', height: '300px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)'
                }} />
                <div style={{
                    position: 'absolute', bottom: '15%', left: '10%',
                    width: '250px', height: '250px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)'
                }} />
            </div>

            <div style={{ maxWidth: '420px', width: '100%', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: 10,
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}>
                            <Leaf size={18} color="white" />
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>EcoTrace</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(148, 163, 184, 0.8)' }}>Customer Waste Pickup Portal</p>
                </div>

                {/* Auth Card */}
                <div style={{
                    background: 'white', borderRadius: '16px', padding: '2rem',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(226, 232, 240, 0.8)'
                }}>
                    <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                        <button onClick={() => { setMode('login'); setError(''); }} style={tabStyle(mode === 'login')}>Login</button>
                        <button onClick={() => { setMode('signup'); setError(''); }} style={tabStyle(mode === 'signup')}>Sign Up</button>
                    </div>

                    {error && (
                        <div style={{
                            padding: '0.7rem 0.9rem', background: '#fef2f2',
                            color: '#dc2626', borderRadius: '10px', marginBottom: '1rem',
                            fontSize: '0.8rem', fontWeight: 500,
                            border: '1px solid #fecaca'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {mode === 'signup' && (
                            <div className="form-group mb-0">
                                <label className="form-label">Your Name / Company</label>
                                <input type="text" className="form-input" placeholder="Enter your name or company" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                        )}
                        <div className="form-group mb-0">
                            <label className="form-label">Mobile Number</label>
                            <input type="tel" className="form-input" placeholder="Enter mobile number" value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-input" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn w-full" style={{
                            marginTop: '0.5rem', padding: '0.8rem',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white', fontSize: '0.9rem', fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            borderRadius: '10px'
                        }}>
                            {mode === 'signup' ? 'Create Account' : 'Login'}
                        </button>
                    </form>
                </div>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <a href="/" style={{
                        color: 'rgba(148, 163, 184, 0.7)', textDecoration: 'none',
                        fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        transition: 'color 0.2s'
                    }}>
                        <ArrowLeft size={14} /> Back to EcoTrace
                    </a>
                </div>
            </div>
        </div>
    );
}
