/* ============================================================
   util.js — non-React utilities (toasts, exports, formatters)
   ------------------------------------------------------------
   - window.TBToast.push(msg, type)      → bottom-right toast
   - window.TBExport.csv(rows, filename) → download CSV
   - window.TBExport.json(obj, filename) → download JSON
   - window.TBExport.txt(text, filename) → download plain text
   - window.TBFmt.tl(n)                  → ₺ format
   - window.TBFmt.short(n)               → 12.4K, 1.2M
   - window.TBFmt.pct(n)                 → +12.4%
============================================================ */
(function () {
  // ---------- Toast system ----------
  const Toast = (function () {
    let host = null;
    function ensureHost() {
      if (host && document.body.contains(host)) return host;
      host = document.createElement("div");
      host.className = "tb-toast-host";
      host.setAttribute("aria-live", "polite");
      document.body.appendChild(host);
      return host;
    }
    function push(message, type) {
      const h = ensureHost();
      const el = document.createElement("div");
      el.className = "tb-toast " + (type || "info");
      const ico = (type === "success") ? "✓"
                : (type === "error")   ? "!"
                : (type === "warn")    ? "△"
                :                        "·";
      el.innerHTML =
        '<span class="tb-toast-ico">' + ico + '</span>' +
        '<span class="tb-toast-msg"></span>';
      el.querySelector(".tb-toast-msg").textContent = String(message || "");
      h.appendChild(el);
      // animate in
      requestAnimationFrame(() => el.classList.add("show"));
      // auto-remove
      setTimeout(() => {
        el.classList.remove("show");
        setTimeout(() => el.remove(), 240);
      }, 2600);
    }
    return { push };
  })();

  // ---------- CSV / JSON / TXT export ----------
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(url);
    }, 400);
  }
  function csvCell(v) {
    if (v == null) return "";
    let s = String(v);
    if (s.search(/[",\n;]/) !== -1) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  }
  function csvRows(rows) {
    if (!rows || !rows.length) return "";
    const headers = Object.keys(rows[0]);
    const head = headers.map(csvCell).join(",");
    const body = rows.map(r => headers.map(h => csvCell(r[h])).join(",")).join("\n");
    return head + "\n" + body;
  }
  const TBExport = {
    csv(rows, filename) {
      // Prepend BOM so Excel TR recognizes UTF-8 with Turkish chars
      const text = "\uFEFF" + csvRows(rows);
      downloadBlob(new Blob([text], { type: "text/csv;charset=utf-8" }), filename || "rapor.csv");
      Toast.push("CSV indirildi · " + (filename || "rapor.csv"), "success");
    },
    json(obj, filename) {
      const text = JSON.stringify(obj, null, 2);
      downloadBlob(new Blob([text], { type: "application/json" }), filename || "rapor.json");
      Toast.push("JSON indirildi · " + (filename || "rapor.json"), "success");
    },
    txt(text, filename) {
      downloadBlob(new Blob([String(text)], { type: "text/plain;charset=utf-8" }), filename || "rapor.txt");
      Toast.push("Dosya indirildi · " + (filename || "rapor.txt"), "success");
    },
    /** Print-friendly window for "PDF" — user picks "Save as PDF" in print dialog */
    print(htmlBody, title) {
      const w = window.open("", "_blank", "width=920,height=720");
      if (!w) { Toast.push("Pop-up engellendi", "error"); return; }
      const css = `
        @page { size: A4; margin: 18mm; }
        body { font: 13px/1.5 -apple-system, Inter, sans-serif; color: #111; }
        h1 { font-size: 20px; margin: 0 0 4px; letter-spacing: -0.02em; }
        h2 { font-size: 14px; margin: 22px 0 8px; color: #444; text-transform: uppercase; letter-spacing: 0.08em; }
        .muted { color: #666; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th, td { padding: 6px 8px; text-align: left; border-bottom: 1px solid #eee; font-size: 12px; }
        th { background: #f7f7f5; font-weight: 600; }
        .stat { display: inline-block; min-width: 120px; padding: 8px 12px; border: 1px solid #eee; border-radius: 8px; margin-right: 8px; margin-top: 4px; }
        .stat .v { font-size: 20px; font-weight: 500; }
      `;
      w.document.write(
        '<!doctype html><html><head><meta charset="utf-8"><title>' + (title || "Rapor") + '</title><style>' + css + '</style></head><body>' +
        htmlBody +
        '</body></html>'
      );
      w.document.close();
      // print after fonts settle
      setTimeout(() => { try { w.focus(); w.print(); } catch (_) {} }, 320);
      Toast.push("Yazdırma penceresi açıldı", "info");
    },
  };

  // ---------- Formatters ----------
  const TBFmt = {
    tl(n) {
      if (n == null || isNaN(n)) return "—";
      const sign = n < 0 ? "−" : "";
      return sign + "₺" + Math.abs(Math.round(Number(n))).toLocaleString("tr-TR");
    },
    short(n) {
      if (n == null || isNaN(n)) return "—";
      const a = Math.abs(n);
      if (a >= 1e9) return (n / 1e9).toFixed(1).replace(".0", "") + "B";
      if (a >= 1e6) return (n / 1e6).toFixed(1).replace(".0", "") + "M";
      if (a >= 1e3) return (n / 1e3).toFixed(1).replace(".0", "") + "K";
      return String(Math.round(n));
    },
    pct(n, digits) {
      if (n == null || isNaN(n)) return "—";
      const sign = n > 0 ? "+" : "";
      return sign + Number(n).toFixed(digits == null ? 1 : digits) + "%";
    },
    date(d) {
      try {
        const x = (d instanceof Date) ? d : new Date(d);
        return x.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
      } catch (_) { return String(d); }
    },
  };

  Object.assign(window, { TBToast: Toast, TBExport, TBFmt });
})();
