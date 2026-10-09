# -*- coding: utf-8 -*-
"""
NH Việt Hóa – Công cụ chuẩn bị đăng bản Việt hóa lên web
==========================================================
Nhấp đúp file này (hoặc "Dang ban moi.bat") để mở giao diện.

Công cụ làm phần CHUẨN BỊ trên máy, không đụng tới GitHub:
  1. Đọc thư mục bản dịch (vd Downloads\\VietHoa_BoCai\\Shogun2):
     file zip, THONG_TIN_WEB.md, src\\CaiVietHoa.cs
  2. Đối chiếu số phiên bản ở 3 chỗ (tên zip, dòng cuối "Lịch sử phiên bản",
     PHIEN_BAN trong mã nguồn). Lệch nhau -> lấy số lớn nhất và CẢNH BÁO.
  3. Tính SHA256, cập nhật games.js (phiên bản, ngày, lịch sử, checksum,
     phiên bản game theo ngày upload), xử lý ảnh bìa + ảnh trong game.
  4. Chép zip vào "_ban-phat-hanh (khong upload len web)" và soạn sẵn
     ghi chú phát hành (file .release.md) để dán lên GitHub Releases.
  5. Chạy build.js nếu máy có Node (không có cũng được, GitHub tự build).

Nguyên tắc: gặp gì lạ thì DỪNG và báo, không đoán. Luôn xem trước rồi mới ghi.
Chỉ cần Python 3.8+ và Pillow (pip install pillow). Không cần mạng.

Chạy không giao diện (để kiểm tra):
  python dang_ban.pyw --kiem-tra "<thư mục bản dịch>" [--game <id>]
"""
import datetime as dt
import difflib
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys

PHIEN_BAN_CONG_CU = "1.0"
THU_MUC_WEB_MAC_DINH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
THU_MUC_PHAT_HANH = "_ban-phat-hanh (khong upload len web)"
URL_WEB = "https://nguyenhoangnhviethoa.github.io"


class LoiDung(Exception):
    """Lỗi cần người dùng xử lý – công cụ dừng lại, không ghi gì."""


# ----------------------------------------------------------------- tiện ích
def so_phien_ban(s):
    s = re.split(r"[–—-]", str(s))[0].strip()
    return tuple(int(x) for x in s.split("."))


def sha256_file(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for khoi in iter(lambda: f.read(1 << 20), b""):
            h.update(khoi)
    return h.hexdigest()


def doc(p):
    with open(p, encoding="utf-8-sig") as f:
        return f.read()


def bo_dinh_dang(s):
    """Bỏ **đậm**, `code` của markdown."""
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"`(.+?)`", r"\1", s)
    return s.strip()


def viet_hoa_dau(s):
    return s[:1].upper() + s[1:] if s else s


def ngay_vn(iso):
    y, m, d = iso.split("-")
    return f"{d}/{m}/{y}"


def ngay_iso(vn):
    d, m, y = vn.split("/")
    return f"{y}-{int(m):02d}-{int(d):02d}"


def kich_thuoc(b):
    return f"{b / 1e6:.1f}".replace(".", ",") + " MB"


# ----------------------------------------------------- đọc thư mục bản dịch
def chia_muc(md):
    """THONG_TIN_WEB.md -> {tiêu đề '## ...' viết thường: [dòng]}"""
    muc, ten = {}, None
    for dong in md.splitlines():
        m = re.match(r"^##\s+(.+?)\s*$", dong)
        if m:
            ten = m.group(1).strip().lower()
            muc[ten] = []
        elif ten is not None:
            muc[ten].append(dong.rstrip())
    return muc


def tim_muc(muc, *tu_khoa):
    for ten, dong in muc.items():
        if all(t in ten for t in tu_khoa):
            return dong
    return None


def ds_gach_dau(dong):
    """Danh sách '- ...' cấp 1; các mục con '  - ...' được ghép vào sau mục cha."""
    muc = []  # [cha, [con]]
    for d in dong:
        m1 = re.match(r"^- (.+)$", d)
        m2 = re.match(r"^\s{2,}- (.+)$", d)
        if m1:
            muc.append([bo_dinh_dang(m1.group(1)), []])
        elif m2 and muc:
            muc[-1][1].append(bo_dinh_dang(m2.group(1)))
    kq = []
    for cha, con in muc:
        if con:
            cha = re.sub(r"[.\s]*Gồm:?\s*$", "", cha).rstrip(" .:")
            cha += ": " + "; ".join(c.rstrip(".") for c in con)
            cha = re.sub(r":\s*;\s*", ": ", cha)
        kq.append(cha)
    return kq


