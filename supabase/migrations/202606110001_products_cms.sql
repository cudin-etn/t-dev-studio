create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 100,
  featured boolean not null default false,
  category text not null default 'Product',
  accent text not null default 'indigo',
  accent_color text not null default '#4f46e5',
  localized_content jsonb not null default '{}'::jsonb,
  platforms jsonb not null default '[]'::jsonb,
  chips jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  assets jsonb not null default '{}'::jsonb,
  screenshots jsonb not null default '[]'::jsonb,
  links jsonb not null default '{}'::jsonb,
  release_meta jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_status_sort_idx on public.products (status, sort_order);
create index if not exists products_slug_idx on public.products (slug);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

alter table public.products enable row level security;

drop policy if exists "Published products are publicly readable" on public.products;
create policy "Published products are publicly readable"
on public.products for select
using (status = 'published');

drop policy if exists "Authenticated admins can read all products" on public.products;
create policy "Authenticated admins can read all products"
on public.products for select
to authenticated
using (true);

drop policy if exists "Authenticated admins can insert products" on public.products;
create policy "Authenticated admins can insert products"
on public.products for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admins can update products" on public.products;
create policy "Authenticated admins can update products"
on public.products for update
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('product-assets', 'product-assets', true)
on conflict (id) do nothing;

drop policy if exists "Product assets are public" on storage.objects;
create policy "Product assets are public"
on storage.objects for select
using (bucket_id = 'product-assets');

drop policy if exists "Authenticated admins can upload product assets" on storage.objects;
create policy "Authenticated admins can upload product assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-assets');

drop policy if exists "Authenticated admins can update product assets" on storage.objects;
create policy "Authenticated admins can update product assets"
on storage.objects for update
to authenticated
using (bucket_id = 'product-assets')
with check (bucket_id = 'product-assets');

