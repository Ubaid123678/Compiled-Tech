begin;

drop policy if exists "Public can subscribe" on public.newsletter;
revoke insert on public.newsletter from anon, authenticated;

create table if not exists public.newsletter_pending (
  id uuid primary key,
  email text unique not null,
  requested_at timestamptz not null default now()
);

alter table public.newsletter_pending enable row level security;
revoke all on public.newsletter_pending from anon, authenticated;
grant select, insert, update, delete on public.newsletter_pending to service_role;

create or replace function public.request_newsletter_confirmation(address text, request_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from public.newsletter_pending where requested_at < now() - interval '24 hours';

  if exists (select 1 from public.newsletter where lower(email) = address) then
    return false;
  end if;

  insert into public.newsletter_pending (id, email)
  values (request_id, address)
  on conflict (email) do update
    set id = excluded.id, requested_at = excluded.requested_at
    where public.newsletter_pending.requested_at <= now() - interval '15 minutes';

  return found;
end;
$$;

create or replace function public.confirm_newsletter_subscription(request_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare subscriber_email text;
begin
  delete from public.newsletter_pending
    where id = request_id and requested_at >= now() - interval '24 hours'
    returning email into subscriber_email;

  if not found then
    return exists (select 1 from public.newsletter where id = request_id);
  end if;

  insert into public.newsletter (id, email) values (request_id, subscriber_email)
  on conflict (email) do nothing;
  return true;
end;
$$;

revoke all on function public.request_newsletter_confirmation(text, uuid) from public, anon, authenticated;
revoke all on function public.confirm_newsletter_subscription(uuid) from public, anon, authenticated;
grant execute on function public.request_newsletter_confirmation(text, uuid) to service_role;
grant execute on function public.confirm_newsletter_subscription(uuid) to service_role;

commit;