def doc_thu_muc_ban_dich(thu_muc):
    """Đọc mọi thứ cần thiết. Thiếu file quan trọng -> LoiDung."""
    if not os.path.isdir(thu_muc):
        raise LoiDung(f"Không thấy thư mục:\n{thu_muc}")
    zips = [f for f in os.listdir(thu_muc) if f.lower().endswith(".zip")]
    if not zips:
        raise LoiDung("Không có file .zip nào ngay trong thư mục bản dịch (không tính thư mục ban_cu).")
    zips.sort(key=lambda f: os.path.getmtime(os.path.join(thu_muc, f)), reverse=True)
    zip_ten = zips[0]
    canh_bao = []
    if len(zips) > 1:
        canh_bao.append(f"Có {len(zips)} file zip; dùng file mới sửa gần nhất: {zip_ten}")

    p_md = os.path.join(thu_muc, "THONG_TIN_WEB.md")
    if not os.path.isfile(p_md):
        raise LoiDung("Thiếu THONG_TIN_WEB.md trong thư mục bản dịch.")
    muc = chia_muc(doc(p_md))

    p_cs = None
    for goc, _, files in os.walk(os.path.join(thu_muc, "src")):
        for f in files:
            if f.lower().endswith(".cs"):
                p_cs = os.path.join(goc, f)
                break
        if p_cs:
            break

    # --- 3 nguồn phiên bản
    m = re.search(r"v(\d+(?:\.\d+){1,3})", zip_ten, re.I)
    pb_zip = m.group(1) if m else None
    lich_su = []
    for d in (tim_muc(muc, "lịch sử") or []):
        m = re.match(r"^- (\d+(?:\.\d+){1,3}(?:\s*[–—-]\s*\d+(?:\.\d+){1,3})?)\s*\(([\d/–—-]+)\)\s*:\s*(.+)$", d)
        mc = re.match(r"^\s{2,}- (.+)$", d)
        if m:
            ngay = re.split(r"[–—-]", m.group(2))[-1]
            lich_su.append({"version": re.sub(r"\s+", "", m.group(1)), "date": ngay_iso(ngay), "notes": viet_hoa_dau(bo_dinh_dang(m.group(3)))})
        elif mc and lich_su:
            n = lich_su[-1]["notes"].rstrip()
            n = n[:-1] + ":" if n.endswith(".") else n
            lich_su[-1]["notes"] = n + (" " if n.endswith(":") else "; ") + bo_dinh_dang(mc.group(1)).rstrip(".")
    for c in lich_su:
        c["notes"] = re.sub(r":\s*$", ".", c["notes"])
        if not c["notes"].endswith((".", "!", "?", "…", ")")):
            c["notes"] += "."
    if not lich_su:
        raise LoiDung("Không đọc được mục 'Lịch sử phiên bản' trong THONG_TIN_WEB.md.\nMỗi dòng cần có dạng:  - 1.0.2 (08/10/2026): nội dung sửa")
    pb_md = lich_su[-1]["version"]
    pb_cs = None
    if p_cs:
        m = re.search(r'PHIEN_BAN\s*=\s*"([\d.]+)"', doc(p_cs)) or re.search(r'AssemblyVersion\("([\d.]+?)(?:\.0)?"\)', doc(p_cs))
        pb_cs = m.group(1) if m else None

    nguon = {"Tên file zip": pb_zip, "THONG_TIN_WEB.md (dòng cuối lịch sử)": pb_md, "Mã nguồn (PHIEN_BAN)": pb_cs}
    co = [v for v in nguon.values() if v]
    phien_ban = max(co, key=so_phien_ban)
    khop = len(set(co)) == 1 and len(co) == 3
    if not khop:
        canh_bao.append("Số phiên bản KHÔNG khớp giữa 3 chỗ → tạm lấy số lớn nhất " + phien_ban + ". Kiểm tra lại trước khi đăng.")

    # --- thông tin chung
    chung = {}
    for d in (tim_muc(muc, "thông tin chung") or []):
        m = re.match(r"^- \*\*(.+?):\*\*\s*(.+)$", d)
        if m:
            chung[m.group(1).strip().lower()] = bo_dinh_dang(m.group(2))
    ten_game = chung.get("tên game", "")
    phu_de = ""
    m = re.match(r"^(.+?)\s*\((.+)\)\s*$", ten_game)
    if m:
        ten_game, phu_de = m.group(1).strip(), viet_hoa_dau(m.group(2).strip())

    gioi_thieu = " ".join(x.strip() for x in (tim_muc(muc, "giới thiệu") or []) if x.strip())
    da_dich = ds_gach_dau(tim_muc(muc, "đã dịch") or [])
    gioi_han = ds_gach_dau(tim_muc(muc, "chưa dịch") or [])
    cai = []
    for d in (tim_muc(muc, "hướng dẫn cài") or []):
        m = re.match(r"^\d+\.\s+(.+)$", d)
        if m and not re.search(r"smartscreen|run anyway|windows protected", m.group(1), re.I):
            cai.append(bo_dinh_dang(m.group(1)))

    p_zip = os.path.join(thu_muc, zip_ten)
    return {
        "thu_muc": thu_muc, "zip_ten": zip_ten, "zip_duong_dan": p_zip,
        "sha256": sha256_file(p_zip), "kich_thuoc": kich_thuoc(os.path.getsize(p_zip)),
        "nguon_phien_ban": nguon, "phien_ban": phien_ban, "khop": khop, "canh_bao": canh_bao,
        "lich_su": lich_su, "ten_game": ten_game, "phu_de": phu_de, "chung": chung,
        "gioi_thieu": gioi_thieu, "da_dich": da_dich, "gioi_han": gioi_han, "cai_dat": cai,
    }


# ------------------------------------------------------------ games.js
def _vi_tri_mang(js):
    i = js.index("window.GAMES")
    i = js.index("[", i)
    return i


