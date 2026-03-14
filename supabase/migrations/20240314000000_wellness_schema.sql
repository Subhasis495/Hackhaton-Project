-- Create tables for Wellness Nudge

-- 1. Profiles (matches auth.users via trigger)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  points integer default 0,
  current_streak integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Break Logs (Stores individual stretch/hydrate/breathe acts)
create table public.break_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  break_type text not null, -- 'hydration', 'breathing', 'stretching'
  points_earned integer not null default 0,
  duration_seconds integer,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Daily Stats (Aggregated tracking per day per user)
create table public.daily_stats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null default current_date,
  hydration_count integer default 0,
  breathing_count integer default 0,
  stretching_count integer default 0,
  unique(user_id, date)
);

-- 4. Burnout Assessments
create table public.burnout_assessments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  score integer not null,
  assessment_date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.break_logs enable row level security;
alter table public.daily_stats enable row level security;
alter table public.burnout_assessments enable row level security;

-- RLS Policies

-- Profiles: Users can read and update their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Break Logs: Users can only see and insert their own logs
create policy "Users can view own break logs" on public.break_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert own break logs" on public.break_logs
  for insert with check (auth.uid() = user_id);

-- Daily Stats: Users can view and update their own daily stats
create policy "Users can view own daily stats" on public.daily_stats
  for select using (auth.uid() = user_id);

create policy "Users can insert own daily stats" on public.daily_stats
  for insert with check (auth.uid() = user_id);

create policy "Users can update own daily stats" on public.daily_stats
  for update using (auth.uid() = user_id);

-- Burnout Assessments: Users can see and insert their own assessments
create policy "Users can view own burnout assessments" on public.burnout_assessments
  for select using (auth.uid() = user_id);

create policy "Users can insert own burnout assessments" on public.burnout_assessments
  for insert with check (auth.uid() = user_id);

-- Trigger for auto-creating Profile when Auth User is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, points, current_streak)
  values (new.id, new.raw_user_meta_data->>'full_name', 0, 0);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
