-- Add case study fields to products table for freelance portfolio
-- This migration extends the existing products schema with case study content
-- while preserving all existing product, release, and download tracking functionality.

-- Add case study columns to products table
alter table public.products
add column if not exists case_study_challenge jsonb default '{"vi":"","en":""}'::jsonb,
add column if not exists case_study_approach jsonb default '{"vi":"","en":""}'::jsonb,
add column if not exists case_study_highlights jsonb default '[]'::jsonb,
add column if not exists case_study_results jsonb default '[]'::jsonb,
add column if not exists case_study_role text,
add column if not exists case_study_duration text,
add column if not exists case_study_links jsonb default '{}'::jsonb;

-- Add comments for documentation
comment on column public.products.case_study_challenge is 'Problem statement and constraints in VI/EN';
comment on column public.products.case_study_approach is 'Architecture decisions and trade-offs in VI/EN';
comment on column public.products.case_study_highlights is 'Array of technical deep-dive topics with VI/EN titles and descriptions';
comment on column public.products.case_study_results is 'Array of key-value metrics {metric: string, value: string, locale: string}';
comment on column public.products.case_study_role is 'Role in project (e.g., "Solo Founder & Lead Engineer")';
comment on column public.products.case_study_duration is 'Project duration (e.g., "6 months")';
comment on column public.products.case_study_links is 'External links: {github, playStore, appStore, liveDemo, caseStudyPdf}';

-- Update RLS policies to allow admin access to new columns (inherited from existing admin policies)
-- No additional policies needed - existing admin policies cover all columns on products table

-- Seed FlashFlow case study content (example data - replace with real content)
update public.products
set
  case_study_challenge = '{"vi": "FlashFlow giải quyết bài toán flash ROM phức tạp cho Android power users trên Windows, macOS, Linux. Thách thức: hỗ trợ đa dạng thiết bị (Pixel, OnePlus, Xiaomi), nhiều loại partition (super.img, dynamic partitions), nhiều protocol (fastboot, EDL, OTA), đảm bảo an toàn thiết bị.", "en": "FlashFlow solves complex ROM flashing for Android power users across Windows, macOS, Linux. Challenge: support diverse devices (Pixel, OnePlus, Xiaomi), partition types (super.img, dynamic partitions), protocols (fastboot, EDL, OTA), while ensuring device safety."}'::jsonb,
  case_study_approach = '{"vi": "Kiến trúc cross-platform: Kotlin Multiplatform cho business logic, Rust cho low-level USB/bootloader protocol, FFmpeg cho payload processing. Chia tách core logic (shared) và platform-specific adapters. Ưu tiên type-safe communication giữa Kotlin và Rust qua JNI/FFI.", "en": "Cross-platform architecture: Kotlin Multiplatform for business logic, Rust for low-level USB/bootloader protocols, FFmpeg for payload processing. Separate core logic (shared) from platform-specific adapters. Prioritize type-safe Kotlin↔Rust communication via JNI/FFI."}'::jsonb,
  case_study_highlights = '[{"title": {"vi": "Bootloader Protocol Implementation", "en": "Bootloader Protocol Implementation"}, "description": {"vi": "Reverse-engineer và implement fastboot/EDL protocol cho Pixel, OnePlus, Xiaomi. Xử lý handshake, authentication, partition flashing, slot management.", "en": "Reverse-engineered and implemented fastboot/EDL protocols for Pixel, OnePlus, Xiaomi. Handles handshake, authentication, partition flashing, slot management."}}, {"title": {"vi": "Super.img & Dynamic Partitions", "en": "Super.img & Dynamic Partitions"}, "description": {"vi": "Parse super.img, dynamic partition metadata, logical-to-physical mapping. Flash logical partitions đúng thứ tự, resize dynamic partitions on-the-fly.", "en": "Parse super.img, dynamic partition metadata, logical-to-physical mapping. Flash logical partitions in correct order, resize dynamic partitions on-the-fly."}}, {"title": {"vi": "Cross-Platform Binary Distribution", "en": "Cross-Platform Binary Distribution"}, "description": {"vi": "Build pipeline: Rust core → cdylib → Kotlin/JNI bindings → Gradle → native libraries per platform (Windows .dll, macOS .dylib, Linux .so). Notarization cho macOS, code signing cho Windows.", "en": "Build pipeline: Rust core → cdylib → Kotlin/JNI bindings → Gradle → native libraries per platform (Windows .dll, macOS .dylib, Linux .so). macOS notarization, Windows code signing."}}, {"title": {"vi": "Device-Safe Workflow Design", "en": "Device-Safe Workflow Design"}, "description": {"vi": "Validation pre-flash: kiểm tra device info, partition layout, battery level. Dry-run mode. Rollback strategy qua backup partitions. User confirmation từng bước critical.", "en": "Pre-flash validation: device info, partition layout, battery level. Dry-run mode. Rollback via backup partitions. User confirmation at each critical step."}}]'::jsonb,
  case_study_results = '[{"metric": "Downloads", "value": "15,000+", "locale": "en"}, {"metric": "Devices Supported", "value": "45+ (Pixel, OnePlus, Xiaomi)", "locale": "en"}, {"metric": "Flash Success Rate", "value": "99.2%", "locale": "en"}, {"metric": "GitHub Stars", "value": "320+", "locale": "en"}, {"metric": "Platforms", "value": "Windows, macOS, Linux", "locale": "en"}, {"metric": "Lượt tải", "value": "15,000+", "locale": "vi"}, {"metric": "Thiết bị hỗ trợ", "value": "45+ (Pixel, OnePlus, Xiaomi)", "locale": "vi"}, {"metric": "Tỷ lệ flash thành công", "value": "99.2%", "locale": "vi"}, {"metric": "GitHub Stars", "value": "320+", "locale": "vi"}, {"metric": "Nền tảng", "value": "Windows, macOS, Linux", "locale": "vi"}]'::jsonb,
  case_study_role = 'Solo Founder & Lead Engineer',
  case_study_duration = '6 months',
  case_study_links = '{"github": "https://github.com/cudin-etn/flashflow", "playStore": "", "appStore": "", "liveDemo": "", "caseStudyPdf": ""}'::jsonb
where slug = 'flashflow';

-- Seed placeholder for other products (to be filled later)
update public.products
set
  case_study_challenge = '{"vi": "Đang cập nhật...", "en": "Coming soon..."}'::jsonb,
  case_study_approach = '{"vi": "Đang cập nhật...", "en": "Coming soon..."}'::jsonb,
  case_study_highlights = '[]'::jsonb,
  case_study_results = '[]'::jsonb,
  case_study_role = 'Solo Founder & Lead Engineer',
  case_study_duration = '',
  case_study_links = '{}'::jsonb
where slug in ('fboard', 'macos-flasher', 'ddrop') and (case_study_challenge is null or case_study_challenge = '{}'::jsonb);