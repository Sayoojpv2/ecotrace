import { useState, useEffect } from 'react';
import {
    getPickups, getPickupRequests, getDocs,
    type PickupRecord, type PickupRequest, type DocRecord
} from '../lib/store';
import {
    Calendar, Filter, Truck, Package, FileText, CheckCircle,
    XCircle, Clock, Search
} from 'lucide-react';

type ActivityType = 'all' | 'pickup' | 'request_accepted' | 'request_completed' | 'request_rejected' | 'document';

interface TimelineEvent {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    date: Date;
    icon: typeof Truck;
    color: string;
    meta?: Record<string, string>;
}

export default function Timeline() {
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [filterType, setFilterType] = useState<ActivityType>('all');
    const [filterDate, setFilterDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        buildTimeline();
    }, []);

    const buildTimeline = () => {
        const allEvents: TimelineEvent[] = [];

        // Pickups recorded
        getPickups().forEach((p: PickupRecord) => {
            allEvents.push({
                id: `pickup-${p.id}`,
                type: 'pickup',
                title: `Pickup Recorded — ${p.wasteType}`,
                description: `${p.quantity} from ${p.sourceType}${p.sourceCompany && p.sourceCompany !== '-' ? ` (${p.sourceCompany})` : ''}`,
                date: new Date(p.date),
                icon: Truck,
                color: '#10b981',
                meta: {
                    'ID': p.id,
                    'Vehicle': p.vehicleNumber && p.vehicleNumber !== '-' ? p.vehicleNumber : '—',
                    'Driver': p.driverName && p.driverName !== '-' ? p.driverName : '—',
                    'Status': p.status
                }
            });
        });

        // Customer requests
        getPickupRequests().forEach((r: PickupRequest) => {
            // Request created
            allEvents.push({
                id: `req-created-${r.id}`,
                type: 'pickup',
                title: `New Request — ${r.customerName}`,
                description: `${r.wasteType} (${r.estimatedQuantity}) pickup request received`,
                date: new Date(r.createdAt),
                icon: Package,
                color: '#f59e0b',
                meta: {
                    'Request ID': r.id,
                    'Customer': r.customerName,
                    'Phone': r.contactNumber,
                    'Waste': `${r.wasteType} — ${r.estimatedQuantity}`
                }
            });

            // If accepted
            if (r.status === 'accepted' || r.status === 'in-progress' || r.status === 'completed') {
                allEvents.push({
                    id: `req-accepted-${r.id}`,
                    type: 'request_accepted',
                    title: `Request Accepted — ${r.customerName}`,
                    description: `Accepted pickup for ${r.wasteType} (${r.estimatedQuantity})`,
                    date: new Date(r.createdAt), // approximate
                    icon: CheckCircle,
                    color: '#3b82f6',
                    meta: { 'Request ID': r.id, 'Customer': r.customerName }
                });
            }

            // If completed
            if (r.status === 'completed' && r.completedAt) {
                allEvents.push({
                    id: `req-completed-${r.id}`,
                    type: 'request_completed',
                    title: `Pickup Completed — ${r.customerName}`,
                    description: `${r.wasteType} collected${r.segregationRating ? ` — Segregation: ${r.segregationRating}` : ''}`,
                    date: new Date(r.completedAt),
                    icon: CheckCircle,
                    color: '#10b981',
                    meta: {
                        'Request ID': r.id,
                        'Rating': r.segregationRating || '—',
                        'QR Verified': r.qrVerified ? 'Yes ✓' : 'No'
                    }
                });
            }

            // If rejected
            if (r.status === 'rejected') {
                allEvents.push({
                    id: `req-rejected-${r.id}`,
                    type: 'request_rejected',
                    title: `Request Rejected — ${r.customerName}`,
                    description: `Declined pickup for ${r.wasteType}`,
                    date: new Date(r.createdAt),
                    icon: XCircle,
                    color: '#ef4444',
                    meta: { 'Request ID': r.id, 'Customer': r.customerName }
                });
            }
        });

        // Documents uploaded
        getDocs().forEach((d: DocRecord) => {
            allEvents.push({
                id: `doc-${d.id}`,
                type: 'document',
                title: `Document Uploaded — ${d.name}`,
                description: `${d.category} • Expires: ${d.expiryDate}`,
                date: new Date(d.uploadDate),
                icon: FileText,
                color: '#8b5cf6',
                meta: {
                    'Doc ID': d.id,
                    'Category': d.category,
                    'Status': d.status,
                    'Expiry': d.expiryDate
                }
            });
        });

        // Sort newest first
        allEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
        setEvents(allEvents);
    };

    // Apply filters
    let filtered = events;
    if (filterType !== 'all') {
        filtered = filtered.filter(e => e.type === filterType);
    }
    if (filterDate) {
        filtered = filtered.filter(e => e.date.toISOString().slice(0, 10) === filterDate);
    }
    if (searchTerm) {
        const t = searchTerm.toLowerCase();
        filtered = filtered.filter(e =>
            e.title.toLowerCase().includes(t) ||
            e.description.toLowerCase().includes(t) ||
            Object.values(e.meta || {}).some(v => v.toLowerCase().includes(t))
        );
    }

    // Group by date
    const grouped: Record<string, TimelineEvent[]> = {};
    filtered.forEach(e => {
        const key = e.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(e);
    });

    const filterOptions: { key: ActivityType; label: string; color: string }[] = [
        { key: 'all', label: 'All Activities', color: '#64748b' },
        { key: 'pickup', label: 'Pickups & Requests', color: '#f59e0b' },
        { key: 'request_accepted', label: 'Accepted', color: '#3b82f6' },
        { key: 'request_completed', label: 'Completed', color: '#10b981' },
        { key: 'request_rejected', label: 'Rejected', color: '#ef4444' },
        { key: 'document', label: 'Documents', color: '#8b5cf6' },
    ];

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>
                        <Calendar size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        Activity Timeline
                    </h2>
                    <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
                        Track all your activities by date and type
                    </p>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {filtered.length} event{filtered.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Filters Bar */}
            <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={16} color="#64748b" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Filters:</span>
                    </div>

                    {/* Activity Type Filter */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {filterOptions.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilterType(f.key)}
                                style={{
                                    padding: '0.35rem 0.75rem', borderRadius: '20px', border: 'none',
                                    fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                                    background: filterType === f.key ? f.color : '#f1f5f9',
                                    color: filterType === f.key ? 'white' : '#64748b',
                                    transition: 'all 0.15s'
                                }}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {/* Date Filter */}
                        <input
                            type="date"
                            value={filterDate}
                            onChange={e => setFilterDate(e.target.value)}
                            style={{
                                padding: '0.4rem 0.6rem', border: '1px solid var(--color-border)',
                                borderRadius: '6px', fontSize: '0.8rem', background: 'white', color: '#334155'
                            }}
                        />
                        {filterDate && (
                            <button onClick={() => setFilterDate('')} style={{
                                padding: '0.3rem 0.5rem', background: '#fee2e2', border: 'none',
                                borderRadius: '4px', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600
                            }}>
                                Clear
                            </button>
                        )}

                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '0.4rem 0.6rem 0.4rem 2rem', border: '1px solid var(--color-border)',
                                    borderRadius: '6px', fontSize: '0.8rem', width: '160px', background: 'white'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            {Object.keys(grouped).length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <Clock size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                    <h3 style={{ color: '#64748b', margin: '0 0 0.5rem' }}>No Activities Found</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                        {filterType !== 'all' || filterDate || searchTerm
                            ? 'Try adjusting your filters to see more results'
                            : 'Activities will appear here as you record pickups, process requests, and upload documents'}
                    </p>
                </div>
            ) : (
                <div style={{ position: 'relative' }}>
                    {/* Vertical timeline line */}
                    <div style={{
                        position: 'absolute', left: '19px', top: '2rem', bottom: '1rem',
                        width: '2px', background: 'var(--color-border)'
                    }} />

                    {Object.entries(grouped).map(([dateLabel, dayEvents]) => (
                        <div key={dateLabel} style={{ marginBottom: '2rem' }}>
                            {/* Date Header */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                marginBottom: '1rem', position: 'relative', zIndex: 1
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: 'var(--color-primary)', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                                        {dateLabel}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                        {dayEvents.length} activit{dayEvents.length === 1 ? 'y' : 'ies'}
                                    </div>
                                </div>
                            </div>

                            {/* Events */}
                            <div style={{ paddingLeft: '56px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {dayEvents.map(event => (
                                    <div key={event.id} className="card" style={{
                                        padding: '1rem 1.25rem', borderLeft: `4px solid ${event.color}`,
                                        transition: 'box-shadow 0.15s'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '8px',
                                                background: `${event.color}15`, color: event.color,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                            }}>
                                                <event.icon size={16} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>
                                                        {event.title}
                                                    </div>
                                                    <span style={{
                                                        fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '0.5rem'
                                                    }}>
                                                        {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                                    {event.description}
                                                </div>
                                                {event.meta && Object.keys(event.meta).length > 0 && (
                                                    <div style={{
                                                        display: 'flex', gap: '1rem', marginTop: '0.5rem',
                                                        flexWrap: 'wrap'
                                                    }}>
                                                        {Object.entries(event.meta).map(([k, v]) => (
                                                            <span key={k} style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                                                <span style={{ fontWeight: 600, color: '#64748b' }}>{k}:</span> {v}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