insert into public.products (
  slug, status, sort_order, featured, category, accent, accent_color,
  localized_content, platforms, chips, features, assets, screenshots, links, release_meta, seo, published_at
) values
(
  'flashflow', 'published', 10, true, 'Android Tooling', 'cyan', '#06b6d4',
  '{"name":"FlashFlow","tagline":{"vi":"Công cụ Android đa năng cho người dùng nâng cao.","en":"An advanced all-in-one Android tool."},"description":{"vi":"FlashFlow là công cụ đa nền tảng dành cho Android power users. Hỗ trợ Pixel, OnePlus, Xiaomi với các tác vụ unlock / lock bootloader, flash ROM stock, OTA, factory ROM, AOSP, Super.img và cài recovery tùy biến như TWRP, OrangeFox.","en":"FlashFlow is a cross-platform tool for Android power users. It supports Pixel, OnePlus and Xiaomi devices with bootloader unlock/lock, flashing stock ROMs, OTA, factory images, AOSP, Super.img, and custom recoveries like TWRP and OrangeFox."}}',
  '["windows","macos","linux"]',
  '[{"key":"desktop","label":"Desktop"},{"key":"rom","label":"ROM Flashing"},{"key":"power-user","label":"Power user"}]',
  '[{"key":"fast","label":{"vi":"Nhanh và ổn định","en":"Fast and stable workflows"}},{"key":"powerful","label":{"vi":"Xử lý tác vụ Android phức tạp","en":"Advanced Android operations"}},{"key":"safe","label":{"vi":"Thiết kế theo hướng an toàn cho thiết bị","en":"Device-safe workflow design"}},{"key":"cross-platform","label":{"vi":"Hoạt động trên Windows, macOS và Linux","en":"Runs on Windows, macOS, and Linux"}}]',
  '{"logo":"/products/flashflow.png","hero":"/products/flashflow.png","og":"/og.png"}',
  '[{"url":"/products/flashflow.png","alt":{"vi":"FlashFlow interface preview","en":"FlashFlow interface preview"}}]',
  '{"download":"https://github.com/cudin-etn/t-dev-studio/releases/download/flashflow/FlashFlow_Setup.exe"}',
  '{"version":"Latest","size":"Desktop installer","license":"Free","pricing":"Free"}',
  '{}', now()
),
(
  'fboard', 'published', 20, true, 'Android App', 'purple', '#a855f7',
  '{"name":"FBoard","tagline":{"vi":"Bàn phím Android tối giản, siêu nhanh.","en":"A minimal, ultra-fast Android keyboard."},"description":{"vi":"FBoard là bàn phím Android với giao diện hiện đại, sạch sẽ, tập trung tuyệt đối vào tốc độ gõ. Không tích hợp các tính năng rườm rà, chỉ giữ lại những gì cần thiết cho trải nghiệm gõ mượt mà.","en":"FBoard is a modern Android keyboard focused on typing speed. It avoids bloated features and keeps only what matters for a smooth typing experience."}}',
  '["android"]',
  '[{"key":"keyboard","label":"Keyboard"},{"key":"privacy","label":"Privacy-first"},{"key":"native","label":"Native Android"}]',
  '[{"key":"ultra-fast","label":{"vi":"Phản hồi rất nhanh","en":"Ultra-fast response"}},{"key":"minimal","label":{"vi":"Thiết kế tối giản, tập trung vào cốt lõi","en":"Minimal core-focused design"}},{"key":"privacy","label":{"vi":"Không thu thập dữ liệu","en":"No tracking or data collection"}}]',
  '{"logo":"/products/fboard.png","hero":"/products/fboard.png","og":"/og.png"}',
  '[{"url":"/products/fboard.png","alt":{"vi":"FBoard interface preview","en":"FBoard interface preview"}}]',
  '{"download":"https://github.com/cudin-etn/t-dev-studio/releases/download/Fboard/Fboard_v2.1.1.apk"}',
  '{"version":"2.1.1","size":"APK","license":"Free","pricing":"Free"}',
  '{}', now()
),
(
  'macos-flasher', 'published', 30, true, 'macOS Tooling', 'emerald', '#10b981',
  '{"name":"macOS Flasher","tagline":{"vi":"Công cụ flash ROM tối ưu cho macOS.","en":"A macOS-optimized flasher for OnePlus devices."},"description":{"vi":"macOS Flasher được thiết kế riêng cho hệ sinh thái Apple, chuyên flash các loại ROM cho OnePlus trên macOS. Hỗ trợ Full OTA, Super.img, AOSP, debloat hệ thống và unlock / lock bootloader.","en":"macOS Flasher is built for the Apple ecosystem, focusing on flashing ROMs for OnePlus devices on macOS. It supports Full OTA, Super.img, AOSP, debloating, and bootloader operations."}}',
  '["macos"]',
  '[{"key":"oneplus","label":"OnePlus"},{"key":"native","label":"macOS"},{"key":"flashing","label":"Flashing"}]',
  '[{"key":"oneplus","label":{"vi":"Hỗ trợ chuyên sâu thiết bị OnePlus","en":"Deep OnePlus device support"}},{"key":"mac-optimized","label":{"vi":"Tối ưu cho workflow macOS","en":"Optimized for macOS workflows"}},{"key":"safe","label":{"vi":"Quy trình rõ ràng, an toàn","en":"Clear and safe operations"}}]',
  '{"logo":"/products/macos-flasher.png","hero":"/products/macos-flasher.png","og":"/og.png"}',
  '[{"url":"/products/macos-flasher.png","alt":{"vi":"macOS Flasher interface preview","en":"macOS Flasher interface preview"}}]',
  '{"download":"https://github.com/cudin-etn/t-dev-studio/releases/download/macos-flasher-v1/MacOSFlasher.dmg"}',
  '{"version":"v1","size":"DMG","license":"Free","pricing":"Free"}',
  '{}', now()
),
(
  'ddrop', 'published', 40, false, 'File Transfer', 'indigo', '#6366f1',
  '{"name":"Ddrop","tagline":{"vi":"Truyền file tốc độ cao giữa Android và macOS.","en":"High-speed file transfer between Android and macOS."},"description":{"vi":"Ddrop là giải pháp truyền file giữa Android và macOS với trải nghiệm tương tự AirDrop. Giao diện trực quan, kết nối nhanh và tốc độ gửi nhận file cao.","en":"Ddrop is an AirDrop-like file transfer solution for Android and macOS with clean discovery, fast pairing, and high transfer speeds."}}',
  '["android","macos"]',
  '[{"key":"transfer","label":"File transfer"},{"key":"wireless","label":"Wireless"},{"key":"coming-soon","label":"Coming soon"}]',
  '[{"key":"fast","label":{"vi":"Gửi nhận nhanh và ổn định","en":"Fast and stable transfer"}},{"key":"wireless","label":{"vi":"Kết nối không dây nhanh","en":"Fast wireless discovery"}},{"key":"simple","label":{"vi":"Đơn giản, dễ dùng","en":"Simple and focused UX"}}]',
  '{"logo":"/og.png","hero":"/og.png","og":"/og.png"}',
  '[{"url":"/og.png","alt":{"vi":"Ddrop interface preview","en":"Ddrop interface preview"}}]',
  '{}',
  '{"version":"Preview","size":"Coming soon","license":"Free","pricing":"Free"}',
  '{}', now()
)
on conflict (slug) do update set
  status = excluded.status,
  sort_order = excluded.sort_order,
  featured = excluded.featured,
  category = excluded.category,
  accent = excluded.accent,
  accent_color = excluded.accent_color,
  localized_content = excluded.localized_content,
  platforms = excluded.platforms,
  chips = excluded.chips,
  features = excluded.features,
  assets = excluded.assets,
  screenshots = excluded.screenshots,
  links = excluded.links,
  release_meta = excluded.release_meta,
  seo = excluded.seo,
  published_at = excluded.published_at;
