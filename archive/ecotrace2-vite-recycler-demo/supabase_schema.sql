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
