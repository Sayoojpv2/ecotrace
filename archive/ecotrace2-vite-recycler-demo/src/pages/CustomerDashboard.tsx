import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Leaf, LogOut, Plus, X, CheckCircle, Package, QrCode, Camera, UploadCloud
} from 'lucide-react';
import {
    getCustomerSession, clearCustomerSession,
    getPickupRequests, savePickupRequest,
    type PickupRequest
} from '../lib/store';

const wasteTypes = ['Plastic', 'E-Waste', 'Metal Scrap', 'Paper/Cardboard', 'Glass', 'Mixed Waste', 'Hazardous', 'Other'];

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const session = getCustomerSession();
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requests, setRequests] = useState<PickupRequest[]>([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [showQR, setShowQR] = useState<PickupRequest | null>(null);

    // Form state
    const [wasteType, setWasteType] = useState(wasteTypes[0]);
    const [quantity, setQuantity] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!session) {
            navigate('/customer');
            return;
        }
        loadRequests();
    }, []);

    const loadRequests = () => {
        const all = getPickupRequests().filter(r => r.contactNumber === session?.phone);
        setRequests(all);
    };

    const handleLogout = () => {
        clearCustomerSession();
        navigate('/customer');
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert('Photo must be under 2MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => setPhoto(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!session || !quantity || !photo) return;

        const id = 'REQ-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const qrData = JSON.stringify({ requestId: id, customer: session.name, wasteType, timestamp: new Date().toISOString() });

        const req: PickupRequest = {
            id,
            customerName: session.name,
            contactNumber: session.phone,
            address: 'Location from photo',
            wasteType,
            estimatedQuantity: quantity,
            photoBase64: photo,
            preferredDate: new Date().toLocaleDateString(),
            status: 'pending',
            qrData,
            createdAt: new Date().toISOString()
        };

        savePickupRequest(req);
        loadRequests();
        setShowRequestForm(false);
        setQuantity('');
        setPhoto(null);
        setSuccessMsg('Pickup request submitted! Your QR code is ready.');
        setShowQR(req);
        setTimeout(() => setSuccessMsg(''), 5000);
    };

    const statusColor = (s: string) => {
        if (s === 'pending') return 'badge-warning';
        if (s === 'accepted' || s === 'in-progress') return 'badge-success';
        if (s === 'completed') return 'badge-success';
        return 'badge-danger';
    };

    const qrUrl = (data: string) =>
        `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data)}`;

    if (!session) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ecfdf5 0%, #f0fdf4 30%, #f0f4f8 100%)' }}>
            {/* Top Bar */}
            <header style={{
                background: 'rgba(255, 255, 255, 0.88)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
                padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Leaf size={14} color="white" />
                    </div>
                    <span style={{ fontWeight: 800, color: '#0f2b3c', fontSize: '1.05rem' }}>EcoTrace</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.78rem', marginLeft: '0.3rem' }}>Customer Portal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>{session.name}</span>
                    <button onClick={handleLogout} style={{
                        background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px',
                        cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center',
                        gap: '0.3rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem',
                        transition: 'all 0.2s'
                    }}>
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </header>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
                {/* Welcome + Request Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ margin: 0, color: '#0f2b3c', fontWeight: 700 }}>Welcome, {session.name}</h2>
                        <p style={{ margin: '0.2rem 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>Manage your waste pickup requests</p>
                    </div>
                    <button
                        className="btn"
                        style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white', padding: '0.7rem 1.5rem', fontSize: '0.9rem',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            borderRadius: '10px', fontWeight: 600
                        }}
                        onClick={() => setShowRequestForm(true)}
                    >
                        <Plus size={18} /> Request Pickup
                    </button>
                </div>

                {successMsg && (
                    <div style={{
                        padding: '0.9rem 1rem', background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                        color: '#047857', borderRadius: '12px', marginBottom: '1.5rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        border: '1px solid #a7f3d0', fontSize: '0.85rem', fontWeight: 500
                    }}>
                        <CheckCircle size={18} /> {successMsg}
                    </div>
                )}

                {/* Request History */}
                <h3 style={{ color: '#134e4a', marginBottom: '1rem' }}>Your Pickup Requests</h3>
                {requests.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
                        <p style={{ fontWeight: 500 }}>No pickup requests yet</p>
                        <p style={{ fontSize: '0.875rem' }}>Click "Request Pickup" to schedule your first waste collection</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {requests.map(req => (
                            <div key={req.id} className="card" style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#134e4a' }}>{req.id}</div>
                                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>Requested {new Date(req.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <span className={`badge ${statusColor(req.status)}`} style={{ textTransform: 'capitalize' }}>{req.status}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    <div><strong>Waste:</strong> {req.wasteType}</div>
                                    <div><strong>Quantity:</strong> {req.estimatedQuantity}</div>
                                    <div><strong>Order Date:</strong> {req.preferredDate}</div>
                                    {req.photoBase64 && <div><strong>📍 Location:</strong> From uploaded photo</div>}
                                </div>
                                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setShowQR(req)}>
                                        <QrCode size={14} /> View QR Code
                                    </button>
                                    {req.status === 'completed' && (
                                        <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <CheckCircle size={14} /> Pickup Complete
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Request Pickup Popup */}
            {showRequestForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="card" style={{ width: '500px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', borderRadius: '12px' }}>
                        <button onClick={() => setShowRequestForm(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} color="#94a3b8" />
                        </button>
                        <h3 style={{ color: '#134e4a', marginBottom: '0.25rem' }}>Request Waste Pickup</h3>
                        <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>Fill in your waste details and we'll arrange collection</p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group mb-0">
                                    <label className="form-label">Waste Type *</label>
                                    <select className="form-select" value={wasteType} onChange={e => setWasteType(e.target.value)}>
                                        {wasteTypes.map(w => <option key={w} value={w}>{w}</option>)}
                                    </select>
                                </div>
                                <div className="form-group mb-0">
                                    <label className="form-label">Estimated Quantity *</label>
                                    <input type="text" className="form-input" placeholder="e.g. 50 kg, 2 bags" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group mb-0">
                                <label className="form-label">Photo of Waste * <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>(location will be taken from image)</span></label>
                                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoSelect} style={{ display: 'none' }} />
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    style={{
                                        border: `2px dashed ${photo ? 'var(--color-success)' : '#cbd5e1'}`,
                                        borderRadius: '8px',
                                        background: photo ? '#f0fdf4' : '#f8fafc',
                                        padding: '1.25rem',
                                        textAlign: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {photo ? (
                                        <div>
                                            <img src={photo} alt="Preview" style={{ maxHeight: '100px', borderRadius: '6px', objectFit: 'cover' }} />
                                            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.5rem' }}>✓ Photo attached — click to change</div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                                            <Camera size={28} />
                                            <span style={{ fontSize: '0.85rem' }}>Tap to add a photo</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-full" style={{ background: '#10b981', padding: '0.85rem', marginTop: '0.5rem' }}>
                                <UploadCloud size={18} /> Submit Pickup Request
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {showQR && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="card" style={{ width: '380px', maxWidth: '95%', textAlign: 'center', borderRadius: '12px' }}>
                        <button onClick={() => setShowQR(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} color="#94a3b8" />
                        </button>
                        <QrCode size={32} color="#134e4a" style={{ margin: '0 auto 0.5rem' }} />
                        <h3 style={{ color: '#134e4a', marginBottom: '0.25rem' }}>Pickup QR Code</h3>
                        <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>Show this to the pickup person for verification</p>

                        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', display: 'inline-block', margin: '0 auto 1rem' }}>
                            <img
                                src={qrUrl(showQR.qrData)}
                                alt="QR Code"
                                style={{ width: '200px', height: '200px' }}
                            />
                        </div>

                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#134e4a', marginBottom: '0.5rem' }}>{showQR.id}</div>
                        <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>{showQR.wasteType} • {showQR.estimatedQuantity}</div>

                        <a
                            href={qrUrl(showQR.qrData)}
                            download={`pickup_qr_${showQR.id}.png`}
                            className="btn btn-outline w-full"
                            style={{ marginTop: '0.5rem' }}
                        >
                            Download QR Code
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
