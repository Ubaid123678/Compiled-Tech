begin;

alter table public.leads enable row level security;
alter table public.leads
  add column if not exists request_id uuid,
  add column if not exists request_fingerprint text,
  add column if not exists admin_email_id text,
  add column if not exists customer_email_id text;

create unique index if not exists leads_request_id_key on public.leads (request_id);
revoke all on public.leads from anon, authenticated;

commit;
