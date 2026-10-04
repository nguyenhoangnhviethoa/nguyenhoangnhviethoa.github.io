(() => {
  const SITE = window.SITE || {};
  const GAMES = (window.GAMES || []).map(g => ({ ...g, _dl: null, _gh: null }));
  const PAGE = document.body.dataset.page || "home";
  const STATUS = {
    done: { label: "Hoàn thành", cls: "done" },
    beta: { label: "Thử nghiệm", cls: "beta" },
    wip:  { label: "Đang dịch",  cls: "wip" }
  };
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
  const fmtDate = d => { if (!d) return "—"; const t = new Date(d); return isNaN(t) ? d : t.toLocaleDateString("vi-VN"); };
  const fmtNum = n => (n ?? 0).toLocaleString("vi-VN");
  const fmtSize = b => b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";
  const hasVer = v => v && v !== "—";
  const gameUrl = g => "game.html?id=" + encodeURIComponent(g.id);

  /* ---------- Thông tin chung (header, footer) ---------- */
  document.querySelectorAll("[data-site]").forEach(el => { el.textContent = SITE[el.dataset.site] || el.textContent; });
  if (SITE.github) document.querySelectorAll(".js-github").forEach(a => { a.href = SITE.github; a.hidden = false; });
  const contacts = [["Facebook", SITE.facebook], ["Discord", SITE.discord], ["GitHub", SITE.github], ["Email", SITE.email && "mailto:" + SITE.email]]
    .filter(([, u]) => u).map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${n}</a>`);
  const cl = $("#contactLinks"); if (cl) cl.innerHTML = contacts.join("");

  function coverStyle(g) {
    if (g.cover) return `background-image:url('${esc(g.cover)}')`;
    const [a, b] = g.colors && g.colors.length ? g.colors : ["#222a3d", "#e63946"];
    return `background-image:linear-gradient(135deg, ${a} 0%, ${a} 35%, ${b} 120%)`;
  }
  const coverArt = g => g.cover ? "" : `<div class="cover-art"><span>${esc(g.title)}</span></div>`;

  function copy(text) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
      () => toast("Đã sao chép link"), () => toast(text));
  }
  let tt; function toast(msg) { const t = $("#toast"); if (!t) return; t.textContent = msg; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2200); }

  /* ---------- Ủng hộ (QR + tài khoản) ---------- */
  const D = SITE.donate || {};
  const hasDonate = !!(D.qr || D.bank);
  function donateHtml(compact) {
    if (!hasDonate) return "";
    const rows = [["Ngân hàng", D.bank], ["Số TK", D.account], ["Chủ TK", D.holder], ["Nội dung", D.note]]
      .filter(([, v]) => v).map(([k, v]) => `<span>${k}</span><b>${esc(v)}</b>`).join("");
    return `<div class="donate-card ${compact ? "compact" : ""}">
      ${compact ? `<div><b class="donate-title">♥ Ủng hộ người dịch</b><p class="muted small">Bản Việt hóa miễn phí. Thấy hay thì mời mình ly cà phê nhé!</p></div>` : ""}
      ${D.qr ? `<img class="donate-qr" src="${esc(D.qr)}" alt="Mã QR ủng hộ${D.bank ? " – " + esc(D.bank) : ""}" loading="lazy">` : ""}
      <div class="donate-info">
        ${rows ? `<div class="donate-rows">${rows}</div>` : ""}
        ${D.account ? `<button class="btn btn-ghost btn-sm" data-copy="${esc(D.account)}">Sao chép số tài khoản</button>` : ""}
        ${D.qr ? `<p class="muted small">Dùng điện thoại: chụp màn hình mã QR → mở app ngân hàng → Quét QR → chọn ảnh vừa chụp.</p>` : ""}
      </div>
    </div>`;
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    const t = b.dataset.copy;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("Đã sao chép số tài khoản"), () => toast(t));
  });

  /* ---------- GitHub Releases (tự lấy link tải + lượt tải) ---------- */
  const CACHE_MIN = 30;
  function cacheGet(k) { try { const v = JSON.parse(localStorage.getItem(k)); if (v && Date.now() - v.t < CACHE_MIN * 60000) return v.d; } catch (_) {} return null; }
  function cacheSet(k, d) { try { localStorage.setItem(k, JSON.stringify({ t: Date.now(), d })); } catch (_) {} }
  async function loadGithub(g) {
    const repo = g.github && g.github.repo; if (!repo) return;
    const tag = (g.github.tag || "latest").trim();
    const key = `gh:${repo}:${tag}`;
    let data = cacheGet(key);
    if (!data) {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`, { headers: { Accept: "application/vnd.github+json" } });
        if (!res.ok) return;
        const rels = (await res.json()).filter(r => !r.draft);
        if (!rels.length) return;
        const rel = tag === "latest" ? (rels.find(r => !r.prerelease) || rels[0]) : rels.find(r => r.tag_name === tag);
        const total = rels.reduce((s, r) => s + r.assets.reduce((a, x) => a + x.download_count, 0), 0);
        data = rel && {
          tag: rel.tag_name, date: rel.published_at, body: (rel.body || "").slice(0, 3000), total,
          assets: rel.assets.map(a => ({ name: a.name, url: a.browser_download_url, size: a.size, count: a.download_count }))
        };
        if (data) cacheSet(key, data);
      } catch (_) { return; }
    }
    if (data) { g._gh = data; g._dl = data.total; }
  }

  /* ---------- Hiệu ứng: tàn lửa bay, đếm số, hiện dần khi cuộn ---------- */
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const emberRuns = new WeakSet();
  function embers() {
    if (reduce) return;
    document.querySelectorAll("canvas.embers").forEach(cv => {
      if (emberRuns.has(cv)) return; emberRuns.add(cv);
      const ctx = cv.getContext("2d"); let W, H, parts = [];
      const size = () => { const r = cv.getBoundingClientRect(); W = cv.width = r.width * devicePixelRatio; H = cv.height = r.height * devicePixelRatio; };
      size(); addEventListener("resize", size);
      const N = Math.min(70, Math.round(W / 22));
      const make = (y) => ({ x: Math.random() * W, y: y ?? H + Math.random() * H * .3, r: (Math.random() * 1.8 + .6) * devicePixelRatio,
        vy: (Math.random() * .6 + .25) * devicePixelRatio, vx: (Math.random() - .5) * .3 * devicePixelRatio, a: Math.random() * .6 + .3, t: Math.random() * 6.28,
        c: Math.random() < .7 ? "255,140,60" : "255,209,102" });
      for (let i = 0; i < N; i++) parts.push(make(Math.random() * H));
      let vis = true;
      new IntersectionObserver(es => { vis = es[0].isIntersecting; }).observe(cv);
      (function tick() {
        if (vis && cv.isConnected) {
          ctx.clearRect(0, 0, W, H);
          for (const p of parts) {
            p.t += .03; p.y -= p.vy; p.x += p.vx + Math.sin(p.t) * .35;
            if (p.y < -10) Object.assign(p, make());
            const fade = Math.min(1, p.y / (H * .5));
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
            ctx.fillStyle = `rgba(${p.c},${p.a * fade})`; ctx.shadowBlur = 8 * devicePixelRatio; ctx.shadowColor = `rgba(${p.c},.9)`;
            ctx.fill();
          }
        }
        if (cv.isConnected) requestAnimationFrame(tick);
      })();
    });
  }
  function countUp() {
    document.querySelectorAll("[data-count]").forEach(el => {
      const end = +el.dataset.count; if (!end || reduce || el.dataset.done) return;
      el.dataset.done = 1; const t0 = performance.now(), dur = 1100;
      (function step(t) { const k = Math.min(1, (t - t0) / dur); el.textContent = fmtNum(Math.round(end * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); })(t0);
    });
  }
  let io;
  function reveal() {
    if (reduce || !("IntersectionObserver" in window)) return;
    io = io || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".card, .g-sec, .steps li, details, .sec-head, .donate-card, .info, .feat").forEach((el, i) => {
      if (el.classList.contains("reveal")) return;
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight) { el.classList.add("reveal", "in"); return; }   // đã trong màn hình thì hiện luôn
      el.classList.add("reveal"); el.style.transitionDelay = (i % 4) * 60 + "ms"; io.observe(el);
    });
  }
  function fx() { embers(); reveal(); }
  const tb = document.querySelector(".topbar");
  const onScroll = () => tb && tb.classList.toggle("scrolled", scrollY > 20);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  if (PAGE === "game") gamePage(); else homePage();

  /* =========================================================
     TRANG CHỦ
     ========================================================= */
  function homePage() {
    // link cũ dạng #/game/id → chuyển sang trang riêng
    const old = location.hash.match(/^#\/game\/(.+)$/);
    if (old) { location.replace("game.html?id=" + old[1]); return; }

    if (SITE.name) document.title = `${SITE.name} — Game Việt hóa miễn phí`;
    if (hasDonate) {
      $("#donate").hidden = false;
      $("#donateBox").innerHTML = donateHtml(false);
      const nd = $("#navDonate"); if (nd) nd.hidden = false;
    }
    $("#sampleNote").hidden = !GAMES.some(g => g.sample);

    function renderStats() {
      const done = GAMES.filter(g => g.status === "done").length;
      const dl = GAMES.reduce((s, g) => s + (g._dl || 0), 0);
      const items = [[GAMES.length, "Game"], [done, "Đã hoàn thành"], [GAMES.length - done, "Đang làm / Beta"]];
      if (dl) items.push([fmtNum(dl), "Lượt tải"]);
      $("#stats").innerHTML = items.map(([n, l]) => `<div class="stat"><b data-count="${String(n).replace(/\D/g, "")}">${n}</b><span>${l}</span></div>`).join("");
      countUp();
    }

    const state = { q: "", status: "all", genre: "all", sort: "updated" };
    const chips = [["all", "Tất cả"], ...Object.entries(STATUS).map(([k, v]) => [k, v.label])];
    $("#statusChips").innerHTML = chips.map(([k, l]) => `<button class="chip" role="tab" data-s="${k}" aria-selected="${k === "all"}">${l}</button>`).join("");
    $("#statusChips").addEventListener("click", e => {
      const b = e.target.closest(".chip"); if (!b) return;
      state.status = b.dataset.s;
      document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-selected", c === b));
      render();
    });
    const genres = [...new Set(GAMES.flatMap(g => g.genres || []))].sort((a, b) => a.localeCompare(b, "vi"));
    $("#genre").innerHTML = `<option value="all">Mọi thể loại</option>` + genres.map(x => `<option>${esc(x)}</option>`).join("");
    $("#genre").onchange = e => { state.genre = e.target.value; render(); };
    $("#sort").onchange = e => { state.sort = e.target.value; render(); };
    $("#q").oninput = e => { state.q = norm(e.target.value.trim()); render(); };

    function filtered() {
      const list = GAMES.filter(g =>
        (state.status === "all" || g.status === state.status) &&
        (state.genre === "all" || (g.genres || []).includes(state.genre)) &&
        (!state.q || norm([g.title, g.subtitle, ...(g.genres || []), g.engine, g.platform].join(" ")).includes(state.q))
      );
      const by = {
        updated: (a, b) => String(b.updated || "").localeCompare(String(a.updated || "")),
        title: (a, b) => a.title.localeCompare(b.title, "vi"),
        progress: (a, b) => (b.progress || 0) - (a.progress || 0),
        downloads: (a, b) => (b._dl || 0) - (a._dl || 0)
      }[state.sort];
      return list.sort(by);
    }

    function render() {
      const list = filtered();
      $("#empty").hidden = list.length > 0;
      $("#grid").innerHTML = list.map(g => {
        const st = STATUS[g.status] || STATUS.wip;
        return `<a class="card" href="${gameUrl(g)}" aria-label="Xem ${esc(g.title)}">
          <div class="cover" style="${coverStyle(g)}">${coverArt(g)}
            <span class="badge ${st.cls}">● ${st.label}</span>
            ${g.sample ? `<span class="badge sample">Mẫu</span>` : ""}
          </div>
          <div class="card-body">
            <h3 class="card-title">${esc(g.title)}</h3>
            ${g.subtitle ? `<div class="card-sub">${esc(g.subtitle)}</div>` : ""}
            <div class="tags">${(g.genres || []).slice(0, 3).map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
            <div class="bar" title="Tiến độ ${g.progress || 0}%"><i style="width:${Math.min(100, g.progress || 0)}%"></i></div>
            <div class="meta"><span>${g.progress || 0}%${hasVer(g.patchVersion) ? " · v" + esc(g.patchVersion) : ""}</span><span>${g._dl ? fmtNum(g._dl) + " lượt tải" : fmtDate(g.updated)}</span></div>
          </div>
        </a>`;
      }).join("");
    }

    function renderFeatured() {
      const pick = [...GAMES].filter(g => !g.sample).sort((a, b) => String(b.updated || "").localeCompare(String(a.updated || "")))[0]
        || GAMES[0];
      const box = $("#featured");
      if (!pick) { box.hidden = true; return; }
      const img = pick.hero || (pick.screenshots || [])[0] || pick.cover;
      if (img) $("#heroBg").style.backgroundImage = `url('${esc(img)}')`;
      const st = STATUS[pick.status] || STATUS.wip;
      box.innerHTML = `<a class="feat" href="${gameUrl(pick)}">
        <div class="feat-img" style="${img ? `background-image:url('${esc(img)}')` : coverStyle(pick)}"></div>
        <div class="feat-body">
          <span class="feat-tag">★ Mới phát hành</span>
          <h3>${esc(pick.title)}</h3>
          <p>${esc((pick.description || "").slice(0, 120))}${(pick.description || "").length > 120 ? "…" : ""}</p>
          <div class="feat-meta">
            <span class="pill ${st.cls}">● ${st.label}</span>
            ${hasVer(pick.patchVersion) ? `<span class="pill">Việt hóa v${esc(pick.patchVersion)}</span>` : ""}
            ${pick._dl ? `<span class="pill">⬇ ${fmtNum(pick._dl)} lượt tải</span>` : ""}
          </div>
          <span class="feat-go">Xem chi tiết & tải về →</span>
        </div>
      </a>`;
    }

    renderStats(); render(); renderFeatured(); fx();
    Promise.all(GAMES.map(loadGithub)).then(() => { if (GAMES.some(g => g._gh)) { renderStats(); render(); renderFeatured(); reveal(); } });
  }

  /* =========================================================
     TRANG CHI TIẾT GAME  (game.html?id=...)
     ========================================================= */
  function gamePage() {
    const id = new URLSearchParams(location.search).get("id");
    const g = GAMES.find(x => x.id === id);
    const root = $("#game");
    if (!g) {
      root.innerHTML = `<div class="wrap notfound"><h1>Không tìm thấy game</h1><p class="muted">Link có thể đã cũ hoặc game đã đổi tên.</p><a class="btn" href="index.html">Xem tất cả game</a></div>`;
      return;
    }
    document.title = `${g.title} Việt hóa — ${SITE.name || ""}`;
    const shots = g.screenshots || [];
    const heroImg = g.hero || shots[0] || g.cover || "";

    function render() {
      const st = STATUS[g.status] || STATUS.wip;
      const gh = g._gh;
      const downloads = gh && gh.assets.length
        ? gh.assets.map(a => ({ label: gh.assets.length > 1 ? a.name : "Tải về máy", url: a.url, note: `${gh.assets.length > 1 ? "" : a.name + " · "}${fmtSize(a.size)} · ${fmtNum(a.count)} lượt tải` }))
        : (g.downloads || []);
      const main = downloads[0];
      const row = (k, v) => v ? `<div class="row"><span>${k}</span><b>${esc(v)}</b></div>` : "";

      root.innerHTML = `
        <section class="g-hero">
          <div class="g-hero-bg" style="${heroImg ? `background-image:url('${esc(heroImg)}')` : coverStyle(g)}" aria-hidden="true"></div>
          <canvas class="embers" aria-hidden="true"></canvas>
          <div class="wrap g-hero-in">
            <div class="g-thumb cover" style="${coverStyle(g)}">${coverArt(g)}</div>
            <div class="g-head">
              <div class="g-badges">
                <span class="pill ${st.cls}">● ${st.label}</span>
                ${(g.genres || []).map(t => `<span class="pill">${esc(t)}</span>`).join("")}
              </div>
              <h1>${esc(g.title)}</h1>
              ${g.subtitle ? `<p class="g-sub">${esc(g.subtitle)}</p>` : ""}
              <div class="g-cta">
                ${main ? `<a class="btn btn-lg" href="${esc(main.url)}">⬇ Tải bản Việt hóa${gh ? " " + esc(gh.tag) : hasVer(g.patchVersion) ? " v" + esc(g.patchVersion) : ""}</a>`
                       : `<a class="btn btn-lg" aria-disabled="true">Chưa phát hành</a>`}
                ${shots.length ? `<a class="btn btn-ghost btn-lg" href="#anh">Xem ảnh trong game</a>` : ""}
              </div>
            </div>
          </div>
        </section>

        <div class="wrap g-body">
          <div class="g-main">
            ${g.sample ? `<p class="sample-note">Đây là game mẫu để minh họa giao diện.</p>` : ""}
            <section class="g-sec">
              <h2>Giới thiệu bản Việt hóa</h2>
              <p class="g-desc">${esc(g.description || "")}</p>
            </section>

            ${g.features && g.features.length ? `<section class="g-sec"><h2>Đã dịch những gì</h2>
              <ul class="g-feat">${g.features.map(f => `<li>${esc(f)}</li>`).join("")}</ul></section>` : ""}

            ${shots.length ? `<section class="g-sec" id="anh"><h2>Ảnh trong game <span class="muted">(${shots.length})</span></h2>
              <div class="g-shots">${shots.map((s, i) =>
                `<button class="shot" data-i="${i}" aria-label="Phóng to ảnh ${i + 1}"><img src="${esc(s)}" alt="Ảnh ${i + 1} trong game ${esc(g.title)}" loading="${i ? "lazy" : "eager"}"></button>`).join("")}
              </div><p class="muted small">Bấm vào ảnh để xem cỡ lớn.</p></section>` : ""}

            ${g.install && g.install.length ? `<section class="g-sec" id="cai-dat"><h2>Hướng dẫn cài đặt</h2>
              <ol class="steps">${g.install.map(f => `<li>${esc(f)}</li>`).join("")}</ol></section>` : ""}

            ${gh && gh.body && gh.body.replace(/\(?https?:\/\/\S+\)?/g, "").replace(/[#*_>\-\s]/g, "").length > 20 ? `<section class="g-sec"><h2>Ghi chú bản phát hành ${esc(gh.tag)}</h2><div class="g-notes">${esc(gh.body)}</div></section>` : ""}

            ${g.changelog && g.changelog.length ? `<section class="g-sec"><h2>Lịch sử cập nhật</h2>
              <div class="log">${g.changelog.map(c => `<div><b>v${esc(c.version)}</b> <span class="muted">· ${fmtDate(c.date)}</span><br>${esc(c.notes)}</div>`).join("")}</div></section>` : ""}
          </div>

          <aside class="g-side">
            <div class="info">
              <div class="row"><span>Trạng thái</span><b class="st-${st.cls}">${st.label}</b></div>
              <div class="bar"><i style="width:${Math.min(100, g.progress || 0)}%"></i></div>
              ${row("Tiến độ", (g.progress || 0) + "%")}
              ${row("Bản Việt hóa", gh ? gh.tag : hasVer(g.patchVersion) && "v" + g.patchVersion)}
              ${row("Phiên bản game", g.gameVersion)}
              ${row("Nền tảng", g.platform)}
              ${row("Engine", g.engine)}
              ${row("Dung lượng", gh && gh.assets[0] ? fmtSize(gh.assets[0].size) : g.size)}
              ${row("Cập nhật", fmtDate(gh ? gh.date : g.updated))}
              ${g._dl ? row("Lượt tải", fmtNum(g._dl)) : ""}
              <div class="dl">
                ${downloads.length
                  ? downloads.map(d => `<a class="btn" href="${esc(d.url)}">⬇ ${esc(d.label)}</a>${d.note ? `<small>${esc(d.note)}</small>` : ""}`).join("")
                  : `<a class="btn" aria-disabled="true">Chưa phát hành</a>`}
                <button class="btn btn-ghost btn-sm" data-share>🔗 Sao chép link game</button>
                ${g.github && g.github.repo ? `<a class="btn btn-ghost btn-sm" href="https://github.com/${esc(g.github.repo)}/issues" target="_blank" rel="noopener">Báo lỗi dịch</a>` : ""}
              </div>
            </div>
            ${donateHtml(true)}
          </aside>
        </div>`;
    }

    /* ---- Xem ảnh cỡ lớn ---- */
    const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCount = $("#lbCount");
    let cur = 0;
    function show(i) {
      cur = (i + shots.length) % shots.length;
      lbImg.src = shots[cur];
      lbImg.alt = `Ảnh ${cur + 1} trong game ${g.title}`;
      lbCount.textContent = `${cur + 1} / ${shots.length}`;
      lb.querySelectorAll(".lb-nav").forEach(b => b.hidden = shots.length < 2);
    }
    function openLb(i) { show(i); lb.hidden = false; document.body.style.overflow = "hidden"; $("#lbClose").focus(); }
    function closeLb() { lb.hidden = true; document.body.style.overflow = ""; }
    lb.addEventListener("click", e => {
      if (e.target.closest("#lbPrev")) show(cur - 1);
      else if (e.target.closest("#lbNext")) show(cur + 1);
      else if (e.target.closest("#lbClose") || e.target === lb || e.target.classList.contains("lb-stage")) closeLb();
    });
    document.addEventListener("keydown", e => {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
    let sx = null;
    lb.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); sx = null; });

    root.addEventListener("click", e => {
      const s = e.target.closest(".shot"); if (s) openLb(+s.dataset.i);
      if (e.target.closest("[data-share]")) copy(location.href);
    });

    render(); fx();
    loadGithub(g).then(() => { if (g._gh) { render(); fx(); } });
  }
})();
