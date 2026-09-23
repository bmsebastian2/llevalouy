-- Bucket público para las fotos de productos.
-- Pegalo en Supabase → SQL Editor → Run. Se puede correr más de una vez.
-- Lectura pública (las fotos se ven en el sitio). Subidas solo desde el panel, vía URL firmada por el servidor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('products', 'products', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