def _cuoi_khoi(js, i):
    """Từ dấu { hoặc [ ở vị trí i, trả về vị trí ngay sau dấu đóng tương ứng
    (bỏ qua nội dung trong chuỗi và chú thích //)."""
    sau, trong_chuoi, thoat, j = 0, None, False, i
    while j < len(js):
        c = js[j]
        if trong_chuoi:
            if thoat:
                thoat = False
            elif c == "\\":
                thoat = True
            elif c == trong_chuoi:
                trong_chuoi = None
        elif c in "\"'":
            trong_chuoi = c
        elif js.startswith("//", j):
            k = js.find("\n", j)
            j = len(js) if k < 0 else k
            continue
        elif c in "{[":
            sau += 1
        elif c in "}]":
            sau -= 1
            if sau == 0:
                return j + 1
        j += 1
    raise LoiDung("games.js có cấu trúc lạ (không tìm thấy ngoặc đóng).")


def _bo_chu_thich(s):
    out, trong_chuoi, thoat, j = [], None, False, 0
    while j < len(s):
        c = s[j]
        if trong_chuoi:
            out.append(c)
            if thoat:
                thoat = False
            elif c == "\\":
                thoat = True
            elif c == trong_chuoi:
                trong_chuoi = None
        elif c == '"':
            trong_chuoi = c
            out.append(c)
        elif s[j:j + 2] == "//":
            j = s.find("\n", j)
            if j < 0:
                break
            continue
        else:
            out.append(c)
        j += 1
    return re.sub(r",(\s*[}\]])", r"\1", "".join(out))


def danh_sach_game(js):
    """[(id, title, vị trí bắt đầu, vị trí kết thúc, dict)]"""
    i = _vi_tri_mang(js)
    het = _cuoi_khoi(js, i)
    kq, j = [], i + 1
    while True:
        k = js.find("{", j, het)
        if k < 0:
            break
        e = _cuoi_khoi(js, k)
        try:
            obj = json.loads(_bo_chu_thich(js[k:e]))
        except Exception as ex:
            raise LoiDung(f"Không đọc được một game trong games.js (gần ký tự {k}): {ex}")
        kq.append((obj.get("id"), obj.get("title"), k, e, obj))
        j = e
    return kq


def _dinh_dang(obj):
    s = json.dumps(obj, ensure_ascii=False, indent=2)
    return "\n".join("  " + d for d in s.split("\n"))


def tao_game_moi(tt, id_game, repo, phien_ban_game, ngay):
    return {
        "id": id_game,
        "title": tt["ten_game"],
        "subtitle": tt["phu_de"],
        "cover": "",
        "colors": ["#1b2a4a", "#e63946"],
        "genres": [viet_hoa_dau(g.strip()) for g in re.split(r",|·", re.sub(r"\(.*?\)", "", tt["chung"].get("thể loại", ""))) if g.strip()][:3],
        "platform": tt["chung"].get("nền tảng", "Steam"),
        "engine": re.sub(r"\s*\(.*?\)", "", tt["chung"].get("engine", "")),
        "gameVersion": phien_ban_game,
        "patchVersion": tt["phien_ban"],
        "status": "done", "progress": 100,
        "updated": ngay,
        "size": tt["kich_thuoc"],
        "description": tt["gioi_thieu"],
        "features": tt["da_dich"],
        "limits": tt["gioi_han"],
        "install": tt["cai_dat"],
        "installNotes": [],
        "checksums": {},
        "virustotal": "",
        "github": {"repo": repo, "tag": "latest"},
        "downloads": [],
        "changelog": [],
        "screenshots": [],
    }


def cap_nhat_game(goc, tt, phien_ban_game, ngay, lam_moi_noi_dung):
    g = json.loads(json.dumps(goc))
    g["patchVersion"] = tt["phien_ban"]
    g["updated"] = ngay
    g["size"] = tt["kich_thuoc"]
    if phien_ban_game:
        g["gameVersion"] = phien_ban_game
    g.setdefault("checksums", {})[tt["zip_ten"]] = tt["sha256"]
    # lịch sử: bản mới nhất ở đầu; giữ dòng cũ không có trong file md
    # THONG_TIN_WEB.md là nguồn chuẩn: lịch sử trên web = đúng lịch sử trong file
    g["changelog"] = sorted(tt["lich_su"], key=lambda c: so_phien_ban(c["version"]), reverse=True)
    if lam_moi_noi_dung:
        for k, v in (("description", tt["gioi_thieu"]), ("features", tt["da_dich"]),
                     ("limits", tt["gioi_han"]), ("install", tt["cai_dat"])):
            if v:
                g[k] = v
    return g


def ghi_vao_js(js, game, vi_tri=None):
    """vi_tri=(bắt đầu, kết thúc) để thay; None = chèn game mới lên đầu mảng."""
    if vi_tri:
        a, b = vi_tri
        # _dinh_dang thêm 2 khoảng trắng đầu dòng; vị trí a đã ở sau phần thụt lề
        return js[:a] + _dinh_dang(game).lstrip() + js[b:]
    i = _vi_tri_mang(js) + 1
    xuong = js[i:i + 1] == "\n"
    return js[:i] + ("\n" if not xuong else "") + _dinh_dang(game) + ",\n" + js[i + (1 if xuong else 0):]


