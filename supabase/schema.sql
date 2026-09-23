-- Llevalo UY — esquema de base de datos
-- Pegalo en Supabase → SQL Editor → Run. Se puede correr más de una vez.

-- ───────────── Productos ─────────────
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name             text not null,
  tagline          text not null default '',
  price            integer not null check (price > 0),            -- UYU, entero
  compare_at_price integer check (compare_at_price is null or compare_at_price > 0),
  images           text[] not null default '{}',
  benefits         jsonb not null default '[]'::jsonb,           -- [{icon, text}]
  description      text not null default '',
  faqs             jsonb not null default '[]'::jsonb,           -- [{q, a}]
  reviews          jsonb not null default '[]'::jsonb,           -- [{name, city, rating, text}]
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ───────────── Pedidos ─────────────
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,                             -- LL-XXXXXXXX, el que ve el cliente
  product_id    uuid not null references public.products(id),
  product_slug  text not null,
  product_name  text not null,                                    -- copia al momento de la compra
  unit_price    integer not null check (unit_price > 0),
  quantity      integer not null check (quantity between 1 and 5),
  total         integer not null check (total = unit_price * quantity),
  name          text not null,
  phone         text not null check (phone ~ '^\+5989[0-9]{7}$'),
  department    text not null,
  city          text not null,
  address       text not null,
  notes         text,
  status        text not null default 'pending'
                check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_phone_idx on public.orders (phone);

-- ───────────── updated_at automático ─────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- ───────────── Seguridad (RLS) ─────────────
-- La web accede solo desde el servidor con la service_role key.
-- Con RLS activo y sin políticas para "orders", la clave pública (anon) no puede leer ni escribir pedidos.
alter table public.products enable row level security;
alter table public.orders   enable row level security;

drop policy if exists "productos activos son públicos" on public.products;
create policy "productos activos son públicos" on public.products
  for select to anon, authenticated using (active);
