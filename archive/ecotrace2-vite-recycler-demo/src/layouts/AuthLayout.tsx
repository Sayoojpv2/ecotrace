import { Outlet } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function AuthLayout() {
    return (
        <div className="auth-layout">
            {/* Floating particles effect */}
            <div style={{
                position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
            }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: `${60 + i * 30}px`,
                        height: `${60 + i * 30}px`,
                        borderRadius: '50%',
                        border: '1px solid rgba(16, 185, 129, 0.06)',
                        top: `${15 + i * 15}%`,
                        left: `${10 + i * 18}%`,
                        animation: `float ${4 + i}s ease-in-out infinite alternate`,
                    }} />
                ))}
                <style>{`
                    @keyframes float {
                        0% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
                        100% { transform: translateY(-20px) rotate(5deg); opacity: 0.6; }
                    }
                `}</style>
            </div>

            <div className="auth-container">
                {/* Logo */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                    marginBottom: '0.5rem'
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                        <Leaf size={20} color="white" />
                    </div>
                    <span style={{
                        fontSize: '1.5rem', fontWeight: 800, color: 'white',
                        letterSpacing: '-0.03em'
                    }}>
                        EcoTrace
                    </span>
                </div>
                <p style={{
                    textAlign: 'center', color: 'rgba(148, 163, 184, 0.8)',
                    fontSize: '0.85rem', marginBottom: '2rem'
                }}>
                    Secure Compliance Portal
                </p>

                {/* Auth Card */}
                <div className="card" style={{
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    padding: '2rem'
                }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
