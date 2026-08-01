-- Fill the second flagship case study without publishing unsupported metrics.
-- This migration is intentionally qualitative; add verified numbers later from
-- release analytics or product telemetry.

update public.products
set
  case_study_challenge = '{"vi":"Bàn phím Android phải phản hồi ngay ở từng lần chạm, đồng thời vẫn đưa ra gợi ý và sửa chính tả đủ hữu ích để người dùng không phải dừng lại giữa câu.","en":"An Android keyboard has to respond instantly to every tap while still offering useful suggestions and autocorrection without interrupting the user''s flow."}'::jsonb,
  case_study_approach = '{"vi":"Tập trung vào một input pipeline gọn, giảm công việc không cần thiết trên mỗi lần gõ và thiết kế suggestion bar để thông tin xuất hiện đúng lúc. Các lựa chọn UX ưu tiên tốc độ, khả năng đọc và cảm giác kiểm soát của người dùng.","en":"The approach focused on a lean input pipeline, minimizing work on every keystroke and presenting suggestions at the right moment. UX decisions prioritize speed, readability, and a sense of control."}'::jsonb,
  case_study_highlights = '[
    {"title":{"vi":"Tốc độ phản hồi","en":"Fast input feedback"},"description":{"vi":"Tối ưu đường đi từ thao tác chạm đến ký tự hiển thị để trải nghiệm gõ luôn liền mạch.","en":"Keep the path from touch input to rendered text short so typing feels continuous and immediate."}},
    {"title":{"vi":"Gợi ý và sửa chính tả","en":"Suggestions and autocorrection"},"description":{"vi":"Cung cấp gợi ý hữu ích và sửa lỗi chính tả mà không biến bàn phím thành một giao diện nhiều thông tin.","en":"Provide useful suggestions and autocorrection without turning the keyboard into a noisy interface."}},
    {"title":{"vi":"UX tối giản","en":"Focused keyboard UX"},"description":{"vi":"Giữ lại những điều cần thiết cho việc gõ nhanh, dễ đọc và dễ kiểm soát trên màn hình nhỏ.","en":"Keep only what helps people type quickly, read clearly, and stay in control on a small screen."}}
  ]'::jsonb,
  case_study_results = '[]'::jsonb,
  case_study_role = 'Solo Founder & Lead Engineer',
  case_study_duration = '',
  case_study_links = '{"github":""}'::jsonb
where slug = 'fboard';
