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
  // Kiểu nền: "anh" (ảnh game) | "nui" (núi sương) | "neon" (lưới neon) | "cucquang" (cực quang)
  background: "cucquang",
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
    "colors": [
      "#1b2a4a",
      "#e63946"
    ],
    "genres": [
      "Nhập vai",
      "Hành động",
      "Thế giới mở"
    ],
    "platform": "Steam / Epic / GOG",
    "engine": "",
    "gameVersion": "V5.01",
    "patchVersion": "1.5.2",
    "status": "done",
    "progress": 100,
    "updated": "2026-10-08",
    "size": "9,6 MB",
    "description": "Bản Việt hóa cho The Witcher 3 bản Remaster, dựa trên bản Việt hóa cộng đồng của Viethoagame và dịch bổ sung phần còn thiếu: giao diện mới của bản Remaster, nhiều nhật ký/thư/sách Blood and Wine, phụ đề video. Xưng hô được soát theo quan hệ nhân vật: Geralt gọi Vesemir là \"thầy\", Ciri gọi Geralt là \"cha\", Yennefer và Triss \"anh – em\", dân thường gọi Geralt là \"anh\", người hầu và hiệp sĩ Toussaint gọi \"ngài\".",
    "features": [
      "Chữ trong game: 88.929/96.915 chuỗi (~1,09 triệu từ tiếng Anh) đã có tiếng Việt: 68.918 chuỗi lấy từ bản Việt hóa của Viethoagame (có sửa xưng hô, lỗi nghĩa); 20.008 chuỗi (~300.000 từ) dịch bổ sung bằng AI rồi soát lại",
      "Gồm: thoại và lựa chọn hội thoại, nhiệm vụ, nhật ký, thư, sách, bảng thông báo, vật phẩm và kỹ năng (tên riêng giữ tiếng Anh), giao diện và menu mới của bản Remaster (cài đặt đồ họa, chụp ảnh, lưu/tải, trợ năng, menu mod), màn hình tải, Gwent.",
      "Hai bản mở rộng: Hearts of Stone và Blood and Wine (bổ sung các đoạn mà bản cũ còn tiếng Anh).",
      "Phụ đề video: video kể chuyện giữa các chương, đoạn kết, hồi tưởng, đoạn mở đầu (cả phụ đề rời lẫn phụ đề nhúng trong video).",
      "Font tiếng Việt: vá font giao diện để hiện đủ dấu.",
      "Soát chất lượng: Xưng hô theo quan hệ nhân vật chính, có công cụ kiểm tra theo người nói, kể cả lựa chọn hội thoại; Soát 262 lá thư, sửa 96 lá sai quan hệ người gửi – người nhận; Đợt 4 (bản 1.5.1) sửa 1.318 câu: 878 câu: dân thường gọi Geralt là \"ngươi\" → \"anh\"/\"ngài\"; 226 câu: \"chúng ta\" ↔ \"chúng tôi\"/\"bọn ta\"; 190 câu: dịch sai nghĩa hoặc thành ngữ dịch theo nghĩa đen; 24 câu: nhãn giao diện sai nghĩa; Quét toàn bộ: không lẫn chữ Trung/Nhật/Hàn, không lỗi thẻ định dạng"
    ],
    "install": [
      "Thoát hẳn game.",
      "Giải nén, chạy CaiVietHoa_Witcher3.exe. Bộ cài tự tìm thư mục game; không thấy thì bấm \"Đổi…\" để chọn.",
      "Bấm CÀI VIỆT HÓA, đợi 100%.",
      "Vào game: Options → Language → Text language = English.",
      "Game cập nhật hoặc Verify thì chạy bộ cài lần nữa.",
      "Muốn gỡ: mở bộ cài → \"Gỡ Việt hóa\"."
    ],
    "installNotes": [
      "Bộ cài chỉ thay file chữ và font, không đụng tới file game khác; bấm \"Gỡ Việt hóa\" là trả lại nguyên bản.",
      "Nếu vào game vẫn thấy tiếng Anh: kiểm tra lại Text language = English và chắc chắn bộ cài đã trỏ đúng thư mục game đang chơi (máy có cả bản Steam lẫn GOG dễ chọn nhầm)."
    ],
    "checksums": {
      "VietHoa_Witcher3_Remasterv1.0.1.zip": "9b66aab01f24cb92213bfe496c7364d5d449c58a93c7b78c44685dd886ad5da4",
      "VietHoa_Witcher3_Remasterv1.0.zip": "bd8e68fb6a544466162d2c7820d4b0e51fcad866af97c7590b680b7a38815138",
      "VietHoa_Witcher3_v1.5.2.zip": "0cf5fbb080fb02b28b01d043e5100435af7872b0b5ae8af6ca2d56900ef926ee"
    },
    "virustotal": "",
    "github": {
      "repo": "nguyenhoangnhviethoa/Viet-hoa-The-Witcher-3",
      "tag": "latest"
    },
    "downloads": [],
    "changelog": [
      {
        "version": "1.5.2",
        "date": "2026-10-08",
        "notes": "Hỗ trợ game v5.01. Dịch các câu mới/đổi của v5.01 (mô tả kỹ năng Giáp vừa, khiên Quen phản sát thương, chụp ảnh, nhặt đồ nhanh…); sửa 13 câu bị hỏng thẻ hoặc sai hẳn nội dung (hướng dẫn rút kiếm bạc, mô tả kỹ năng lựu đạn/adrenaline, chữ in nghiêng/màu trong Gwent, bách khoa). Hộp thoại khi game khác phiên bản nói rõ game mới hơn/cũ hơn, vẫn cài và chơi được, gặp lỗi thì nhắn qua trang Việt hóa."
      },
      {
        "version": "1.5.1",
        "date": "2026-10-08",
        "notes": "Sửa 1.318 câu: Dân thường, thương nhân, người được cứu gọi Geralt là \"anh\"/\"ngài\" thay vì \"ngươi\"; \"chúng ta\"/\"chúng tôi\"/\"bọn ta\" đúng theo người nghe; Sửa câu dịch ngược nghĩa và thành ngữ (vd \"keep it down\", \"Va fail\", \"broken on the wheel\"); Sửa nhãn giao diện sai nghĩa (\"Tay cầm đã ngắt kết nối\", \"Lơ là phòng bị\", \"Nữ Công tước\"…)"
      },
      {
        "version": "1.5",
        "date": "2026-10-06",
        "notes": "Sửa 96 lá thư sai quan hệ người gửi – người nhận; sửa cách Geralt xưng hô với Vesemir (\"con – thầy\")."
      },
      {
        "version": "1.4",
        "date": "2026-10-04",
        "notes": "Thêm phụ đề nhúng trong video (mở đầu game, đoạn kết, hồi tưởng)."
      },
      {
        "version": "1.3",
        "date": "2026-10-04",
        "notes": "Thêm phụ đề video (video kể chuyện giữa chương)."
      },
      {
        "version": "1.2",
        "date": "2026-10-04",
        "notes": "Dịch bổ sung 1.464 câu còn tiếng Anh (menu Remaster, nhật ký/thư/sách Blood and Wine); cài đè được bản Việt hóa cũ."
      },
      {
        "version": "1.0–1.1",
        "date": "2026-10-04",
        "notes": "Bộ cài một nút bấm, vá font tiếng Việt; giao diện mới, thanh tiến trình, tự tìm thư mục game."
      }
    ],
    "screenshots": [
      "assets/shots/the-witcher-3-1.jpg",
      "assets/shots/the-witcher-3-2.jpg"
    ],
    "limits": [
      "Lồng tiếng vẫn là tiếng Anh (chỉ dịch chữ và phụ đề).",
      "Tên nhân vật, địa danh, vật phẩm, nhiệm vụ giữ tiếng Anh theo quy ước.",
      "Một số câu giữ nguyên: tiếng Elder, câu ngân nga, danh sách người làm game, điều khoản pháp lý, 21 câu mà bản Remaster đã đổi nội dung tiếng Anh.",
      "Thoại vặt trên đường (dân nói với nhau) chưa soát hết từng câu.",
      "Bản 1.5.2 đã kiểm thử cài/gỡ trên bản sao file game (v5.01 và v5.00c). Các câu sửa đợt 4 chưa được xem lại trực tiếp trong game."
    ]
  }
];
