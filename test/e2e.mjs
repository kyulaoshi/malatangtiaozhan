import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const URL = 'file://' + path.resolve('dist/index.html');
const SHOT = 'test/shots';
fs.rmSync(SHOT, { recursive: true, force: true });
fs.mkdirSync(SHOT, { recursive: true });
const errors = [];
let pass = 0;
const ok = (cond, msg) => { if (!cond) throw new Error('FAIL: ' + msg); pass++; console.log('  ✓', msg); };

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
async function newPage(vp = { width: 1366, height: 900 }) {
  const ctx = await browser.newContext({ viewport: vp });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('ERR_FAILED')) errors.push('console: ' + m.text()); });
  return p;
}
const txt = (p, id) => p.getByTestId(id).innerText();
const bowlIds = (p) => p.getByTestId('bowl-item').evaluateAll((els) => els.map((e) => e.dataset.id).sort());

// ---------- Flow A: 시작 → 바로 주문서 ----------
console.log('Flow A: desktop');
let p = await newPage();
await p.goto(URL);
await p.waitForTimeout(1000);
await p.screenshot({ path: `${SHOT}/01-start.png` });
await p.getByTestId('start').click();
ok(await p.getByTestId('sheet').isVisible(), 'start goes straight to order sheet (no settings / target screen)');
ok((await txt(p, 'time-left')) === '60', 'default time limit 60s');
ok((await p.locator('.sheet .row-ico, .sheet .ico, .sheet svg:not(.box svg)').count()) === 0, 'no ingredient images on order sheet');
ok((await p.locator('.sheet-body .py').count()) === 26, 'pinyin shown for all 26 items');
const sheetBody = await p.locator('.sheet-body').innerText();
ok(/niúròu/.test(sheetBody) && /qīngcài/.test(sheetBody), 'pinyin text present');
ok(!/[가-힣]/.test(sheetBody), 'no Korean anywhere in the ingredient list');
ok((await p.locator('[data-testid^="row-"]').count()) === 26, '26 ingredients listed');
for (const w of ['牛蛙', '毛肚', '午餐肉', '鸭血', '鱼豆腐', '蟹棒', '海带', '宽粉']) ok(sheetBody.includes(w), `new ingredient ${w}`);
const spiceText = await p.locator('.spice-group').innerText();
ok(['不辣', '微辣', '中辣', '特辣', 'zhōng là'].every((w) => spiceText.includes(w)) && !/[가-힣]/.test(spiceText), 'spice options: hanzi + pinyin only');

await p.getByTestId('name-input').fill('김민수');
const pick = ['beef', 'qingcai', 'potato', 'fuzhu', 'fishball'];
for (const id of pick) await p.getByTestId(`row-${id}`).click();
ok((await txt(p, 'count')) === '5' && (await txt(p, 'total')) === '14', '5种 / 14元');
await p.getByTestId('row-lamb').click();
await p.getByTestId('row-lamb').click();
ok((await txt(p, 'total')) === '14', 'check + uncheck lamb → 14');
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(300);
await p.screenshot({ path: `${SHOT}/02-order.png` });

await p.getByTestId('submit').click();
ok(await p.locator('.toast').innerText().then((t) => t.includes('辣度')), 'submit without spice → warning');
ok(!(await p.getByTestId('row-lamb').isDisabled()), 'still editable after spice warning');
await p.getByTestId('spice-weila').click();
await p.getByTestId('spice-zhongla').click();
ok((await p.locator('.spice.on').count()) === 1 && (await txt(p, 'spice-chosen')) === '中辣', 'spice is single-choice (中辣)');
ok((await txt(p, 'total')) === '14', 'spice is free (total still 14)');
await p.getByTestId('row-niuwa').click();
ok((await txt(p, 'total')) === '20', '牛蛙 +6 → 20');
await p.getByTestId('row-niuwa').click();
await p.getByTestId('submit').click();
ok(await p.getByTestId('row-lamb').isDisabled() && await p.getByTestId('spice-bula').isDisabled(), 'locked after submit');
await p.getByTestId('cooking').waitFor();
await p.locator('[data-stage="done"]').waitFor({ timeout: 20000 });
ok(JSON.stringify(await bowlIds(p)) === JSON.stringify([...pick].sort()), 'bowl contains exactly ordered items');
await p.getByTestId('result').waitFor({ timeout: 8000 });
await p.waitForTimeout(1300);
ok((await txt(p, 'r-price')) === '14元', 'result price 14元');
ok((await txt(p, 'r-spice')).includes('中辣'), 'result shows 中辣');
ok((await p.getByTestId('diff-area').count()) === 0, 'no diff shown before target entered');
await p.screenshot({ path: `${SHOT}/03-result-before.png` });
await p.getByTestId('target-input').fill('15');
await p.getByTestId('target-check').click();
ok((await txt(p, 'r-diff')) === '1元' && (await txt(p, 'verdict')).includes('太棒了'), 'target 15 → diff 1, close');
await p.getByTestId('target-input').fill('14');
await p.getByTestId('target-input').press('Enter');
ok((await txt(p, 'r-diff')) === '0元' && (await txt(p, 'verdict')).includes('恭喜你'), 'target 14 → exact (Enter key works)');
await p.getByTestId('target-input').fill('30');
await p.getByTestId('target-check').click();
ok((await txt(p, 'r-diff')) === '16元' && (await txt(p, 'verdict')).includes('下次再努力'), 'target 30 → diff 16, far');
await p.waitForTimeout(500);
await p.screenshot({ path: `${SHOT}/04-result-after.png` });

