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
  -- Legado: pedidos de un solo producto. Los productos del pedido ahora viven en order_items.
  product_id    uuid references public.products(id),
  product_slug  text,
  product_name  text,
  unit_price    integer check (unit_price > 0),
  quantity      integer check (quantity between 1 and 5),
  total         integer not null,                                 -- suma de los subtotales de order_items
  name          text not null,
  phone         text not null check (phone ~ '^\+5989[0-9]{7}$'),
  department    text not null,
  city          text not null,
  address       text not null,
  payment_method text not null default 'cash'
                check (payment_method in ('cash', 'transfer', 'mercadopago')),
  notes         text,
  status        text not null default 'pending'
                check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Bases creadas antes de agregar el método de pago
alter table public.orders add column if not exists payment_method text not null default 'cash'
  check (payment_method in ('cash', 'transfer', 'mercadopago'));

-- Bases creadas antes de los pedidos con varios productos
alter table public.orders
  alter column product_id   drop not null,
  alter column product_slug drop not null,
  alter column product_name drop not null,
  alter column unit_price   drop not null,
  alter column quantity     drop not null;
alter table public.orders drop constraint if exists orders_total_check;
alter table public.orders drop constraint if exists orders_total_positive;
alter table public.orders add constraint orders_total_positive check (total > 0);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_phone_idx on public.orders (phone);

-- ───────────── Productos de cada pedido ─────────────
create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  line          smallint not null default 0,                      -- orden en el pedido; 0 = el de la página
  product_id    uuid not null references public.products(id),
  product_slug  text not null,
  product_name  text not null,                                    -- copia al momento de la compra
  unit_price    integer not null check (unit_price > 0),
  quantity      integer not null check (quantity between 1 and 5),
  subtotal      integer not null check (subtotal = unit_price * quantity),
  created_at    timestamptz not null default now(),
  unique (order_id, product_id)
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- Pasa los pedidos viejos (un solo producto) a order_items. No duplica si se corre de nuevo.
insert into public.order_items (order_id, line, product_id, product_slug, product_name, unit_price, quantity, subtotal, created_at)
select o.id, 0, o.product_id, o.product_slug, o.product_name, o.unit_price, o.quantity, o.unit_price * o.quantity, o.created_at
from public.orders o
where o.product_id is not null
  and not exists (select 1 from public.order_items i where i.order_id = o.id);

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
-- Con RLS activo y sin políticas para "orders" ni "order_items", la clave pública (anon) no puede leer ni escribir pedidos.
alter table public.products enable row level security;
alter table public.orders   enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "productos activos son públicos" on public.products;
create policy "productos activos son públicos" on public.products
  for select to anon, authenticated using (active);
