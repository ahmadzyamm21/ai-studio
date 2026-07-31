create extension if not exists "pgcrypto";
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  product_code text not null,
  name text not null,
  brand text,
  product_dna jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(owner_id, product_code)
);
create table if not exists prompts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade,
  scene_code text,
  camera_code text,
  lighting_code text,
  platform text,
  prompt_text text not null,
  score int check (score between 1 and 5),
  created_at timestamptz not null default now()
);
alter table products enable row level security;
alter table prompts enable row level security;
create policy "owners manage products" on products for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage prompts" on prompts for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
