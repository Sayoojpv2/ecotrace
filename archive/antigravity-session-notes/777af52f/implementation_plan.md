# EcoTrace Feature Expansion Plan

This plan covers 4 feature areas requested by the user.

---

## Part 1: Sign Out → Introduction Page (Quick Fix)

The [Landing.tsx](file:///c:/Users/acer/et/src/pages/Landing.tsx) already has Login and Signup buttons. The `ProtectedRoute` already redirects unauthenticated users to `/login`. 

#### [MODIFY] [DashboardLayout.tsx](file:///c:/Users/acer/et/src/layouts/DashboardLayout.tsx)
- Change `navigate('/')` → already correct (goes to Landing page). BUT the `ProtectedRoute` in App.tsx sends logged-out users to `/login`. Fix: change `ProtectedRoute` redirect to `/` instead.

#### [MODIFY] [App.tsx](file:///c:/Users/acer/et/src/App.tsx)  
- Change `ProtectedRoute` redirect from `/login` → `/`

---

## Part 2: Clear All Demo Data (Quick Fix)

#### [MODIFY] [store.ts](file:///c:/Users/acer/et/src/lib/store.ts)
- Add `clearAllData()` function that wipes all `ecotrace_*` localStorage keys

#### [MODIFY] [useAuth.tsx](file:///c:/Users/acer/et/src/hooks/useAuth.tsx)
- Call `clearAllData()` on logout so each session starts fresh

---

## Part 3: Document File Upload (PDF/Photos) with Viewer

Currently documents are metadata-only. We'll store actual files as base64 data URLs in localStorage.

> [!WARNING]
> localStorage has a ~5MB limit. Each file will be capped at ~2MB. For a production app, a backend storage solution would be needed.

#### [MODIFY] [store.ts](file:///c:/Users/acer/et/src/lib/store.ts)
- Add `fileData` field to `DocRecord` (base64 string)
- Add `fileType` field (`'pdf' | 'image'`)
- Add `saveFileData(docId, base64)` and `getFileData(docId)` helpers
- Store file data in separate localStorage key per file to avoid hitting size limits

#### [MODIFY] [Documents.tsx](file:///c:/Users/acer/et/src/pages/Documents.tsx)
- Add `<input type="file" accept=".pdf,image/*">` to upload modal
- Convert file to base64 via `FileReader` on upload
- Add "View" button on each document row
- Add document viewer modal: renders `<img>` for images, `<iframe>` for PDFs

---

## Part 4: Customer Pickup Link & QR Workflow

This is the largest feature. It adds a full customer-facing pickup request system with QR verification.

### 4A: Data Models

#### [MODIFY] [store.ts](file:///c:/Users/acer/et/src/lib/store.ts)
Add new interfaces and CRUD:

```typescript
interface PickupRequest {
  id: string;           // e.g. "REQ-A1B2C3"
  customerName: string;
  contactNumber: string;
  address: string;
  location?: { lat: number; lng: number };
  wasteType: string;
  estimatedQuantity: string;
  photoBase64?: string;
  preferredDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'assigned' | 'in-progress' | 'completed';
  assignedStaff?: string;
  qrData: string;       // JSON stringified verification payload
  createdAt: string;
  // Pickup completion fields
  arrivalTimestamp?: string;
  arrivalCoords?: { lat: number; lng: number };
  qrVerified?: boolean;
  segregationRating?: 'Good' | 'Mixed' | 'Poor';
  pickupPhoto?: string;
  completedAt?: string;
  completedBy?: string;
}

interface PickupLink {
  id: string;           // unique link ID
  createdAt: string;
  url: string;          // "/pickup-request/{id}"
}
```

### 4B: New Pages & Routes

#### [NEW] [CustomerPickupForm.tsx](file:///c:/Users/acer/et/src/pages/CustomerPickupForm.tsx)
- Mobile-friendly standalone form (NOT inside dashboard)
- Fields: Name, Contact, Address, Waste Type, Quantity, Photo, Preferred Date
- On submit: creates `PickupRequest` with status `pending`, generates QR code
- Shows confirmation with QR code (displayed + downloadable)
- Uses `qrcode` npm package for QR generation

#### [NEW] [StaffLogin.tsx](file:///c:/Users/acer/et/src/pages/StaffLogin.tsx)  
- Simple staff login page (name + phone)

#### [NEW] [StaffDashboard.tsx](file:///c:/Users/acer/et/src/pages/StaffDashboard.tsx)
- Lists assigned pickup jobs
- Each job card: customer details, waste type, quantity, navigation button
- Job flow: Navigate → Arrive → Scan QR → Rate Segregation → Confirm Pickup

#### [NEW] [StaffPickupJob.tsx](file:///c:/Users/acer/et/src/pages/StaffPickupJob.tsx)
- Full pickup execution flow (step-by-step)
- Step 1: Job details + "Navigate" button (opens Google Maps)
- Step 2: "Arrived at Location" button (logs GPS + timestamp)
- Step 3: "Scan QR" button (camera-based QR scanner or manual ID entry)
- Step 4: Segregation rating selector + optional photo upload
- Step 5: "Confirm Pickup" → creates waste batch entry

### 4C: Dashboard Integration

#### [MODIFY] [Pickup.tsx](file:///c:/Users/acer/et/src/pages/Pickup.tsx)
- Add "Generate Pickup Link" button
- Add "Pending Requests" section showing incoming customer requests
- Each request card: customer name, waste type, quantity, photo, Accept/Reject buttons
- Accept → assign to staff, Reject → decline

#### [MODIFY] [App.tsx](file:///c:/Users/acer/et/src/App.tsx)
- Add routes: `/pickup-request/:linkId` → CustomerPickupForm
- Add routes: `/staff/login`, `/staff/dashboard`, `/staff/pickup/:requestId`

### 4D: QR Code System
- QR contains: `{ requestId, customerName, wasteType, timestamp }`
- Verification: staff scans QR → system matches against assigned job
- Uses `qrcode` library for generation, `html5-qrcode` for scanning

---

## User Review Required

> [!IMPORTANT]
> **localStorage limits**: Files (PDFs, photos) stored as base64 in localStorage have a ~5MB total limit. We'll cap each file at ~2MB. This works for demo/small-scale usage but would need cloud storage for production.

> [!IMPORTANT]  
> **QR Scanning**: Real camera-based QR scanning requires the `html5-qrcode` library (additional npm install). As a fallback, we can use manual Request ID entry. Which approach do you prefer?

> [!IMPORTANT]
> **GPS Location**: The customer form can use browser `navigator.geolocation` for GPS coordinates. Map preview requires Google Maps API key. Should I use a simple text address field instead of a map?

> [!IMPORTANT]
> **Staff accounts**: Should staff accounts be separate from the main recycler account, or should we keep it simple with a single "staff mode" toggle?

---

## Verification Plan

### Automated Tests
- Browser test: Full flow from generating pickup link → customer submission → QR display → recycler accept → staff pickup → completion
- Verify all data persists in localStorage
- Test document upload (PDF + image) and viewing

### Manual Verification
- Test QR code generation and scanning on mobile
- Test GPS capture
- Verify chain-of-custody data integrity
