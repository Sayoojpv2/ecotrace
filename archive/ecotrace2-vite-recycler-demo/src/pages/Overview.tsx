import { useState, useEffect } from 'react';
import { Activity, CheckCircle, Package, Truck, FileText, ArrowRight, AlertOctagon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getMetrics, getPickups, getDocs, generateAlerts } from '../lib/store';

const statCardStyle = () => ({
    background: 'white',
    borderRadius: '14px',
    border: '1px solid var(--color-border)',
    padding: '1.25rem',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '0.5rem',
    justifyContent: 'space-between' as const,
    transition: 'all 0.2s',
    cursor: 'default',
    position: 'relative' as const,
    overflow: 'hidden' as const,
});

export default function Overview() {
    const { userRole } = useAuth();
    const isReadOnly = userRole === 'partner';
    const navigate = useNavigate();

    const [metrics, setMetrics] = useState({ pickups: 0, totalPickupCount: 0, processing: 0, dispatch: 0, pending: 0 });
    const [recentPickups, setRecentPickups] = useState<{ wasteType: string; quantity: string; date: string }[]>([]);
    const [alertCount, setAlertCount] = useState(0);

    useEffect(() => {
        setMetrics(getMetrics());
        setRecentPickups(getPickups().slice(0, 5));
        setAlertCount(generateAlerts().filter(a => a.severity === 'Critical' || a.severity === 'Warning').length);
    }, []);

    const docsCount = getDocs().length;
    const hasData = getPickups().length > 0 || docsCount > 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>

            {/* Row 1: Status & Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                {/* Compliance Status */}
                <div style={{
                    background: alertCount > 0
                        ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
                        : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                    borderRadius: '14px',
                    border: `1.5px solid ${alertCount > 0 ? '#fde68a' : '#a7f3d0'}`,
                    padding: '1.5rem',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: alertCount > 0 ? '#f59e0b' : '#10b981',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: `0 4px 12px ${alertCount > 0 ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
                            flexShrink: 0
                        }}>
                            {alertCount > 0
                                ? <AlertOctagon size={22} color="white" />
                                : <CheckCircle size={22} color="white" />}
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f2b3c' }}>
                                {alertCount > 0 ? 'Attention Needed' : 'All Systems Compliant'}
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                                {alertCount > 0
                                    ? `${alertCount} alert${alertCount > 1 ? 's' : ''} requiring attention`
                                    : 'All entries complete and up to date'}
                            </p>
                        </div>
                    </div>
                    <button
                        className="btn btn-outline w-fit"
                        style={{
                            borderColor: alertCount > 0 ? '#f59e0b' : '#10b981',
                            color: alertCount > 0 ? '#b45309' : '#047857',
                            fontSize: '0.8rem', padding: '0.45rem 1rem',
                            background: 'rgba(255,255,255,0.6)',
                            backdropFilter: 'blur(4px)'
                        }}
                        onClick={() => navigate('/dashboard/alerts')}
                    >
                        View Alerts ({alertCount})
                    </button>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    {[
                        { label: 'Total Pickups', value: metrics.totalPickupCount, icon: Truck, sub: metrics.totalPickupCount === 0 ? 'No Pickups Yet' : `${metrics.pickups}T Today`, accentColor: '#3b82f6' },
                        { label: 'Processing', value: `${metrics.processing} T`, icon: Activity, sub: metrics.processing === 0 ? 'No Activity' : 'Estimated', accentColor: '#8b5cf6' },
                        { label: 'Dispatch', value: `${metrics.dispatch} T`, icon: Package, sub: metrics.dispatch === 0 ? 'No Dispatch' : 'Estimated', accentColor: '#f59e0b' },
                        { label: 'Documents', value: docsCount, icon: FileText, sub: metrics.pending > 0 ? `${metrics.pending} need attention` : 'All valid', accentColor: metrics.pending > 0 ? '#f59e0b' : '#10b981' },
                    ].map((card, i) => (
                        <div key={i} style={statCardStyle()}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)'; }}
                        >
                            <div style={{
                                position: 'absolute', top: 0, right: 0,
                                width: '60px', height: '60px',
                                background: `radial-gradient(circle at top right, ${card.accentColor}08, transparent)`,
                                borderBottomLeftRadius: '30px'
                            }} />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '8px',
                                    background: `${card.accentColor}10`, color: card.accentColor,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <card.icon size={15} />
                                </div>
                            </div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f2b3c', letterSpacing: '-0.02em' }}>
                                {card.value}
                            </div>
                            <span style={{
                                fontSize: '0.7rem', fontWeight: 500, padding: '0.2rem 0.6rem',
                                borderRadius: '6px', background: '#f8fafc', color: '#94a3b8',
                                alignSelf: 'flex-start'
                            }}>
                                {card.sub}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Row 2: Quick Actions */}
            {!isReadOnly && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-success" onClick={() => navigate('/dashboard/pickup')} style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}>
                        Record Pickup <ArrowRight size={16} />
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate('/dashboard/documents')} style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}>
                        Upload Document <ArrowRight size={16} />
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate('/dashboard/reports')} style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}>
                        Generate Report <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* Row 3: Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
                {/* Recent Pickups */}
                <div className="card">
                    <h4 className="card-title">Recent Pickups</h4>
                    {recentPickups.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8' }}>
                            <Truck size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                            <p style={{ margin: 0, fontSize: '0.85rem' }}>No pickups recorded yet.</p>
                            {!isReadOnly && (
                                <button className="btn btn-outline" onClick={() => navigate('/dashboard/pickup')} style={{ marginTop: '0.75rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                                    Record First Pickup
                                </button>
                            )}
                        </div>
                    ) : (
                        <table className="data-table" style={{ margin: 0 }}>
                            <thead>
                                <tr>
                                    <th>Material</th>
                                    <th>Quantity</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPickups.map((p, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 500 }}>{p.wasteType}</td>
                                        <td>{p.quantity}</td>
                                        <td style={{ color: '#94a3b8' }}>{p.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Getting Started / Summary */}
                <div className="card">
                    <h4 className="card-title" style={{ marginBottom: '0.75rem' }}>
                        {hasData ? 'Activity Summary' : 'Getting Started'}
                    </h4>
                    {!hasData ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { n: '1', title: 'Record a Pickup', desc: 'Log your first waste collection activity' },
                                { n: '2', title: 'Upload Documents', desc: 'Add permits and compliance certificates' },
                                { n: '3', title: 'Track & Report', desc: 'View data tracking and generate reports' },
                            ].map(step => (
                                <div key={step.n} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #0f2b3c, #1a4563)',
                                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                                    }}>{step.n}</div>
                                    <div>
                                        <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{step.title}</h5>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {[
                                { label: 'Total Pickups Recorded', value: getPickups().length },
                                { label: 'Documents Uploaded', value: docsCount },
                                { label: 'Active Alerts', value: alertCount, color: alertCount > 0 ? '#f59e0b' : '#10b981' },
                            ].map((row, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none'
                                }}>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{row.label}</span>
                                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: row.color || '#0f2b3c' }}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
