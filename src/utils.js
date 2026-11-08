// ---------- 숫자 → 중국어 / 병음 ----------
const ZH = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const PY = ['líng', 'yī', 'èr', 'sān', 'sì', 'wǔ', 'liù', 'qī', 'bā', 'jiǔ'];

export function numToZh(n) {
  n = Math.max(0, Math.floor(n));
  if (n < 10) return { zh: ZH[n], py: PY[n] };
  if (n < 100) {
    const t = Math.floor(n / 10), o = n % 10;
    const zh = (t === 1 ? '' : ZH[t]) + '十' + (o ? ZH[o] : '');
    const py = (t === 1 ? '' : PY[t]) + 'shí' + (o ? PY[o] : '');
    return { zh, py };
  }
  if (n < 1000) {
    const h = Math.floor(n / 100), rest = n % 100;
    let zh = (h === 2 ? '两' : ZH[h]) + '百';
    let py = (h === 2 ? 'liǎng' : PY[h]) + 'bǎi';
    if (rest === 0) return { zh, py };
    if (rest < 10) return { zh: zh + '零' + ZH[rest], py: py + ' líng ' + PY[rest] };
    const t = Math.floor(rest / 10), o = rest % 10;
    zh += ZH[t] + '十' + (o ? ZH[o] : '');
    py += ' ' + PY[t] + 'shí' + (o ? PY[o] : '');
    return { zh, py };
  }
  return { zh: String(n), py: String(n) };
}

// ---------- 그릇 안 재료 위치 (그릇 좌표계 400 x 300) ----------
export function bowlLayout(n) {
  const out = [];
  const size = n <= 4 ? 100 : n <= 8 ? 86 : n <= 12 ? 72 : n <= 18 ? 64 : 56;
  for (let i = 0; i < n; i++) {
    let x = 200, y = 120;
    if (n > 1) {
      const r = Math.sqrt((i + 0.55) / n);
      const th = i * 2.39996 + 0.9;
      x = 200 + r * 122 * Math.cos(th);
      y = 122 + r * 27 * Math.sin(th);
    }
    // 나중에 들어간 재료일수록 위로 쌓임
    y -= Math.floor(i / 7) * 9;
    const rot = ((i * 53) % 50) - 25;
    out.push({ x, y, rot, size });
  }
  return out;
}

// ---------- 저장소 (실패해도 게임은 계속) ----------
export const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
};

// ---------- 효과음 (Web Audio, 파일 없음) ----------
let ctx = null;
let muted = store.get('mlt_muted', false);
export const sound = {
  isMuted: () => muted,
  setMuted(v) { muted = v; store.set('mlt_muted', v); },
  _ctx() {
    if (muted) return null;
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch { return null; }
  },
  tone(freq, dur = 0.1, type = 'sine', vol = 0.15, slideTo = null, delay = 0) {
    const c = this._ctx(); if (!c) return;
    const t = c.currentTime + delay;
    const o = c.createOscillator(), gn = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gn.gain.setValueAtTime(vol, t);
    gn.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(gn).connect(c.destination);
    o.start(t); o.stop(t + dur + 0.02);
  },
  check() { this.tone(880, 0.09, 'triangle', 0.12, 1320); },
  uncheck() { this.tone(500, 0.08, 'triangle', 0.1, 320); },
  tick() { this.tone(1200, 0.05, 'square', 0.05); },
  stamp() { this.tone(140, 0.18, 'sawtooth', 0.12, 60); },
  plop() { this.tone(420, 0.16, 'sine', 0.18, 140); },
  click() { this.tone(660, 0.06, 'triangle', 0.08); },
  ding() { this.tone(1046, 0.25, 'sine', 0.14); this.tone(1568, 0.35, 'sine', 0.12, null, 0.12); },
  fanfare() { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.13, null, i * 0.11)); },
  alarm() { this.tone(880, 0.12, 'square', 0.08); this.tone(660, 0.18, 'square', 0.08, null, 0.14); },
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
