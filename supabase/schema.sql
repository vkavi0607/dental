create extension if not exists pgcrypto;

create table if not exists public.appointments (
    id uuid primary key default gen_random_uuid(),
    full_name text not null,
    email text not null,
    phone text not null,
    patient_type text not null check (patient_type in ('New Patient', 'Returning Patient')),
    preferred_date date not null,
    time_slot text not null,
    service text not null,
    dentist text not null default 'Any available dentist',
    payment_preference text,
    notes text,
    status text not null default 'requested' check (status in ('requested', 'confirmed', 'rescheduled', 'cancelled', 'completed')),
    source text not null default 'website',
    created_at timestamptz not null default now()
);

create index if not exists appointments_preferred_date_idx
    on public.appointments (preferred_date);

create index if not exists appointments_status_idx
    on public.appointments (status);

alter table public.appointments enable row level security;

drop policy if exists "Allow public appointment requests" on public.appointments;
create policy "Allow public appointment requests"
    on public.appointments
    for insert
    to anon
    with check (source = 'website' and status = 'requested');

drop policy if exists "Allow authenticated staff to read appointments" on public.appointments;
create policy "Allow authenticated staff to read appointments"
    on public.appointments
    for select
    to authenticated
    using (true);

drop policy if exists "Allow authenticated staff to update appointments" on public.appointments;
create policy "Allow authenticated staff to update appointments"
    on public.appointments
    for update
    to authenticated
    using (true)
    with check (true);
