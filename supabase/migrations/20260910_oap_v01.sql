-- Open Anomaly Project V0.1 schema
-- Apply ONLY to a dedicated OAP Supabase project (not shared UGN DBs).

create extension if not exists postgis;
create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  home_region_coarse text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.provider_credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null,
  encrypted_secret_reference text not null,
  display_hint text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_verified_at timestamptz
);

create table if not exists public.agent_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  display_name text not null,
  agent_type text not null default 'manual',
  provider_credential_id uuid references public.provider_credentials (id) on delete set null,
  endpoint text,
  model text,
  capabilities jsonb not null default '[]'::jsonb,
  subscription_preferences jsonb not null default '{}'::jsonb,
  autonomy_level text not null default 'on_demand',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.alert_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  live_verification boolean not null default true,
  categories text[] not null default '{}',
  morphologies text[] not null default '{}',
  radius_km double precision not null default 50,
  worldwide boolean not null default false,
  push_subscription jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id text primary key,
  title text not null,
  category text not null,
  subcategory text,
  observed_morphology text[] not null default '{}',
  tags text[] not null default '{}',
  location geography(Point, 4326),
  latitude double precision not null,
  longitude double precision not null,
  altitude_m double precision,
  location_accuracy_m double precision,
  location_uncertainty_radius_m double precision,
  location_precision text,
  start_time timestamptz,
  end_time timestamptz,
  time_precision text,
  reported_at timestamptz not null default now(),
  description text not null default '',
  summary text,
  status text not null,
  is_live boolean not null default false,
  is_historical boolean not null default false,
  source_links jsonb not null default '[]'::jsonb,
  event_confidence double precision not null default 0.2,
  resolution jsonb,
  original_reporter_id uuid references auth.users (id) on delete set null,
  moderation_state text not null default 'visible',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_reviewed_at timestamptz
);

create index if not exists events_location_gix on public.events using gist (location);
create index if not exists events_status_idx on public.events (status);
create index if not exists events_reported_at_idx on public.events (reported_at desc);

create table if not exists public.observations (
  id text primary key,
  event_id text not null references public.events (id) on delete cascade,
  submitter_id uuid references auth.users (id) on delete set null,
  visibility text,
  description text not null default '',
  media_url text,
  platform text,
  sensor_package jsonb not null default '[]'::jsonb,
  internal_location geography(Point, 4326),
  public_location geography(Point, 4326),
  privacy_radius_m double precision not null default 1000,
  public_exact boolean not null default false,
  captured_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.evidence (
  id text primary key,
  event_id text not null references public.events (id) on delete cascade,
  observation_id text references public.observations (id) on delete set null,
  type text not null,
  source text,
  source_url text,
  raw_claim text,
  normalized_finding text,
  confidence double precision,
  submitter_id uuid references auth.users (id) on delete set null,
  agent_id uuid references public.agent_profiles (id) on delete set null,
  provenance jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.hypotheses (
  id text primary key,
  event_id text not null references public.events (id) on delete cascade,
  mechanism text not null,
  summary text,
  confidence double precision,
  status text not null default 'open',
  created_by uuid references auth.users (id) on delete set null,
  agent_id uuid references public.agent_profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.investigations (
  id text primary key,
  event_id text not null references public.events (id) on delete cascade,
  investigator_type text not null,
  investigator_id text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  checks_performed jsonb not null default '[]'::jsonb,
  evidence_used jsonb not null default '[]'::jsonb,
  hypotheses_considered jsonb not null default '[]'::jsonb,
  conclusion text,
  confidence double precision,
  limitations text,
  sources jsonb not null default '[]'::jsonb,
  evidence_cone jsonb
);

create table if not exists public.event_status_history (
  id bigserial primary key,
  event_id text not null references public.events (id) on delete cascade,
  status text not null,
  note text,
  at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
alter table public.provider_credentials enable row level security;
alter table public.agent_profiles enable row level security;
alter table public.alert_subscriptions enable row level security;
alter table public.events enable row level security;
alter table public.observations enable row level security;
alter table public.evidence enable row level security;
alter table public.hypotheses enable row level security;
alter table public.investigations enable row level security;
alter table public.event_status_history enable row level security;

-- Public browse of visible events; writes require auth (refine in dedicated project).
create policy events_public_read on public.events
  for select using (moderation_state = 'visible');

create policy events_auth_insert on public.events
  for insert to authenticated with check (true);

create policy credentials_owner_all on public.provider_credentials
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy agents_owner_all on public.agent_profiles
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy subscriptions_owner_all on public.alert_subscriptions
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
