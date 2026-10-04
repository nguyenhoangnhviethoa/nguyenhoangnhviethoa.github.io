/* =========================================================
   DỮ LIỆU WEB — chỉ cần sửa file này để thêm / cập nhật game.
   Mẹo: mở them-game.html để điền form và copy đoạn code sinh ra.
   ========================================================= */

window.SITE = {
  name: "NH Việt Hóa",
  tagline: "Game hay, chơi bằng tiếng Việt — miễn phí cho mọi người",
  author: "Trường",
  // Để trống "" thì nút tương ứng tự ẩn
  github: "https://github.com/your-username",
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
    id: "hollow-lantern",
    title: "Hollow Lantern",
    subtitle: "Ngọn Đèn Rỗng",
    sample: true,
    cover: "",
    colors: ["#1b2a4a", "#e0a43a"],
    genres: ["Nhập vai", "Hành động", "Metroidvania"],
    platform: "Steam",
    engine: "Unity",
    gameVersion: "1.4.2",
    patchVersion: "1.2",
    status: "done",
    progress: 100,
    updated: "2026-09-21",
    size: "18 MB",
    description:
      "Dịch toàn bộ cốt truyện, hội thoại, giao diện, mô tả vật phẩm và kỹ năng. Đã thay font hỗ trợ đầy đủ dấu tiếng Việt, soát tay toàn bộ câu thoại chính.",
    features: ["Cốt truyện & hội thoại", "Giao diện / Menu", "Vật phẩm & kỹ năng", "Font có dấu đầy đủ"],
    install: [
      "Tải file Viet-hoa-Hollow-Lantern.zip bên dưới.",
      "Chuột phải game trên Steam → Manage → Browse local files.",
      "Giải nén, chép đè toàn bộ vào thư mục game (chọn Replace).",
      "Vào game → Settings → Language → chọn English (đã được thay bằng tiếng Việt)."
    ],
    github: { repo: "", tag: "latest" },
    downloads: [{ label: "Bản Việt hóa v1.2 (GitHub)", url: "https://github.com/your-username/viet-hoa-hollow-lantern/releases/latest" }],
    changelog: [
      { version: "1.2", date: "2026-09-21", notes: "Cập nhật cho bản game 1.4.2, sửa 120 câu thoại." },
      { version: "1.0", date: "2026-08-30", notes: "Phát hành bản đầu tiên." }
    ],
    screenshots: []
  },
  {
    id: "starfall-tactics",
    title: "Starfall Tactics",
    subtitle: "Chiến Thuật Sao Rơi",
    sample: true,
    cover: "",
    colors: ["#2b1055", "#7597de"],
    genres: ["Chiến thuật", "Theo lượt", "Khoa học viễn tưởng"],
    platform: "Steam / GOG",
    engine: "Unreal Engine 4",
    gameVersion: "2.0.1",
    patchVersion: "0.8",
    status: "beta",
    progress: 85,
    updated: "2026-09-28",
    size: "42 MB",
    description:
      "Bản thử nghiệm: đã dịch giao diện, nhiệm vụ chính và hướng dẫn. Một số nhiệm vụ phụ còn tiếng Anh. Rất mong mọi người báo lỗi để hoàn thiện.",
    features: ["Giao diện / Menu", "Nhiệm vụ chính", "Hướng dẫn chơi"],
    install: [
      "Tải file .pak bên dưới.",
      "Chép vào thư mục: StarfallTactics/Content/Paks/~mods (tự tạo nếu chưa có).",
      "Mở game, ngôn ngữ để English."
    ],
    github: { repo: "", tag: "latest" },
    downloads: [{ label: "Bản thử nghiệm v0.8", url: "https://github.com/your-username/viet-hoa-starfall/releases/latest" }],
    changelog: [{ version: "0.8", date: "2026-09-28", notes: "Bản beta đầu tiên." }],
    screenshots: []
  },
  {
    id: "pixel-farm-story",
    title: "Pixel Farm Story",
    subtitle: "Chuyện Nông Trại",
    sample: true,
    cover: "",
    colors: ["#2d6a4f", "#f4d35e"],
    genres: ["Mô phỏng", "Nông trại", "Thư giãn"],
    platform: "Steam",
    engine: "GameMaker",
    gameVersion: "1.1.0",
    patchVersion: "1.0",
    status: "done",
    progress: 100,
    updated: "2026-08-12",
    size: "6 MB",
    description: "Việt hóa 100%: hội thoại dân làng, sự kiện, công thức nấu ăn, thư tín và toàn bộ giao diện.",
    features: ["Hội thoại & sự kiện", "Giao diện", "Thư & công thức"],
    install: ["Tải file cài đặt .exe.", "Chạy file, chọn đúng thư mục cài game, bấm Cài đặt."],
    github: { repo: "", tag: "latest" },
    downloads: [{ label: "Trình cài đặt v1.0", url: "https://github.com/your-username/viet-hoa-pixel-farm/releases/latest" }],
    changelog: [{ version: "1.0", date: "2026-08-12", notes: "Phát hành." }],
    screenshots: []
  },
  {
    id: "ashen-keep",
    title: "Echoes of Ashen Keep",
    subtitle: "Tiếng Vọng Thành Tro",
    sample: true,
    cover: "",
    colors: ["#3a0d0d", "#c0392b"],
    genres: ["Nhập vai", "Dark fantasy", "Souls-like"],
    platform: "Steam",
    engine: "Unity",
    gameVersion: "0.9.5",
    patchVersion: "—",
    status: "wip",
    progress: 40,
    updated: "2026-10-01",
    size: "",
    description: "Đang dịch phần mô tả vật phẩm và lore. Dự kiến phát hành bản đầu khi đạt 80%.",
    features: ["Mô tả vật phẩm", "Lore / Truyền thuyết"],
    install: [],
    github: { repo: "", tag: "latest" },
    downloads: [],
    changelog: [],
    screenshots: []
  }
];