// next round: reset, auto submit by URL short time
await p.getByTestId('next').click();
ok(await p.getByTestId('sheet').isVisible(), 'next round → new order sheet directly');
ok((await txt(p, 'count')) === '0' && (await p.locator('.row.on').count()) === 0, 'selections reset');
ok((await p.locator('.round-pill').innerText()).includes('2'), 'round 2 label');
ok((await p.getByTestId('name-input').inputValue()) === '김민수', 'name kept');

// ---------- Flow B: ?time=12, auto submit, mobile ----------
console.log('Flow B: mobile, ?time=12 auto-submit');
p = await newPage({ width: 390, height: 844 });
await p.goto(URL + '?time=12');
await p.getByTestId('start').click();
ok((await txt(p, 'time-left')) === '12', 'URL time=12 applied');
await p.getByTestId('row-tofu').click();
await p.getByTestId('row-muer').click();
await p.waitForTimeout(2500);
ok(await p.getByTestId('timerbar').evaluate((e) => e.classList.contains('danger')), 'danger warning ≤10s');
await p.screenshot({ path: `${SHOT}/10-m-order.png` });
await p.getByTestId('timeup').waitFor({ timeout: 13000 });
ok(true, 'time up → auto submit');
await p.getByTestId('cooking').waitFor({ timeout: 5000 });
await p.getByTestId('skip').click();
ok(JSON.stringify(await bowlIds(p)) === '["muer","tofu"]', 'auto-submitted order cooked');
await p.getByTestId('to-result').click();
await p.waitForTimeout(1300);
ok((await txt(p, 'r-price')) === '4元', 'price 4元');
ok((await txt(p, 'r-spice')).includes('不辣'), 'no spice chosen + time up → 不辣');
await p.getByTestId('target-input').fill('5');
await p.getByTestId('target-check').click();
await p.waitForTimeout(400);
await p.screenshot({ path: `${SHOT}/11-m-result.png`, fullPage: true });
await p.getByTestId('home').click();
ok(await p.getByTestId('start').isVisible(), 'home button → start screen');

// ---------- Flow C: tablet, all 26 + 特辣 ----------
console.log('Flow C: tablet, all items, 特辣');
p = await newPage({ width: 820, height: 1180 });
await p.goto(URL);
await p.getByTestId('start').click();
await p.getByTestId('spice-tela').click();
const all = await p.locator('[data-testid^="row-"]').evaluateAll((els) => els.map((e) => e.dataset.testid.slice(4)));
for (const id of all) await p.getByTestId(`row-${id}`).click();
ok((await txt(p, 'total')) === '70' && (await txt(p, 'count')) === '26', 'all 26 → 70元');
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(300);
await p.screenshot({ path: `${SHOT}/20-t-order.png` });
await p.getByTestId('submit').click();
await p.locator('[data-stage="adding"]').waitFor({ timeout: 6000 });
await p.waitForTimeout(3000);
await p.screenshot({ path: `${SHOT}/21-t-adding.png` });
await p.getByTestId('skip').click();
ok((await p.getByTestId('bowl-item').count()) === 26, 'bowl has all 26');
await p.waitForTimeout(800);
await p.screenshot({ path: `${SHOT}/22-t-done.png` });

// soup colour check for each spice level
p = await newPage({ width: 1366, height: 900 });
for (const sp of ['bula', 'weila', 'zhongla', 'tela']) {
  await p.goto(URL);
  await p.getByTestId('start').click();
  await p.getByTestId(`spice-${sp}`).click();
  for (const id of ['niuwa', 'maodu', 'wucanrou', 'yaxue', 'yudoufu', 'xiebang', 'haidai', 'kuanfen']) await p.getByTestId(`row-${id}`).click();
  await p.getByTestId('submit').click();
  await p.getByTestId('cooking').waitFor();
  await p.getByTestId('skip').click();
  await p.waitForTimeout(700);
  await p.locator('.cook-bowl').screenshot({ path: `${SHOT}/3x-bowl-${sp}.png` });
}
ok(true, 'rendered all 4 spice levels');

await browser.close();
console.log(`\n${pass} checks passed`);
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'No page errors');
