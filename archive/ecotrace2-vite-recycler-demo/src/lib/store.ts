/**
 * localStorage data store for EcoTrace.
 * All dashboard data is persisted here instead of Supabase.
 */

// ─── Pickups ───
export interface PickupRecord {
    id: string;
    date: string;
    wasteType: string;
    sourceType: string;
    quantity: string;
    weight: string;
    vehicleNumber: string;
    driverName: string;
    sourceCompany: string;
    notes: string;
    status: 'Recorded' | 'Pending Verification';
}

export function getPickups(): PickupRecord[] {
    try {
        return JSON.parse(localStorage.getItem('ecotrace_pickups') || '[]');
    } catch { return []; }
}

export function savePickup(pickup: PickupRecord) {
    const pickups = getPickups();
    pickups.unshift(pickup);
    localStorage.setItem('ecotrace_pickups', JSON.stringify(pickups));
}

export function deletePickup(id: string) {
    const pickups = getPickups().filter(p => p.id !== id);
    localStorage.setItem('ecotrace_pickups', JSON.stringify(pickups));
}

// ─── Documents ───
export interface DocRecord {
    id: string;
    name: string;
    category: string;
    uploadDate: string;
    expiryDate: string;
    status: 'Valid' | 'Expiring Soon' | 'Expired';
    fileType?: 'pdf' | 'image' | 'none';
    hasFile?: boolean;
}

export function getDocs(): DocRecord[] {
    try {
        return JSON.parse(localStorage.getItem('ecotrace_docs') || '[]');
    } catch { return []; }
}

export function saveDoc(doc: DocRecord) {
    const docs = getDocs();
    docs.unshift(doc);
    localStorage.setItem('ecotrace_docs', JSON.stringify(docs));
}

export function deleteDoc(id: string) {
    deleteFileData(id);
    const docs = getDocs().filter(d => d.id !== id);
    localStorage.setItem('ecotrace_docs', JSON.stringify(docs));
}

// File storage (separate keys to avoid localStorage size issues)
export function saveFileData(docId: string, base64Data: string) {
    try {
        localStorage.setItem('ecotrace_file_' + docId, base64Data);
    } catch (e) {
        console.error('File too large for localStorage', e);
    }
}

export function getFileData(docId: string): string | null {
    return localStorage.getItem('ecotrace_file_' + docId);
}

export function deleteFileData(docId: string) {
    localStorage.removeItem('ecotrace_file_' + docId);
}

// ─── Alerts ───
export interface AlertRecord {
    id: string;
    type: string;
    severity: 'Critical' | 'Warning' | 'Info';
    message: string;
    date: string;
    targetPath: string;
}

export function generateAlerts(): AlertRecord[] {
    const alerts: AlertRecord[] = [];
    const docs = getDocs();
    const pickups = getPickups();

    // Check for expired documents
    docs.forEach(doc => {
        if (doc.status === 'Expired') {
            alerts.push({
                id: 'alert-exp-' + doc.id,
                type: 'Document',
                severity: 'Critical',
                message: `Document "${doc.name}" has expired`,
                date: doc.expiryDate,
                targetPath: '/dashboard/documents'
            });
        } else if (doc.status === 'Expiring Soon') {
            alerts.push({
                id: 'alert-soon-' + doc.id,
                type: 'Document',
                severity: 'Warning',
                message: `Document "${doc.name}" is expiring soon`,
                date: doc.expiryDate,
                targetPath: '/dashboard/documents'
            });
        }
    });

    // Check if no pickups recently
    if (pickups.length === 0) {
        alerts.push({
            id: 'alert-no-pickups',
            type: 'Activity',
            severity: 'Info',
            message: 'No pickup activity recorded yet. Record your first pickup.',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            targetPath: '/dashboard/pickup'
        });
    }

    // Check if no documents uploaded
    if (docs.length === 0) {
        alerts.push({
            id: 'alert-no-docs',
            type: 'Compliance',
            severity: 'Warning',
            message: 'No compliance documents uploaded. Upload your permits and certificates.',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            targetPath: '/dashboard/documents'
        });
    }

    return alerts;
}

