(() => {
  const SITE = window.SITE || {};
  const GAMES = (window.GAMES || []).map(g => ({ ...g, _dl: null, _gh: null }));
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

  /* ---------- Site info ---------- */
  document.querySelectorAll("[data-site]").forEach(el => { el.textContent = SITE[el.dataset.site] || el.textContent; });
  if (SITE.name) document.title = `${SITE.name} — Game Việt hóa miễn phí`;
  if (SITE.github) { const a = $("#navGithub"); a.href = SITE.github; a.hidden = false; }
  const contacts = [["Facebook", SITE.facebook], ["Discord", SITE.discord], ["GitHub", SITE.github], ["Email", SITE.email && "mailto:" + SITE.email]]
    .filter(([, u]) => u).map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${n}</a>`);
  $("#contactLinks").innerHTML = contacts.join("");
  if (SITE.donate && SITE.donate.bank) {
    const d = SITE.donate;
    $("#donate").hidden = false;
    $("#donateBox").innerHTML = `<span>Ngân hàng</span><b>${esc(d.bank)}</b><span>Số TK</span><b>${esc(d.account)}</b><span>Chủ TK</span><b>${esc(d.holder)}</b>${d.note ? `<span>Nội dung</span><b>${esc(d.note)}</b>` : ""}`;
  }
  $("#sampleNote").hidden = !GAMES.some(g => g.sample);

  /* ---------- Cover art ---------- */
  function coverStyle(g) {
    if (g.cover) return `background-image:url('${esc(g.cover)}')`;
    const [a, b] = g.colors && g.colors.length ? g.colors : ["#222a3d", "#e63946"];
    return `background-image:linear-gradient(135deg, ${a} 0%, ${a} 35%, ${b} 120%)`;
  }
  const coverArt = g => g.cover ? "" : `<div class="cover-art"><span>${esc(g.title)}</span></div>`;

  /* ---------- Stats ---------- */
  function renderStats() {
    const done = GAMES.filter(g => g.status === "done").length;
    const dl = GAMES.reduce((s, g) => s + (g._dl || 0), 0);
    const items = [[GAMES.length, "Game"], [done, "Đã hoàn thành"], [GAMES.length - done, "Đang làm / Beta"]];
    if (dl) items.push([fmtNum(dl), "Lượt tải"]);
    $("#stats").innerHTML = items.map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("");
  }

  /* ---------- Filters ---------- */
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
    let list = GAMES.filter(g =>
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

  /* ---------- Grid ---------- */
  function render() {
    const list = filtered();
    $("#empty").hidden = list.length > 0;
    $("#grid").innerHTML = list.map(g => {
      const st = STATUS[g.status] || STATUS.wip;
      return `<button class="card" data-id="${esc(g.id)}" aria-label="Xem ${esc(g.title)}">
        <div class="cover" style="${coverStyle(g)}">${coverArt(g)}
          <span class="badge ${st.cls}">● ${st.label}</span>
          ${g.sample ? `<span class="badge sample">Mẫu</span>` : ""}
        </div>
        <div class="card-body">
          <h3 class="card-title">${esc(g.title)}</h3>
          ${g.subtitle ? `<div class="card-sub">${esc(g.subtitle)}</div>` : ""}
          <div class="tags">${(g.genres || []).slice(0, 3).map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          <div class="bar" title="Tiến độ ${g.progress || 0}%"><i style="width:${Math.min(100, g.progress || 0)}%"></i></div>
          <div class="meta"><span>${g.progress || 0}%${g.patchVersion && g.patchVersion !== "—" ? " · v" + esc(g.patchVersion) : ""}</span><span>${g._dl ? fmtNum(g._dl) + " lượt tải" : fmtDate(g.updated)}</span></div>
        </div>
      </button>`;
    }).join("");
  }
  $("#grid").addEventListener("click", e => { const c = e.target.closest(".card"); if (c) location.hash = "#/game/" + c.dataset.id; });

  /* ---------- Detail modal ---------- */
  const modal = $("#modal");
  function openGame(id) {
    const g = GAMES.find(x => x.id === id);
    if (!g) return;
    const st = STATUS[g.status] || STATUS.wip;
    const gh = g._gh;
    const downloads = gh && gh.assets.length
      ? gh.assets.map(a => ({ label: a.name, url: a.url, note: `${fmtSize(a.size)} · ${fmtNum(a.count)} lượt tải` }))
      : (g.downloads || []);
    const row = (k, v) => v ? `<div><span>${k}</span><b>${esc(v)}</b></div>` : "";
    $("#mBody").innerHTML = `
      <div class="m-cover" style="${coverStyle(g)}"><button class="m-close" aria-label="Đóng">×</button></div>
      <div class="m-head">
        <h2 id="mTitle">${esc(g.title)}</h2>
        ${g.subtitle ? `<div class="sub">${esc(g.subtitle)}</div>` : ""}
      </div>
      <div class="m-content">
        <div>
          ${g.sample ? `<p class="sample-note">Đây là game mẫu để minh họa giao diện.</p>` : ""}
          <h3>Giới thiệu bản Việt hóa</h3>
          <p>${esc(g.description || "")}</p>
          ${g.features && g.features.length ? `<h3>Đã dịch</h3><ul class="feat">${g.features.map(f => `<li>${esc(f)}</li>`).join("")}</ul>` : ""}
          ${g.install && g.install.length ? `<h3>Hướng dẫn cài đặt</h3><ol class="inst">${g.install.map(f => `<li>${esc(f)}</li>`).join("")}</ol>` : ""}
          ${g.screenshots && g.screenshots.length ? `<h3>Ảnh trong game</h3><div class="shots">${g.screenshots.map(s => `<a href="${esc(s)}" target="_blank" rel="noopener"><img src="${esc(s)}" alt="Ảnh ${esc(g.title)}" loading="lazy"></a>`).join("")}</div>` : ""}
          ${g.changelog && g.changelog.length ? `<h3>Lịch sử cập nhật</h3><div class="log">${g.changelog.map(c => `<div><b>v${esc(c.version)}</b> <span class="muted">· ${fmtDate(c.date)}</span><br>${esc(c.notes)}</div>`).join("")}</div>` : ""}
          ${gh && gh.body ? `<h3>Ghi chú bản phát hành (GitHub)</h3><p style="white-space:pre-line">${esc(gh.body)}</p>` : ""}
        </div>
        <aside class="info">
          <div><span>Trạng thái</span><b class="badge-inline" style="color:var(--${st.cls === "done" ? "green" : st.cls === "beta" ? "blue" : "gold"})">${st.label}</b></div>
          <div class="bar"><i style="width:${Math.min(100, g.progress || 0)}%"></i></div>
          ${row("Tiến độ", (g.progress || 0) + "%")}
          ${row("Bản Việt hóa", gh ? gh.tag : g.patchVersion && g.patchVersion !== "—" && "v" + g.patchVersion)}
          ${row("Phiên bản game", g.gameVersion)}
          ${row("Nền tảng", g.platform)}
          ${row("Engine", g.engine)}
          ${row("Dung lượng", gh && gh.assets[0] ? fmtSize(gh.assets[0].size) : g.size)}
          ${row("Cập nhật", fmtDate(gh ? gh.date : g.updated))}
          ${g._dl ? row("Lượt tải", fmtNum(g._dl)) : ""}
          <div class="dl">
            ${downloads.length
              ? downloads.map(d => `<a class="btn" href="${esc(d.url)}" target="_blank" rel="noopener">⬇ ${esc(d.label)}</a>${d.note ? `<small>${esc(d.note)}</small>` : ""}`).join("")
              : `<a class="btn" aria-disabled="true">Chưa phát hành</a>`}
            <button class="btn btn-ghost btn-sm" data-share>🔗 Sao chép link game</button>
            ${g.github && g.github.repo ? `<a class="btn btn-ghost btn-sm" href="https://github.com/${esc(g.github.repo)}/issues" target="_blank" rel="noopener">Báo lỗi dịch</a>` : ""}
          </div>
        </aside>
      </div>`;
    document.title = `${g.title} Việt hóa — ${SITE.name || ""}`;
    if (!modal.open) modal.showModal();
    $("#mBody").scrollTop = 0;
  }
  function closeModal() { if (modal.open) modal.close(); }
  modal.addEventListener("close", () => {
    document.title = `${SITE.name} — Game Việt hóa miễn phí`;
    if (location.hash.startsWith("#/game/")) history.pushState("", "", location.pathname + location.search);
  });
  modal.addEventListener("click", e => {
    if (e.target === modal || e.target.closest(".m-close")) closeModal();
    if (e.target.closest("[data-share]")) copy(location.href);
  });
  function route() {
    const m = location.hash.match(/^#\/game\/(.+)$/);
    if (m) openGame(decodeURIComponent(m[1])); else closeModal();
  }
  window.addEventListener("hashchange", route);

  function copy(text) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
      () => toast("Đã sao chép link"), () => toast(text));
  }
  let tt; function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2200); }

  /* ---------- GitHub Releases (tự động lấy link + lượt tải) ---------- */
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
          tag: rel.tag_name, date: rel.published_at, body: (rel.body || "").slice(0, 1500), total,
          assets: rel.assets.map(a => ({ name: a.name, url: a.browser_download_url, size: a.size, count: a.download_count }))
        };
        if (data) cacheSet(key, data);
      } catch (_) { return; }
    }
    if (data) { g._gh = data; g._dl = data.total; }
  }

  /* ---------- Start ---------- */
  renderStats(); render(); route();
  Promise.all(GAMES.map(loadGithub)).then(() => {
    if (GAMES.some(g => g._gh)) { renderStats(); render(); const m = location.hash.match(/^#\/game\/(.+)$/); if (m && modal.open) openGame(decodeURIComponent(m[1])); }
  });
})();
