-- SmartSpend initial schema
-- Run this in your Supabase SQL editor or via `supabase db push`

-- Enable UUID extension (already enabled in Supabase by default)
create extension if not exists "uuid-ossp";

-- ── Profiles ──────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  xp          integer default 0 not null,
  streak      integer default 0 not null,
  last_logged date,
  is_pro      boolean default false not null,
  theme       text default 'forest' not null,
  acc         text default 'hat' not null,
  toggles     jsonb default '[true,true,true,true]'::jsonb not null,
  created_at  timestamptz default now() not null
);

alter table profiles enable row level security;

create policy "Users can read their own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- Auto-create profile on sign-up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Transactions ──────────────────────────────────────────────────────────────
create table if not exists transactions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references profiles(id) on delete cascade not null,
  type       text check (type in ('income', 'expense')) not null,
  amount     numeric(10,2) not null,
  category   text not null,
  note       text default '' not null,
  date       date not null,
  created_at timestamptz default now() not null
);

alter table transactions enable row level security;

create policy "Users can manage their own transactions"
  on transactions for all using (auth.uid() = user_id);

-- ── Budgets ───────────────────────────────────────────────────────────────────
create table if not exists budgets (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references profiles(id) on delete cascade not null,
  category     text not null,
  limit_amount numeric(10,2) not null,
  created_at   timestamptz default now() not null,
  unique(user_id, category)
);

alter table budgets enable row level security;

create policy "Users can manage their own budgets"
  on budgets for all using (auth.uid() = user_id);

-- ── Savings Goals ─────────────────────────────────────────────────────────────
create table if not exists savings_goals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references profiles(id) on delete cascade not null,
  title         text not null,
  emoji         text default '🎯' not null,
  target_amount numeric(10,2) not null,
  saved_amount  numeric(10,2) default 0 not null,
  color         text default '#7B5CF5' not null,
  color_light   text default '#EDE9FE' not null,
  color_dark    text default '#4C1D95' not null,
  created_at    timestamptz default now() not null
);

alter table savings_goals enable row level security;

create policy "Users can manage their own savings goals"
  on savings_goals for all using (auth.uid() = user_id);