// ─── Reports (generated from data) ───
export interface ReportRecord {
    id: string;
    name: string;
    date: string;
    period: string;
    type: 'inspection' | 'monthly';
    pdfData?: string; // base64 PDF data
}

export function getGeneratedReports(): ReportRecord[] {
    try {
        return JSON.parse(localStorage.getItem('ecotrace_reports') || '[]');
    } catch { return []; }
}

export function saveReport(report: ReportRecord) {
    const reports = getGeneratedReports();
    reports.unshift(report);
    localStorage.setItem('ecotrace_reports', JSON.stringify(reports));
}

export function deleteReport(id: string) {
    const reports = getGeneratedReports().filter(r => r.id !== id);
    localStorage.setItem('ecotrace_reports', JSON.stringify(reports));
}

// ─── Metrics (computed) ───
export function getMetrics() {
    const pickups = getPickups();
    const docs = getDocs();
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const todayPickups = pickups.filter(p => p.date === today);

    // Parse tons from quantity strings like "Medium (5T)"
    const parseTons = (q: string) => {
        const match = q.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    };

    const totalTons = todayPickups.reduce((sum, p) => sum + parseTons(p.quantity), 0);
    const pendingDocs = docs.filter(d => d.status === 'Expiring Soon' || d.status === 'Expired').length;

    return {
        pickups: totalTons,
        totalPickupCount: pickups.length,
        processing: Math.round(totalTons * 0.8), // estimate
        dispatch: Math.round(totalTons * 0.6), // estimate
        pending: pendingDocs,
    };
}

// ─── Chart data (computed from real pickups + customer requests) ───
export function getChartData() {
    const pickups = getPickups();
    const requests = getPickupRequests();

    // Parse quantity to kg — customer entries are typically in kg,
    // recycler entries may use formats like "Medium (5T)"
    const parseKg = (q: string, isRecyclerEntry: boolean): number => {
        if (!q) return 0;
        const lower = q.toLowerCase();
        const match = q.match(/(\d+\.?\d*)/);
        if (!match) return 0;
        const num = parseFloat(match[1]);

        // Explicit ton indicators
        if (lower.includes('t)') || lower.includes('ton')) return Math.round(num * 1000);
        // Explicit kg indicator
        if (lower.includes('kg')) return Math.round(num);
        // Recycler entries with labels like "Medium (5T)" — already handled above
        // Bare numbers: customer form entries are in kg
        if (isRecyclerEntry) return Math.round(num * 1000); // recycler bare numbers assumed tons
        return Math.round(num); // customer bare numbers assumed kg
    };

    // Normalize any date string to 'MMM D' format
    const normDate = (dateStr: string): string => {
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return '';
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch { return ''; }
    };

    // Build the last 7 day labels
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    // Build unified entry list with kg values
    interface UnifiedEntry { date: string; wasteType: string; kg: number; source: 'recycler' | 'customer'; }
    const allEntries: UnifiedEntry[] = [];

    pickups.forEach(p => {
        allEntries.push({
            date: p.date, wasteType: p.wasteType,
            kg: parseKg(p.quantity, true), source: 'recycler'
        });
    });

    requests.forEach(r => {
        const dateStr = r.completedAt || r.createdAt || r.preferredDate;
        allEntries.push({
            date: dateStr, wasteType: r.wasteType,
            kg: parseKg(r.estimatedQuantity, false), source: 'customer'
        });
    });

    // Daily collection in kg
    const dailyData = days.map(day => {
        const dayEntries = allEntries.filter(e => normDate(e.date) === day);
        const totalKg = dayEntries.reduce((sum, e) => sum + e.kg, 0);
        const count = dayEntries.length;
        return { day, kg: totalKg, count };
    });

    // Waste type distribution in kg
    const wasteMap: Record<string, number> = {};
    allEntries.forEach(e => {
        if (e.kg > 0) {
            wasteMap[e.wasteType] = (wasteMap[e.wasteType] || 0) + e.kg;
        }
    });
    const wasteDistribution = Object.entries(wasteMap).map(([name, value]) => ({ name, value }));

    // Request status breakdown
    const statusCounts = { pending: 0, accepted: 0, completed: 0, rejected: 0 };
    requests.forEach(r => {
        if (r.status === 'pending') statusCounts.pending++;
        else if (r.status === 'accepted' || r.status === 'in-progress') statusCounts.accepted++;
        else if (r.status === 'completed') statusCounts.completed++;
        else if (r.status === 'rejected') statusCounts.rejected++;
    });

    const totalKg = allEntries.reduce((sum, e) => sum + e.kg, 0);

    return { dailyData, wasteDistribution, statusCounts, totalKg, totalEntries: allEntries.length };
}

