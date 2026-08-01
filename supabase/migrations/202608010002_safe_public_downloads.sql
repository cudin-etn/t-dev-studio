-- Public downloads should not create an anonymous database write on every click.
-- Keep the old counter function private until a rate-limited analytics path exists.

revoke all on function public.increment_download(uuid) from anon;
revoke all on function public.increment_download(uuid) from authenticated;

create or replace function public.get_public_download_asset(asset_id uuid)
returns table (download_url text)
language sql
stable
security definer
set search_path = public
as $$
  select asset.download_url
  from public.release_assets asset
  join public.product_releases release on release.id = asset.release_id
  join public.products product on product.id = release.product_id
  where asset.id = asset_id
    and release.status = 'published'
    and product.status = 'published'
    and asset.is_active;
$$;

revoke all on function public.get_public_download_asset(uuid) from public;
grant execute on function public.get_public_download_asset(uuid) to anon, authenticated;