# ---------------------------------------------------------------- ảnh
def lam_anh(web, id_game, anh_bia, anh_trong_game):
    """Trả về (cover, [screenshots], hero) – đường dẫn tương đối trong web."""
    from PIL import Image
    cover, shots = None, []
    if anh_bia:
        im = Image.open(anh_bia).convert("RGB")
        w, h = im.size
        cw = int(w * 0.55)                     # cắt phần giữa-trên, nơi thường có logo game
        ch = int(cw * 9 / 16)
        x = (w - cw) // 2
        if ch > h:
            ch, cw = h, int(h * 16 / 9)
            x = (w - cw) // 2
        bia = im.crop((x, 0, x + cw, ch)).resize((960, 540), Image.LANCZOS)
        cover = f"assets/covers/{id_game}.jpg"
        bia.save(os.path.join(web, cover), quality=85, optimize=True, progressive=True)
    for n, p in enumerate(anh_trong_game, 1):
        im = Image.open(p).convert("RGB")
        im.thumbnail((1600, 900), Image.LANCZOS)
        rel = f"assets/shots/{id_game}-{n}.jpg"
        im.save(os.path.join(web, rel), quality=82, optimize=True, progressive=True)
        shots.append(rel)
    hero = shots[1] if len(shots) >= 2 else None
    return cover, shots, hero


def ghi_chu_phat_hanh(tt, g):
    moi = tt["lich_su"][-1]
    trang = f"{URL_WEB}/game/{g['id']}.html"
    return (f"# Việt hóa {g['title']} v{tt['phien_ban']}\n\n"
            f"Tag: v{tt['phien_ban']}\n\n---\n\n"
            f"{moi['notes']}\n\n"
            f"Đã cài bản cũ thì chạy bộ cài mới đè lên là được. Hướng dẫn cài và ảnh trong game: {trang}\n\n"
            f"SHA256 ({tt['zip_ten']}): `{tt['sha256']}`\n")


# ------------------------------------------------------------- toàn bộ
def chuan_bi(web, thu_muc_ban_dich, id_game=None, repo=None, phien_ban_game=None,
             lam_moi_noi_dung=False, anh_bia=None, anh_trong_game=(), ghi=False):
    """Trả về dict báo cáo. ghi=False chỉ xem trước."""
    p_js = os.path.join(web, "games.js")
    if not os.path.isfile(p_js):
        raise LoiDung(f"Không thấy games.js trong thư mục web:\n{web}")
    tt = doc_thu_muc_ban_dich(thu_muc_ban_dich)
    js_cu = doc(p_js)
    ds = danh_sach_game(js_cu)
    ngay = dt.date.today().isoformat()
    tim = [x for x in ds if x[0] == id_game]
    if tim:
        _, _, a, b, goc = tim[0]
        if so_phien_ban(tt["phien_ban"]) < so_phien_ban(goc.get("patchVersion", "0")):
            raise LoiDung(f"Phiên bản {tt['phien_ban']} cũ hơn bản đang có trên web ({goc.get('patchVersion')}). Dừng lại.")
        game = cap_nhat_game(goc, tt, phien_ban_game, ngay, lam_moi_noi_dung)
        vi_tri = (a, b)
    else:
        if not id_game or not re.match(r"^[a-z0-9]+(-[a-z0-9]+)*$", id_game):
            raise LoiDung("Game mới cần mã (id) dạng chữ thường-gạch-ngang, vd: total-war-shogun-2")
        if not repo:
            raise LoiDung("Game mới cần tên repo GitHub, vd: nguyenhoangnhviethoa/Viet-hoa-Shogun-2")
        _tt = lambda n: re.sub(r"_?v?\d[\d.]*\.zip$", "", n, flags=re.I).lower()
        for x in ds:
            if any(_tt(k) == _tt(tt["zip_ten"]) for k in (x[4].get("checksums") or {})):
                raise LoiDung(f"File {tt['zip_ten']} là bản mới của game đã có trên web: \"{x[1]}\".\n"
                              f"Ở mục 3, chọn game đó thay vì \"＋ Game mới\" (nếu không sẽ thành 2 game trùng nhau).")
        game = tao_game_moi(tt, id_game, repo, phien_ban_game or "", ngay)
        game["checksums"][tt["zip_ten"]] = tt["sha256"]
        game["changelog"] = sorted(tt["lich_su"], key=lambda c: so_phien_ban(c["version"]), reverse=True)
        vi_tri = None
    if anh_bia:
        game["cover"] = f"assets/covers/{game['id']}.jpg"
    if anh_trong_game:
        game["screenshots"] = [f"assets/shots/{game['id']}-{n}.jpg" for n in range(1, len(anh_trong_game) + 1)]
        if len(anh_trong_game) >= 2:
            game["hero"] = game["screenshots"][1]

    js_moi = ghi_vao_js(js_cu, game, vi_tri)
    # tự kiểm: file mới phải đọc lại được và game khác giữ nguyên
    ds_moi = danh_sach_game(js_moi)
    if {x[0] for x in ds} - {x[0] for x in ds_moi}:
        raise LoiDung("Kiểm tra an toàn thất bại: ghi xong sẽ làm mất game khác. Đã dừng, không ghi gì.")
    for x in ds:
        if x[0] != game["id"]:
            sau = [y for y in ds_moi if y[0] == x[0]][0]
            if json.dumps(sau[4], sort_keys=True) != json.dumps(x[4], sort_keys=True):
                raise LoiDung(f"Kiểm tra an toàn thất bại: game '{x[0]}' bị thay đổi ngoài ý muốn. Đã dừng.")

    khac = "".join(difflib.unified_diff(js_cu.splitlines(True), js_moi.splitlines(True), "games.js (cũ)", "games.js (mới)", n=1))
    bc = {"thong_tin": tt, "game": game, "khac_biet": khac, "da_ghi": [], "ghi_chu": ghi_chu_phat_hanh(tt, game)}
    if not ghi:
        return bc

    # ---- ghi thật
    if anh_bia or anh_trong_game:
        os.makedirs(os.path.join(web, "assets", "covers"), exist_ok=True)
        os.makedirs(os.path.join(web, "assets", "shots"), exist_ok=True)
        cover, shots, _ = lam_anh(web, game["id"], anh_bia, list(anh_trong_game))
        bc["da_ghi"] += [p for p in [cover] + shots if p]
    sao_luu = p_js + ".bak"
    shutil.copy2(p_js, sao_luu)
    with open(p_js, "w", encoding="utf-8", newline="\n") as f:
        f.write(js_moi)
    bc["da_ghi"].append("games.js (bản cũ lưu ở games.js.bak)")

    ph = os.path.join(web, THU_MUC_PHAT_HANH)
    os.makedirs(ph, exist_ok=True)
    dich = os.path.join(ph, tt["zip_ten"])
    if not os.path.exists(dich):
        shutil.copy2(tt["zip_duong_dan"], dich)
        bc["da_ghi"].append(f"{THU_MUC_PHAT_HANH}\\{tt['zip_ten']}")
    with open(dich + ".release.md", "w", encoding="utf-8") as f:
        f.write(bc["ghi_chu"])
    bc["da_ghi"].append(f"{THU_MUC_PHAT_HANH}\\{tt['zip_ten']}.release.md (ghi chú phát hành)")

    node = shutil.which("node")
    if node and os.path.isfile(os.path.join(web, "build.js")):
        r = subprocess.run([node, "build.js"], cwd=web, capture_output=True, text=True, encoding="utf-8")
        bc["build"] = (r.stdout + r.stderr).strip() or "build.js chạy xong"
        if r.returncode != 0:
            bc["build"] = "build.js LỖI:\n" + bc["build"]
    else:
        bc["build"] = "Máy chưa có Node – bỏ qua build.js (GitHub sẽ tự build khi đẩy games.js lên)."
    return bc