// ─── Pickup Requests (Customer → Recycler) ───
export interface PickupRequest {
    id: string;
    customerName: string;
    contactNumber: string;
    address: string;
    wasteType: string;
    estimatedQuantity: string;
    photoBase64?: string;
    preferredDate: string;
    status: 'pending' | 'accepted' | 'rejected' | 'in-progress' | 'completed';
    segregationRating?: 'Good' | 'Mixed' | 'Poor';
    qrData: string;
    createdAt: string;
    arrivalTimestamp?: string;
    arrivalConfirmed?: boolean;
    qrVerified?: boolean;
    pickupPhoto?: string;
    completedAt?: string;
}

export function getPickupRequests(): PickupRequest[] {
    try {
        return JSON.parse(localStorage.getItem('ecotrace_pickup_requests') || '[]');
    } catch { return []; }
}

export function savePickupRequest(req: PickupRequest) {
    const reqs = getPickupRequests();
    reqs.unshift(req);
    localStorage.setItem('ecotrace_pickup_requests', JSON.stringify(reqs));
}

export function updatePickupRequest(id: string, updates: Partial<PickupRequest>) {
    const reqs = getPickupRequests().map(r =>
        r.id === id ? { ...r, ...updates } : r
    );
    localStorage.setItem('ecotrace_pickup_requests', JSON.stringify(reqs));
}

export function getPickupRequestById(id: string): PickupRequest | undefined {
    return getPickupRequests().find(r => r.id === id);
}

// ─── Customer Auth (separate from recycler) ───
export function getCustomerUsers(): Record<string, { name: string; password: string; phone: string }> {
    try {
        return JSON.parse(localStorage.getItem('ecotrace_customer_users') || '{}');
    } catch { return {}; }
}

export function saveCustomerUser(phone: string, name: string, password: string) {
    const users = getCustomerUsers();
    users[phone] = { name, password, phone };
    localStorage.setItem('ecotrace_customer_users', JSON.stringify(users));
}

export function getCustomerSession(): { name: string; phone: string } | null {
    try {
        const s = localStorage.getItem('ecotrace_customer_session');
        return s ? JSON.parse(s) : null;
    } catch { return null; }
}

export function setCustomerSession(name: string, phone: string) {
    localStorage.setItem('ecotrace_customer_session', JSON.stringify({ name, phone }));
}

export function clearCustomerSession() {
    localStorage.removeItem('ecotrace_customer_session');
}

// ─── Pickup Links ───
export function getPickupLinks(): string[] {
    try {
        return JSON.parse(localStorage.getItem('ecotrace_pickup_links') || '[]');
    } catch { return []; }
}

export function createPickupLink(): string {
    const id = 'PL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const links = getPickupLinks();
    links.unshift(id);
    localStorage.setItem('ecotrace_pickup_links', JSON.stringify(links));
    return id;
}

// ─── Admin helpers ───
export function deletePickupRequest(id: string) {
    const reqs = getPickupRequests().filter(r => r.id !== id);
    localStorage.setItem('ecotrace_pickup_requests', JSON.stringify(reqs));
}

export function deleteCustomerUser(phone: string) {
    const users = getCustomerUsers();
    delete users[phone];
    localStorage.setItem('ecotrace_customer_users', JSON.stringify(users));
}

export function getPlatformUsers(): Record<string, { name: string; password: string }> {
    try {
        return JSON.parse(localStorage.getItem('ecotrace_users') || '{}');
    } catch { return {}; }
}

export function deletePlatformUser(phone: string) {
    const users = getPlatformUsers();
    delete users[phone];
    localStorage.setItem('ecotrace_users', JSON.stringify(users));
}
