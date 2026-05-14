
-- Roles enum and table (security best practice: roles in separate table)
create type public.app_role as enum ('admin', 'farmer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  district text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table public.saved_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  crop text not null,
  district text not null,
  season text not null,
  advice text not null,
  created_at timestamptz not null default now()
);

-- Security definer function to check role (avoids recursive RLS)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.saved_recommendations enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles
  for select using (public.has_role(auth.uid(), 'admin'));
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- user_roles policies (read-only from client; assignment via trigger or admin)
create policy "Users can view own roles" on public.user_roles
  for select using (auth.uid() = user_id);
create policy "Admins can view all roles" on public.user_roles
  for select using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can manage roles" on public.user_roles
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- saved_recommendations policies
create policy "Users can view own recommendations" on public.saved_recommendations
  for select using (auth.uid() = user_id);
create policy "Admins can view all recommendations" on public.saved_recommendations
  for select using (public.has_role(auth.uid(), 'admin'));
create policy "Users can insert own recommendations" on public.saved_recommendations
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own recommendations" on public.saved_recommendations
  for delete using (auth.uid() = user_id);

-- Trigger: auto-create profile + assign 'farmer' role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, district, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'district',
    new.raw_user_meta_data ->> 'phone'
  );
  insert into public.user_roles (user_id, role)
  values (new.id, 'farmer');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger for profiles
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
