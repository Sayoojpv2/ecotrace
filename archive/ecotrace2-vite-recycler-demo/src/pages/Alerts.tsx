import { useState, useEffect } from 'react';
import { AlertOctagon, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateAlerts, type AlertRecord } from '../lib/store';

type Severity = 'Critical' | 'Warning' | 'Info';

export default function Alerts() {
    const [filter, setFilter] = useState<'All' | Severity>('All');
    const [alerts, setAlerts] = useState<AlertRecord[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        setAlerts(generateAlerts());
    }, []);

    const filteredAlerts = filter === 'All' ? alerts : alerts.filter(a => a.severity === filter);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h3 className="page-title" style={{ marginBottom: 0 }}>System Alerts & Warnings</h3>

                <div className="flex gap-2">
                    <button
                        className={"btn " + (filter === 'All' ? 'btn-primary' : 'btn-outline')}
                        onClick={() => setFilter('All')}
                    >
                        All ({alerts.length})
                    </button>
                    <button
                        className={"btn " + (filter === 'Critical' ? 'btn-primary' : 'btn-outline')}
                        onClick={() => setFilter('Critical')}
                        style={filter === 'Critical' ? { backgroundColor: 'var(--color-danger)' } : {}}
                    >
                        Critical ({alerts.filter(a => a.severity === 'Critical').length})
                    </button>
                    <button
                        className={"btn " + (filter === 'Warning' ? 'btn-primary' : 'btn-outline')}
                        onClick={() => setFilter('Warning')}
                        style={filter === 'Warning' ? { backgroundColor: 'var(--color-warning)', color: 'white', borderColor: 'var(--color-warning)' } : {}}
                    >
                        Warning ({alerts.filter(a => a.severity === 'Warning').length})
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {filteredAlerts.length === 0 ? (
                    <div className="card text-center text-muted py-8">
                        <Info size={32} className="mx-auto mb-2" />
                        <p>{filter === 'All' ? 'No active alerts. Your facility is in good standing!' : `No ${filter.toLowerCase()} alerts.`}</p>
                    </div>
                ) : (
                    filteredAlerts.map(alert => (
                        <div
                            key={alert.id}
                            className="card flex items-center justify-between"
                            style={{
                                borderLeft: "4px solid " + (
                                    alert.severity === 'Critical' ? 'var(--color-danger)' :
                                        alert.severity === 'Warning' ? 'var(--color-warning)' :
                                            'var(--color-primary-light)'
                                ),
                                cursor: 'pointer',
                                transition: 'transform 0.1s',
                            }}
                            onClick={() => navigate(alert.targetPath)}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(4px)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
                        >
                            <div className="flex items-start gap-4">
                                <div style={{
                                    padding: '0.75rem',
                                    borderRadius: '50%',
                                    backgroundColor: alert.severity === 'Critical' ? 'var(--color-danger-bg)' :
                                        alert.severity === 'Warning' ? 'var(--color-warning-bg)' : '#e2e8f0',
                                    color: alert.severity === 'Critical' ? 'var(--color-danger)' :
                                        alert.severity === 'Warning' ? 'var(--color-warning)' : 'var(--color-text-main)'
                                }}>
                                    {alert.severity === 'Critical' && <AlertOctagon size={24} />}
                                    {alert.severity === 'Warning' && <AlertTriangle size={24} />}
                                    {alert.severity === 'Info' && <Info size={24} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className={"badge " + (
                                                alert.severity === 'Critical' ? 'badge-danger' :
                                                    alert.severity === 'Warning' ? 'badge-warning' : ''
                                            )}
                                            style={alert.severity === 'Info' ? { background: '#e2e8f0' } : {}}
                                        >
                                            {alert.severity}
                                        </span>
                                        <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>{alert.type}</span>
                                    </div>
                                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-main)' }}>{alert.message}</h4>
                                    <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem', marginTop: '0.25rem' }}>{alert.date}</p>
                                </div>
                            </div>
                            <div>
                                <ArrowRight size={20} color="var(--color-text-muted)" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
