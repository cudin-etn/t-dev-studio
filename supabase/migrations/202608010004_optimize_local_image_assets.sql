-- Use the optimized local image assets without overwriting images an editor has
-- already replaced in the CMS. The original PNGs remain available for rollback.

update public.products
set
  assets = jsonb_build_object(
    'logo', '/products/flashflow.webp',
    'hero', '/products/flashflow.webp',
    'og', '/og-banner.jpg'
  ),
  screenshots = '[{"url":"/products/flashflow.webp","alt":{"vi":"FlashFlow interface preview","en":"FlashFlow interface preview"}}]'::jsonb
where slug = 'flashflow'
  and assets = '{"logo":"/products/flashflow.png","hero":"/products/flashflow.png","og":"/og.png"}'::jsonb;

update public.products
set
  assets = jsonb_build_object(
    'logo', '/products/fboard.webp',
    'hero', '/products/fboard.webp',
    'og', '/og-banner.jpg'
  ),
  screenshots = '[{"url":"/products/fboard.webp","alt":{"vi":"FBoard interface preview","en":"FBoard interface preview"}}]'::jsonb
where slug = 'fboard'
  and assets = '{"logo":"/products/fboard.png","hero":"/products/fboard.png","og":"/og.png"}'::jsonb;

update public.products
set
  assets = jsonb_build_object(
    'logo', '/products/macos-flasher.webp',
    'hero', '/products/macos-flasher.webp',
    'og', '/og-banner.jpg'
  ),
  screenshots = '[{"url":"/products/macos-flasher.webp","alt":{"vi":"macOS Flasher interface preview","en":"macOS Flasher interface preview"}}]'::jsonb
where slug = 'macos-flasher'
  and assets = '{"logo":"/products/macos-flasher.png","hero":"/products/macos-flasher.png","og":"/og.png"}'::jsonb;

update public.products
set
  assets = jsonb_build_object(
    'logo', '/og.webp',
    'hero', '/og.webp',
    'og', '/og-banner.jpg'
  ),
  screenshots = '[{"url":"/og.webp","alt":{"vi":"Ddrop interface preview","en":"Ddrop interface preview"}}]'::jsonb
where slug = 'ddrop'
  and assets = '{"logo":"/og.png","hero":"/og.png","og":"/og.png"}'::jsonb;
