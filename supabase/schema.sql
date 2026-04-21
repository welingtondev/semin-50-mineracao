create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  nickname text not null,
  max_score integer default 0,
  created_at timestamp with time zone default now()
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  pergunta text not null,
  alternativas text[] not null,
  corretas integer[] not null,
  dificuldade text check (dificuldade in ('facil','medio','dificil')) not null,
  created_at timestamp with time zone default now()
);

create table matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  score integer not null,
  duration_ms integer not null,
  answers jsonb not null,
  created_at timestamp with time zone default now()
);

create table share_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  tipo text not null,
  imagem_url text not null,
  created_at timestamp with time zone default now()
);

-- Row Level Security policies (example)
alter table users enable row level security;
create policy "users can read own" on users for select using (auth.uid() = id);
create policy "users can update own" on users for update using (auth.uid() = id);

alter table matches enable row level security;
create policy "matches can read own" on matches for select using (auth.uid() = user_id);
create policy "matches can insert own" on matches for insert with check (auth.uid() = user_id);
