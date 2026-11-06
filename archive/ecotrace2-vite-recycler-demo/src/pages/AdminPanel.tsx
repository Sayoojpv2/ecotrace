import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getPickups, deletePickup, type PickupRecord,
    getDocs, deleteDoc, type DocRecord,
    getPickupRequests, deletePickupRequest, updatePickupRequest, type PickupRequest,
    getCustomerUsers, deleteCustomerUser,
    getPlatformUsers, deletePlatformUser,
} from '../lib/store';
import {
    Shield, Users, Package, FileText, Truck, Trash2, Edit3,
    LogOut, RefreshCw, Search, X, Check, Star
} from 'lucide-react';

type Section = 'overview' | 'users' | 'customers' | 'pickups' | 'requests' | 'documents';

export default function AdminPanel() {
    const navigate = useNavigate();
    const [section, setSection] = useState<Section>('overview');
    const [pickups, setPickups] = useState<PickupRecord[]>([]);
    const [docs, setDocs] = useState<DocRecord[]>([]);
    const [requests, setRequests] = useState<PickupRequest[]>([]);
    const [platformUsers, setPlatformUsers] = useState<Record<string, { name: string; password: string }>>({});
    const [customerUsers, setCustomerUsers] = useState<Record<string, { name: string; password: string; phone: string }>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [editingReq, setEditingReq] = useState<PickupRequest | null>(null);
    const [editStatus, setEditStatus] = useState('');
    const [editRating, setEditRating] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string; label: string } | null>(null);

    const reload = () => {
        setPickups(getPickups());
        setDocs(getDocs());
        setRequests(getPickupRequests());
        setPlatformUsers(getPlatformUsers());
        setCustomerUsers(getCustomerUsers());
    };

    useEffect(() => { reload(); }, []);

    const handleDelete = () => {
        if (!confirmDelete) return;
        const { type, id } = confirmDelete;
        if (type === 'pickup') deletePickup(id);
        else if (type === 'request') deletePickupRequest(id);
        else if (type === 'document') deleteDoc(id);
        else if (type === 'platformUser') deletePlatformUser(id);
        else if (type === 'customerUser') deleteCustomerUser(id);
        setConfirmDelete(null);
        reload();
    };

    const handleSaveEdit = () => {
        if (!editingReq) return;
        const updates: Partial<PickupRequest> = {};
        if (editStatus) updates.status = editStatus as PickupRequest['status'];
        if (editRating) updates.segregationRating = editRating as PickupRequest['segregationRating'];
        updatePickupRequest(editingReq.id, updates);
        setEditingReq(null);
        setEditStatus('');
        setEditRating('');
        reload();
    };

    const platformUserList = Object.entries(platformUsers).map(([phone, u]) => ({ phone, ...u }));
    const customerUserList = Object.entries(customerUsers).map(([key, u]) => ({ ...u, phone: key }));

    const stats = {
        users: platformUserList.length,
        customers: customerUserList.length,
        pickups: pickups.length,
        requests: requests.length,
        documents: docs.length,
        pendingReqs: requests.filter(r => r.status === 'pending').length,
        completedReqs: requests.filter(r => r.status === 'completed').length,
    };

    const filter = (items: any[], keys: string[]) => {
        if (!searchTerm) return items;
        const term = searchTerm.toLowerCase();
        return items.filter(item => keys.some(k => String(item[k] || '').toLowerCase().includes(term)));
    };

    const navItems: { key: Section; label: string; icon: any; count?: number }[] = [
        { key: 'overview', label: 'Overview', icon: Shield },
        { key: 'users', label: 'Platform Users', icon: Users, count: stats.users },
        { key: 'customers', label: 'Customers', icon: Users, count: stats.customers },
        { key: 'pickups', label: 'Pickup Records', icon: Truck, count: stats.pickups },
        { key: 'requests', label: 'Customer Requests', icon: Package, count: stats.requests },
        { key: 'documents', label: 'Documents', icon: FileText, count: stats.documents },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#0f172a', fontFamily: "'Inter', system-ui, sans-serif" }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px', background: '#1e293b', borderRight: '1px solid #334155',
                display: 'flex', flexDirection: 'column', flexShrink: 0
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Shield size={22} color="white" />
                        </div>
                        <div>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>Admin Panel</div>
                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>EcoTrace Control</div>
                        </div>
                    </div>
                </div>
                <nav style={{ flex: 1, padding: '0.75rem' }}>
                    {navItems.map(item => (
                        <button key={item.key} onClick={() => setSection(item.key)} style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.75rem 1rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
                            background: section === item.key ? 'rgba(239,68,68,0.15)' : 'transparent',
                            color: section === item.key ? '#f87171' : '#94a3b8',
                            fontWeight: section === item.key ? 600 : 400, fontSize: '0.9rem',
                            marginBottom: '0.25rem', transition: 'all 0.15s'
                        }}>
                            <item.icon size={18} />
                            <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                            {item.count !== undefined && (
                                <span style={{
                                    background: section === item.key ? '#ef4444' : '#334155',
                                    color: section === item.key ? 'white' : '#94a3b8',
                                    padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600
                                }}>{item.count}</span>
                            )}
                        </button>
                    ))}
                </nav>
                <div style={{ padding: '1rem', borderTop: '1px solid #334155' }}>
                    <button onClick={() => navigate('/')} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.6rem 1rem', background: '#334155', border: 'none', borderRadius: '8px',
                        color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem'
                    }}>
                        <LogOut size={16} /> Exit Admin
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflow: 'auto' }}>
                {/* Top Bar */}
                <div style={{
                    padding: '1rem 2rem', borderBottom: '1px solid #334155',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e293b'
                }}>
                    <h2 style={{ color: 'white', margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>
                        {navItems.find(n => n.key === section)?.label}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {section !== 'overview' && (
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input
                                    type="text" placeholder="Search..." value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={{
                                        padding: '0.5rem 0.75rem 0.5rem 2.25rem', background: '#0f172a', border: '1px solid #334155',
                                        borderRadius: '8px', color: 'white', fontSize: '0.85rem', width: '220px', outline: 'none'
                                    }}
                                />
                            </div>
                        )}
                        <button onClick={reload} style={{
                            padding: '0.5rem', background: '#334155', border: 'none', borderRadius: '8px',
                            color: '#94a3b8', cursor: 'pointer', display: 'flex'
                        }}>
                            <RefreshCw size={16} />
                        </button>
                    </div>
                </div>

                <div style={{ padding: '1.5rem 2rem' }}>
                    {/* ─── Overview ─── */}
                    {section === 'overview' && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                                {[
                                    { label: 'Platform Users', value: stats.users, color: '#3b82f6', icon: Users },
                                    { label: 'Customers', value: stats.customers, color: '#10b981', icon: Users },
                                    { label: 'Pickup Records', value: stats.pickups, color: '#f59e0b', icon: Truck },
                                    { label: 'Customer Requests', value: stats.requests, color: '#8b5cf6', icon: Package },
                                ].map((s, i) => (
                                    <div key={i} style={{
                                        background: '#1e293b', borderRadius: '12px', padding: '1.5rem',
                                        border: '1px solid #334155'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{s.label}</span>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '8px',
                                                background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <s.icon size={18} color={s.color} />
                                            </div>
                                        </div>
                                        <div style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>{s.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem', border: '1px solid #334155' }}>
                                    <h4 style={{ color: 'white', margin: '0 0 1rem' }}>Request Status Breakdown</h4>
                                    {['pending', 'accepted', 'in-progress', 'completed', 'rejected'].map(status => {
                                        const count = requests.filter(r => r.status === status).length;
                                        const colors: Record<string, string> = { pending: '#f59e0b', accepted: '#3b82f6', 'in-progress': '#8b5cf6', completed: '#10b981', rejected: '#ef4444' };
                                        return (
                                            <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #334155' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[status] }} />
                                                    <span style={{ color: '#cbd5e1', fontSize: '0.9rem', textTransform: 'capitalize' }}>{status}</span>
                                                </div>
                                                <span style={{ color: 'white', fontWeight: 600 }}>{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem', border: '1px solid #334155' }}>
                                    <h4 style={{ color: 'white', margin: '0 0 1rem' }}>Documents</h4>
                                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #334155' }}>
                                            <span>Total Documents</span><span style={{ color: 'white', fontWeight: 600 }}>{stats.documents}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #334155' }}>
                                            <span>Valid</span><span style={{ color: '#10b981', fontWeight: 600 }}>{docs.filter(d => d.status === 'Valid').length}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #334155' }}>
                                            <span>Expiring Soon</span><span style={{ color: '#f59e0b', fontWeight: 600 }}>{docs.filter(d => d.status === 'Expiring Soon').length}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                                            <span>Expired</span><span style={{ color: '#ef4444', fontWeight: 600 }}>{docs.filter(d => d.status === 'Expired').length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── Platform Users ─── */}
                    {section === 'users' && (
                        <Table
                            headers={['Name', 'Phone', 'Actions']}
                            rows={filter(platformUserList, ['name', 'phone']).map(u => [
                                <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{u.name}</span>,
                                <span style={{ color: '#94a3b8' }}>{u.phone}</span>,
                                <button onClick={() => setConfirmDelete({ type: 'platformUser', id: u.phone, label: u.name })} style={delBtnStyle}>
                                    <Trash2 size={14} /> Delete
                                </button>
                            ])}
                            emptyMsg="No platform users registered."
                        />
                    )}

                    {/* ─── Customers ─── */}
                    {section === 'customers' && (
                        <Table
                            headers={['Name', 'Phone', 'Requests', 'Completed', 'Avg Rating', 'Actions']}
                            rows={filter(customerUserList, ['name', 'phone']).map(c => {
                                const reqs = requests.filter(r => r.contactNumber === c.phone);
                                const completed = reqs.filter(r => r.status === 'completed');
                                const rated = completed.filter(r => r.segregationRating);
                                const avg = rated.length > 0
                                    ? rated.map(r => r.segregationRating === 'Good' ? 3 : r.segregationRating === 'Mixed' ? 2 : 1).reduce((a, b) => a + b, 0) / rated.length
                                    : null;
                                const avgLabel = avg ? (avg >= 2.5 ? 'Good' : avg >= 1.5 ? 'Mixed' : 'Poor') : null;
                                return [
                                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{c.name}</span>,
                                    <span style={{ color: '#94a3b8' }}>{c.phone}</span>,
                                    <Badge value={reqs.length} color="#3b82f6" />,
                                    <Badge value={completed.length} color="#10b981" />,
                                    avgLabel
                                        ? <span style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: avgLabel === 'Good' ? '#10b98120' : avgLabel === 'Poor' ? '#ef444420' : '#f59e0b20', color: avgLabel === 'Good' ? '#10b981' : avgLabel === 'Poor' ? '#ef4444' : '#f59e0b' }}>{avgLabel}</span>
                                        : <span style={{ color: '#475569' }}>—</span>,
                                    <button onClick={() => setConfirmDelete({ type: 'customerUser', id: c.phone, label: c.name })} style={delBtnStyle}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                ];
                            })}
                            emptyMsg="No customers registered."
                        />
                    )}

                    {/* ─── Pickup Records ─── */}
                    {section === 'pickups' && (
                        <Table
                            headers={['ID', 'Date', 'Waste Type', 'Source', 'Quantity', 'Vehicle', 'Status', 'Actions']}
                            rows={filter(pickups, ['id', 'wasteType', 'sourceType', 'vehicleNumber']).map(p => [
                                <span style={{ fontWeight: 600, color: '#60a5fa' }}>{p.id}</span>,
                                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{p.date}</span>,
                                <span style={{ color: '#e2e8f0' }}>{p.wasteType}</span>,
                                <span style={{ color: '#94a3b8' }}>{p.sourceType}</span>,
                                <span style={{ color: '#cbd5e1' }}>{p.quantity}{p.weight && p.weight !== '-' ? ` (${p.weight}kg)` : ''}</span>,
                                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{p.vehicleNumber && p.vehicleNumber !== '-' ? p.vehicleNumber : '—'}</span>,
                                <Badge value={p.status} color="#10b981" />,
                                <button onClick={() => setConfirmDelete({ type: 'pickup', id: p.id, label: `Pickup ${p.id}` })} style={delBtnStyle}>
                                    <Trash2 size={14} /> Delete
                                </button>
                            ])}
                            emptyMsg="No pickup records."
                        />
                    )}

                    {/* ─── Customer Requests ─── */}
                    {section === 'requests' && (
                        <Table
                            headers={['ID', 'Customer', 'Phone', 'Waste', 'Status', 'Rating', 'Date', 'Actions']}
                            rows={filter(requests, ['id', 'customerName', 'contactNumber', 'wasteType', 'status']).map(r => {
                                const statusColors: Record<string, string> = { pending: '#f59e0b', accepted: '#3b82f6', 'in-progress': '#8b5cf6', completed: '#10b981', rejected: '#ef4444' };
                                return [
                                    <span style={{ fontWeight: 600, color: '#60a5fa' }}>{r.id}</span>,
                                    <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{r.customerName}</span>,
                                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{r.contactNumber}</span>,
                                    <span style={{ color: '#cbd5e1' }}>{r.wasteType} ({r.estimatedQuantity})</span>,
                                    <Badge value={r.status} color={statusColors[r.status] || '#64748b'} />,
                                    r.segregationRating
                                        ? <span style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: r.segregationRating === 'Good' ? '#10b98120' : r.segregationRating === 'Poor' ? '#ef444420' : '#f59e0b20', color: r.segregationRating === 'Good' ? '#10b981' : r.segregationRating === 'Poor' ? '#ef4444' : '#f59e0b' }}>{r.segregationRating}</span>
                                        : <span style={{ color: '#475569' }}>—</span>,
                                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(r.createdAt).toLocaleDateString()}</span>,
                                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                                        <button onClick={() => { setEditingReq(r); setEditStatus(r.status); setEditRating(r.segregationRating || ''); }} style={{ ...editBtnStyle }}>
                                            <Edit3 size={13} />
                                        </button>
                                        <button onClick={() => setConfirmDelete({ type: 'request', id: r.id, label: `Request ${r.id}` })} style={delBtnStyle}>
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ];
                            })}
                            emptyMsg="No customer requests."
                        />
                    )}

                    {/* ─── Documents ─── */}
                    {section === 'documents' && (
                        <Table
                            headers={['ID', 'Name', 'Category', 'Upload Date', 'Expiry', 'Status', 'Actions']}
                            rows={filter(docs, ['id', 'name', 'category']).map(d => {
                                const statusColors: Record<string, string> = { Valid: '#10b981', 'Expiring Soon': '#f59e0b', Expired: '#ef4444' };
                                return [
                                    <span style={{ fontWeight: 600, color: '#60a5fa' }}>{d.id}</span>,
                                    <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{d.name}</span>,
                                    <span style={{ color: '#94a3b8' }}>{d.category}</span>,
                                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{d.uploadDate}</span>,
                                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{d.expiryDate}</span>,
                                    <Badge value={d.status} color={statusColors[d.status] || '#64748b'} />,
                                    <button onClick={() => setConfirmDelete({ type: 'document', id: d.id, label: d.name })} style={delBtnStyle}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                ];
                            })}
                            emptyMsg="No documents uploaded."
                        />
                    )}
                </div>
            </main>

            {/* ─── Delete Confirmation Modal ─── */}
            {confirmDelete && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#1e293b', borderRadius: '14px', padding: '2rem', width: '400px', border: '1px solid #334155' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ef444420', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <Trash2 size={24} color="#ef4444" />
                            </div>
                            <h3 style={{ color: 'white', margin: '0 0 0.5rem' }}>Confirm Delete</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                                Are you sure you want to delete <strong style={{ color: '#f87171' }}>{confirmDelete.label}</strong>? This action cannot be undone.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: '0.75rem', background: '#334155', border: 'none', borderRadius: '8px', color: '#cbd5e1', cursor: 'pointer', fontWeight: 600 }}>
                                Cancel
                            </button>
                            <button onClick={handleDelete} style={{ flex: 1, padding: '0.75rem', background: '#ef4444', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Edit Request Modal ─── */}
            {editingReq && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#1e293b', borderRadius: '14px', padding: '2rem', width: '450px', border: '1px solid #334155' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ color: 'white', margin: 0 }}>Edit Request {editingReq.id}</h3>
                            <button onClick={() => setEditingReq(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={20} color="#64748b" />
                            </button>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '0.35rem' }}>Customer</label>
                            <div style={{ color: '#e2e8f0', fontWeight: 500 }}>{editingReq.customerName} — {editingReq.contactNumber}</div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '0.35rem' }}>Status</label>
                            <select value={editStatus} onChange={e => setEditStatus(e.target.value)} style={{
                                width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155',
                                borderRadius: '8px', color: 'white', fontSize: '0.9rem'
                            }}>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '0.35rem' }}>Segregation Rating</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {['Good', 'Mixed', 'Poor'].map(r => (
                                    <button key={r} onClick={() => setEditRating(r)} style={{
                                        flex: 1, padding: '0.6rem', border: `2px solid ${editRating === r ? (r === 'Good' ? '#10b981' : r === 'Poor' ? '#ef4444' : '#f59e0b') : '#334155'}`,
                                        background: editRating === r ? (r === 'Good' ? '#10b98120' : r === 'Poor' ? '#ef444420' : '#f59e0b20') : '#0f172a',
                                        color: editRating === r ? (r === 'Good' ? '#10b981' : r === 'Poor' ? '#ef4444' : '#f59e0b') : '#64748b',
                                        borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
                                    }}>
                                        <Star size={14} fill={editRating === r ? 'currentColor' : 'none'} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => setEditingReq(null)} style={{ flex: 1, padding: '0.75rem', background: '#334155', border: 'none', borderRadius: '8px', color: '#cbd5e1', cursor: 'pointer', fontWeight: 600 }}>
                                Cancel
                            </button>
                            <button onClick={handleSaveEdit} style={{ flex: 1, padding: '0.75rem', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                                <Check size={16} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Sub-components ───
function Table({ headers, rows, emptyMsg }: { headers: string[]; rows: React.ReactNode[][]; emptyMsg: string }) {
    return (
        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        {headers.map((h, i) => (
                            <th key={i} style={{
                                padding: '0.85rem 1rem', textAlign: 'left', color: '#64748b',
                                fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                                letterSpacing: '0.5px', borderBottom: '1px solid #334155', background: '#1a2332'
                            }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr><td colSpan={headers.length} style={{ padding: '3rem', textAlign: 'center', color: '#475569' }}>{emptyMsg}</td></tr>
                    ) : rows.map((row, ri) => (
                        <tr key={ri} style={{ borderBottom: '1px solid #1e293b' }}>
                            {row.map((cell, ci) => (
                                <td key={ci} style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Badge({ value, color }: { value: string | number; color: string }) {
    return (
        <span style={{
            padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
            background: `${color}20`, color, textTransform: 'capitalize'
        }}>{value}</span>
    );
}

const delBtnStyle: React.CSSProperties = {
    padding: '0.35rem 0.6rem', background: '#ef444415', border: '1px solid #ef444430',
    borderRadius: '6px', color: '#f87171', cursor: 'pointer', fontSize: '0.75rem',
    display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500
};

const editBtnStyle: React.CSSProperties = {
    padding: '0.35rem 0.5rem', background: '#3b82f615', border: '1px solid #3b82f630',
    borderRadius: '6px', color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center'
};
