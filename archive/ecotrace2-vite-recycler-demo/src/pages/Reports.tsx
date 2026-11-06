import { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle, Trash2, Eye, FolderOpen, Archive } from 'lucide-react';
import { getPickups, getDocs, getGeneratedReports, saveReport, deleteReport, type ReportRecord } from '../lib/store';
import jsPDF from 'jspdf';

const inspectionTemplates = [
    'Stock Register',
    'Waste Inward Register',
    'Processing Log',
    'Dispatch & Channelization Record',
    'Residue Disposal Record',
    'Daily Activity Log'
];

const monthlyTemplates = [
    'Monthly Processing Summary',
    'Material Balance Report',
    'Pickup Summary',
    'Facility Activity Summary'
];

export default function Reports() {
    const [reports, setReports] = useState<ReportRecord[]>([]);
    const [generating, setGenerating] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [viewingPdf, setViewingPdf] = useState<ReportRecord | null>(null);
    const [activeTab, setActiveTab] = useState<'generate' | 'library'>('generate');

    useEffect(() => {
        setReports(getGeneratedReports());
    }, []);

    const generatePDF = (reportName: string, reportType: 'inspection' | 'monthly'): string => {
        const doc = new jsPDF();
        const pickups = getPickups();
        const docs = getDocs();
        const now = new Date();
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;

        const addNewPageIfNeeded = () => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        };

        // Header bar
        doc.setFillColor(15, 43, 60);
        doc.rect(0, 0, pageWidth, 38, 'F');
        doc.setTextColor(16, 185, 129);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('EcoTrace', 14, 16);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text('Compliance Operating System', 14, 23);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text(reportName, 14, 32);

        // Report info
        y = 48;
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Report ID: RPT-${Math.floor(100 + Math.random() * 900)}`, 14, y);
        doc.text(`Generated: ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`, 14, y + 6);
        doc.text(`Time: ${now.toLocaleTimeString()}`, 14, y + 12);
        doc.text(`Type: ${reportType === 'inspection' ? 'Inspection Document' : 'Monthly Summary'}`, 14, y + 18);

        y = 78;

        // Divider
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(14, y, pageWidth - 14, y);
        y += 8;

        // Pickup Records Section
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 43, 60);
        doc.text('Pickup Records', 14, y);
        y += 8;

        if (pickups.length === 0) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(9);
            doc.setTextColor(148, 163, 184);
            doc.text('No pickup records found.', 14, y);
            y += 10;
        } else {
            // Table header
            doc.setFillColor(248, 250, 252);
            doc.rect(14, y - 4, pageWidth - 28, 8, 'F');
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 116, 139);
            const cols = [14, 40, 72, 102, 132, 162];
            const headers = ['ID', 'DATE', 'WASTE TYPE', 'QUANTITY', 'SOURCE', 'STATUS'];
            headers.forEach((h, i) => doc.text(h, cols[i], y));
            y += 7;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(30, 41, 59);
            pickups.forEach(p => {
                addNewPageIfNeeded();
                doc.text(p.id || '—', cols[0], y);
                doc.text(p.date || '—', cols[1], y);
                doc.text((p.wasteType || '—').substring(0, 18), cols[2], y);
                doc.text((p.quantity || '—').substring(0, 15), cols[3], y);
                doc.text((p.sourceType || '—').substring(0, 15), cols[4], y);
                doc.text(p.status || '—', cols[5], y);
                // Row separator
                doc.setDrawColor(241, 245, 249);
                doc.line(14, y + 2, pageWidth - 14, y + 2);
                y += 7;
            });
            y += 5;
        }

        addNewPageIfNeeded();

        // Documents Section
        doc.setDrawColor(226, 232, 240);
        doc.line(14, y, pageWidth - 14, y);
        y += 8;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 43, 60);
        doc.text('Uploaded Documents', 14, y);
        y += 8;

        if (docs.length === 0) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(9);
            doc.setTextColor(148, 163, 184);
            doc.text('No documents uploaded.', 14, y);
            y += 10;
        } else {
            // Table header
            doc.setFillColor(248, 250, 252);
            doc.rect(14, y - 4, pageWidth - 28, 8, 'F');
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 116, 139);
            const dCols = [14, 40, 90, 140];
            const dHeaders = ['ID', 'NAME', 'CATEGORY', 'STATUS'];
            dHeaders.forEach((h, i) => doc.text(h, dCols[i], y));
            y += 7;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(30, 41, 59);
            docs.forEach(d => {
                addNewPageIfNeeded();
                doc.text(d.id || '—', dCols[0], y);
                doc.text((d.name || '—').substring(0, 30), dCols[1], y);
                doc.text((d.category || '—').substring(0, 25), dCols[2], y);
                doc.text(d.status || '—', dCols[3], y);
                doc.setDrawColor(241, 245, 249);
                doc.line(14, y + 2, pageWidth - 14, y + 2);
                y += 7;
            });
            y += 5;
        }

        addNewPageIfNeeded();

        // Summary Section
        doc.setDrawColor(226, 232, 240);
        doc.line(14, y, pageWidth - 14, y);
        y += 8;

        doc.setFillColor(236, 253, 245);
        doc.roundedRect(14, y - 4, pageWidth - 28, 28, 3, 3, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(4, 120, 87);
        doc.text('Summary', 18, y + 2);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        doc.text(`Total Pickup Records: ${pickups.length}`, 18, y + 10);
        doc.text(`Total Documents Uploaded: ${docs.length}`, 18, y + 17);
        y += 32;

        // Footer
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setDrawColor(226, 232, 240);
        doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text('EcoTrace Compliance OS — Auto-generated report', 14, pageHeight - 10);
        doc.text(`Page 1 of ${doc.getNumberOfPages()}`, pageWidth - 42, pageHeight - 10);

        return doc.output('datauristring');
    };

    const handleGenerate = (name: string, type: 'inspection' | 'monthly') => {
        setGenerating(name);
        setTimeout(() => {
            const now = new Date();
            const pdfData = generatePDF(name, type);
            const report: ReportRecord = {
                id: 'RPT-' + Math.floor(100 + Math.random() * 900),
                name,
                date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                period: type === 'monthly'
                    ? now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                type,
                pdfData
            };
            saveReport(report);
            setReports(getGeneratedReports());
            setGenerating(null);
            setSuccessMsg(`"${name}" generated as PDF and saved!`);
            setTimeout(() => setSuccessMsg(''), 4000);
        }, 600);
    };

    const handleDownload = (report: ReportRecord) => {
        if (report.pdfData) {
            const a = document.createElement('a');
            a.href = report.pdfData;
            a.download = `${report.name.replace(/\s+/g, '_')}_${report.date.replace(/[\s,]+/g, '_')}.pdf`;
            a.click();
        }
    };

    const handleView = (report: ReportRecord) => {
        setViewingPdf(report);
    };

    const handleDelete = (id: string) => {
        deleteReport(id);
        setReports(getGeneratedReports());
    };

    const tabStyle = (active: boolean) => ({
        padding: '0.6rem 1.25rem', background: active ? 'var(--color-primary)' : 'transparent',
        color: active ? 'white' : '#64748b', border: 'none', borderRadius: '8px',
        cursor: 'pointer', fontWeight: 600 as const, fontSize: '0.85rem', fontFamily: 'inherit',
        transition: 'all 0.2s', display: 'flex' as const, alignItems: 'center' as const, gap: '0.4rem'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header with tabs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 className="page-title" style={{ marginBottom: 0 }}>Compliance Reports</h3>
                <div style={{
                    display: 'flex', gap: '0.25rem', padding: '0.25rem',
                    background: '#f1f5f9', borderRadius: '10px'
                }}>
                    <button onClick={() => setActiveTab('generate')} style={tabStyle(activeTab === 'generate')}>
                        <FileText size={15} /> Generate
                    </button>
                    <button onClick={() => setActiveTab('library')} style={tabStyle(activeTab === 'library')}>
                        <Archive size={15} /> Saved Reports
                        {reports.length > 0 && (
                            <span style={{
                                background: activeTab === 'library' ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                                padding: '0.1rem 0.45rem', borderRadius: '8px', fontSize: '0.7rem'
                            }}>
                                {reports.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {successMsg && (
                <div style={{
                    padding: '0.75rem 1rem', background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                    color: '#047857', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500,
                    border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                    <CheckCircle size={16} /> {successMsg}
                </div>
            )}

            {/* GENERATE TAB */}
            {activeTab === 'generate' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* Inspection Documents */}
                    <div>
                        <h4 className="card-title">Inspection Documents</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {inspectionTemplates.map((report, i) => (
                                <div key={i} className="card" style={{
                                    padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <div style={{
                                            padding: '0.4rem', borderRadius: '8px',
                                            background: 'linear-gradient(135deg, #0f2b3c, #1a4563)',
                                            color: 'white', display: 'flex', alignItems: 'center'
                                        }}>
                                            <FileText size={15} />
                                        </div>
                                        <span style={{ fontWeight: 500, fontSize: '0.83rem' }}>{report}</span>
                                    </div>
                                    <button
                                        className="btn btn-success"
                                        style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}
                                        onClick={() => handleGenerate(report, 'inspection')}
                                        disabled={generating === report}
                                    >
                                        {generating === report ? 'Generating...' : 'Generate PDF'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Summaries */}
                    <div>
                        <h4 className="card-title">Monthly Summaries</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {monthlyTemplates.map((report, i) => (
                                <div key={i} className="card" style={{
                                    padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <div style={{
                                            padding: '0.4rem', borderRadius: '8px',
                                            background: '#f1f5f9',
                                            color: '#64748b', display: 'flex', alignItems: 'center'
                                        }}>
                                            <FileText size={15} />
                                        </div>
                                        <span style={{ fontWeight: 500, fontSize: '0.83rem' }}>{report}</span>
                                    </div>
                                    <button
                                        className="btn btn-success"
                                        style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}
                                        onClick={() => handleGenerate(report, 'monthly')}
                                        disabled={generating === report}
                                    >
                                        {generating === report ? 'Generating...' : 'Generate PDF'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* SAVED REPORTS LIBRARY TAB */}
            {activeTab === 'library' && (
                <div>
                    {reports.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                            <FolderOpen size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                            <h3 style={{ color: '#64748b', margin: '0 0 0.5rem', fontSize: '1rem' }}>No Saved Reports</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                                Generate reports from the "Generate" tab — they'll be saved here as PDFs.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            {reports.map((rep) => (
                                <div key={rep.id} className="card" style={{
                                    padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
                                    borderTop: `3px solid ${rep.type === 'inspection' ? '#0f2b3c' : '#10b981'}`
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <div style={{
                                            padding: '0.4rem', borderRadius: '8px',
                                            background: rep.type === 'inspection' ? '#0f2b3c' : '#10b981',
                                            color: 'white', display: 'flex', alignItems: 'center'
                                        }}>
                                            <FileText size={16} />
                                        </div>
                                        <span style={{
                                            fontSize: '0.65rem', padding: '0.15rem 0.5rem',
                                            background: rep.type === 'inspection' ? '#f1f5f9' : '#ecfdf5',
                                            color: rep.type === 'inspection' ? '#64748b' : '#047857',
                                            borderRadius: '6px', fontWeight: 600
                                        }}>
                                            {rep.type === 'inspection' ? 'Inspection' : 'Monthly'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                                            {rep.name}
                                        </h4>
                                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                                            {rep.date} • Period: {rep.period}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto' }}>
                                        {rep.pdfData && (
                                            <>
                                                <button
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', flex: 1 }}
                                                    onClick={() => handleView(rep)}
                                                >
                                                    <Eye size={13} /> View
                                                </button>
                                                <button
                                                    className="btn btn-success"
                                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', flex: 1 }}
                                                    onClick={() => handleDownload(rep)}
                                                >
                                                    <Download size={13} /> Download
                                                </button>
                                            </>
                                        )}
                                        <button
                                            className="btn"
                                            style={{
                                                padding: '0.3rem 0.5rem', fontSize: '0.72rem',
                                                background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca'
                                            }}
                                            onClick={() => handleDelete(rep.id)}
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* PDF Viewer Modal */}
            {viewingPdf && viewingPdf.pdfData && (
                <div
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '2rem'
                    }}
                    onClick={() => setViewingPdf(null)}
                >
                    <div
                        style={{
                            background: 'white', borderRadius: '16px', width: '800px', maxWidth: '95%',
                            height: '85vh', display: 'flex', flexDirection: 'column',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{
                            padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f2b3c' }}>{viewingPdf.name}</h3>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{viewingPdf.date} • {viewingPdf.period}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className="btn btn-success"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                    onClick={() => handleDownload(viewingPdf)}
                                >
                                    <Download size={14} /> Download PDF
                                </button>
                                <button
                                    className="btn btn-outline"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                    onClick={() => setViewingPdf(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                        {/* PDF iframe  */}
                        <iframe
                            src={viewingPdf.pdfData}
                            style={{ flex: 1, border: 'none', width: '100%' }}
                            title="PDF Preview"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
