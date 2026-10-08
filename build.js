/* =========================================================
   build.js — sinh trang tĩnh cho từng game + sitemap.xml
   Chạy:  node build.js     (không cần cài thêm gì, Node 18+)
   Trên GitHub, file .github/workflows/build.yml tự chạy lệnh này
   mỗi khi games.js thay đổi, nên bình thường KHÔNG cần chạy tay.

   Vì sao cần: game.html?id=… vẽ nội dung bằng JavaScript, nên khi
   chia sẻ lên Facebook/Zalo chỉ hiện tiêu đề chung chung, không ảnh;
   Google cũng khó lập chỉ mục. Trang game/<id>.html có sẵn tiêu đề,
   mô tả, og:image và nội dung cơ bản cho máy quét; người xem thật
   vẫn được app.js vẽ giao diện đầy đủ như cũ.
   ========================================================= */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "games.js"), "utf8"), ctx);
const SITE = ctx.window.SITE || {};
const GAMES = (ctx.window.GAMES || []).filter(g => !g.sample);
const BASE = (SITE.url || "").replace(/\/+$/, "");
if (!BASE) { console.error("games.js: thiếu SITE.url (vd https://ten.github.io)"); process.exit(1); }

/* Số phiên bản theo nội dung file: mỗi lần games.js/app.js/style.css đổi,
   đường dẫn đổi theo (games.js?v=abc123) nên trình duyệt buộc tải bản mới,
   không dùng bản cũ đã lưu tạm (GitHub Pages cho lưu 10 phút). */
