-- BhoomiSetu premium owner contact + private legal documents.
-- Run after 001_bhoomisetu_platform.sql.

alter table public.lands
  add column if not exists owner_phone text,
  add column if not exists survey_number text,
  add column if not exists legal_documents jsonb not null default '[]'::jsonb;

insert into storage.buckets (id, name, public)
values ('land-documents', 'land-documents', false)
on conflict (id) do update set public = false;

drop policy if exists "owners upload their legal documents" on storage.objects;
create policy "owners upload their legal documents"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'land-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "owners update their legal documents" on storage.objects;
create policy "owners update their legal documents"
on storage.objects for update
to authenticated
using (
  bucket_id = 'land-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'land-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "owners delete their legal documents" on storage.objects;
create policy "owners delete their legal documents"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'land-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);
