import { useState, useEffect, useRef } from 'react';
import { Folder, File, UploadCloud, Trash2, X, Eye, FileText, Image } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getDocs, saveDoc, deleteDoc, saveFileData, getFileData, type DocRecord } from '../lib/store';

const categories = [
    'Pollution Control Authorization',
    'Consent to Operate',
    'Agreements',
    'Vehicle Permits',
    'Registration Certificates',
    'Safety Certificates',
    'Other'
];

export default function Documents() {
    const { userRole } = useAuth();
    const isReadOnly = userRole === 'partner';
    const [activeFolder, setActiveFolder] = useState<string>('Consent to Operate');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [viewingDoc, setViewingDoc] = useState<DocRecord | null>(null);
    const [viewFileData, setViewFileData] = useState<string | null>(null);

    // Form State
    const [uploadCategory, setUploadCategory] = useState(categories[0]);
    const [uploadName, setUploadName] = useState('');
    const [uploadIssue, setUploadIssue] = useState('');
    const [uploadExpiry, setUploadExpiry] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [docs, setDocs] = useState<DocRecord[]>([]);

    useEffect(() => {
        setDocs(getDocs());
    }, []);

    const folderDocs = docs.filter(d => d.category === activeFolder);
    const validCount = docs.filter(d => d.status === 'Valid').length;
    const soonCount = docs.filter(d => d.status === 'Expiring Soon').length;
    const expiredCount = docs.filter(d => d.status === 'Expired').length;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setUploadError('');
        if (!file) return;

        // Check file size (2MB limit for localStorage)
        if (file.size > 2 * 1024 * 1024) {
            setUploadError('File is too large. Maximum size is 2MB.');
            return;
        }

        // Check file type
        const isPdf = file.type === 'application/pdf';
        const isImage = file.type.startsWith('image/');
        if (!isPdf && !isImage) {
            setUploadError('Only PDF and image files (JPG, PNG) are supported.');
            return;
        }

        setSelectedFile(file);

        // Generate preview for images
        if (isImage) {
            const reader = new FileReader();
            reader.onload = (ev) => setFilePreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }

        // Auto-fill name if empty
        if (!uploadName) {
            setUploadName(file.name);
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadName || isReadOnly) return;

        let status: 'Valid' | 'Expiring Soon' | 'Expired' = 'Valid';
        if (uploadExpiry) {
            const diffDays = Math.ceil((new Date(uploadExpiry).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            if (diffDays < 0) status = 'Expired';
            else if (diffDays <= 30) status = 'Expiring Soon';
        }

        const docId = 'DOC-' + Math.floor(100 + Math.random() * 900);
        const fileType: 'pdf' | 'image' | 'none' = selectedFile
            ? (selectedFile.type === 'application/pdf' ? 'pdf' : 'image')
            : 'none';

        const newDoc: DocRecord = {
            id: docId,
            name: uploadName,
            category: uploadCategory,
            uploadDate: new Date().toLocaleDateString(),
            expiryDate: uploadExpiry ? new Date(uploadExpiry).toLocaleDateString() : 'N/A',
            status,
            fileType,
            hasFile: !!selectedFile
        };

        // Save file data if a file was selected
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64 = ev.target?.result as string;
                saveFileData(docId, base64);
            };
            reader.readAsDataURL(selectedFile);
        }

        saveDoc(newDoc);
        setDocs(getDocs());
        setShowUploadModal(false);
        resetForm();
    };

    const resetForm = () => {
        setUploadName('');
        setUploadIssue('');
        setUploadExpiry('');
        setSelectedFile(null);
        setFilePreview(null);
        setUploadError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = (id: string) => {
        deleteDoc(id);
        setDocs(getDocs());
    };

    const handleView = (doc: DocRecord) => {
        const data = getFileData(doc.id);
        setViewFileData(data);
        setViewingDoc(doc);
    };

    const closeViewer = () => {
        setViewingDoc(null);
        setViewFileData(null);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h3 className="page-title" style={{ marginBottom: 0 }}>Compliance Vault</h3>
                {!isReadOnly && (
                    <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
                        <UploadCloud size={18} />
                        Upload Document
                    </button>
                )}
            </div>

            <div className="grid grid-cols-4" style={{ gap: '1rem', gridTemplateColumns: 'repeat(4, minmax(200px, 1fr))' }}>
                <div className="card flex items-center justify-between" style={{ padding: '1rem', borderTop: '4px solid var(--color-success)' }}>
                    <div>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>Valid</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{validCount}</div>
                    </div>
                </div>
                <div className="card flex items-center justify-between" style={{ padding: '1rem', borderTop: '4px solid var(--color-warning)' }}>
                    <div>
                        <div className="text-warning" style={{ fontSize: '0.875rem' }}>Expiring Soon</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{soonCount}</div>
                    </div>
                </div>
                <div className="card flex items-center justify-between" style={{ padding: '1rem', borderTop: '4px solid var(--color-danger)' }}>
                    <div>
                        <div className="text-danger" style={{ fontSize: '0.875rem' }}>Expired</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{expiredCount}</div>
                    </div>
                </div>
                <div className="card flex items-center justify-between" style={{ padding: '1rem', borderTop: '4px solid var(--color-primary)' }}>
                    <div>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>Total</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{docs.length}</div>
                    </div>
                </div>
            </div>

            <div className="flex gap-8 mt-2">
                {/* Folders Sidebar */}
                <div className="flex flex-col gap-2" style={{ width: 280, flexShrink: 0 }}>
                    <h4 className="card-title text-muted" style={{ fontSize: '0.75rem' }}>DOCUMENT CATEGORIES</h4>
                    {categories.map(cat => {
                        const count = docs.filter(d => d.category === cat).length;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveFolder(cat)}
                                className="flex items-center gap-3 w-full"
                                style={{
                                    padding: '0.75rem 1rem',
                                    textAlign: 'left',
                                    background: activeFolder === cat ? 'var(--color-primary-light)' : 'transparent',
                                    color: activeFolder === cat ? 'white' : 'var(--color-text-main)',
                                    border: '1px solid',
                                    borderColor: activeFolder === cat ? 'var(--color-primary-light)' : 'var(--color-border)',
                                    borderRadius: 'var(--radius)',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    fontSize: '0.875rem'
                                }}
                            >
                                <Folder size={18} fill={activeFolder === cat ? '#94a3b8' : 'none'} color={activeFolder === cat ? 'white' : '#94a3b8'} />
                                {cat}
                                {count > 0 && (
                                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7 }}>({count})</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Folder Content */}
                <div className="flex-grow">
                    <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: '400px' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', background: '#f8fafc' }}>
                            <div className="flex items-center gap-2">
                                <Folder size={24} fill="#94a3b8" color="transparent" />
                                <h4 style={{ margin: 0, fontSize: '1.125rem' }}>{activeFolder}</h4>
                            </div>
                        </div>

                        {folderDocs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-muted">
                                <File size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>No documents in this folder.</p>
                                {!isReadOnly && (
                                    <button className="btn btn-outline" onClick={() => { setUploadCategory(activeFolder); setShowUploadModal(true); }} style={{ marginTop: '0.5rem' }}>
                                        Upload Document Here
                                    </button>
                                )}
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Document</th>
                                        <th>Upload Date</th>
                                        <th>Expiry Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {folderDocs.map(doc => (
                                        <tr key={doc.id}>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    {doc.fileType === 'pdf' ? (
                                                        <FileText size={18} color="var(--color-danger)" />
                                                    ) : doc.fileType === 'image' ? (
                                                        <Image size={18} color="var(--color-primary)" />
                                                    ) : (
                                                        <File size={18} color="#94a3b8" />
                                                    )}
                                                    <div>
                                                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{doc.name}</div>
                                                        {doc.hasFile && (
                                                            <div style={{ fontSize: '0.7rem', color: 'var(--color-success)' }}>
                                                                {doc.fileType === 'pdf' ? 'PDF' : 'Image'} attached
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-muted" style={{ fontSize: '0.875rem' }}>{doc.uploadDate}</td>
                                            <td style={{ fontSize: '0.875rem', fontWeight: 500 }}>{doc.expiryDate}</td>
                                            <td>
                                                <span className={
                                                    "badge " +
                                                    (doc.status === 'Valid' ? 'badge-success' :
                                                        doc.status === 'Expiring Soon' ? 'badge-warning' : 'badge-danger')
                                                }>
                                                    {doc.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    {doc.hasFile && (
                                                        <button
                                                            className="btn btn-outline"
                                                            style={{ padding: '0.3rem 0.5rem', borderColor: 'transparent', color: 'var(--color-primary)' }}
                                                            title="View Document"
                                                            onClick={() => handleView(doc)}
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                    )}
                                                    {!isReadOnly && (
                                                        <button
                                                            className="btn btn-outline"
                                                            style={{ padding: '0.3rem', borderColor: 'transparent', color: 'var(--color-danger)' }}
                                                            title="Delete"
                                                            onClick={() => handleDelete(doc.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && !isReadOnly && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '520px', maxWidth: '90%', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button
                            onClick={() => { setShowUploadModal(false); resetForm(); }}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={24} color="var(--color-text-muted)" />
                        </button>

                        <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Upload Document</h3>

                        <form onSubmit={handleUpload} className="flex flex-col gap-4">
                            <div className="form-group mb-0">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={uploadCategory}
                                    onChange={e => setUploadCategory(e.target.value)}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="form-group mb-0">
                                <label className="form-label">Document Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. CTO_2026.pdf"
                                    value={uploadName}
                                    onChange={e => setUploadName(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group mb-0">
                                    <label className="form-label">Issue Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={uploadIssue}
                                        onChange={e => setUploadIssue(e.target.value)}
                                    />
                                </div>
                                <div className="form-group mb-0">
                                    <label className="form-label">Expiry Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={uploadExpiry}
                                        onChange={e => setUploadExpiry(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* File Upload Area */}
                            <div className="form-group mb-0">
                                <label className="form-label">Upload File (PDF or Image, max 2MB)</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,image/jpeg,image/png,image/jpg,image/webp"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                    id="doc-file-input"
                                />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: `2px dashed ${selectedFile ? 'var(--color-success)' : 'var(--color-border)'}`,
                                        borderRadius: 'var(--radius)',
                                        backgroundColor: selectedFile ? 'var(--color-success-bg)' : '#f8fafc',
                                        cursor: 'pointer',
                                        padding: '1.5rem',
                                        textAlign: 'center',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {selectedFile ? (
                                        <div className="flex flex-col items-center gap-2">
                                            {filePreview ? (
                                                <img
                                                    src={filePreview}
                                                    alt="Preview"
                                                    style={{ maxHeight: '120px', maxWidth: '100%', borderRadius: 'var(--radius)', objectFit: 'contain' }}
                                                />
                                            ) : (
                                                <FileText size={40} color="var(--color-danger)" />
                                            )}
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-success)' }}>
                                                    ✓ {selectedFile.name}
                                                </div>
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                    {(selectedFile.size / 1024).toFixed(0)} KB — Click to change
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <UploadCloud size={36} color="var(--color-text-muted)" />
                                            <div>
                                                <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>Click to choose file</div>
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>PDF, JPG, PNG — Max 2MB</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {uploadError && (
                                    <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{uploadError}</div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" className="btn btn-outline" onClick={() => { setShowUploadModal(false); resetForm(); }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={!uploadName}>Upload to Vault</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Document Viewer Modal */}
            {viewingDoc && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 60,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: 'var(--radius)',
                        width: '90%',
                        maxWidth: '900px',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
                    }}>
                        {/* Viewer Header */}
                        <div style={{
                            padding: '1rem 1.5rem',
                            borderBottom: '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#f8fafc'
                        }}>
                            <div className="flex items-center gap-3">
                                {viewingDoc.fileType === 'pdf' ? (
                                    <FileText size={20} color="var(--color-danger)" />
                                ) : (
                                    <Image size={20} color="var(--color-primary)" />
                                )}
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{viewingDoc.name}</h4>
                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                        {viewingDoc.category} • Uploaded {viewingDoc.uploadDate}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={closeViewer}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                            >
                                <X size={24} color="var(--color-text-muted)" />
                            </button>
                        </div>

                        {/* Viewer Content */}
                        <div style={{ flexGrow: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#e2e8f0', minHeight: '400px' }}>
                            {!viewFileData ? (
                                <div className="text-center text-muted">
                                    <File size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                    <p>File data not found. It may have been cleared.</p>
                                </div>
                            ) : viewingDoc.fileType === 'image' ? (
                                <img
                                    src={viewFileData}
                                    alt={viewingDoc.name}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '70vh',
                                        objectFit: 'contain',
                                        borderRadius: 'var(--radius)',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                            ) : viewingDoc.fileType === 'pdf' ? (
                                <iframe
                                    src={viewFileData}
                                    title={viewingDoc.name}
                                    style={{
                                        width: '100%',
                                        height: '70vh',
                                        border: 'none',
                                        borderRadius: 'var(--radius)',
                                    }}
                                />
                            ) : (
                                <div className="text-center text-muted">
                                    <p>Preview not available for this file type.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