const crypto = require("crypto");
const H = {};
for (const f of ["games.js", "app.js", "style.css"]) H[f] = crypto.createHash("sha1").update(fs.readFileSync(path.join(ROOT, f))).digest("hex").slice(0, 8);
const ASSET_RE = /((?:src|href)=")((?:\.\.\/|\/)?)(games\.js|app\.js|style\.css)(?:\?v=[0-9a-f]*)?"/g;
const verAssets = html => html.replace(ASSET_RE, (m, a, pre, f) => `${a}${pre}${f}?v=${H[f]}"`);

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const abs = p => !p ? "" : /^https?:/.test(p) ? p : BASE + "/" + p.replace(/^\/+/, "");
const STATUS = { done: "Hoàn thành", beta: "Thử nghiệm", wip: "Đang dịch" };
const ICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23e63946'/%3E%3Cpath d='M32 12l5.9 12.1 13.3 1.9-9.6 9.4 2.3 13.2L32 42.4l-11.9 6.2 2.3-13.2-9.6-9.4 13.3-1.9z' fill='%23ffd166'/%3E%3C/svg%3E`;

function page(g) {
  const url = `${BASE}/game/${encodeURIComponent(g.id)}.html`;
  const title = `Việt hóa ${g.title} — ${SITE.name || ""}`;
  // Mô tả ≤ 300 ký tự, cắt ở cuối câu cho gọn khi hiện trên Facebook/Google
  let desc = (g.description || `Bản Việt hóa ${g.title} miễn phí.`).replace(/\s+/g, " ").trim();
  if (desc.length > 300) { const cut = desc.slice(0, 300); const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! ")); desc = end > 120 ? cut.slice(0, end + 1) : cut.trimEnd() + "…"; }
  const img = abs(g.cover || (g.screenshots || [])[0] || "");
  const dl = g.github && g.github.repo ? `https://github.com/${g.github.repo}/releases/latest`
           : (g.downloads && g.downloads[0] && g.downloads[0].url) || "";
  const list = (arr, tag) => arr && arr.length ? `<${tag} class="${tag === "ol" ? "steps" : "g-feat"}">${arr.map(x => `<li>${esc(x)}</li>`).join("")}</${tag}>` : "";
  const ld = {
    "@context": "https://schema.org", "@type": "SoftwareApplication",
    name: `Việt hóa ${g.title}`, applicationCategory: "GameApplication", operatingSystem: "Windows",
    description: desc, url, image: img || undefined, inLanguage: "vi",
    offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
    author: { "@type": "Person", name: SITE.author || "" }, ...(g.updated ? { dateModified: g.updated } : {})
  };
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${esc(url)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(SITE.name || "")}">
  <meta property="og:url" content="${esc(url)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  ${img ? `<meta property="og:image" content="${esc(img)}">` : ""}
  <meta property="og:locale" content="vi_VN">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${ICON}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../style.css">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body data-page="game" data-root="../" data-id="${esc(g.id)}">
  <header class="topbar">
    <div class="wrap topbar-in">
      <a class="brand" href="../index.html">
        <span class="logo" aria-hidden="true">★</span>
        <span class="brand-name" data-site="name">${esc(SITE.name || "")}</span>
      </a>
      <nav class="nav">
        <a href="../index.html" class="back">← Tất cả game</a>
        <a class="btn btn-ghost btn-sm js-github" target="_blank" rel="noopener" hidden>GitHub</a>
      </nav>
    </div>
  </header>

  <!-- Nội dung sẵn cho máy quét (Google, Facebook). app.js sẽ vẽ lại đầy đủ khi trang chạy. -->
  <main id="game">
    <section class="g-hero">
      <div class="wrap g-hero-in">
        <div class="g-head">
          <div class="g-badges"><span class="pill">● ${esc(STATUS[g.status] || STATUS.wip)}</span>${(g.genres || []).map(t => `<span class="pill">${esc(t)}</span>`).join("")}</div>
          <h1>${esc(g.title)}</h1>
          ${g.subtitle ? `<p class="g-sub">${esc(g.subtitle)}</p>` : ""}
          <div class="g-cta">${dl ? `<a class="btn btn-lg" href="${esc(dl)}">⬇ Tải bản Việt hóa${g.patchVersion ? " v" + esc(g.patchVersion) : ""}</a>` : ""}</div>
        </div>
      </div>
    </section>
    <div class="wrap g-body">
      <div class="g-main">
        <section class="g-sec"><h2>Giới thiệu bản Việt hóa</h2><p class="g-desc">${esc(g.description || "")}</p></section>
        ${g.features && g.features.length ? `<section class="g-sec"><h2>Đã dịch những gì</h2>${list(g.features, "ul")}</section>` : ""}
        ${g.install && g.install.length ? `<section class="g-sec"><h2>Hướng dẫn cài đặt</h2>${list(g.install, "ol")}</section>` : ""}
        ${g.screenshots && g.screenshots.length ? `<section class="g-sec"><h2>Ảnh trong game</h2><div class="g-shots">${g.screenshots.map((s, i) => `<img src="../${esc(s)}" alt="Ảnh ${i + 1} trong game ${esc(g.title)}" loading="lazy">`).join("")}</div></section>` : ""}
      </div>
      <aside class="g-side"><div class="info">
        ${g.gameVersion ? `<div class="row"><span>Phiên bản game</span><b>${esc(g.gameVersion)}</b></div>` : ""}
        ${g.platform ? `<div class="row"><span>Nền tảng</span><b>${esc(g.platform)}</b></div>` : ""}
        ${g.updated ? `<div class="row"><span>Cập nhật</span><b>${esc(g.updated)}</b></div>` : ""}
      </div></aside>
    </div>
  </main>

  <footer class="footer">
    <div class="wrap footer-in">
      <div>
        <b data-site="name"></b> · Dịch bởi <span data-site="author"></span>
        <p class="muted">Bản quyền game thuộc về nhà phát triển. Web chỉ chia sẻ bản dịch phi lợi nhuận.</p>
      </div>
      <div class="links" id="contactLinks"></div>
    </div>
  </footer>

  <div class="lightbox" id="lightbox" hidden role="dialog" aria-modal="true" aria-label="Xem ảnh">
    <div class="lb-stage"><img id="lbImg" alt=""></div>
    <button class="lb-btn lb-close" id="lbClose" aria-label="Đóng">×</button>
    <button class="lb-btn lb-nav lb-prev" id="lbPrev" aria-label="Ảnh trước">‹</button>
    <button class="lb-btn lb-nav lb-next" id="lbNext" aria-label="Ảnh sau">›</button>
    <div class="lb-count" id="lbCount"></div>
  </div>
  <div class="toast" id="toast" role="status"></div>

  <script src="../games.js"></script>
  <script src="../app.js"></script>
</body>
</html>
`;
}

/* ---- ghi file ---- */
const outDir = path.join(ROOT, "game");
fs.mkdirSync(outDir, { recursive: true });
// xóa trang của game đã bị gỡ khỏi games.js
for (const f of fs.readdirSync(outDir)) if (f.endsWith(".html") && !GAMES.some(g => g.id + ".html" === f)) fs.unlinkSync(path.join(outDir, f));
for (const g of GAMES) fs.writeFileSync(path.join(outDir, g.id + ".html"), verAssets(page(g)));
// gắn ?v= vào các trang viết tay
for (const f of ["index.html", "game.html", "404.html", "them-game.html"]) {
  const fp = path.join(ROOT, f);
  if (!fs.existsSync(fp)) continue;
  const old = fs.readFileSync(fp, "utf8"), neu = verAssets(old);
  if (neu !== old) fs.writeFileSync(fp, neu);
}

const today = new Date().toISOString().slice(0, 10);
const urls = [{ loc: BASE + "/", lastmod: GAMES.map(g => g.updated || "").sort().pop() || today, priority: "1.0" },
  ...GAMES.map(g => ({ loc: `${BASE}/game/${encodeURIComponent(g.id)}.html`, lastmod: g.updated || today, priority: "0.8" }))];
fs.writeFileSync(path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${esc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`).join("\n") + `\n</urlset>\n`);

console.log(`Đã tạo ${GAMES.length} trang trong game/ và sitemap.xml`);
