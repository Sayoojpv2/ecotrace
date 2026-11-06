-- =====================================================================
-- DRAFT ONLY. NOT APPLIED TO ANY DATABASE.
-- Written during the Nov 2026 recovery from code inspection alone.
-- The live schema, trigger and policy names are UNKNOWN. Read the real
-- definitions in the Supabase dashboard first, adapt names, test on a
-- fresh/staging project, and take a backup before running anything.
-- See docs/SECURITY_REVIEW.md (S1-S5).
-- =====================================================================

-- S1: never trust a role coming from signup metadata.
-- Replace the body of your existing auth.users -> profiles trigger with
-- something like this (function name is a guess):
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  requested text := coalesce(new.raw_user_meta_data->>'role', 'institution');
begin
  insert into public.profiles (id, org_name, city, phone, role)
  values (
    new.id,
    new.raw_user_meta_data->>'org_name',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'phone',
    case when requested in ('institution', 'handler') then requested else 'institution' end
  );
  return new;
end $$;

-- S2: users must not be able to change their own role.
create or replace function public.block_role_change()
returns trigger language plpgsql as $$
begin
  if new.role is distinct from old.role and current_user = 'authenticated' then
    raise exception 'role cannot be changed by the user';
  end if;
  return new;
end $$;
drop trigger if exists profiles_block_role_change on public.profiles;
create trigger profiles_block_role_change before update on public.profiles
  for each row execute function public.block_role_change();

-- Helper used by policies below.
create or replace function public.current_role_is(r text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = r)
$$;

-- S3/S8: only admins may delete evidence (consider soft-delete instead).
-- (Inspect and drop any broader existing DELETE policies first.)
-- create policy "admin delete activities" on public.activities
--   for delete using (public.current_role_is('admin'));

-- S4: OTPs must not be readable by handlers.
-- alter table public.waste_logs enable row level security;
-- revoke select on public.waste_logs from authenticated;
-- Then generate/verify OTPs only inside security definer RPCs,
-- store a hash (e.g. crypt(otp, gen_salt('bf')) from pgcrypto), add expiry
-- and an attempt counter.

-- S5: make evidence buckets private and use signed URLs in the app.
-- update storage.buckets set public = false
--   where id in ('verification_photos', 'handler_docs', 'documents');
-- (App code must switch from getPublicUrl() to createSignedUrl() first,
--  and rows that store full public URLs need migrating to paths.)