# ================================================================ GIAO DIỆN
def giao_dien():
    import tkinter as tk
    from tkinter import ttk, filedialog, messagebox
    try:
        from PIL import Image, ImageTk  # noqa: F401
        co_pil = True
    except ImportError:
        co_pil = False

    root = tk.Tk()
    root.title(f"NH Việt Hóa – Chuẩn bị đăng bản mới (công cụ v{PHIEN_BAN_CONG_CU})")
    root.geometry("1040x780")
    root.minsize(900, 640)
    NEN, CHU, PHU, DO, XANH, VANG = "#14161c", "#eef0f5", "#9aa1b2", "#e63946", "#2ec27e", "#ffd166"
    root.configure(bg=NEN)
    st = ttk.Style()
    try:
        st.theme_use("clam")
    except tk.TclError:
        pass
    font = ("Segoe UI", 10)
    st.configure(".", background=NEN, foreground=CHU, font=font, fieldbackground="#1d2029")
    st.configure("TLabelframe", background=NEN, bordercolor="#2a2e3a")
    st.configure("TLabelframe.Label", background=NEN, foreground=VANG, font=("Segoe UI", 10, "bold"))
    st.configure("TButton", background="#262a36", foreground=CHU, padding=6, borderwidth=0)
    st.map("TButton", background=[("active", "#323746")])
    st.configure("Chinh.TButton", background=DO, foreground="white", font=("Segoe UI", 10, "bold"), padding=8)
    st.map("Chinh.TButton", background=[("active", "#ff5a66"), ("disabled", "#5a3035")])
    st.configure("TEntry", fieldbackground="#1d2029", foreground=CHU, insertcolor=CHU)
    st.configure("TCheckbutton", background=NEN, foreground=CHU)
    st.configure("TCombobox", fieldbackground="#1d2029", foreground=CHU, background="#262a36")
    st.map("TCombobox", fieldbackground=[("readonly", "#1d2029")], foreground=[("readonly", CHU)],
           selectbackground=[("readonly", "#1d2029")], selectforeground=[("readonly", CHU)])
    root.option_add("*TCombobox*Listbox.background", "#1d2029")
    root.option_add("*TCombobox*Listbox.foreground", CHU)

    v_web = tk.StringVar(value=THU_MUC_WEB_MAC_DINH)
    v_bd = tk.StringVar(value=os.path.join(os.path.expanduser("~"), "Downloads", "VietHoa_BoCai"))
    v_game = tk.StringVar()
    v_id = tk.StringVar()
    v_repo = tk.StringVar(value="nguyenhoangnhviethoa/Viet-hoa-")
    v_pbgame = tk.StringVar()
    v_lammoi = tk.BooleanVar(value=False)
    trang = {"tt": None, "ds": [], "bia": None, "shots": [], "bc": None, "anh_xem": None}

    khung = ttk.Frame(root, padding=14)
    khung.pack(fill="both", expand=True)
    khung.columnconfigure(0, weight=3)
    khung.columnconfigure(1, weight=2)
    khung.rowconfigure(3, weight=1)

    tieu = tk.Label(khung, text="★ NH Việt Hóa — chuẩn bị đăng bản mới", bg=NEN, fg=CHU, font=("Segoe UI", 15, "bold"))
    tieu.grid(row=0, column=0, columnspan=2, sticky="w", pady=(0, 10))

    # ---- 1. thư mục
    f1 = ttk.LabelFrame(khung, text=" 1. Chọn thư mục ", padding=10)
    f1.grid(row=1, column=0, columnspan=2, sticky="ew")
    f1.columnconfigure(1, weight=1)

    def chon(var):
        p = filedialog.askdirectory(initialdir=var.get() if os.path.isdir(var.get()) else os.path.expanduser("~"))
        if p:
            var.set(os.path.normpath(p))

    ttk.Label(f1, text="Thư mục bản dịch:").grid(row=0, column=0, sticky="w")
    ttk.Entry(f1, textvariable=v_bd).grid(row=0, column=1, sticky="ew", padx=6)
    ttk.Button(f1, text="Chọn…", command=lambda: chon(v_bd)).grid(row=0, column=2)
    ttk.Label(f1, text="Thư mục web:").grid(row=1, column=0, sticky="w", pady=(6, 0))
    ttk.Entry(f1, textvariable=v_web).grid(row=1, column=1, sticky="ew", padx=6, pady=(6, 0))
    ttk.Button(f1, text="Chọn…", command=lambda: chon(v_web)).grid(row=1, column=2, pady=(6, 0))
    ttk.Button(f1, text="Đọc thông tin", style="Chinh.TButton", command=lambda: doc_tt()).grid(row=0, column=3, rowspan=2, padx=(10, 0), sticky="ns")

    # ---- 2. kiểm tra phiên bản
    f2 = ttk.LabelFrame(khung, text=" 2. Kiểm tra phiên bản ", padding=10)
    f2.grid(row=2, column=0, sticky="nsew", pady=10, padx=(0, 8))
    lb_pb = tk.Label(f2, text="Bấm \"Đọc thông tin\" để bắt đầu.", bg=NEN, fg=PHU, justify="left", anchor="w", font=font, wraplength=560)
    lb_pb.pack(fill="x")

    # ---- 3. game + ảnh
    f3 = ttk.LabelFrame(khung, text=" 3. Game trên web ", padding=10)
    f3.grid(row=2, column=1, sticky="nsew", pady=10)
    f3.columnconfigure(1, weight=1)
    ttk.Label(f3, text="Game:").grid(row=0, column=0, sticky="w")
    cb = ttk.Combobox(f3, textvariable=v_game, state="readonly")
    cb.grid(row=0, column=1, sticky="ew", padx=6)
    lb_id = ttk.Label(f3, text="Mã (id):")
    en_id = ttk.Entry(f3, textvariable=v_id)
    lb_repo = ttk.Label(f3, text="Repo GitHub:")
    en_repo = ttk.Entry(f3, textvariable=v_repo)
    ttk.Label(f3, text="Phiên bản game:").grid(row=3, column=0, sticky="w", pady=(6, 0))
    ttk.Entry(f3, textvariable=v_pbgame).grid(row=3, column=1, sticky="ew", padx=6, pady=(6, 0))
    tk.Label(f3, text="Ghi theo ngày upload; số build xem ở góc menu game.", bg=NEN, fg=PHU, font=("Segoe UI", 8)).grid(row=4, column=1, sticky="w", padx=6)
    ttk.Checkbutton(f3, text="Lấy lại nội dung trang từ THONG_TIN_WEB.md", variable=v_lammoi).grid(row=5, column=0, columnspan=2, sticky="w", pady=(6, 0))
    fa = ttk.Frame(f3)
    fa.grid(row=6, column=0, columnspan=2, sticky="ew", pady=(8, 0))
    lb_anh = tk.Label(fa, text="Ảnh: giữ nguyên", bg=NEN, fg=PHU, font=font)

    def chon_bia():
        p = filedialog.askopenfilename(title="Ảnh menu chính có logo game (làm ảnh bìa)", filetypes=[("Ảnh", "*.png *.jpg *.jpeg *.webp")])
        if p:
            trang["bia"] = p
            cap_nhat_anh()

    def chon_shots():
        ps = filedialog.askopenfilenames(title="Ảnh trong game (2–4 ảnh)", filetypes=[("Ảnh", "*.png *.jpg *.jpeg *.webp")])
        if ps:
            trang["shots"] = list(ps)
            cap_nhat_anh()

    ttk.Button(fa, text="Ảnh bìa…", command=chon_bia).pack(side="left")
    ttk.Button(fa, text="Ảnh trong game…", command=chon_shots).pack(side="left", padx=6)
    lb_anh.pack(side="left", padx=6)
    cv = tk.Label(f3, bg=NEN)
    cv.grid(row=7, column=0, columnspan=2, pady=(8, 0))

    def cap_nhat_anh():
        lb_anh.config(text=f"Bìa: {'có' if trang['bia'] else 'giữ nguyên'} · Ảnh game: {len(trang['shots']) or 'giữ nguyên'}")
        if trang["bia"] and co_pil:
            im = Image.open(trang["bia"]).convert("RGB")
            w, h = im.size
            cw = int(w * .55); ch = min(h, int(cw * 9 / 16)); x = (w - cw) // 2
            im = im.crop((x, 0, x + cw, ch)).resize((320, 180))
            trang["anh_xem"] = ImageTk.PhotoImage(im)
            cv.config(image=trang["anh_xem"])

    def doi_game(*_):
        moi = v_game.get().startswith("＋")
        for w, r in ((lb_id, 1), (en_id, 1), (lb_repo, 2), (en_repo, 2)):
            if moi:
                w.grid(row=r, column=0 if w in (lb_id, lb_repo) else 1, sticky="w" if w in (lb_id, lb_repo) else "ew", padx=0 if w in (lb_id, lb_repo) else 6, pady=(6, 0))
            else:
                w.grid_remove()
        if not moi:
            g = [x for x in trang["ds"] if x[1] == v_game.get()]
            if g:
                v_id.set(g[0][0])
                cu = g[0][4].get("gameVersion", "")
                mb = re.search(r"\((v[^)]*)\)", cu) or re.search(r"(v[\d.]+.*)$", cu)
                build = mb.group(1) if mb else ""
                hom_nay = dt.date.today().strftime("%d/%m/%Y")
                v_pbgame.set(f"Bản Steam tại ngày {hom_nay}" + (f" ({build})" if build else "") if "Bản Steam tại ngày" in cu or not cu else cu)
        else:
            v_pbgame.set(f"Bản Steam tại ngày {dt.date.today().strftime('%d/%m/%Y')}")
    cb.bind("<<ComboboxSelected>>", doi_game)

    # ---- 4. xem trước / ghi
    f4 = ttk.LabelFrame(khung, text=" 4. Xem trước & ghi ", padding=10)
    f4.grid(row=3, column=0, columnspan=2, sticky="nsew")
    f4.columnconfigure(0, weight=1)
    f4.rowconfigure(1, weight=1)
    thanh = ttk.Frame(f4)
    thanh.grid(row=0, column=0, sticky="ew")
    bt_xem = ttk.Button(thanh, text="Xem trước thay đổi", command=lambda: chay(False))
    bt_ghi = ttk.Button(thanh, text="Ghi vào thư mục web", style="Chinh.TButton", command=lambda: chay(True), state="disabled")
    bt_xem.pack(side="left")
    bt_ghi.pack(side="left", padx=8)
    ttk.Button(thanh, text="Mở thư mục phát hành", command=lambda: mo(os.path.join(v_web.get(), THU_MUC_PHAT_HANH))).pack(side="right")
    txt = tk.Text(f4, bg="#0d0f14", fg=CHU, insertbackground=CHU, font=("Consolas", 9), wrap="none", relief="flat", padx=8, pady=6)
    txt.grid(row=1, column=0, sticky="nsew", pady=(8, 0))
    sb = ttk.Scrollbar(f4, command=txt.yview)
    sb.grid(row=1, column=1, sticky="ns", pady=(8, 0))
    txt.config(yscrollcommand=sb.set)
    for tag, mau in (("them", XANH), ("bot", "#ff7b84"), ("tieude", VANG), ("loi", "#ff7b84"), ("ok", XANH)):
        txt.tag_config(tag, foreground=mau)

    def viet(s, tag=None, xoa=False):
        if xoa:
            txt.delete("1.0", "end")
        txt.insert("end", s, tag)
        txt.see("end")

    def mo(p):
        if os.path.isdir(p):
            os.startfile(p) if hasattr(os, "startfile") else None

    def doc_tt():
        trang["bc"] = None
        bt_ghi.config(state="disabled")
        try:
            tt = doc_thu_muc_ban_dich(v_bd.get())
            js = doc(os.path.join(v_web.get(), "games.js"))
            trang["ds"] = danh_sach_game(js)
        except LoiDung as e:
            lb_pb.config(text="⚠ " + str(e), fg="#ff7b84")
            return
        except Exception as e:
            lb_pb.config(text=f"⚠ Lỗi không mong đợi: {e}", fg="#ff7b84")
            return
        trang["tt"] = tt
        dong = [f"Zip: {tt['zip_ten']}  ({tt['kich_thuoc']})", ""]
        for k, v in tt["nguon_phien_ban"].items():
            dong.append(f"  {'✓' if v == tt['phien_ban'] else '✗'}  {k}: {v or '(không thấy)'}")
        dong += ["", f"→ Phiên bản dùng: {tt['phien_ban']}" + ("   (3 chỗ khớp nhau)" if tt["khop"] else "")]
        dong += ["⚠ " + c for c in tt["canh_bao"]]
        dong += ["", f"Game: {tt['ten_game']}", f"SHA256: {tt['sha256'][:16]}…"]
        lb_pb.config(text="\n".join(dong), fg=CHU if tt["khop"] else VANG)
        ten = [x[1] for x in trang["ds"]] + ["＋ Game mới"]
        cb["values"] = ten
        # Nhận game theo tên file zip trước (vd VietHoa_Witcher3_v1.5.3.zip khớp game đã có VietHoa_Witcher3_v1.5.2.zip),
        # vì tên game trong THONG_TIN_WEB.md có thể viết khác tên trên web.
        tien_to = re.sub(r"_?v?\d[\d.]*\.zip$", "", tt["zip_ten"], flags=re.I).lower()
        goi_y = [x[1] for x in trang["ds"] if tien_to and any(re.sub(r"_?v?\d[\d.]*\.zip$", "", k, flags=re.I).lower() == tien_to for k in (x[4].get("checksums") or {}))]
        if not goi_y:
            goi_y = [x[1] for x in trang["ds"] if tt["ten_game"] and (tt["ten_game"].lower() in (x[1] or "").lower() or (x[1] or "").lower() in tt["ten_game"].lower())]
        v_game.set(goi_y[0] if goi_y else "＋ Game mới")
        if not goi_y:
            v_id.set(re.sub(r"[^a-z0-9]+", "-", tt["ten_game"].lower().replace(":", "")).strip("-"))
            v_repo.set("nguyenhoangnhviethoa/Viet-hoa-" + re.sub(r"[^A-Za-z0-9]+", "-", tt["ten_game"].split(":")[-1].strip()).strip("-"))
        doi_game()
        viet("Đã đọc xong. Kiểm tra mục 2 và 3, rồi bấm \"Xem trước thay đổi\".\n", "ok", xoa=True)

    def chay(ghi):
        if not trang["tt"]:
            doc_tt()
            if not trang["tt"]:
                return
        if (trang["bia"] or trang["shots"]) and not co_pil:
            messagebox.showerror("Thiếu Pillow", "Cần cài Pillow để xử lý ảnh.\nMở cửa sổ lệnh và gõ:  pip install pillow")
            return
        if ghi and not trang["bc"]:
            messagebox.showinfo("Xem trước", "Hãy bấm \"Xem trước thay đổi\" trước khi ghi.")
            return
        if ghi and not trang["tt"]["khop"] and not messagebox.askyesno("Phiên bản lệch", "Số phiên bản ở 3 chỗ KHÔNG khớp.\nVẫn ghi với số " + trang["tt"]["phien_ban"] + "?"):
            return
        try:
            bc = chuan_bi(v_web.get(), v_bd.get(), id_game=v_id.get().strip(), repo=v_repo.get().strip(),
                          phien_ban_game=v_pbgame.get().strip(), lam_moi_noi_dung=v_lammoi.get(),
                          anh_bia=trang["bia"], anh_trong_game=trang["shots"], ghi=ghi)
        except LoiDung as e:
            viet("DỪNG: " + str(e) + "\n", "loi", xoa=True)
            return
        except Exception as e:
            viet(f"Lỗi không mong đợi: {e}\n", "loi", xoa=True)
            return
        if not ghi:
            trang["bc"] = bc
            bt_ghi.config(state="normal")
            viet("XEM TRƯỚC – chưa ghi gì.\n\n", "tieude", xoa=True)
            for d in (bc["khac_biet"] or "(games.js không đổi)\n").splitlines(True):
                viet(d, "them" if d.startswith("+") and not d.startswith("+++") else "bot" if d.startswith("-") and not d.startswith("---") else None)
            viet("\n\nGHI CHÚ PHÁT HÀNH SẼ SOẠN SẴN:\n", "tieude")
            viet(bc["ghi_chu"])
        else:
            trang["bc"] = None
            bt_ghi.config(state="disabled")
            viet("ĐÃ GHI XONG ✓\n\n", "ok", xoa=True)
            for p in bc["da_ghi"]:
                viet("  • " + p + "\n")
            viet("\n" + bc.get("build", "") + "\n\n")
            g = bc["game"]
            viet("BƯỚC TIẾP THEO (nhờ Claude, hoặc tự làm):\n", "tieude")
            viet(f"  1. Tạo Release tag v{bc['thong_tin']['phien_ban']} trên repo {g['github']['repo']}, đính kèm {bc['thong_tin']['zip_ten']},\n"
                 f"     dán nội dung file {bc['thong_tin']['zip_ten']}.release.md\n"
                 f"  2. Đẩy games.js (và ảnh mới nếu có) lên repo nguyenhoangnhviethoa.github.io\n"
                 f"  3. Chờ ~1 phút, mở {URL_WEB}/game/{g['id']}.html và nhấn Ctrl+F5\n")

    root.mainloop()


# ============================================================ dòng lệnh
def chinh():
    if "--kiem-tra" in sys.argv:
        i = sys.argv.index("--kiem-tra")
        bd = sys.argv[i + 1]
        web = sys.argv[sys.argv.index("--web") + 1] if "--web" in sys.argv else THU_MUC_WEB_MAC_DINH
        gid = sys.argv[sys.argv.index("--game") + 1] if "--game" in sys.argv else None
        try:
            bc = chuan_bi(web, bd, id_game=gid, repo=None, phien_ban_game=None, ghi=False)
        except LoiDung as e:
            print("DỪNG:", e)
            sys.exit(2)
        tt = bc["thong_tin"]
        print("Nguồn phiên bản:", json.dumps(tt["nguon_phien_ban"], ensure_ascii=False))
        print("Dùng:", tt["phien_ban"], "| khớp:", tt["khop"], "| cảnh báo:", tt["canh_bao"])
        print(bc["khac_biet"] or "(không đổi)")
        print(bc["ghi_chu"])
        return
    giao_dien()


if __name__ == "__main__":
    chinh()
