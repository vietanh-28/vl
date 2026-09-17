create extension if not exists pgcrypto;

create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  license_key text unique not null,
  status text not null default 'active' check (status in ('active','blocked')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  note text not null default '',
  last_seen_at timestamptz,
  last_machine_id text,
  use_count bigint not null default 0
);

create index if not exists licenses_key_idx on public.licenses (license_key);
create index if not exists licenses_expires_idx on public.licenses (expires_at);

alter table public.licenses enable row level security;

-- Không tạo policy public. API server dùng SERVICE ROLE để quản lý bảng.
