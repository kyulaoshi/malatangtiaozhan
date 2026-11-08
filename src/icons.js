// 재료 일러스트 (SVG, viewBox 0 0 100 100) — 외부 이미지 없이 동작하도록 직접 그림
const O = '#4a2416'; // 공통 외곽선 색
const g = (inner) =>
  `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${inner}</g>`;

const roll = (x, y, body, end, streak) => `
  <g transform="translate(${x} ${y})">
    <path d="M0 0 H40 A11 13 0 0 1 40 26 H0 A11 13 0 0 1 0 0Z" fill="${body}"/>
    <path d="M6 7 C14 11 22 5 32 9 M4 18 C14 22 24 15 34 19" fill="none" stroke="${streak}" stroke-width="3"/>
    <ellipse cx="40" cy="13" rx="11" ry="13" fill="${end}"/>
    <path d="M40 13 m-1.5 0 a2.5 2.5 0 1 1 3 2.4 a5.5 5.5 0 1 1 -7 -5 a8.5 8.5 0 1 1 10 11" fill="none" stroke="${streak}" stroke-width="2.4"/>
  </g>`;

export const ICONS = {
  beef: g(`
    ${roll(16, 22, '#c8303a', '#e2605c', '#fde4dc')}
    ${roll(30, 50, '#b8262f', '#dc5550', '#fde4dc')}
    <path d="M22 28 l6 -2" stroke="#fff" stroke-width="2.5" opacity=".7"/>`),

  lamb: g(`
    <path d="M14 30 H62 A14 18 0 0 1 62 66 H14 A14 18 0 0 1 14 30Z" fill="#c9605a"/>
    <path d="M10 40 C24 46 36 36 52 42 M8 54 C22 60 40 50 58 58" fill="none" stroke="#fff6ef" stroke-width="5"/>
    <ellipse cx="62" cy="48" rx="14" ry="18" fill="#e48f84"/>
    <path d="M62 48 m-2 0 a3 3 0 1 1 4 3 a7 7 0 1 1 -9 -6 a11 11 0 1 1 13 14" fill="none" stroke="#fff6ef" stroke-width="3.4"/>
    <path d="M20 34 l10 -1" stroke="#fff" stroke-width="2.5" opacity=".6"/>`),

  shrimp: g(`
    <path d="M30 80 L18 90 L22 76 Z M30 80 L40 92 L40 78Z" fill="#f2793a"/>
    <path d="M72 26 C52 12 20 22 18 50 C17 68 28 80 40 80 C48 80 52 72 48 66 C38 66 32 58 34 48 C36 38 50 34 62 40 C70 44 78 34 72 26Z" fill="#f68a45"/>
    <path d="M28 34 C34 38 36 44 34 48 M22 50 C28 52 32 54 34 52 M24 64 C30 62 34 60 36 58 M44 32 C46 38 44 40 42 42" fill="none" stroke="#c2481b" stroke-width="2.4"/>
    <path d="M30 42 C26 52 28 60 34 66" fill="none" stroke="#ffd2a6" stroke-width="3" opacity=".9"/>
    <circle cx="66" cy="30" r="3" fill="${O}" stroke="none"/>
    <path d="M74 26 C84 18 90 16 96 18 M72 22 C78 12 86 8 92 8" fill="none" stroke="#c2481b" stroke-width="2"/>`),

  sausage: g(`
    <path d="M18 70 C10 62 14 50 24 44 L66 20 C76 14 88 20 88 30 C88 38 82 42 76 46 L34 72 C28 76 22 76 18 70Z" fill="#d94a4f"/>
    <path d="M36 50 l6 8 M48 42 l6 8 M60 34 l6 8 M72 27 l5 7" stroke="#ffb3a6" stroke-width="3"/>
    <path d="M28 54 C40 46 56 36 72 26" fill="none" stroke="#fff" stroke-width="2.5" opacity=".55"/>
    <path d="M86 26 l8 -6 M16 72 l-8 6" stroke="${O}" stroke-width="3"/>`),

  fishball: g(`
    <circle cx="34" cy="62" r="20" fill="#f7f2e8"/>
    <circle cx="66" cy="62" r="20" fill="#f3ede1"/>
    <circle cx="50" cy="34" r="20" fill="#fbf8f1"/>
    <path d="M40 26 a10 10 0 0 1 10 -6" fill="none" stroke="#fff" stroke-width="4" opacity=".9"/>
    <path d="M22 72 a14 14 0 0 0 22 4 M54 72 a14 14 0 0 0 22 4" fill="none" stroke="#dcd2bf" stroke-width="3"/>`),

  meatball: g(`
    <circle cx="33" cy="62" r="19" fill="#9b5a35"/>
    <circle cx="67" cy="62" r="19" fill="#8e4f2d"/>
    <circle cx="50" cy="35" r="19" fill="#a8653d"/>
    <g fill="#6b3519" stroke="none">
      <circle cx="44" cy="30" r="2"/><circle cx="56" cy="40" r="2"/><circle cx="50" cy="44" r="1.5"/>
      <circle cx="28" cy="60" r="2"/><circle cx="38" cy="68" r="2"/><circle cx="62" cy="58" r="2"/><circle cx="72" cy="68" r="2"/>
    </g>
    <path d="M42 26 a9 9 0 0 1 8 -4" fill="none" stroke="#d99a6c" stroke-width="3.5"/>`),

  fuzhu: g(`
    <path d="M14 70 L62 16 C66 12 72 16 70 22 L24 78 C20 84 10 78 14 70Z" fill="#f0cd78"/>
    <path d="M30 80 L76 28 C80 24 86 28 84 34 L40 88 C36 94 26 88 30 80Z" fill="#e8c06a"/>
    <path d="M26 62 l8 4 M36 50 l8 4 M46 38 l8 4 M42 72 l8 4 M52 60 l8 4 M62 48 l8 4" stroke="#b98a2e" stroke-width="2.4"/>
    <path d="M22 66 L56 26" stroke="#fff3c6" stroke-width="2.5" opacity=".8"/>`),

  tofu: g(`
    <path d="M14 46 L36 36 L58 46 L36 56Z" fill="#fffdf7"/>
    <path d="M14 46 L36 56 L36 80 L14 70Z" fill="#efe8d8"/>
    <path d="M58 46 L36 56 L36 80 L58 70Z" fill="#e2d8c3"/>
    <path d="M44 30 L66 20 L88 30 L66 40Z" fill="#fffdf7"/>
    <path d="M44 30 L66 40 L66 64 L44 54Z" fill="#efe8d8"/>
    <path d="M88 30 L66 40 L66 64 L88 54Z" fill="#e2d8c3"/>
    <path d="M24 46 l8 -3" stroke="#fff" stroke-width="2" opacity=".8"/>`),

  quailegg: g(`
    <ellipse cx="34" cy="54" rx="18" ry="24" fill="#fbf6ec" transform="rotate(-16 34 54)"/>
    <ellipse cx="66" cy="58" rx="19" ry="22" fill="#fbf6ec" transform="rotate(14 66 58)"/>
    <ellipse cx="67" cy="58" rx="10" ry="11" fill="#f7b733" stroke="#d98e12" stroke-width="2.4" transform="rotate(14 67 58)"/>
    <path d="M26 40 a10 12 0 0 1 8 -8" fill="none" stroke="#fff" stroke-width="3.5"/>
    <circle cx="64" cy="54" r="3" fill="#ffe08a" stroke="none"/>`),

  qingcai: g(`
    <path d="M50 92 C38 84 30 66 34 50 L42 52 C42 66 46 80 54 88Z" fill="#e9f5d0"/>
    <path d="M50 92 C62 84 70 66 66 50 L58 52 C58 66 54 80 46 88Z" fill="#dff0bf"/>
    <path d="M38 54 C14 44 12 18 30 10 C46 6 52 30 42 54Z" fill="#3f9b3a"/>
    <path d="M62 54 C86 44 88 18 70 10 C54 6 48 30 58 54Z" fill="#368c33"/>
    <path d="M50 58 C38 40 40 14 50 6 C60 14 62 40 50 58Z" fill="#4caf45"/>
    <path d="M50 54 L50 14 M36 46 C32 34 30 24 30 16 M64 46 C68 34 70 24 70 16" fill="none" stroke="#a9dc8f" stroke-width="2.4"/>`),

  baicai: g(`
    <path d="M30 34 C18 24 22 6 38 8 C44 2 56 2 62 8 C78 6 84 24 70 34 C74 46 66 52 60 50 L40 50 C32 52 24 44 30 34Z" fill="#b6d96b"/>
    <path d="M38 48 C34 64 36 82 44 94 L58 94 C66 82 66 64 62 48 C56 52 44 52 38 48Z" fill="#fbfbef"/>
    <path d="M50 52 L50 90 M44 60 C42 70 42 80 46 90 M56 60 C58 70 58 80 54 90" fill="none" stroke="#dfe5c5" stroke-width="2.4"/>
    <path d="M50 50 L50 16 M50 34 L36 22 M50 30 L64 18" fill="none" stroke="#e8f5c0" stroke-width="2.6"/>`),

  enoki: g(`
    <path d="M30 86 C30 76 38 72 50 72 C62 72 70 76 70 86 C70 92 30 92 30 86Z" fill="#b98a5a"/>
    <g fill="none" stroke-width="2.6">
      <path d="M38 76 C34 50 26 30 20 16"/><path d="M42 76 C40 50 36 28 34 12"/>
      <path d="M47 76 C46 48 46 26 46 10"/><path d="M53 76 C54 48 56 26 58 10"/>
      <path d="M58 76 C62 50 66 30 70 14"/><path d="M62 76 C68 52 76 34 82 20"/>
    </g>
    <g fill="#fff7e2">
      <ellipse cx="20" cy="15" rx="5" ry="3.6"/><ellipse cx="34" cy="11" rx="5" ry="3.6"/>
      <ellipse cx="46" cy="9" rx="5" ry="3.6"/><ellipse cx="58" cy="9" rx="5" ry="3.6"/>
      <ellipse cx="70" cy="13" rx="5" ry="3.6"/><ellipse cx="82" cy="19" rx="5" ry="3.6"/>
    </g>`),

  potato: g(`
    <circle cx="36" cy="58" r="22" fill="#f6da86" stroke-width="5" stroke="#c4934a"/>
    <circle cx="64" cy="40" r="22" fill="#f9e39a" stroke-width="5" stroke="#c4934a"/>
    <g fill="#e4c26a" stroke="none"><circle cx="58" cy="34" r="2.4"/><circle cx="70" cy="46" r="2"/><circle cx="30" cy="62" r="2.4"/><circle cx="42" cy="52" r="1.8"/></g>
    <path d="M54 28 a12 12 0 0 1 8 -4" fill="none" stroke="#fff6cf" stroke-width="3"/>`),

  lotus: g(`
    <circle cx="50" cy="50" r="38" fill="#f4e7cf"/>
    <circle cx="50" cy="50" r="31" fill="none" stroke="#e3cfa8" stroke-width="2"/>
    <g fill="#c9ab7c">
      <circle cx="50" cy="50" r="7"/>
      <circle cx="50" cy="28" r="7"/><circle cx="69" cy="39" r="7"/><circle cx="69" cy="61" r="7"/>
      <circle cx="50" cy="72" r="7"/><circle cx="31" cy="61" r="7"/><circle cx="31" cy="39" r="7"/>
    </g>
    <path d="M24 32 a30 30 0 0 1 14 -12" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>`),

  muer: g(`
    <path d="M16 56 C8 40 22 22 38 28 C44 14 66 16 68 32 C84 30 92 50 80 62 C84 76 66 84 56 76 C46 88 24 82 26 68 C18 68 14 62 16 56Z" fill="#4a2c27"/>
    <path d="M28 52 C36 44 46 46 50 54 C56 46 66 46 70 54 M36 66 C42 60 50 62 52 68" fill="none" stroke="#7d544a" stroke-width="3"/>
    <path d="M30 34 C36 30 42 32 44 36" fill="none" stroke="#9a6f63" stroke-width="2.6"/>`),

  fentiao: g(`
    <ellipse cx="50" cy="54" rx="40" ry="30" fill="#d9c6ab" opacity=".55"/>
    <g fill="none" stroke="#9c8164" stroke-width="2.2">
      <path d="M12 40 C24 30 34 50 46 40 C58 30 68 50 80 40 C86 36 90 38 92 40"/>
      <path d="M10 50 C22 40 34 60 46 50 C58 40 70 60 82 50 C86 47 90 48 92 50"/>
      <path d="M12 60 C24 50 36 70 48 60 C60 50 70 70 82 60 C86 57 88 58 90 60"/>
      <path d="M16 70 C28 60 38 80 50 70 C62 60 72 78 84 68"/>
      <path d="M20 32 C32 24 40 42 52 32 C62 24 72 40 80 32"/>
    </g>
    <g fill="none" stroke="#f3eadb" stroke-width="1.6" opacity=".9">
      <path d="M14 45 C26 35 36 55 48 45 C60 35 70 55 82 45"/>
      <path d="M14 65 C26 55 36 75 48 65 C60 55 70 75 82 65"/>
    </g>`),

  noodles: g(`
    <rect x="14" y="22" width="72" height="56" rx="12" fill="#f6c84a"/>
    <g fill="none" stroke="#d99a18" stroke-width="2.6">
      <path d="M20 32 q5 -6 10 0 t10 0 t10 0 t10 0 t10 0 t10 0"/>
      <path d="M20 42 q5 -6 10 0 t10 0 t10 0 t10 0 t10 0 t10 0"/>
      <path d="M20 52 q5 -6 10 0 t10 0 t10 0 t10 0 t10 0 t10 0"/>
      <path d="M20 62 q5 -6 10 0 t10 0 t10 0 t10 0 t10 0 t10 0"/>
      <path d="M20 72 q5 -6 10 0 t10 0 t10 0 t10 0 t10 0 t10 0"/>
    </g>
    <path d="M22 28 h18" stroke="#fff3c0" stroke-width="3"/>`),

  niangao: g(`
    <rect x="12" y="44" width="30" height="40" rx="12" fill="#f9f5ec"/>
    <rect x="38" y="30" width="30" height="44" rx="12" fill="#fffdf6"/>
    <rect x="62" y="46" width="28" height="38" rx="12" fill="#f6f1e6"/>
    <path d="M10 54 C18 44 36 44 44 50 C44 58 40 62 38 70 C36 62 32 60 30 66 C28 58 22 60 20 64 C18 58 12 60 10 54Z" fill="#f8b62c"/>
    <path d="M36 38 C44 28 62 28 70 34 C70 44 66 46 64 52 C62 46 58 46 56 52 C54 44 48 46 46 50 C44 44 38 46 36 38Z" fill="#fbc23d"/>
    <path d="M60 56 C66 48 84 48 92 54 C92 60 88 64 86 70 C84 64 80 62 78 66 C76 60 70 62 68 64 C66 60 60 62 60 56Z" fill="#f6ad22"/>
    <path d="M44 36 h12" stroke="#fff3b8" stroke-width="2.6"/>`),
};

