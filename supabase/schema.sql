-- ==============================================================================
-- CROP WISE – DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text default 'Farmer Friend',
  preferred_language text default 'en',
  farm_location text,
  farm_size_acres numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 2. ANALYSES TABLE (CROP DIAGNOSIS HISTORY)
create table if not exists public.analyses (
  id text primary key,
  user_id uuid references auth.users on delete cascade,
  crop_name text not null,
  disease_name text not null,
  scientific_name text,
  confidence integer not null default 90,
  severity text not null check (severity in ('Low', 'Medium', 'High', 'Healthy')),
  symptoms jsonb default '[]'::jsonb,
  possible_causes jsonb default '[]'::jsonb,
  recommended_care jsonb default '{}'::jsonb,
  prevention jsonb default '[]'::jsonb,
  image_url text not null,
  notes text,
  is_demo boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for analyses
alter table public.analyses enable row level security;

-- Analyses Policies
create policy "Users can view their own analyses"
  on public.analyses for select
  using (auth.uid() = user_id or user_id is null);

create policy "Users can insert their own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can delete their own analyses"
  on public.analyses for delete
  using (auth.uid() = user_id);

-- Indexes for lightning fast queries
create index if not exists analyses_user_id_idx on public.analyses(user_id);
create index if not exists analyses_created_at_idx on public.analyses(created_at desc);
create index if not exists analyses_crop_name_idx on public.analyses(crop_name);

-- 3. AUTO PROFILE TRIGGER ON SIGN UP
create or replace function public.handle_new_user()
returns trigger as 
begin
  insert into public.profiles (id, full_name, preferred_language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Farmer Friend'),
    coalesce(new.raw_user_meta_data->>'preferred_language', 'en')
  );
  return new;
end;
 language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
