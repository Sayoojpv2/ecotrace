import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
    CheckCircle, Trash2, UserPlus, Check, X, Users,
    MapPin, Navigation, QrCode, Star, Phone, Calendar, Package
} from 'lucide-react';
import {
    getPickups, savePickup, deletePickup, type PickupRecord,
    getPickupRequests, updatePickupRequest, type PickupRequest,
    getCustomerUsers
} from '../lib/store';

type TabType = 'record' | 'requests' | 'customers';

export default function Pickup() {
    const { userRole } = useAuth();
    const isReadOnly = userRole === 'partner';
    const [activeTab, setActiveTab] = useState<TabType>('record');

    // Record pickup state
    const [pickups, setPickups] = useState<PickupRecord[]>([]);
    const [wasteType, setWasteType] = useState('Mixed E-Waste');
    const [sourceType, setSourceType] = useState('Aggregator');
    const [quantityClass, setQuantityClass] = useState('Medium (5T)');
    const [weight, setWeight] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [driverName, setDriverName] = useState('');
    const [sourceCompany, setSourceCompany] = useState('');
    const [notes, setNotes] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Pickup requests state
    const [requests, setRequests] = useState<PickupRequest[]>([]);
    const [viewingRequest, setViewingRequest] = useState<PickupRequest | null>(null);
    const [qrInput, setQrInput] = useState('');
    const [qrError, setQrError] = useState('');
    const [qrVerifiedReq, setQrVerifiedReq] = useState<PickupRequest | null>(null);
    const [selectedRating, setSelectedRating] = useState<'Good' | 'Mixed' | 'Poor' | ''>('');

    useEffect(() => {
        setPickups(getPickups());
        setRequests(getPickupRequests());
    }, []);

    const reload = () => {
        setPickups(getPickups());
        setRequests(getPickupRequests());
    };

    // ─── Record Pickup ───
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isReadOnly) return;
        const newRecord: PickupRecord = {
            id: 'PKG-' + Math.floor(100 + Math.random() * 900),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            wasteType, sourceType, quantity: quantityClass,
            weight: weight || '-',
            vehicleNumber: vehicleNumber || '-',
            driverName: driverName || '-',
            sourceCompany: sourceCompany || '-',
            notes: notes || '',
            status: 'Recorded'
        };
        savePickup(newRecord);
        reload();
        setSuccessMsg(`Pickup ${newRecord.id} recorded!`);
        setWeight(''); setVehicleNumber(''); setDriverName(''); setSourceCompany(''); setNotes('');
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleDelete = (id: string) => { deletePickup(id); reload(); };

    // ─── Add Customer ───
    const handleAddCustomer = () => {
        window.open(`${window.location.origin}/customer`, '_blank');
    };

    // ─── Request Management ───
    const pendingRequests = requests.filter(r => r.status === 'pending');
    const activeRequests = requests.filter(r => r.status === 'accepted' || r.status === 'in-progress');
    const completedRequests = requests.filter(r => r.status === 'completed');

    const handleAccept = (id: string) => {
        updatePickupRequest(id, { status: 'accepted' });
        reload();
        setSuccessMsg('Request accepted!');
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    // Get average segregation rating for a customer from completed pickups
    const getCustomerAvgRating = (contactNumber: string) => {
        const completed = requests.filter(r => r.contactNumber === contactNumber && r.status === 'completed' && r.segregationRating);
        if (completed.length === 0) return null;
        const scores = completed.map(r => r.segregationRating === 'Good' ? 3 : r.segregationRating === 'Mixed' ? 2 : 1);
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        const label = avg >= 2.5 ? 'Good' : avg >= 1.5 ? 'Mixed' : 'Poor';
        return { label, count: completed.length, avg: avg.toFixed(1) };
    };

    const handleReject = (id: string) => {
        updatePickupRequest(id, { status: 'rejected' });
        reload();
    };

    const handleArrival = (id: string) => {
        updatePickupRequest(id, {
            status: 'in-progress',
            arrivalConfirmed: true,
            arrivalTimestamp: new Date().toISOString()
        });
        reload();
        setViewingRequest(getPickupRequests().find(r => r.id === id) || null);
    };

    const handleVerifyQR = (req: PickupRequest) => {
        setQrError('');
        try {
            const data = JSON.parse(req.qrData);
            if (qrInput.trim() === req.id || qrInput.trim() === data.requestId) {
                // QR verified — move to rating step
                setQrVerifiedReq(req);
                setSelectedRating('');
            } else {
                setQrError('ID does not match. Please enter the correct Request ID shown on the customer QR.');
            }
        } catch {
            setQrError('Verification failed.');
        }
    };

    const handleCompleteWithRating = () => {
        if (!qrVerifiedReq || !selectedRating) return;
        updatePickupRequest(qrVerifiedReq.id, {
            qrVerified: true,
            status: 'completed',
            completedAt: new Date().toISOString(),
            segregationRating: selectedRating
        });
        reload();
        setSuccessMsg(`Pickup ${qrVerifiedReq.id} verified and completed with ${selectedRating} segregation! ✓`);
        setViewingRequest(null);
        setQrVerifiedReq(null);
        setQrInput('');
        setSelectedRating('');
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const openMap = (address: string) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    };

    const tabStyle = (tab: TabType) => ({
        padding: '0.75rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
        fontWeight: 600 as const, fontSize: '0.95rem',
        color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
        borderBottom: activeTab === tab ? '3px solid var(--color-primary)' : '3px solid transparent',
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h3 className="page-title" style={{ marginBottom: 0 }}>Waste Receipt & Pickup</h3>
                <button className="btn btn-primary" style={{ gap: '0.5rem' }} onClick={handleAddCustomer}>
                    <UserPlus size={18} /> Add New Customer
                </button>
            </div>

            {successMsg && (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
                    <CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    {successMsg}
                </div>
            )}

            {/* Tab Navigation */}
            <div style={{ borderBottom: '2px solid var(--color-border)', display: 'flex', gap: '0.5rem' }}>
                <button style={tabStyle('record')} onClick={() => setActiveTab('record')}>
                    <Package size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Record Pickup
                </button>
                <button style={tabStyle('requests')} onClick={() => setActiveTab('requests')}>
                    <QrCode size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Customer Requests
                    {pendingRequests.length > 0 && (
                        <span className="badge badge-danger" style={{ marginLeft: '0.5rem', padding: '0.1rem 0.5rem', fontSize: '0.75rem' }}>{pendingRequests.length}</span>
                    )}
                </button>
                <button style={tabStyle('customers')} onClick={() => setActiveTab('customers')}>
                    <Users size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Customers
                </button>
            </div>

            {activeTab === 'record' && (
                <div className="grid grid-cols-2">
                    {/* Record Form */}
                    <div>
                        <div className="card">
                            <h4 className="card-title">New Pickup Entry</h4>
                            {isReadOnly ? (
                                <div className="text-center py-8 text-muted"><p>Read-only mode.</p></div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="form-group mb-0">
                                            <label className="form-label">Waste Type *</label>
                                            <select className="form-select" value={wasteType} onChange={e => setWasteType(e.target.value)}>
                                                <option>Mixed E-Waste</option>
                                                <option>Processed Copper</option>
                                                <option>Plastic Casings</option>
                                                <option>Battery Scrap</option>
                                                <option>Ferrous Metal</option>
                                                <option>Non-Ferrous Metal</option>
                                                <option>PCB Boards</option>
                                                <option>Glass/CRT</option>
                                                <option>Rubber/Tyres</option>
                                                <option>Paper/Cardboard</option>
                                                <option>Mixed Recyclables</option>
                                                <option>Hazardous Waste</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group mb-0">
                                            <label className="form-label">Source Type *</label>
                                            <select className="form-select" value={sourceType} onChange={e => setSourceType(e.target.value)}>
                                                <option>Aggregator</option>
                                                <option>Corporate IT</option>
                                                <option>Municipal</option>
                                                <option>Individual</option>
                                                <option>Manufacturer</option>
                                                <option>Retail / Commercial</option>
                                                <option>Institutional</option>
                                                <option>Import</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="form-group mb-0">
                                            <label className="form-label">Quantity Class *</label>
                                            <select className="form-select" value={quantityClass} onChange={e => setQuantityClass(e.target.value)}>
                                                <option>Micro (&lt;500 kg)</option>
                                                <option>Small (500 kg - 2T)</option>
                                                <option>Medium (2T - 5T)</option>
                                                <option>Large (5T - 12T)</option>
                                                <option>Bulk (12T - 20T)</option>
                                                <option>Container (20T+)</option>
                                            </select>
                                        </div>
                                        <div className="form-group mb-0">
                                            <label className="form-label">Actual Weight (kg)</label>
                                            <input type="text" className="form-input" placeholder="e.g. 4500" value={weight} onChange={e => setWeight(e.target.value)} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="form-group mb-0">
                                            <label className="form-label">Vehicle Number</label>
                                            <input type="text" className="form-input" placeholder="e.g. KA-01-AB-1234" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} />
                                        </div>
                                        <div className="form-group mb-0">
                                            <label className="form-label">Driver Name</label>
                                            <input type="text" className="form-input" placeholder="Driver name" value={driverName} onChange={e => setDriverName(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-group mb-0">
                                        <label className="form-label">Source / Supplier Company</label>
                                        <input type="text" className="form-input" placeholder="Company or individual who supplied the waste" value={sourceCompany} onChange={e => setSourceCompany(e.target.value)} />
                                    </div>

                                    <div className="form-group mb-0">
                                        <label className="form-label">Notes / Remarks</label>
                                        <textarea
                                            className="form-input"
                                            placeholder="Any additional details (condition, special handling, etc.)"
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            rows={2}
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary mt-2 w-full">Record Pickup Activity</button>
                                </form>
                            )}
                        </div>
                    </div>
                    {/* Pickup History */}
                    <div>
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                                <h4 className="card-title" style={{ margin: 0 }}>Recent Pickups ({pickups.length})</h4>
                            </div>
                            <table className="data-table">
                                <thead><tr><th>ID / Date</th><th>Material & Qty</th><th>Vehicle / Driver</th><th>Status</th><th></th></tr></thead>
                                <tbody>
                                    {pickups.length === 0 ? (
                                        <tr><td colSpan={5} className="text-center text-muted" style={{ padding: '2rem' }}>No pickups recorded yet.</td></tr>
                                    ) : pickups.map(p => (
                                        <tr key={p.id}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{p.id}</div>
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{p.date}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{p.wasteType}</div>
                                                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                    {p.quantity}{p.weight && p.weight !== '-' ? ` • ${p.weight} kg` : ''}
                                                </div>
                                                {p.sourceCompany && p.sourceCompany !== '-' && (
                                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>From: {p.sourceCompany}</div>
                                                )}
                                            </td>
                                            <td>
                                                {p.vehicleNumber && p.vehicleNumber !== '-' ? (
                                                    <div>
                                                        <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{p.vehicleNumber}</div>
                                                        {p.driverName && p.driverName !== '-' && (
                                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{p.driverName}</div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>—</span>
                                                )}
                                            </td>
                                            <td><span className="badge badge-success"><CheckCircle size={14} /> {p.status}</span></td>
                                            <td>{!isReadOnly && <button className="btn btn-outline" style={{ padding: '0.3rem', borderColor: 'transparent', color: 'var(--color-danger)' }} onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="flex flex-col gap-6">
                    {/* Pending Requests */}
                    <div>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
                            Pending Requests {pendingRequests.length > 0 && <span className="badge badge-warning" style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}>{pendingRequests.length} new</span>}
                        </h4>
                        {pendingRequests.length === 0 ? (
                            <div className="card text-center text-muted" style={{ padding: '2rem' }}>
                                <Package size={36} style={{ opacity: 0.3, margin: '0 auto 0.5rem', display: 'block' }} />
                                No pending pickup requests. Share your pickup link with customers.
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
                                {pendingRequests.map(req => (
                                    <div key={req.id} className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-warning)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                            <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{req.id}</div>
                                            <span className="badge badge-warning">Pending</span>
                                        </div>
                                        <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
                                            <div><strong>{req.customerName}</strong></div>
                                            <div className="text-muted"><Phone size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />{req.contactNumber}</div>
                                            <div className="text-muted"><MapPin size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />{req.address}</div>
                                            <div><Calendar size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />Pickup: {req.preferredDate}</div>
                                            <div><Package size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />{req.wasteType} — {req.estimatedQuantity}</div>
                                        </div>
                                        {req.photoBase64 && (
                                            <img src={req.photoBase64} alt="Waste" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.75rem' }} />
                                        )}
                                        {/* Customer History / Avg Rating */}
                                        {(() => {
                                            const avgInfo = getCustomerAvgRating(req.contactNumber);
                                            if (!avgInfo) return (
                                                <div style={{ padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
                                                    <Star size={12} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                                                    New customer — no previous pickup history
                                                </div>
                                            );
                                            const badgeClass = avgInfo.label === 'Good' ? 'badge-success' : avgInfo.label === 'Poor' ? 'badge-danger' : 'badge-warning';
                                            return (
                                                <div style={{ padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span>
                                                        <Star size={12} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle', color: '#eab308' }} />
                                                        Avg Rating: <span className={`badge ${badgeClass}`} style={{ fontSize: '0.7rem' }}>{avgInfo.label} ({avgInfo.avg})</span>
                                                    </span>
                                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{avgInfo.count} past pickup{avgInfo.count > 1 ? 's' : ''}</span>
                                                </div>
                                            );
                                        })()}
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', background: '#10b981' }} onClick={() => handleAccept(req.id)}>
                                                <Check size={16} /> Accept
                                            </button>
                                            <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => handleReject(req.id)}>
                                                <X size={16} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Active Pickups (Accepted/In-Progress) */}
                    {activeRequests.length > 0 && (
                        <div>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Active Pickups</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
                                {activeRequests.map(req => (
                                    <div key={req.id} className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-success)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{req.id}</div>
                                            <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>{req.status}</span>
                                        </div>
                                        <div style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                                            <strong>{req.customerName}</strong> — {req.wasteType} ({req.estimatedQuantity})
                                            <div className="text-muted"><MapPin size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />{req.address}</div>
                                            {req.segregationRating && <div>Segregation: <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{req.segregationRating}</span></div>}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => openMap(req.address)}>
                                                <Navigation size={14} /> Navigate
                                            </button>
                                            {!req.arrivalConfirmed ? (
                                                <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleArrival(req.id)}>
                                                    <MapPin size={14} /> Arrived at Location
                                                </button>
                                            ) : (
                                                <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#7c3aed' }} onClick={() => { setViewingRequest(req); setQrInput(''); setQrError(''); }}>
                                                    <QrCode size={14} /> Verify QR
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed Pickups */}
                    {completedRequests.length > 0 && (
                        <div>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Completed ({completedRequests.length})</h4>
                            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                <table className="data-table">
                                    <thead><tr><th>Request</th><th>Customer</th><th>Waste</th><th>Segregation</th><th>Completed</th></tr></thead>
                                    <tbody>
                                        {completedRequests.map(req => (
                                            <tr key={req.id}>
                                                <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{req.id}</td>
                                                <td>{req.customerName}</td>
                                                <td>{req.wasteType} ({req.estimatedQuantity})</td>
                                                <td><span className={`badge ${req.segregationRating === 'Good' ? 'badge-success' : req.segregationRating === 'Poor' ? 'badge-danger' : 'badge-warning'}`}>{req.segregationRating || 'N/A'}</span></td>
                                                <td className="text-muted" style={{ fontSize: '0.85rem' }}>{req.completedAt ? new Date(req.completedAt).toLocaleDateString() : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'customers' && (() => {
                const usersObj = getCustomerUsers();
                const customers = Object.values(usersObj) as { name: string; phone: string; password: string }[];
                // Build stats for each customer from requests
                const customerStats = customers.map(c => {
                    const custRequests = requests.filter(r => r.contactNumber === c.phone);
                    const completed = custRequests.filter(r => r.status === 'completed');
                    const rated = completed.filter(r => r.segregationRating);
                    const avgScore = rated.length > 0
                        ? rated.map(r => r.segregationRating === 'Good' ? 3 : r.segregationRating === 'Mixed' ? 2 : 1).reduce((a, b) => a + b, 0) / rated.length
                        : null;
                    const avgLabel = avgScore ? (avgScore >= 2.5 ? 'Good' : avgScore >= 1.5 ? 'Mixed' : 'Poor') : null;
                    const lastReq = custRequests.length > 0 ? custRequests[0] : null;
                    return { ...c, total: custRequests.length, completed: completed.length, avgLabel, avgScore, lastReq };
                });

                return (
                    <div>
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 className="card-title" style={{ margin: 0 }}>Registered Customers ({customers.length})</h4>
                                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }} onClick={handleAddCustomer}>
                                    <UserPlus size={16} /> Add Customer
                                </button>
                            </div>
                            {customers.length === 0 ? (
                                <div className="text-center text-muted" style={{ padding: '3rem' }}>
                                    <Users size={40} style={{ opacity: 0.25, marginBottom: '0.5rem' }} />
                                    <p>No customers registered yet. Click "Add Customer" to get started.</p>
                                </div>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Customer</th>
                                            <th>Phone</th>
                                            <th>Requests</th>
                                            <th>Completed</th>
                                            <th>Avg Rating</th>
                                            <th>Last Activity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerStats.map((c, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{
                                                            width: '36px', height: '36px', borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                                                        }}>
                                                            {c.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-muted)' }}>
                                                        <Phone size={13} /> {c.phone}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge badge-info" style={{ fontSize: '0.8rem' }}>{c.total}</span>
                                                </td>
                                                <td>
                                                    <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>{c.completed}</span>
                                                </td>
                                                <td>
                                                    {c.avgLabel ? (
                                                        <span className={`badge ${c.avgLabel === 'Good' ? 'badge-success' : c.avgLabel === 'Poor' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.8rem' }}>
                                                            <Star size={11} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} />
                                                            {c.avgLabel} ({c.avgScore!.toFixed(1)})
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>—</span>
                                                    )}
                                                </td>
                                                <td className="text-muted" style={{ fontSize: '0.85rem' }}>
                                                    {c.lastReq ? new Date(c.lastReq.createdAt).toLocaleDateString() : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* QR Verification Modal — Step 1: Verify QR */}
            {viewingRequest && !qrVerifiedReq && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="card" style={{ width: '450px', maxWidth: '95%', position: 'relative', borderRadius: '12px' }}>
                        <button onClick={() => { setViewingRequest(null); setQrInput(''); }} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} color="#94a3b8" />
                        </button>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <QrCode size={36} color="var(--color-primary)" style={{ marginBottom: '0.5rem' }} />
                            <h3 style={{ color: 'var(--color-primary)', margin: 0 }}>Step 1: QR Verification</h3>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Enter the Request ID from the customer's QR code</p>
                        </div>

                        <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                            <div><strong>Customer:</strong> {viewingRequest.customerName}</div>
                            <div><strong>Waste:</strong> {viewingRequest.wasteType} — {viewingRequest.estimatedQuantity}</div>
                            <div><strong>Address:</strong> {viewingRequest.address}</div>
                            {viewingRequest.arrivalTimestamp && (
                                <div className="text-success" style={{ marginTop: '0.5rem' }}>
                                    <CheckCircle size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                    Arrived at {new Date(viewingRequest.arrivalTimestamp).toLocaleTimeString()}
                                </div>
                            )}
                        </div>

                        <div className="form-group mb-0">
                            <label className="form-label">Request ID (from QR code)</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. REQ-A1B2C3"
                                value={qrInput}
                                onChange={e => { setQrInput(e.target.value); setQrError(''); }}
                                style={{ fontSize: '1.1rem', fontWeight: 600, textAlign: 'center', letterSpacing: '1px' }}
                            />
                        </div>

                        {qrError && (
                            <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{qrError}</div>
                        )}

                        <button
                            className="btn btn-primary w-full"
                            style={{ marginTop: '1rem', background: '#7c3aed', padding: '0.85rem' }}
                            onClick={() => handleVerifyQR(viewingRequest)}
                            disabled={!qrInput.trim()}
                        >
                            <CheckCircle size={18} /> Verify QR Code
                        </button>
                    </div>
                </div>
            )}

            {/* QR Verification Modal — Step 2: Segregation Rating */}
            {qrVerifiedReq && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="card" style={{ width: '450px', maxWidth: '95%', position: 'relative', borderRadius: '12px' }}>
                        <button onClick={() => { setQrVerifiedReq(null); setViewingRequest(null); setQrInput(''); }} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} color="#94a3b8" />
                        </button>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <CheckCircle size={36} color="#10b981" style={{ marginBottom: '0.5rem' }} />
                            <h3 style={{ color: '#10b981', margin: 0 }}>QR Verified ✓</h3>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Step 2: Rate the waste segregation quality</p>
                        </div>

                        <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={16} />
                            <span><strong>{qrVerifiedReq.id}</strong> — {qrVerifiedReq.customerName} — {qrVerifiedReq.wasteType}</span>
                        </div>

                        <label style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', display: 'block', color: 'var(--color-primary)' }}>How well was the waste segregated?</label>
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            {(['Good', 'Mixed', 'Poor'] as const).map(r => (
                                <button
                                    key={r}
                                    className="btn"
                                    onClick={() => setSelectedRating(r)}
                                    style={{
                                        flex: 1, padding: '1rem 0.5rem', fontSize: '0.9rem', fontWeight: 600,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                                        border: `2px solid ${selectedRating === r ? (r === 'Good' ? '#10b981' : r === 'Poor' ? '#ef4444' : '#f59e0b') : '#e2e8f0'}`,
                                        background: selectedRating === r ? (r === 'Good' ? '#f0fdf4' : r === 'Poor' ? '#fef2f2' : '#fffbeb') : 'white',
                                        color: selectedRating === r ? (r === 'Good' ? '#065f46' : r === 'Poor' ? '#991b1b' : '#92400e') : '#64748b',
                                        borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s'
                                    }}
                                >
                                    <Star size={20} fill={selectedRating === r ? 'currentColor' : 'none'} />
                                    {r}
                                </button>
                            ))}
                        </div>

                        <button
                            className="btn btn-primary w-full"
                            style={{ padding: '0.85rem', background: selectedRating ? '#10b981' : '#94a3b8' }}
                            onClick={handleCompleteWithRating}
                            disabled={!selectedRating}
                        >
                            <CheckCircle size={18} /> Complete Pickup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
