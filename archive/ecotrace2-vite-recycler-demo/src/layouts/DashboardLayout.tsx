import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { generateAlerts } from '../lib/store';
import {
    BarChart3,
    AlertTriangle,
    Truck,
    FileText,
    FolderLock,
    LineChart,
    Calendar,
    LogOut,
    Leaf,
} from 'lucide-react';

export default function DashboardLayout() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const alertCount = generateAlerts().filter(a => a.severity === 'Critical' || a.severity === 'Warning').length;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { to: '/dashboard/overview', icon: BarChart3, label: 'Overview' },
        { to: '/dashboard/alerts', icon: AlertTriangle, label: 'Alerts', badge: alertCount },
        { to: '/dashboard/pickup', icon: Truck, label: 'Pickup' },
        { to: '/dashboard/reports', icon: FileText, label: 'Reports' },
        { to: '/dashboard/documents', icon: FolderLock, label: 'Documents' },
        { to: '/dashboard/tracking', icon: LineChart, label: 'Data Tracking' },
        { to: '/dashboard/timeline', icon: Calendar, label: 'Timeline' },
    ];

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div style={{
                        width: 28, height: 28,
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                    }}>
                        <Leaf size={16} color="white" />
                    </div>
                    <span>EcoTrace</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/dashboard/overview'}
                            className={({ isActive }) => "nav-item " + (isActive ? "active" : "")}
                        >
                            <item.icon size={18} />
                            {item.label}
                            {item.badge && item.badge > 0 && (
                                <span style={{
                                    marginLeft: 'auto',
                                    background: '#ef4444',
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '10px',
                                    minWidth: '20px',
                                    textAlign: 'center'
                                }}>
                                    {item.badge}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {user && (
                        <div style={{
                            fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                            <div style={{
                                width: '28px', height: '28px', borderRadius: '8px',
                                background: 'linear-gradient(135deg, #1a4563, #225c82)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.7rem', fontWeight: 700, color: 'white'
                            }}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{user.name}</span>
                        </div>
                    )}
                    <button onClick={handleLogout} className="nav-item w-full" style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        textAlign: 'left', color: '#94a3b8', padding: '0.6rem 0',
                        fontSize: '0.85rem'
                    }}>
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-area">
                <header className="topbar">
                    <h2 style={{ fontSize: '1rem', marginBottom: 0, color: 'var(--color-primary)', fontWeight: 600 }}>
                        Facility Operations Dashboard
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                            {user ? `Welcome, ${user.name}` : 'EcoTrace Operations'}
                        </span>
                    </div>
                </header>
                <div className="content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
