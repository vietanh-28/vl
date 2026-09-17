# Duck Farm Studio — Key Server cho doilathe.site

Gói này bổ sung hệ thống Key cho website Vercel hiện có.

## 1. Tạo database Supabase
1. Tạo project Supabase miễn phí.
2. Vào SQL Editor.
3. Chạy toàn bộ file `supabase_schema.sql`.
4. Lấy `Project URL` và `service_role key` trong Project Settings → API.

## 2. Thêm biến môi trường trên Vercel
Trong project đang chạy `doilathe.site`, thêm:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_SECRET` — mật khẩu dài chỉ chủ tool biết
- `OWNER_CONTACT` — ví dụ: `Zalo chủ tool: 09xxxxxxxx`
- `OWNER_CONTACT_URL` — ví dụ: `https://zalo.me/09xxxxxxxx`

Deploy lại project sau khi thêm biến.

## 3. Ghép vào web hiện tại
Copy các mục sau vào source hiện tại của `doilathe.site`:

- thư mục `api/`
- `admin-keys.html`
- `vercel.json` (nếu web đã có vercel.json thì ghép phần rewrite/header, không ghi đè mù)

`package.json` chỉ cần nếu project hiện tại chưa có. Nếu đã có package.json thì giữ file cũ và đảm bảo Vercel dùng Node >=18.

## 4. Quản lý Key
Mở:

`https://www.doilathe.site/admin-keys`

Nhập `ADMIN_SECRET` rồi bạn có thể:
- tạo Key 1/7/30/... ngày tùy ý
- gia hạn +7 / +30 ngày
- khóa/mở Key
- xóa Key
- xem ngày hết hạn và số lần tool xác thực

## 5. API mà tool dùng
Tool Duck Farm Studio đã được cấu hình gọi:

`POST https://www.doilathe.site/api/key/verify`

Body:
```json
{"key":"DUCK-XXXXXX-XXXXXX-XXXXXX","machine_id":"...","app":"Duck Farm Studio"}
```

Key hết hạn hoặc bị khóa sẽ không mở được tool.
