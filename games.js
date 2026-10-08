/* =========================================================
   DỮ LIỆU WEB — chỉ cần sửa file này để thêm / cập nhật game.
   Mẹo: mở them-game.html để điền form và copy đoạn code sinh ra.
   ========================================================= */

window.SITE = {
  name: "NH Việt Hóa",
  // Địa chỉ web (build.js dùng để tạo og:image, sitemap). Đổi nếu sau này dùng tên miền riêng.
  url: "https://nguyenhoangnhviethoa.github.io",
  tagline: "Game hay, chơi bằng tiếng Việt — miễn phí cho mọi người",
  author: "Trường",
  // Để trống "" thì nút tương ứng tự ẩn
  github: "https://github.com/nguyenhoangnhviethoa",
  facebook: "https://www.facebook.com/profile.php?id=61586904953797",
  discord: "",
  email: "",
  // Ủng hộ (tùy chọn) — để trống cả qr và bank thì ẩn khối ủng hộ
  // qr: ảnh mã QR ngân hàng/MoMo, chép vào thư mục assets rồi ghi tên file vào đây
  donate: {
    qr: "assets/donate-qr.jpg",
    bank: "Vietcombank",
    account: "0431000240104",
    holder: "NGUYEN HOANG TRUONG",
    note: "Ung ho Viet hoa"
  }
};

