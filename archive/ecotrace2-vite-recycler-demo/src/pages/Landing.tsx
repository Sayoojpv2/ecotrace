import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Clock, Users, Truck, Leaf, Zap, ChevronRight } from 'lucide-react';

export default function Landing() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
            {/* Header */}
            <header style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 2.5rem',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
                position: 'sticky', top: 0, zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: 28, height: 28,
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        borderRadius: 7,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Leaf size={16} color="white" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f2b3c', letterSpacing: '-0.02em' }}>
                        EcoTrace
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Link to="/login" style={{
                        padding: '0.55rem 1.25rem', borderRadius: '8px',
                        border: '1.5px solid #e2e8f0', background: 'white',
                        color: '#0f2b3c', fontWeight: 600, fontSize: '0.85rem',
                        textDecoration: 'none', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: '0.4rem'
                    }}>
                        Recycler Login
                    </Link>
                    <Link to="/customer" style={{
                        padding: '0.55rem 1.25rem', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white', fontWeight: 600, fontSize: '0.85rem',
                        textDecoration: 'none', transition: 'all 0.2s',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                        display: 'flex', alignItems: 'center', gap: '0.4rem'
                    }}>
                        Customer Login
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main style={{ flexGrow: 1 }}>
                <section style={{
                    padding: '5rem 2rem 3rem',
                    background: 'linear-gradient(180deg, #f0f4f8 0%, #e8f0f8 50%, #f0f4f8 100%)',
                    position: 'relative', overflow: 'hidden'
                }}>
                    {/* Decorative background elements */}
                    <div style={{
                        position: 'absolute', top: '-100px', right: '-100px',
                        width: '400px', height: '400px',
                        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
                        borderRadius: '50%'
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-80px', left: '-80px',
                        width: '300px', height: '300px',
                        background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
                        borderRadius: '50%'
                    }} />

                    <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.35rem 1rem', borderRadius: '20px',
                            background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)',
                            color: '#059669', fontSize: '0.8rem', fontWeight: 600,
                            marginBottom: '1.5rem'
                        }}>
                            <Zap size={14} /> Built for Modern Recyclers
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                            fontWeight: 800, color: '#0f2b3c',
                            lineHeight: 1.15, margin: '0 0 1.25rem',
                            letterSpacing: '-0.03em'
                        }}>
                            The Compliance <br />
                            <span style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>Operating System</span>
                        </h1>
                        <p style={{
                            fontSize: '1.15rem', color: '#64748b',
                            maxWidth: '38rem', margin: '0 auto', lineHeight: 1.7
                        }}>
                            Automate your daily facility logging into inspection-ready documentation.
                            Track receipts, processing, and dispatch — all in one place.
                        </p>
                    </div>
                </section>

                {/* Portal Selection */}
                <section style={{ padding: '2rem 2rem 4rem', background: 'var(--color-background)' }}>
                    <div style={{ maxWidth: '50rem', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ color: '#0f2b3c', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.35rem', letterSpacing: '-0.02em' }}>
                                Choose Your Portal
                            </h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                Select how you'd like to access the platform
                            </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {/* Customer Card */}
                            <Link to="/customer" style={{ textDecoration: 'none' }}>
                                <div style={{
                                    padding: '2.5rem 2rem', textAlign: 'center', cursor: 'pointer',
                                    background: 'white', borderRadius: '16px',
                                    border: '1.5px solid #e2e8f0',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
                                }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.borderColor = '#10b981';
                                        el.style.transform = 'translateY(-6px)';
                                        el.style.boxShadow = '0 16px 40px rgba(16, 185, 129, 0.12)';
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.borderColor = '#e2e8f0';
                                        el.style.transform = 'none';
                                        el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                                    }}
                                >
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                                    }}>
                                        <Users size={26} color="white" />
                                    </div>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f2b3c', margin: 0 }}>
                                        Customer Portal
                                    </h3>
                                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>
                                        Request waste pickups, track requests, and view QR verification codes
                                    </p>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                                        color: '#10b981', fontWeight: 600, fontSize: '0.85rem', marginTop: '0.25rem'
                                    }}>
                                        Enter as Customer <ChevronRight size={16} />
                                    </div>
                                </div>
                            </Link>

                            {/* Recycler Card */}
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <div style={{
                                    padding: '2.5rem 2rem', textAlign: 'center', cursor: 'pointer',
                                    background: 'white', borderRadius: '16px',
                                    border: '1.5px solid #e2e8f0',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
                                }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.borderColor = '#3b82f6';
                                        el.style.transform = 'translateY(-6px)';
                                        el.style.boxShadow = '0 16px 40px rgba(59, 130, 246, 0.12)';
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.borderColor = '#e2e8f0';
                                        el.style.transform = 'none';
                                        el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                                    }}
                                >
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
                                    }}>
                                        <Truck size={26} color="white" />
                                    </div>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f2b3c', margin: 0 }}>
                                        Recycler Portal
                                    </h3>
                                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>
                                        Manage operations, pickups, documents, compliance reports & tracking
                                    </p>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                                        color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem', marginTop: '0.25rem'
                                    }}>
                                        Enter as Recycler <ChevronRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section style={{ padding: '4rem 2rem 5rem', background: 'white' }}>
                    <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f2b3c', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
                                Why EcoTrace?
                            </h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Everything you need for modern facility compliance</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            {[
                                { icon: Activity, title: 'Automated Logs', desc: 'Record daily pickups and processing with simple 2-click forms designed for fast-paced facility floors.', color: '#3b82f6', bg: '#dbeafe' },
                                { icon: ShieldCheck, title: 'Instant Reports', desc: 'Generate complete inspection packs — stock registers, inward logs, and material balance records.', color: '#10b981', bg: '#d1fae5' },
                                { icon: Clock, title: 'Expiry Alerts', desc: 'Never miss a deadline. Compliance vault warns you before licenses and agreements expire.', color: '#f59e0b', bg: '#fef3c7' },
                            ].map((f, i) => (
                                <div key={i} style={{
                                    padding: '2rem 1.5rem', borderRadius: '14px',
                                    border: '1px solid #f1f5f9',
                                    transition: 'all 0.25s',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    gap: '0.75rem', textAlign: 'center', cursor: 'default'
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(0,0,0,0.06)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                                >
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '12px',
                                        background: f.bg, color: f.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <f.icon size={24} />
                                    </div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f2b3c', margin: 0 }}>
                                        {f.title}
                                    </h3>
                                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem', lineHeight: 1.6 }}>
                                        {f.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer style={{
                background: 'linear-gradient(135deg, #0f2b3c 0%, #1a4563 100%)',
                color: 'white', padding: '2.5rem 2rem'
            }}>
                <div style={{ maxWidth: '64rem', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}>
                        <div style={{
                            width: 24, height: 24,
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Leaf size={14} color="white" />
                        </div>
                        EcoTrace
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        &copy; {new Date().getFullYear()} EcoTrace Compliance OS. All rights reserved.
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
                        <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Support</a>
                        <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
