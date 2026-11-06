# EcoTrace Recycler Compliance Platform

The goal is to build a professional B2B logging and operational dashboard system for recycling facilities. The application will use React via Vite with conventional (Vanilla) CSS for styling and `react-router-dom` for navigation.

## Proposed Changes

### Frontend Infrastructure
- Initialize a React + TypeScript project using Vite (`npx create-vite@latest ./ --template react-ts`)
- Install supporting UI libraries: `react-router-dom` (routing), `lucide-react` (iconography), `recharts` (data visualization).
- Set up a robust `index.css` implementing the required industrial color palette (Dark Teal, Safety Green, Red, Light Grey).

### Core Layouts
- **AuthLayout**: Centered minimal login screen.
- **DashboardLayout**: Persistent left sidebar with navigation routing to inner pages, and a top header spanning the width.

### Public Pages (New)
- **Landing Page (`/`)**: A public-facing marketing page. Needs a Header (Logo + Auth buttons), a Hero section, a Features grid (Automated Logs, Instant Reports, Expiry Alerts), and a simple Footer.
- **Sign Up Page (`/signup`)**: Uses `AuthLayout`. Includes fields for Facility Name, Contact Person, Mobile, Email, and Waste Categories.

### Dashboard Pages
- **Login (`/login`)**: Moved from `/` to `/login`. Mobile number + Password input.
- **Overview (`/dashboard`)**: Moved from `/` to `/dashboard`. High-level status ring, 4 summary cards, quick action buttons, current stock table, timeline.
- **Alerts (`/dashboard/alerts`)**: Filterable list of warnings (missing entries, license expiry).
- **Pickup (`/dashboard/pickup`)**: Split view with an entry form on the left, and recent transactions on the right.
- **Reports (`/dashboard/reports`)**: Grid of report types with download actions.
- **Documents (`/dashboard/documents`)**: Vault with folders and an upload modal. Expiry trackers built-in.
- **Data Tracking (`/dashboard/tracking`)**: Recharts integration showing daily pickups, processing, waste type, and stock trend.

## Database Architecture (Supabase)

> [!IMPORTANT]
> The following SQL schema needs to be executed in your Supabase SQL Editor. We are utilizing Row Level Security (RLS) to ensure that users (facilities) can only see their own operating data.

```sql
-- Create custom types for waste categories if desired, or use text
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Facilities (Profiles mapped to Auth Users)
create table public.facilities (
  id uuid references auth.users not null primary key,
  facility_name text not null,
  contact_person text,
  mobile_number text,
  waste_categories text[],
  role text default 'recycler' check (role in ('recycler', 'partner', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS
alter table public.facilities enable row level security;
create policy "Users can view own facility" on public.facilities for select using (auth.uid() = id);
create policy "Users can update own facility" on public.facilities for update using (auth.uid() = id);

-- 2. Pickups
create table public.pickups (
  id uuid default uuid_generate_v4() primary key,
  facility_id uuid references public.facilities(id) not null,
  vehicle_number text not null,
  material_type text not null,
  estimated_weight numeric not null,
  status text default 'Pending' check (status in ('Pending', 'Completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.pickups enable row level security;
create policy "Users can view own pickups" on public.pickups for select using (auth.uid() = facility_id);
create policy "Users can insert own pickups" on public.pickups for insert with check (auth.uid() = facility_id);
create policy "Users can update own pickups" on public.pickups for update using (auth.uid() = facility_id);

-- 3. Processing Logs
create table public.processing_logs (
  id uuid default uuid_generate_v4() primary key,
  facility_id uuid references public.facilities(id) not null,
  input_material text not null,
  input_weight numeric not null,
  output_material text not null,
  output_weight numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.processing_logs enable row level security;
create policy "Users can view own logs" on public.processing_logs for select using (auth.uid() = facility_id);
create policy "Users can insert own logs" on public.processing_logs for insert with check (auth.uid() = facility_id);

-- 4. Documents
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  facility_id uuid references public.facilities(id) not null,
  file_name text not null,
  document_type text not null,
  file_url text not null,
  expiry_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.documents enable row level security;
create policy "Users can view own documents" on public.documents for select using (auth.uid() = facility_id);
create policy "Users can insert own documents" on public.documents for insert with check (auth.uid() = facility_id);
```

### Backend Integration Steps
1. **Client Setup**: Install `@supabase/supabase-js`, create `supabaseClient.ts` using Vite environment variables.
2. **Authentication Refactor**: Overhaul `AuthContext.tsx` to use `supabase.auth.signInWithPassword` and `supabase.auth.signOut`. Fix the logout routing bug to perfectly target `/`.
3. **Data Fetching**: Replace hardcoded states in Overview, Pickups, Documents, and Data Tracking with real fetches `supabase.from('tableName').select()`. Implement true "Zero States" for new users (e.g. 0 tons, empty lists).

## Verification Plan

### Automated / Browser Verification
- Use `npm run dev` to serve the application locally.
- Use the provided browser tools to verify that visual styling correctly implements the modern deep blue/safety green design without Tailwind.
- Verify user flows (Login -> Overview -> Nested Pages) via standard clicking and navigation testing.

### Manual Verification
- Request the user to launch `npm run dev` and open `http://localhost:5173` to test responsiveness and visual aesthetics on different screen sizes.
- Verify that Role switching (Recycler / Admin / Partner) correctly updates UI restrictions.
