create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

insert into public.admin_users (user_id)
select id
from auth.users
where email = 'tungninh88@gmail.com'
on conflict (user_id) do nothing;

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.product_releases (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  version text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  release_notes jsonb not null default '{"vi":"","en":""}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, version)
);

create table if not exists public.release_assets (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.product_releases(id) on delete cascade,
  platform text not null check (platform in ('windows', 'macos', 'linux', 'android', 'web', 'ios')),
  label text not null,
  download_url text not null check (download_url ~ '^https://'),
  file_name text,
  file_size text,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  download_count bigint not null default 0 check (download_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (release_id, download_url)
);

create index if not exists product_releases_product_idx
on public.product_releases (product_id, status, published_at desc);

create index if not exists release_assets_release_idx
on public.release_assets (release_id, sort_order);

drop trigger if exists product_releases_set_updated_at on public.product_releases;
create trigger product_releases_set_updated_at
before update on public.product_releases
for each row execute function public.set_updated_at();

drop trigger if exists release_assets_set_updated_at on public.release_assets;
create trigger release_assets_set_updated_at
before update on public.release_assets
for each row execute function public.set_updated_at();

alter table public.product_releases enable row level security;
alter table public.release_assets enable row level security;

drop policy if exists "Authenticated admins can read all products" on public.products;
drop policy if exists "Authenticated admins can insert products" on public.products;
drop policy if exists "Authenticated admins can update products" on public.products;

create policy "Allowlisted admins can read all products"
on public.products for select
to authenticated
using (public.is_admin());

create policy "Allowlisted admins can insert products"
on public.products for insert
to authenticated
with check (public.is_admin());

create policy "Allowlisted admins can update products"
on public.products for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Published releases are publicly readable"
on public.product_releases for select
using (
  status = 'published'
  and exists (
    select 1 from public.products
    where products.id = product_releases.product_id
      and products.status = 'published'
  )
);

create policy "Allowlisted admins manage releases"
on public.product_releases for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published release assets are publicly readable" on public.release_assets;

create policy "Allowlisted admins manage release assets"
on public.release_assets for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated admins can upload product assets" on storage.objects;
drop policy if exists "Authenticated admins can update product assets" on storage.objects;

create policy "Allowlisted admins can upload product assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-assets' and public.is_admin());

create policy "Allowlisted admins can update product assets"
on storage.objects for update
to authenticated
using (bucket_id = 'product-assets' and public.is_admin())
with check (bucket_id = 'product-assets' and public.is_admin());

create policy "Allowlisted admins can delete product assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-assets' and public.is_admin());

insert into public.product_releases (product_id, version, status, release_notes, published_at)
select
  id,
  coalesce(nullif(release_meta->>'version', ''), 'Latest'),
  status,
  '{"vi":"","en":""}'::jsonb,
  coalesce(published_at, now())
from public.products
where coalesce(links->>'download', '') <> ''
on conflict (product_id, version) do nothing;

insert into public.release_assets (
  release_id,
  platform,
  label,
  download_url,
  file_size,
  sort_order
)
select
  release.id,
  coalesce(product.platforms->>0, 'web'),
  coalesce(nullif(product.release_meta->>'size', ''), 'Download'),
  product.links->>'download',
  nullif(product.release_meta->>'size', ''),
  10
from public.products product
join public.product_releases release
  on release.product_id = product.id
 and release.version = coalesce(nullif(product.release_meta->>'version', ''), 'Latest')
where coalesce(product.links->>'download', '') <> ''
  and not exists (
    select 1
    from public.release_assets asset
    where asset.release_id = release.id
      and asset.download_url = product.links->>'download'
  );

update public.products
set links = links - 'download'
where links ? 'download';

create or replace function public.get_published_products(requested_slug text default null)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    jsonb_agg(
      (to_jsonb(product) - 'links')
      || jsonb_build_object('links', coalesce(product.links, '{}'::jsonb) - 'download')
      || jsonb_build_object(
        'product_releases',
        coalesce((
          select jsonb_agg(
            to_jsonb(release)
            || jsonb_build_object(
              'release_assets',
              coalesce((
                select jsonb_agg(
                  jsonb_build_object(
                    'id', asset.id,
                    'release_id', asset.release_id,
                    'platform', asset.platform,
                    'label', asset.label,
                    'file_name', asset.file_name,
                    'file_size', asset.file_size,
                    'sort_order', asset.sort_order,
                    'is_active', asset.is_active,
                    'download_count', asset.download_count
                  )
                  order by asset.sort_order, asset.created_at
                )
                from public.release_assets asset
                where asset.release_id = release.id
                  and asset.is_active
              ), '[]'::jsonb)
            )
            order by release.published_at desc nulls last, release.created_at desc
          )
          from public.product_releases release
          where release.product_id = product.id
            and release.status = 'published'
        ), '[]'::jsonb)
      )
      order by product.sort_order, product.created_at
    ),
    '[]'::jsonb
  )
  from public.products product
  where product.status = 'published'
    and (requested_slug is null or product.slug = requested_slug);
$$;

revoke all on function public.get_published_products(text) from public;
grant execute on function public.get_published_products(text) to anon, authenticated;

create or replace function public.save_product_release(
  input_product_id uuid,
  input_version text,
  input_status text,
  input_notes jsonb,
  input_published_at timestamptz,
  input_assets jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_release_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;
  if input_status not in ('draft', 'published') then
    raise exception 'Invalid release status';
  end if;

  insert into public.product_releases (
    product_id,
    version,
    status,
    release_notes,
    published_at
  )
  values (
    input_product_id,
    input_version,
    input_status,
    coalesce(input_notes, '{"vi":"","en":""}'::jsonb),
    input_published_at
  )
  on conflict (product_id, version) do update set
    status = excluded.status,
    release_notes = excluded.release_notes,
    published_at = excluded.published_at
  returning id into saved_release_id;

  update public.release_assets
  set is_active = false
  where release_id = saved_release_id;

  insert into public.release_assets (
    release_id,
    platform,
    label,
    download_url,
    file_size,
    sort_order,
    is_active
  )
  select
    saved_release_id,
    asset.platform,
    asset.label,
    asset.download_url,
    nullif(asset.file_size, ''),
    asset.sort_order,
    true
  from jsonb_to_recordset(coalesce(input_assets, '[]'::jsonb)) as asset(
    platform text,
    label text,
    download_url text,
    file_size text,
    sort_order integer
  )
  on conflict (release_id, download_url) do update set
    platform = excluded.platform,
    label = excluded.label,
    file_size = excluded.file_size,
    sort_order = excluded.sort_order,
    is_active = true;

  return saved_release_id;
end;
$$;

revoke all on function public.save_product_release(uuid, text, text, jsonb, timestamptz, jsonb) from public;
grant execute on function public.save_product_release(uuid, text, text, jsonb, timestamptz, jsonb) to authenticated;

create or replace function public.increment_download(asset_id uuid)
returns table (download_url text, download_count bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  update public.release_assets asset
  set download_count = asset.download_count + 1
  from public.product_releases release, public.products product
  where asset.id = asset_id
    and release.id = asset.release_id
    and product.id = release.product_id
    and release.status = 'published'
    and product.status = 'published'
    and asset.is_active
  returning asset.download_url, asset.download_count;
end;
$$;

revoke all on function public.increment_download(uuid) from public;
grant execute on function public.increment_download(uuid) to anon, authenticated;
