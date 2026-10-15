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
    "id": "late-shift",
    "title": "Late Shift",
    "subtitle": "Phim tương tác, Wales Interactive / CtrlMovie",
    "cover": "assets/covers/late-shift.jpg",
    "colors": [
      "#0d1b2a",
      "#c9a227"
    ],
    "genres": [
      "Phim tương tác",
      "Tội phạm – trộm cướp",
      "Nhiều kết thúc"
    ],
    "platform": "Windows – Epic (đã thử), Steam/GOG",
    "engine": "Unity",
    "gameVersion": "Bản Epic tại ngày 15/10/2026 (v1.0.5)",
    "patchVersion": "1.0.2",
    "status": "done",
    "progress": 100,
    "updated": "2026-10-15",
    "size": "0,2 MB",
    "description": "Bản Việt hóa phụ đề và giao diện cho Late Shift – bộ phim tương tác về Matt, cậu sinh viên bị cuốn vào vụ trộm đấu giá ở London. Toàn bộ thoại có phụ đề tiếng Việt, các nút lựa chọn trong lúc xem phim đều đã dịch. Xưng hô theo đúng quan hệ nhân vật: Matt và May-Ling \"tôi – cô / tôi – anh\", ông trùm Parr \"ta – cậu\", xã hội đen \"tao – mày\", Matt khi bị dồn đến đường cùng cũng đổi giọng.",
    "features": [
      "Phụ đề toàn bộ phim: mọi nhánh truyện và cả 7 kết thúc",
      "Các nút lựa chọn trong lúc xem phim",
      "Giao diện: menu, cài đặt, tên chương, màn hình \"Lựa chọn của bạn\"",
      "Tên và mô tả thành tựu",
      "Xưng hô soát theo quan hệ nhân vật",
      "Font sẵn của game hiện đủ dấu, không cần vá"
    ],
    "limits": [
      "Lồng tiếng là giọng diễn viên tiếng Anh (phụ đề đã dịch).",
      "Chữ xuất hiện trong video (biển hiệu, màn hình điện thoại…) giữ nguyên.",
      "Tên riêng (Matt, May-Ling, Parr, nhà Tchoi, Hainsworth's…) giữ nguyên.",
      "Tiếng Việt thay vào vị trí ngôn ngữ Danish trong danh sách ngôn ngữ.",
      "Mới chạy thử trên bản Epic; bản Steam/GOG bộ cài vẫn nhận nhưng chưa kiểm tra thực tế."
    ],
    "install": [
      "Thoát hẳn game (và launcher nếu đang cập nhật).",
      "Giải nén, chạy CaiVietHoa_LateShift.exe (bộ cài tự tìm thư mục game; không thấy thì bấm \"Đổi…\" chọn thư mục có LateShift.exe).",
      "Bấm CÀI VIỆT HÓA, đợi 100%.",
      "Vào game: Settings → Language → Tiếng Việt, bật Subtitles.",
      "Muốn gỡ: chạy lại bộ cài → \"Gỡ Việt hóa\"."
    ],
    "installNotes": [],
    "checksums": {
      "VietHoa_LateShift_v1.0.2.zip": "3408459abd8666dd1381be826fbb7ff775f4689d7b2b74cc4562f19de28166e9"
    },
    "virustotal": "",
    "github": {
      "repo": "nguyenhoangnhviethoa/Viet-hoa-Late-Shift",
      "tag": "latest"
    },
    "downloads": [],
    "changelog": [
      {
        "version": "1.0.2",
        "date": "2026-10-15",
        "notes": "Soát lại 442 nhãn giao diện, sửa 113 nhãn: tên ngôn ngữ hiện \"Tiếng Việt\", nút lựa chọn đúng ngữ cảnh (\"Squeal\" = Khai ra, \"Push it\" = Đòi thêm, \"Remove oxygen\" = Rút ống thở, \"Hold still\" = Đứng yên, \"High five\" = Đập tay…), thống nhất \"Hang sư tử\", Ep11 gọi đối thủ là \"hắn\", tên thành tựu viết thường kiểu Việt và bỏ trùng tên; bộ cài ghi số phiên bản, báo rõ khi game khác phiên bản."
      },
      {
        "version": "1.0.1",
        "date": "2026-10-06",
        "notes": "Phát hành lần đầu – phụ đề 3.376 câu, giao diện, bộ cài một nút bấm (có Gỡ), ảnh nền lấy từ game."
      }
    ],
    "screenshots": [
      "assets/shots/late-shift-1.jpg",
      "assets/shots/late-shift-2.jpg",
      "assets/shots/late-shift-3.jpg",
      "assets/shots/late-shift-4.jpg",
      "assets/shots/late-shift-5.jpg"
    ],
    "hero": "assets/shots/late-shift-2.jpg"
  },
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
    "gameVersion": "Bản Steam tại ngày 14/10/2026 (v1.1.0, build 6262.29)",
    "patchVersion": "1.0.5",
    "status": "done",
    "progress": 100,
    "updated": "2026-10-14",
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
      "VietHoa_Shogun2_v1.0.1.zip": "7fef8ffb0d0c39bd724dcf9e3064af58fa060f34103f7b970b721e12523deb8f",
      "VietHoa_Shogun2_v1.0.5.zip": "3a4a47016eaa79b3486a12ec00dedc8b4171c2eb0f579bb05e855edd7f12506d"
    },
    "virustotal": "",
    "github": {
      "repo": "nguyenhoangnhviethoa/Viet-hoa-Shogun-2",
      "tag": "latest"
    },
    "downloads": [],
    "changelog": [
      {
        "version": "1.0.5",
        "date": "2026-10-13",
        "notes": "Soát thêm phần chưa chấm lại: thống nhất xưng hô sứ giả (xưng \"ta\", \"bên ta\"/\"bọn ta\", gọi chủ mình \"chúa công ta\"), tooltip nhắc đúng tên nút/thẻ đang hiện trong game (Chiêu mộ tướng, Sửa đổi, Tóm tắt, tên đội hình…), soát 8.558 nhãn/tên ngắn (tên thành tựu, trạng thái sĩ khí, viết hoa tên phe, nhãn bị hiểu sai ngữ cảnh như Mỏ/Thủy lôi, Pháo thủ, Phe ủng hộ). 808 chuỗi sửa, tất cả qua chấm mù (mới thắng 563, hòa 28, thua 37 – câu hòa/thua giữ bản cũ)."
      },
      {
        "version": "1.0.4",
        "date": "2026-10-13",
        "notes": "Chấm mù 762 câu sửa của bản soát (bản mới thắng 620, hòa 125, thua 17) – chỉ giữ 620 câu tốt hơn, còn lại trả về bản cũ. Các lỗi đã sửa: ~300 câu sai xưng hô (mô tả/tooltip gọi nhầm \"chúa công\", sứ giả xưng hô lệch thái độ), ~200 câu lệch thuật ngữ, ~80 câu sai nghĩa (đảo khả năng thành chắc chắn, nhầm chủ thể, sai phạm vi hiệu ứng), câu văn máy, phần sót và phần tự thêm. Phần chơi mạng giữ nguyên chữ \"Clan\" (tín vật Clan, tranh đua Clan, bảng xếp hạng Clan…); Crest của hóa thân = \"Huy hiệu mũ\"; thống nhất \"giáo\" cho spear: Thạo Giáo, Tinh Thông Giáo (nhánh học thuật vẫn là \"Đạo Thương\")."
      },
      {
        "version": "1.0.3",
        "date": "2026-10-13",
        "notes": "Soát lại toàn bộ câu dài và Bách khoa theo chuẩn dịch mới (bản nội bộ, thay bằng 1.0.4)."
      },
      {
        "version": "1.0.2",
        "date": "2026-10-08",
        "notes": "Sửa 74 nhãn/câu dịch sai nghĩa: nút \"Apply now\" thành \"Áp dụng ngay\" (trước ghi nhầm \"Đăng ký ngay\"); bảng thống kê trận ghi rõ tướng/tàu/đơn vị địch bị hạ; \"Increase rank/file\" = tăng hàng ngang/hàng dọc của đội hình; Fire arrows = \"Tên tẩm lửa\", rocket = \"Hỏa tiễn\" (trước đều là \"tên lửa\"); \"Độ chi tiết\" trong tùy chọn đồ họa; một số nhãn chơi mạng (Bắt đầu sau, Tính điểm xếp hạng, Hết mùa giải)."
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
    "patchVersion": "1.5.4",
    "status": "done",
    "progress": 100,
    "updated": "2026-10-14",
    "size": "9,6 MB",
    "description": "Bản Việt hóa cho The Witcher 3 bản Remaster, dựa trên bản Việt hóa cộng đồng của Viethoagame và dịch bổ sung phần còn thiếu: giao diện mới của bản Remaster, nhiều nhật ký/thư/sách Blood and Wine, phụ đề video. Xưng hô được soát theo quan hệ nhân vật: Geralt gọi Vesemir là \"thầy\", Ciri gọi Geralt là \"cha\", Yennefer và Triss \"anh – em\", dân thường gọi Geralt là \"anh\", người hầu, trưởng làng, hiệp sĩ Toussaint gọi \"ngài\".",
    "features": [
      "Thoại, lựa chọn hội thoại, nhiệm vụ, nhật ký, thư và sách",
      "Vật phẩm, kỹ năng, bảng thông báo, Gwent (tên riêng giữ tiếng Anh)",
      "Giao diện và menu mới của bản Remaster",
      "Hai bản mở rộng Hearts of Stone và Blood and Wine",
      "Phụ đề video và các đoạn phim",
      "Font hiện đủ dấu; xưng hô soát theo quan hệ nhân vật"
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
      "VietHoa_Witcher3_v1.5.2.zip": "0cf5fbb080fb02b28b01d043e5100435af7872b0b5ae8af6ca2d56900ef926ee",
      "VietHoa_Witcher3_v1.5.3.zip": "2969fda80e8ec103cd5002b6749975ee3510388a63243bac48e2399c6257f75a",
      "VietHoa_Witcher3_v1.5.4.zip": "b37624b4c91e331e03bec8fd57ccc70bed7654668f06caaf3558c44172897138"
    },
    "virustotal": "",
    "github": {
      "repo": "nguyenhoangnhviethoa/Viet-hoa-The-Witcher-3",
      "tag": "latest"
    },
    "downloads": [],
    "changelog": [
      {
        "version": "1.5.4",
        "date": "2026-10-10",
        "notes": "Lời thoại nhắc tới người thứ ba không còn để trơn \"bà/ông/cô/anh\" (dễ tưởng đang gọi người nghe) mà dùng \"bà ấy/ông ấy/cô ấy/anh ấy\" hoặc \"bà ta/hắn\" tùy thái độ – 64 câu; kèm sửa 118 câu dịch sai nghĩa, ngược nghĩa, lỗi chính tả, sót tiếng Anh phát hiện khi đọc lại."
      },
      {
        "version": "1.5.3",
        "date": "2026-10-09",
        "notes": "Sửa 316 câu dùng \"thầy\" sai làm cách gọi lễ phép (bản cũ dịch \"Master witcher\" thành \"Thầy witcher\"): trưởng làng Downwarren, người hầu, lính, thương nhân, dân Toussaint gọi Geralt \"ngài\"; dân thường \"anh\"; người già \"cậu\"; trẻ con \"chú\"; \"Master Dandelion\" → \"ngài Dandelion\". Giữ \"thầy\" cho Vesemir và các thầy dạy thật. Kèm sửa vài câu dịch ngược nghĩa và lỗi chính tả."
      },
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
      "Thoại vặt trên đường (dân nói với nhau) chưa soát hết từng câu."
    ]
  }
];
