# NH Việt Hóa — web chia sẻ bản Việt hóa game

Web tĩnh, không cần server hay database. Mở `index.html` là chạy được ngay trên máy.

## Cấu trúc

| File | Dùng để |
|---|---|
| `games.js` | **Dữ liệu duy nhất cần sửa**: thông tin web (tên, link liên hệ, ủng hộ) và danh sách game |
| `them-game.html` | Form điền thông tin game → sinh code để dán vào `games.js` |
| `index.html`, `style.css`, `app.js` | Giao diện (không cần đụng tới) |
| `build.js` | Sinh trang tĩnh `game/<id>.html` (có ảnh/tiêu đề khi chia sẻ Facebook, Zalo) và `sitemap.xml`. GitHub tự chạy qua `.github/workflows/build.yml` mỗi khi `games.js` đổi — không cần chạy tay |
| `game/` | Trang của từng game, **do build.js sinh ra, đừng sửa tay** |
| `assets/og-home.jpg` | Ảnh hiện khi chia sẻ link trang chủ (1200×630) |
| `assets/covers/` | Ảnh bìa game (16:9, khoảng 1280×720, .jpg/.webp) |

## Thêm một game

1. Mỗi game nên có 1 repo GitHub riêng, ví dụ `viet-hoa-hollow-knight`.
2. Trên repo đó: **Releases → Draft a new release** → đặt tag (vd `v1.0`) → kéo file `.zip` Việt hóa vào → **Publish**.
3. Mở `them-game.html`, điền thông tin, ô *GitHub repo* ghi `ten-github/viet-hoa-hollow-knight` → **Sao chép code**.
4. Dán vào `games.js` bên trong `window.GAMES = [ ... ]`. **Xóa các game mẫu** (có `sample: true`).
5. Commit `games.js` lên GitHub. Khoảng 1 phút sau, workflow **build** tự tạo `game/<id>.html` + cập nhật `sitemap.xml` (xem tab *Actions*). Nếu chạy trên máy: `node build.js`.
6. Nên điền thêm `checksums` (SHA256 của file zip — PowerShell: `Get-FileHash file.zip`) và `virustotal` để người tải yên tâm hơn với file .exe.

Khi có `github.repo`, web tự đọc GitHub Releases để hiện: nút tải đúng file mới nhất, dung lượng, tổng lượt tải, ghi chú phát hành. Cập nhật bản mới chỉ cần tạo release mới — không phải sửa web.

## Đưa web lên mạng (GitHub Pages, miễn phí)

1. Tạo repo mới, vd `viet-hoa` (để Public).
2. **Add file → Upload files** → kéo toàn bộ nội dung thư mục này vào → Commit.
3. **Settings → Pages → Source: Deploy from a branch → main / (root)** → Save.
4. Sau 1–2 phút web có địa chỉ `https://ten-github.github.io/viet-hoa/`.

Muốn tên miền riêng (vd `viethoa.nguyenhoang.vn`): Settings → Pages → Custom domain, rồi trỏ CNAME về `ten-github.github.io`.
Cách khác: kéo thả thư mục vào **Netlify Drop** hoặc **Cloudflare Pages**.

## Lưu ý

- Chỉ phát hành **file bản dịch/patch**, không đính kèm file game gốc (exe, data đầy đủ) để tránh vi phạm bản quyền.
- GitHub API cho khách không đăng nhập 60 lượt/giờ/IP; web lưu tạm 30 phút. Khi API lỗi, nút tải tự chuyển sang link trang Releases nên vẫn tải được.
- Link chia sẻ một game: `.../game/<id>.html` (link cũ `game.html?id=<id>` và `#/game/<id>` vẫn chạy).
- Số lượt tải chỉ hiện khi ≥ 50; ô thống kê trang chủ chỉ hiện khi có ≥ 3 game (đổi `MIN_DL`, `MIN_GAMES_STATS` đầu `app.js`).
- Để Google lập chỉ mục nhanh: đăng ký web tại Google Search Console và gửi `sitemap.xml`.
