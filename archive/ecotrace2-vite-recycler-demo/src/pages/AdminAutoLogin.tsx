import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ADMIN_NAME = 'Admin';
const ADMIN_PHONE = 'admin';
const ADMIN_PASSWORD = 'REDACTED_DEMO_PASSWORD'; // redacted in 2026-11 recovery; never reuse the original value

export default function AdminAutoLogin() {
    const { signup, login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin-panel', { replace: true });
            return;
        }

        const autoLogin = async () => {
            try {
                await login(ADMIN_PHONE, ADMIN_PASSWORD);
            } catch {
                try {
                    await signup(ADMIN_NAME, ADMIN_PHONE, ADMIN_PASSWORD);
                } catch {
                    await login(ADMIN_PHONE, ADMIN_PASSWORD);
                }
            }
            navigate('/admin-panel', { replace: true });
        };

        autoLogin();
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '48px', height: '48px', border: '3px solid rgba(255,255,255,0.2)',
                    borderTopColor: '#ef4444', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem'
                }} />
                <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Signing in as Admin...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );
}
