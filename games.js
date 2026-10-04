/* =========================================================
   DỮ LIỆU WEB — chỉ cần sửa file này để thêm / cập nhật game.
   Mẹo: mở them-game.html để điền form và copy đoạn code sinh ra.
   ========================================================= */

window.SITE = {
  name: "NH Việt Hóa",
  tagline: "Game hay, chơi bằng tiếng Việt — miễn phí cho mọi người",
  author: "Trường",
  // Để trống "" thì nút tương ứng tự ẩn
  github: "https://github.com/nguyenhoangnhviethoa",
  facebook: "",
  discord: "",
  email: "",
  // Ủng hộ (tùy chọn) — để trống bank thì ẩn khối ủng hộ
  donate: { bank: "", account: "", holder: "", note: "Ủng hộ Việt hóa" }
};

/*
  status: "done" (Hoàn thành) | "beta" (Thử nghiệm) | "wip" (Đang dịch)
  github.repo + github.tag: web tự đọc GitHub Releases để lấy link tải,
  dung lượng và lượt tải. tag = "latest" để luôn lấy bản mới nhất.
  downloads: link tải dự phòng/thủ công (dùng khi không có github).
  cover: đường dẫn ảnh bìa (vd "assets/covers/ten-game.jpg", tỉ lệ 16:9).
         Để trống thì web tự vẽ ảnh bìa từ 2 màu trong "colors".
  sample: true = dữ liệu mẫu, XÓA các game mẫu khi đưa game thật vào.
*/
window.GAMES = [
  {
    "id": "the-witcher-3-remastered",
    "title": "The Witcher 3: Wild Hunt - Remastered",
    "subtitle": "",
    "cover": "assets/covers/the-witcher-3-remastered.jpg",
    "colors": ["#1b2a4a", "#e63946"],
    "genres": ["Nhập vai", "Hành động", "Thế giới mở"],
    "platform": "Steam / Epic / GOG",
    "engine": "",
    "gameVersion": "V5.00C",
    "patchVersion": "1.0",
    "status": "done",
    "progress": 100,
    "updated": "2026-10-04",
    "size": "10MB",
    "description": "Việt hóa The Witcher 3 bản Remastered (v5.00c), gồm cả hai bản mở rộng Hearts of Stone và Blood and Wine. Bản dịch dựa trên bản Việt hóa của Viethoagame, phần còn thiếu được dịch bổ sung bằng AI. Xưng hô được chỉnh lại theo quan hệ giữa các nhân vật. Có font tiếng Việt đầy đủ dấu và bộ cài tự động, gỡ ra là trả lại game gốc. Phát hành miễn phí.",
    "features": [
      "Cốt truyện & hội thoại (game gốc + Hearts of Stone + Blood and Wine)",
      "Nhiệm vụ, nhật ký, thư từ, sách",
      "Giao diện, menu, cài đặt của bản Remastered (Mod, chụp ảnh, trợ năng…)",
      "Kỹ năng và hướng dẫn",
      "Phụ đề video: mở đầu, giữa chương, hồi tưởng, kết thúc",
      "Font tiếng Việt có dấu",
      "Giữ nguyên tiếng Anh: tên riêng, tên vật phẩm, tên nhiệm vụ"
    ],
    "install": [
      "Tải file zip và giải nén",
      "Thoát game và launcher (Steam/Epic/GOG)",
      "Chạy CaiVietHoa_Witcher3.exe (Windows cảnh báo thì bấm More info → Run anyway)",
      "Bấm \"Cài Việt hóa\" (bộ cài tự tìm thư mục game, không thấy thì bấm \"Đổi…\" để chọn)",
      "Vào game: Options → Language → Text language = English",
      "Game cập nhật hoặc Verify thì chạy lại bộ cài; muốn trả tiếng Anh thì bấm \"Gỡ Việt hóa\""
    ],
    "github": { "repo": "nguyenhoangnhviethoa/Viet-hoa-The-Witcher-3", "tag": "latest" },
    "downloads": [],
    "changelog": [
      { "version": "1.0", "date": "2026-10-04", "notes": "Phát hành." }
    ],
    "screenshots": ["assets/shots/the-witcher-3-1.jpg", "assets/shots/the-witcher-3-2.jpg"]
  }
];