/*
  status: "done" (Hoàn thành) | "beta" (Thử nghiệm) | "wip" (Đang dịch)
  github.repo + github.tag: web tự đọc GitHub Releases để lấy link tải,
  dung lượng và lượt tải. tag = "latest" để luôn lấy bản mới nhất.
  downloads: link tải dự phòng/thủ công (dùng khi không có github).
  installNotes: các ghi chú thêm dưới phần cài đặt (tùy chọn).
  checksums: { "ten-file.zip": "sha256..." } để người tải đối chiếu; virustotal: link kết quả quét (tùy chọn).
  cover: đường dẫn ảnh bìa (vd "assets/covers/ten-game.jpg", tỉ lệ 16:9).
         Để trống thì web tự vẽ ảnh bìa từ 2 màu trong "colors".
  sample: true = dữ liệu mẫu, XÓA các game mẫu khi đưa game thật vào.
*/
window.GAMES = [
  {
    "id": "total-war-shogun-2",
    "title": "Total War: SHOGUN 2",
    "subtitle": "Kèm Rise of the Samurai và Fall of the Samurai",
    "cover": "assets/covers/total-war-shogun-2.jpg",
    "hero": "assets/shots/total-war-shogun-2-2.jpg",
    "colors": [
      "#1a0d0d",
      "#c8102e"
    ],
    "genres": [
      "Chiến thuật",
      "Thời gian thực",
      "Lịch sử"
    ],
    "platform": "Steam (Windows)",
    "engine": "Warscape",
    "gameVersion": "Bản Steam tại ngày 08/10/2026 (v1.1.0, build 6262.29)",
    "patchVersion": "1.0.2",
    "status": "done",
    "progress": 100,
    "updated": "2026-10-08",
    "size": "6,3 MB",
    "description": "Bản Việt hóa đầy đủ cho Total War: SHOGUN 2 và hai bản mở rộng, có font tiếng Việt và bộ cài một nút. Văn phong theo không khí Nhật thời Chiến Quốc: cố vấn gọi người chơi là \"chúa công\", quân mình là \"quân ta\", sứ giả ngoại giao xưng hô tùy thái độ thân thiện hay thù địch. Thuật ngữ được thống nhất xuyên suốt (Sĩ khí, Tháo chạy, Danh vọng gia tộc, Thương điếm…) và đã quét máy toàn bộ để không lỗi biến, không sót chữ.",
    "features": [
      "24.745 chuỗi chữ trong game (~431.000 từ): giao diện, tooltip, đơn vị, công trình, học thuật, kỹ năng tướng và ninja/metsuke/tăng nhân",
      "Sự kiện chiến dịch, nhiệm vụ, lời hịch trước trận, thoại ngoại giao",
      "Lời cố vấn (chữ), hướng dẫn chơi, danh ngôn màn hình tải",
      "Hai bản mở rộng: Rise of the Samurai (Chiến tranh Genpei) và Fall of the Samurai (Chiến tranh Boshin)",
      "Bách khoa trong game: 1.527 trang, kể cả chú thích khi rê chuột",
      "Font: thêm 92 chữ có dấu vào font Bardi gốc của game, giữ đúng nét chữ"
    ],
    "limits": [
      "Giọng đọc của cố vấn và lính là file âm thanh nên vẫn tiếng Anh (phần chữ đã dịch).",
      "Tên nhân vật lịch sử, tên người giữ nguyên tiếng Nhật.",
      "Ở cỡ chữ rất nhỏ (cỡ 4/6/8 đậm), chữ hiện không dấu."
    ],
    "install": [
      "Thoát hẳn game, tải file zip và giải nén",
      "Chạy CaiVietHoa_Shogun2.exe — bộ cài tự tìm thư mục game; không thấy thì bấm \"Đổi…\" (Steam: chuột phải game → Manage → Browse local files)",
      "Bấm \"Cài Việt hóa\", đợi tới 100%",
      "Mở game là có tiếng Việt, giữ ngôn ngữ English",
      "Muốn gỡ: chạy lại bộ cài → \"Gỡ Việt hóa\""
    ],
    "installNotes": [
      "Sau khi Steam cập nhật game hoặc bạn dùng \"Verify integrity of game files\", Bách khoa có thể trở về tiếng Anh: chạy lại bộ cài là xong.",
      "Bộ cài chỉ thêm data\\viethoa.pack và thay các trang trong data\\encyclopedia, không đụng tới file save."
    ],
    "checksums": {
      "VietHoa_Shogun2_v1.0.2.zip": "85adb836e51db5ceec0125d23f7d91c8845c4b1434a38c0785bb442263d87983",
      "VietHoa_Shogun2v1.0.zip": "7fef8ffb0d0c39bd724dcf9e3064af58fa060f34103f7b970b721e12523deb8f",
      "VietHoa_Shogun2_v1.0.1.zip": "7fef8ffb0d0c39bd724dcf9e3064af58fa060f34103f7b970b721e12523deb8f"
    },
    "virustotal": "",
    "github": {
      "repo": "nguyenhoangnhviethoa/Viet-hoa-Shogun-2",
      "tag": "latest"
    },
    "downloads": [],
    "changelog": [
      {
        "version": "1.0.2",
        "date": "2026-10-08",
        "notes": "Sửa 74 nhãn/câu dịch sai nghĩa: nút \"Apply now\" thành \"Áp dụng ngay\"; bảng thống kê trận ghi rõ tướng/tàu/đơn vị địch bị hạ; tăng hàng ngang/hàng dọc của đội hình; \"Tên tẩm lửa\" và \"Hỏa tiễn\" (trước đều là \"tên lửa\"); \"Độ chi tiết\" trong tùy chọn đồ họa; một số nhãn chơi mạng."
      },
      {
        "version": "1.0.1",
        "date": "2026-10-08",
        "notes": "Phát hành lần đầu."
      }
    ],
    "screenshots": [
      "assets/shots/total-war-shogun-2-1.jpg",
      "assets/shots/total-war-shogun-2-2.jpg",
      "assets/shots/total-war-shogun-2-3.jpg"
    ]
  },
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
    "patchVersion": "1.0.1",
    "status": "done",
    "progress": 100,
    "updated": "2026-10-08",
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
      "Vào game: Options → Language → Text language = English (bản Việt hóa ghi đè lên gói chữ tiếng Anh, nên phải chọn English mới hiện tiếng Việt)",
      "Game cập nhật hoặc Verify thì chạy lại bộ cài; muốn trả tiếng Anh thì bấm \"Gỡ Việt hóa\""
    ],
    "installNotes": [
      "Bộ cài chỉ thay file chữ và font, không đụng tới file game khác; bấm \"Gỡ Việt hóa\" là trả lại nguyên bản.",
      "Nếu vào game vẫn thấy tiếng Anh: kiểm tra lại Text language = English và chắc chắn bộ cài đã trỏ đúng thư mục game đang chơi (máy có cả bản Steam lẫn GOG dễ chọn nhầm)."
    ],
    // SHA256 của file trên GitHub Releases, theo tên file (PowerShell: Get-FileHash ten-file.zip)
    "checksums": {
      "VietHoa_Witcher3_Remasterv1.0.1.zip": "9b66aab01f24cb92213bfe496c7364d5d449c58a93c7b78c44685dd886ad5da4",
      "VietHoa_Witcher3_Remasterv1.0.zip": "bd8e68fb6a544466162d2c7820d4b0e51fcad866af97c7590b680b7a38815138"
    },
    // Link kết quả quét VirusTotal (tùy chọn): upload file .zip lên virustotal.com rồi dán link vào đây
    "virustotal": "",
    "github": { "repo": "nguyenhoangnhviethoa/Viet-hoa-The-Witcher-3", "tag": "latest" },
    "downloads": [],
    "changelog": [
      { "version": "1.0.1", "date": "2026-10-08", "notes": "Sửa lỗi dịch, chỉnh lại câu chữ." },
      { "version": "1.0", "date": "2026-10-04", "notes": "Phát hành." }
    ],
    "screenshots": ["assets/shots/the-witcher-3-1.jpg", "assets/shots/the-witcher-3-2.jpg"]
  }
];
