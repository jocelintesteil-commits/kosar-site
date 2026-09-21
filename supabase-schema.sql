-- Run this in Supabase: Project > SQL Editor > New query > paste > Run

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  onboarded boolean default false,
  avoid text default '',
  budget_eur numeric default 25,
  servings int default 3,
  equipment text[] default '{}',
  time_pref text default 'depend',
  effort text default 'normal',
  weekend text default 'home',
  stores text default 'Lidl, Aldi, Tesco',
  country text default 'Hongrie',
  updated_at timestamptz default now()
);

create table if not exists weeks (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  week_number int not null,
  created_at timestamptz default now(),
  servings int,
  total_estimate_eur numeric,
  shopping_list jsonb default '[]',
  dishes jsonb default '[]',
  notes text,
  unique (user_id, week_number)
);

alter table profiles enable row level security;
alter table weeks enable row level security;

-- Each user can only see and edit their own rows.
create policy "own profile select" on profiles for select using (auth.uid() = user_id);
create policy "own profile upsert" on profiles for insert with check (auth.uid() = user_id);
create policy "own profile update" on profiles for update using (auth.uid() = user_id);

create policy "own weeks select" on weeks for select using (auth.uid() = user_id);
create policy "own weeks insert" on weeks for insert with check (auth.uid() = user_id);
create policy "own weeks update" on weeks for update using (auth.uid() = user_id);
