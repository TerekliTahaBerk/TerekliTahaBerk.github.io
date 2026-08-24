/* ============================================================
   GitHubActivityGrid — a decorative plus-sign field that reflects
   real GitHub contribution data.
   ------------------------------------------------------------
   Deterministic mock data renders immediately (so the field never
   looks broken or empty), then a statically-generated JSON file
   (built daily by .github/workflows/github-activity.yml from the
   real GitHub GraphQL contribution calendar) is quietly overlaid.
   If the JSON is unavailable, the field keeps its mock texture and
   is labelled honestly as sample data — never as "live".
============================================================ */
function GitHubActivityGrid({ mount, username, cols = 22, rows = 8 }) {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  mount.style.setProperty('--cols', cols);
  mount.style.setProperty('--rows', rows);

  let tipEl = document.querySelector('.gh-tip');
  if (!tipEl) {
    tipEl = document.createElement('div');
    tipEl.className = 'gh-tip';
    tipEl.setAttribute('role', 'tooltip');
    tipEl.innerHTML = '<span class="gh-tip-label"></span><span class="gh-tip-count"></span>';
    document.body.appendChild(tipEl);
  }
  const tipLabel = tipEl.querySelector('.gh-tip-label');
  const tipCount = tipEl.querySelector('.gh-tip-count');

  function labelFor(count) {
    if (count <= 0)  return 'quiet day';
    if (count === 1) return 'one tiny spark';
    if (count <= 3)  return 'a few sparks';
    if (count <= 7)  return 'busy little day';
    if (count <= 12) return 'commit weather: active';
    return 'tiny storm of commits';
  }

  function showTip(svg) {
    const count = svg.__count | 0;
    tipLabel.textContent = labelFor(count);
    tipCount.textContent = count === 1 ? '1 commit' : `${count} commits`;
    const r = svg.getBoundingClientRect();
    tipEl.style.left = `${r.left + r.width / 2}px`;
    tipEl.style.top = `${r.top}px`;
    tipEl.classList.add('show');
  }
  function hideTip() { tipEl.classList.remove('show'); }

  function styleFromIntensity(v) {
    const x = Math.max(0, Math.min(1, v));
    const op = 0.06 + Math.pow(x, 1.25) * 0.86;
    const tone = Math.pow(x, 1.4);
    const scl = 0.86 + x * 0.18;
    return { op, tone, scl };
  }

  function makePlus(v) {
    const { op, tone, scl } = styleFromIntensity(v);
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 14 14');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.setProperty('--op', op);
    svg.style.setProperty('--tone', tone);
    svg.style.setProperty('--scl', scl);
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M7 2.5 L7 11.5 M2.5 7 L11.5 7');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.4');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('fill', 'none');
    svg.appendChild(path);
    return svg;
  }

  function applyStyle(svg, v) {
    const { op, tone, scl } = styleFromIntensity(v);
    svg.style.setProperty('--op', op);
    svg.style.setProperty('--tone', tone);
    svg.style.setProperty('--scl', scl);
    if (svg.classList.contains('in')) svg.style.opacity = op;
  }

  const totalDays = cols * rows;
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const firstDay = new Date(todayUTC.getTime() - (totalDays - 1) * 86400000);
  function dateForIndex(i) { return new Date(firstDay.getTime() + i * 86400000); }

  function mockCountFromIntensity(v) {
    return Math.round(Math.pow(Math.max(0, Math.min(1, v)), 1.6) * 14);
  }

  function buildMock(seed) {
    let r = seed >>> 0;
    const rand = () => { r = (r * 1664525 + 1013904223) >>> 0; return (r & 0xffffffff) / 0x100000000; };
    const data = new Array(cols * rows);
    for (let c = 0; c < cols; c++) {
      for (let row = 0; row < rows; row++) {
        const recency = c / Math.max(1, cols - 1);
        const wave = 0.18 * Math.sin(c * 0.55 + row * 0.85) + 0.12 * Math.sin(c * 0.21 - row * 0.33 + 1.1);
        const noise = rand() * 0.45;
        let v = 0.22 + noise + wave + recency * 0.22;
        if (rand() < 0.18) v *= 0.15;
        v = Math.max(0, Math.min(1, v));
        const idx = c * rows + row;
        data[idx] = { intensity: v, count: mockCountFromIntensity(v), date: dateForIndex(idx) };
      }
    }
    return data;
  }

  function render(data) {
    mount.innerHTML = '';
    const nodes = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
      const cell = data[i];
      const svg = makePlus(cell.intensity);
      svg.__count = cell.count;
      svg.addEventListener('mouseenter', () => showTip(svg));
      svg.addEventListener('mouseleave', hideTip);
      svg.addEventListener('focus', () => showTip(svg));
      svg.addEventListener('blur', hideTip);
      mount.appendChild(svg);
      nodes[i] = svg;
    }
    for (let i = 0; i < nodes.length; i++) {
      const col = Math.floor(i / rows);
      const row = i % rows;
      const delay = 180 + col * 22 + row * 14;
      setTimeout(() => nodes[i].classList.add('in'), delay);
    }
    return nodes;
  }

  window.addEventListener('scroll', hideTip, { passive: true });
  window.addEventListener('resize', hideTip);

  const data = buildMock(0x9e3779b1);
  const nodes = render(data);

  (async () => {
    const candidates = ['/github-activity.json', 'github-activity.json', 'public/github-activity.json'];
    let days = null;
    for (const url of candidates) {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) continue;
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) { days = json; break; }
      } catch (_) { /* try next candidate */ }
    }

    const label = document.getElementById('live-label');

    if (!days) {
      if (label) label.textContent = 'sample activity · pattern only';
      return;
    }

    const byDay = Object.create(null);
    let maxCount = 0;
    for (const d of days) {
      if (!d || typeof d.date !== 'string') continue;
      const c = Number(d.count) || 0;
      byDay[d.date] = c;
      if (c > maxCount) maxCount = c;
    }

    const denom = Math.log2(1 + Math.max(maxCount, 2));

    for (let d = 0; d < totalDays; d++) {
      const iso = dateForIndex(d).toISOString().slice(0, 10);
      const count = byDay[iso] || 0;
      data[d].count = count;
      nodes[d].__count = count;
      const intensity = count > 0 ? Math.min(1, 0.18 + (Math.log2(1 + count) / denom) * 0.82) : 0.05;
      data[d].intensity = intensity;
      applyStyle(nodes[d], intensity);
    }

    if (label) label.textContent = 'github activity · last 52 weeks';
  })();
}