// 정육면체 2개 (鸭血 / 鱼豆腐 공용)
const cubes = (top, left, right, hi) => g(`
  <path d="M12 50 L34 40 L56 50 L34 60Z" fill="${top}"/>
  <path d="M12 50 L34 60 L34 84 L12 74Z" fill="${left}"/>
  <path d="M56 50 L34 60 L34 84 L56 74Z" fill="${right}"/>
  <path d="M44 30 L66 20 L88 30 L66 40Z" fill="${top}"/>
  <path d="M44 30 L66 40 L66 64 L44 54Z" fill="${left}"/>
  <path d="M88 30 L66 40 L66 64 L88 54Z" fill="${right}"/>
  <path d="M22 49 l9 -4 M54 29 l9 -4" stroke="${hi}" stroke-width="2.6"/>`);

Object.assign(ICONS, {
  // 牛蛙: 개구리 뒷다리 두 개
  niuwa: g(`
    <path d="M46 20 C34 18 24 30 26 46 C27 56 32 62 36 70 L30 84 L22 86 L24 92 L36 90 L42 76 C46 66 50 56 50 44 C50 34 52 24 46 20Z" fill="#f4dccb"/>
    <path d="M58 20 C70 18 80 30 78 46 C77 56 72 62 68 70 L74 84 L82 86 L80 92 L68 90 L62 76 C58 66 54 56 54 44 C54 34 52 24 58 20Z" fill="#efd0bd"/>
    <path d="M34 30 C32 38 32 46 34 52 M70 30 C72 38 72 46 70 52" fill="none" stroke="#fff6ee" stroke-width="3"/>
    <path d="M38 62 C40 58 44 56 46 56 M66 62 C64 58 60 56 58 56" fill="none" stroke="#d6a98f" stroke-width="2.2"/>`),

  // 毛肚: 돌기가 많은 회색 천엽
  maodu: g(`
    <path d="M12 34 C24 24 40 32 50 26 C62 20 78 26 88 34 L84 72 C72 80 58 72 48 78 C36 84 22 78 14 70Z" fill="#d9cfb7"/>
    <g fill="none" stroke="#9c8e70" stroke-width="2.2">
      <path d="M22 40 v8 M30 38 v10 M38 40 v8 M46 36 v10 M54 34 v10 M62 34 v10 M70 36 v10 M78 40 v8"/>
      <path d="M22 56 v8 M30 54 v10 M38 56 v8 M46 54 v10 M54 52 v10 M62 52 v10 M70 54 v10 M78 56 v8"/>
    </g>
    <path d="M18 36 C28 30 38 34 46 30" fill="none" stroke="#f3ecdc" stroke-width="3"/>`),

  // 午餐肉: 분홍색 햄 두 조각
  wucanrou: g(`
    <path d="M14 40 L50 30 L58 62 L22 72Z" fill="#f2a3a0"/>
    <path d="M14 40 L22 72 L24 80 L16 48Z" fill="#d9817e"/>
    <path d="M42 26 L82 20 L88 54 L48 60Z" fill="#f7b3ad"/>
    <path d="M48 60 L88 54 L88 62 L50 68Z" fill="#dd8a85"/>
    <g fill="#fbd9d4" stroke="none"><circle cx="30" cy="52" r="2"/><circle cx="40" cy="58" r="1.6"/><circle cx="58" cy="36" r="2"/><circle cx="72" cy="42" r="1.6"/><circle cx="64" cy="48" r="1.8"/></g>
    <path d="M48 30 l16 -3" stroke="#fff" stroke-width="2.6" opacity=".8"/>`),

  // 鸭血: 검붉은 정육면체
  yaxue: cubes('#8a2a2a', '#6e1c1c', '#561313', '#c46a6a'),

  // 鱼豆腐: 노릇노릇한 정육면체
  yudoufu: cubes('#f4cf74', '#e3a94a', '#cf8f30', '#fff0c0'),

  // 蟹棒: 흰색 + 빨간 줄 게맛살 두 개
  xiebang: g(`
    <path d="M16 44 L72 22 A8 8 0 0 1 78 37 L22 59 A8 8 0 0 1 16 44Z" fill="#fffaf2"/>
    <path d="M18 43 L73 21 A8 8 0 0 1 77 28 L21 50Z" fill="#ef5a3c"/>
    <path d="M22 70 L78 48 A8 8 0 0 1 84 63 L28 85 A8 8 0 0 1 22 70Z" fill="#fffaf2"/>
    <path d="M24 69 L79 47 A8 8 0 0 1 83 54 L27 76Z" fill="#ef5a3c"/>
    <path d="M30 54 l40 -16 M36 80 l40 -16" stroke="#e8dccb" stroke-width="2"/>`),

  // 海带: 다시마 매듭
  haidai: g(`
    <path d="M20 80 C30 60 30 40 46 30 C58 22 74 26 76 40 C78 54 62 62 50 56 C40 50 46 36 56 38" fill="none" stroke="${O}" stroke-width="16"/>
    <path d="M20 80 C30 60 30 40 46 30 C58 22 74 26 76 40 C78 54 62 62 50 56 C40 50 46 36 56 38" fill="none" stroke="#2f6a3e" stroke-width="10"/>
    <path d="M56 38 C64 52 72 64 84 78" fill="none" stroke="${O}" stroke-width="16"/>
    <path d="M56 38 C64 52 72 64 84 78" fill="none" stroke="#3a7d4a" stroke-width="10"/>
    <path d="M30 62 C34 50 38 42 46 36 M66 56 C70 62 74 68 80 74" fill="none" stroke="#6fae74" stroke-width="2.4"/>`),

  // 宽粉: 넓고 반투명한 당면
  kuanfen: g(`
    <g fill="none" stroke-linecap="round">
      <path d="M12 34 C30 22 40 46 58 34 C72 26 80 34 90 30" stroke="${O}" stroke-width="14"/>
      <path d="M12 34 C30 22 40 46 58 34 C72 26 80 34 90 30" stroke="#c9b294" stroke-width="9"/>
      <path d="M10 54 C28 42 40 66 58 54 C72 46 80 54 90 50" stroke="${O}" stroke-width="14"/>
      <path d="M10 54 C28 42 40 66 58 54 C72 46 80 54 90 50" stroke="#bda585" stroke-width="9"/>
      <path d="M12 74 C30 62 42 86 60 74 C74 66 82 74 90 70" stroke="${O}" stroke-width="14"/>
      <path d="M12 74 C30 62 42 86 60 74 C74 66 82 74 90 70" stroke="#c9b294" stroke-width="9"/>
      <path d="M18 32 C28 27 34 34 42 36 M16 52 C26 47 32 54 40 56 M18 72 C28 67 34 74 42 76" stroke="#efe4d2" stroke-width="2.4"/>
    </g>`),
});

export function iconSvg(id, emoji = '🍲') {
  const inner = ICONS[id];
  if (!inner) {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text x="50" y="66" font-size="56" text-anchor="middle">${emoji}</text></svg>`;
  }
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" overflow="visible">${inner}</svg>`;
}
