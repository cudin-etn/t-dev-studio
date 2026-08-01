-- Save product content and its edited release in one database transaction.
-- The expected timestamp prevents an older admin tab from overwriting a newer save.

create or replace function public.save_admin_product(
  input_product_id uuid,
  input_expected_updated_at timestamptz,
  input_product jsonb,
  input_release jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_product public.products%rowtype;
begin
  if not public.is_admin() then
    raise exception 'NOT_AUTHORIZED';
  end if;

  if input_product is null then
    raise exception 'INVALID_PRODUCT';
  end if;

  if input_product_id is null then
    insert into public.products (
      slug, status, sort_order, featured, category, accent, accent_color,
      localized_content, platforms, chips, features, assets, screenshots,
      links, release_meta, seo, published_at, case_study_challenge,
      case_study_approach, case_study_highlights, case_study_results,
      case_study_role, case_study_duration, case_study_links
    ) values (
      input_product->>'slug',
      coalesce(input_product->>'status', 'draft'),
      coalesce((input_product->>'sort_order')::integer, 100),
      coalesce((input_product->>'featured')::boolean, false),
      coalesce(input_product->>'category', 'Product'),
      coalesce(input_product->>'accent', 'indigo'),
      coalesce(input_product->>'accent_color', '#4f46e5'),
      coalesce(input_product->'localized_content', '{}'::jsonb),
      coalesce(input_product->'platforms', '[]'::jsonb),
      coalesce(input_product->'chips', '[]'::jsonb),
      coalesce(input_product->'features', '[]'::jsonb),
      coalesce(input_product->'assets', '{}'::jsonb),
      coalesce(input_product->'screenshots', '[]'::jsonb),
      coalesce(input_product->'links', '{}'::jsonb),
      coalesce(input_product->'release_meta', '{}'::jsonb),
      coalesce(input_product->'seo', '{}'::jsonb),
      nullif(input_product->>'published_at', '')::timestamptz,
      coalesce(input_product->'case_study_challenge', '{"vi":"","en":""}'::jsonb),
      coalesce(input_product->'case_study_approach', '{"vi":"","en":""}'::jsonb),
      coalesce(input_product->'case_study_highlights', '[]'::jsonb),
      coalesce(input_product->'case_study_results', '[]'::jsonb),
      nullif(input_product->>'case_study_role', ''),
      nullif(input_product->>'case_study_duration', ''),
      coalesce(input_product->'case_study_links', '{}'::jsonb)
    )
    returning * into saved_product;
  else
    if input_expected_updated_at is null then
      raise exception 'STALE_WRITE';
    end if;

    update public.products
    set
      slug = input_product->>'slug',
      status = coalesce(input_product->>'status', 'draft'),
      sort_order = coalesce((input_product->>'sort_order')::integer, 100),
      featured = coalesce((input_product->>'featured')::boolean, false),
      category = coalesce(input_product->>'category', 'Product'),
      accent = coalesce(input_product->>'accent', 'indigo'),
      accent_color = coalesce(input_product->>'accent_color', '#4f46e5'),
      localized_content = coalesce(input_product->'localized_content', '{}'::jsonb),
      platforms = coalesce(input_product->'platforms', '[]'::jsonb),
      chips = coalesce(input_product->'chips', '[]'::jsonb),
      features = coalesce(input_product->'features', '[]'::jsonb),
      assets = coalesce(input_product->'assets', '{}'::jsonb),
      screenshots = coalesce(input_product->'screenshots', '[]'::jsonb),
      links = coalesce(input_product->'links', '{}'::jsonb),
      release_meta = coalesce(input_product->'release_meta', '{}'::jsonb),
      seo = coalesce(input_product->'seo', '{}'::jsonb),
      published_at = nullif(input_product->>'published_at', '')::timestamptz,
      case_study_challenge = coalesce(input_product->'case_study_challenge', '{"vi":"","en":""}'::jsonb),
      case_study_approach = coalesce(input_product->'case_study_approach', '{"vi":"","en":""}'::jsonb),
      case_study_highlights = coalesce(input_product->'case_study_highlights', '[]'::jsonb),
      case_study_results = coalesce(input_product->'case_study_results', '[]'::jsonb),
      case_study_role = nullif(input_product->>'case_study_role', ''),
      case_study_duration = nullif(input_product->>'case_study_duration', ''),
      case_study_links = coalesce(input_product->'case_study_links', '{}'::jsonb)
    where id = input_product_id
      and updated_at = input_expected_updated_at
    returning * into saved_product;

    if not found then
      if exists (select 1 from public.products where id = input_product_id) then
        raise exception 'STALE_WRITE';
      end if;
      raise exception 'PRODUCT_NOT_FOUND';
    end if;
  end if;

  if input_release->>'operation' = 'deactivate' then
    update public.product_releases
    set status = 'draft', published_at = null
    where product_id = saved_product.id;

    update public.release_assets asset
    set is_active = false
    from public.product_releases release
    where release.id = asset.release_id
      and release.product_id = saved_product.id;
  elsif input_release is not null and coalesce(input_release->>'version', '') <> '' then
    perform public.save_product_release(
      saved_product.id,
      input_release->>'version',
      coalesce(input_release->>'status', 'draft'),
      coalesce(input_release->'notes', '{"vi":"","en":""}'::jsonb),
      nullif(input_release->>'published_at', '')::timestamptz,
      coalesce(input_release->'assets', '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'id', saved_product.id,
    'updated_at', saved_product.updated_at
  );
end;
$$;

revoke all on function public.save_admin_product(uuid, timestamptz, jsonb, jsonb) from public;
grant execute on function public.save_admin_product(uuid, timestamptz, jsonb, jsonb) to authenticated;

-- Prevent release-only writes from bypassing the product stale-write token.
-- save_admin_product is SECURITY DEFINER and can still call this helper.
revoke execute on function public.save_product_release(uuid, text, text, jsonb, timestamptz, jsonb) from authenticated;
