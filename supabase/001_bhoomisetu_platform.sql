-- BhoomiSetu production additions.
-- Run this in Supabase SQL Editor before using image uploads and payments.

alter table public.lands
  add column if not exists image_urls jsonb not null default '[]'::jsonb;

create table if not exists public.land_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  land_id text not null references public.lands(id) on delete cascade,
  razorpay_order_id text not null unique,
  razorpay_payment_id text unique,
  amount_inr numeric(12,2) not null,
  status text not null default 'created' check (status in ('created','paid','failed','refunded')),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists land_purchases_user_land_idx on public.land_purchases(user_id, land_id);
create index if not exists land_purchases_status_idx on public.land_purchases(status);

alter table public.land_purchases enable row level security;

drop policy if exists "users can read their own purchases" on public.land_purchases;

create policy "users can read their own purchases"
on public.land_purchases for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can create their own purchase rows" on public.land_purchases;

create policy "users can create their own purchase rows"
on public.land_purchases for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can update their own purchase rows" on public.land_purchases;

create policy "users can update their own purchase rows"
on public.land_purchases for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('land-images', 'land-images', true)
on conflict (id) do update set public = true;

drop policy if exists "authenticated users upload land images into their folder" on storage.objects;

create policy "authenticated users upload land images into their folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'land-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "owners can update their land images" on storage.objects;

create policy "owners can update their land images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'land-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'land-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "owners can delete their land images" on storage.objects;

create policy "owners can delete their land images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'land-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
