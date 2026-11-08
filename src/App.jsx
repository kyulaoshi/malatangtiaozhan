import React, { useEffect, useMemo, useRef, useState } from 'react';
import Bowl, { Ico } from './Bowl.jsx';
import OrderSheet from './OrderSheet.jsx';
import Cooking from './Cooking.jsx';
import { numToZh, sound, store } from './utils.js';
import { ICONS } from './icons.js';

const clampInt = (v, lo, hi, d) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d;
};

// 제한 시간: 주소 뒤에 ?time=90 을 붙이면 바뀜 (기본은 config.js의 time)
function timeLimit(cfg) {
  let t = cfg.time;
  try {
    const q = new URLSearchParams(location.search).get('time');
    if (q) t = clampInt(q, 10, 600, t);
  } catch { /* ignore */ }
  return t;
}

export default function App({ cfg }) {
  const [screen, setScreen] = useState('start');
  const [round, setRound] = useState(1);
  const [name, setName] = useState(() => store.get('mlt_name', ''));
  const [order, setOrder] = useState([]);
  const [spice, setSpice] = useState(null);
  const [muted, setMuted] = useState(sound.isMuted());
  const time = useMemo(() => timeLimit(cfg), [cfg]);

  useEffect(() => { store.set('mlt_name', name); }, [name]);
  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  const go = (s) => { sound.click(); setScreen(s); };
  const onSubmit = (o, sp) => { setOrder(o); setSpice(sp); setScreen('cooking'); };
  const next = () => { setRound((r) => r + 1); setOrder([]); go('order'); };

  return (
    <div className={`app scr-${screen}`}>
      <div className="lanterns" aria-hidden="true"><Lantern /><Lantern right /></div>
      <button className="mute" onClick={() => { sound.setMuted(!muted); setMuted(!muted); }}
        aria-label={muted ? '소리 켜기' : '소리 끄기'} title={muted ? '소리 켜기' : '소리 끄기'}>
        {muted ? '🔇' : '🔊'}
      </button>

      {screen === 'start' && <Start onStart={() => go('order')} />}
      {screen === 'order' && (
        <OrderSheet key={`r${round}`} cfg={cfg} round={round} time={time}
          name={name} setName={setName} onSubmit={onSubmit} />
      )}
      {screen === 'cooking' && <Cooking order={order} spice={spice} orderName={name} onDone={() => setScreen('result')} />}
      {screen === 'result' && (
        <Result key={`res${round}`} items={order} spice={spice} name={name} cfg={cfg} nextRound={round + 1}
          onNext={next} onHome={() => go('start')} />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- 공통 */
function Lantern({ right }) {
  return (
    <svg className={`lantern ${right ? 'r' : 'l'}`} viewBox="0 0 80 160">
      <line x1="40" y1="0" x2="40" y2="30" stroke="#3a1206" strokeWidth="3" />
      <rect x="28" y="28" width="24" height="8" rx="2" fill="#f2b632" />
      <ellipse cx="40" cy="74" rx="34" ry="40" fill="#e0261b" />
      <path d="M40 34 C22 50 22 98 40 114 M40 34 C58 50 58 98 40 114 M40 34 V114" fill="none" stroke="#a5120b" strokeWidth="2.5" />
      <ellipse cx="28" cy="62" rx="7" ry="14" fill="#ff7b5c" opacity=".45" />
      <text x="40" y="84" fontSize="24" textAnchor="middle" fill="#ffd451" fontWeight="900"
        fontFamily="'Ma Shan Zheng','Noto Serif SC','Noto Serif CJK SC',serif">{right ? '辣' : '福'}</text>
      <rect x="28" y="112" width="24" height="8" rx="2" fill="#f2b632" />
      <path d="M32 120 V150 M36 120 V154 M40 120 V156 M44 120 V154 M48 120 V150" stroke="#f2b632" strokeWidth="2.5" />
    </svg>
  );
}

/* ---------------------------------------------------------------- STEP 1 시작 화면 */
const HERO_ITEMS = ['beef', 'qingcai', 'fishball', 'quailegg', 'enoki', 'niangao', 'tofu', 'shrimp'];
function Start({ onStart }) {
  const heroItems = HERO_ITEMS.filter((id) => ICONS[id]).map((id) => ({ id, zh: '', ko: '' }));
  const floaters = ['lotus', 'potato', 'sausage', 'muer', 'meatball', 'baicai', 'noodles', 'fuzhu'];
  return (
    <main className="start">
      <div className="signboard">
        <span className="sb-small">正宗川味</span>
        <span className="sb-main">红火麻辣烫</span>
        <span className="sb-small">自选食材</span>
      </div>

      <h1 className="title" data-testid="title">
        <span className="t1">麻辣烫</span><span className="t2">价格大挑战！</span>
      </h1>
      <p className="subtitle">今天，你能挑战成功吗？<small>오늘, 도전에 성공할 수 있을까?</small></p>

      <div className="hero">
        {floaters.map((id, i) => (
          <span key={id} className={`floater f${i}`}><Ico id={id} /></span>
        ))}
        <Bowl items={heroItems} className="hero-bowl" />
      </div>

      <button className="start-btn" onClick={onStart} data-testid="start">
        <span className="chili">🌶️</span>开始游戏<small>게임 시작</small>
      </button>
      <p className="start-foot">목표 가격에 가장 가까운 마라탕을 만들어 보세요! · 中文 + 한국어</p>
    </main>
  );
}

/* ---------------------------------------------------------------- STEP 6~7 결과 화면 */
function useCountUp(to, ms = 1100) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf; const t0 = performance.now();
    const f = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return v;
}

function Result({ items, spice, name, cfg, nextRound, onNext, onHome }) {
  const price = items.reduce((t, i) => t + i.price, 0);
  const shown = useCountUp(price);
  const [input, setInput] = useState('');
  const [target, setTarget] = useState(null); // 선생님이 말한 목표 가격 (선택 입력)
  const diff = target == null ? null : Math.abs(target - price);
  const tier = diff == null ? null : diff === 0 ? 'exact' : diff <= cfg.closeRange ? 'close' : 'far';

  const check = () => {
    const v = clampInt(input, 1, 999, null);
    if (v == null) return;
    setTarget(v);
    const d = Math.abs(v - price);
    if (d === 0) sound.fanfare(); else if (d <= cfg.closeRange) sound.ding(); else sound.uncheck();
  };

  const msg = tier && {
    exact: ['恭喜你！价格完全正确！', '축하해요! 가격이 딱 맞았어요!'],
    close: ['太棒了！非常接近！', '아주 잘했어요! 정말 가까워요!'],
    far: ['下次再努力！', '다음에 다시 도전해요!'],
  }[tier];
  const relation = diff == null ? '' : price === target ? '딱 맞음' : price > target ? `${diff}元 초과` : `${diff}元 부족`;
  const lo = target == null ? 0 : Math.max(0, Math.min(target, price) - 6);
  const hi = target == null ? 1 : Math.max(target, price) + 6;
  const pos = (v) => `${((v - lo) / (hi - lo)) * 100}%`;
  const z = numToZh(price);
  const sorted = useMemo(() => cfg.ingredients.filter((i) => items.some((x) => x.id === i.id)), [cfg, items]);

  return (
    <main className="result" data-testid="result">
      {tier === 'exact' && <Confetti />}
      <h2 className="result-title">我的麻辣烫做好了！<small>{name ? `${name}의 ` : '내 '}마라탕 완성!</small></h2>

      <div className="result-grid">
        <section className="card bowl-card">
          <Bowl items={items} spice={spice.level} steam boil className="result-bowl" labels />
          <div className="spice-tag" data-testid="r-spice">
            辣度：<b>{spice.zh}</b> <i>{spice.pinyin}</i> {'🌶️'.repeat(spice.level) || '🥛'} <small>{spice.ko}</small>
          </div>
          <div className="in-bowl compact">
            {sorted.map((i) => (
              <span className="chip" key={i.id}><Ico id={i.id} emoji={i.emoji} />{i.zh}<small>{i.ko}</small></span>
            ))}
            {!sorted.length && <span className="chip">只有汤 · 국물만</span>}
          </div>
        </section>

        <section className="card price-card">
          <div className="my-price">
            <span>你的价格 <small>내 마라탕 가격</small></span>
            <b data-testid="r-price">{shown}元</b>
          </div>

          <div className="speech">
            <div className="speech-head">🙋 举手发表！ <small>손 들고 발표하기</small></div>
            <p className="say">我的麻辣烫是<b>{z.zh}</b>元！</p>
            <p className="say-py">Wǒ de málàtàng shì {z.py} yuán!</p>
            <p className="say-ko">제 마라탕은 {price}위안이에요!</p>
            <p className="say-sp">我要<b>{spice.zh}</b>。 <i>Wǒ yào {spice.pinyin}.</i> <small>({spice.ko}로 주세요)</small></p>
          </div>

          <form className="target-check" onSubmit={(e) => { e.preventDefault(); check(); }}>
            <label>
              🎯 目标价格 <small>선생님이 말한 목표 가격을 넣으면 차이를 계산해요</small>
            </label>
            <div className="tc-row">
              <input type="number" inputMode="numeric" min={1} max={999} value={input} placeholder="?"
                onChange={(e) => setInput(e.target.value)} data-testid="target-input" />
              <span>元</span>
              <button type="submit" className="btn primary small" data-testid="target-check">相差多少？ <small>차이 보기</small></button>
            </div>
          </form>

          {target != null && (
            <div className="diff-area pop-in" data-testid="diff-area">
              <div className="prices">
                <div className="pbox"><span>目标价格</span><small>목표 가격</small><b data-testid="r-target">{target}元</b></div>
                <div className="pbox mine"><span>你的价格</span><small>내 가격</small><b>{price}元</b></div>
                <div className={`pbox diff ${tier}`}><span>相差</span><small>차이</small><b data-testid="r-diff">{diff}元</b></div>
              </div>
              <div className="gauge" aria-hidden="true">
                <div className="g-line" />
                <div className="g-span" style={{ left: pos(Math.min(target, price)), width: `calc(${pos(Math.max(target, price))} - ${pos(Math.min(target, price))})` }} />
                <div className="g-mark target" style={{ left: pos(target) }}><i>🎯</i><span>{target}元</span></div>
                <div className="g-mark me" style={{ left: pos(price) }}><i>🍲</i><span>{price}元</span></div>
              </div>
              <p className="relation">|{target} − {price}| = <b>{diff}</b>元 · {relation}</p>
              <div className={`verdict ${tier} show`} data-testid="verdict"><b>{msg[0]}</b><span>{msg[1]}</span></div>
            </div>
          )}
        </section>

        <section className="card receipt">
          <h3>小票 <small>영수증</small></h3>
          <ul data-testid="receipt">
            {sorted.map((i) => (
              <li key={i.id}><span>{i.zh} <small>{i.ko}</small></span><span>{i.price}元</span></li>
            ))}
            {!sorted.length && <li><span>—</span><span>0元</span></li>}
            <li className="sp-line"><span>辣度：{spice.zh} <small>{spice.ko}</small></span><span>0元</span></li>
          </ul>
          <div className="r-total"><span>共 {sorted.length} 种 · 合计</span><b>{price}元</b></div>
        </section>
      </div>

      <div className="result-actions">
        <button className="btn ghost" onClick={onHome} data-testid="home">⌂ 首页 <small>처음 화면</small></button>
        <button className="btn primary big" onClick={onNext} data-testid="next">
          下一轮 ▶ ROUND {nextRound} <small>새 주문서 받기</small>
        </button>
      </div>
    </main>
  );
}

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 1.2, dur: 2.4 + Math.random() * 1.8,
    color: ['#ffd54a', '#ff6b3d', '#e0261b', '#57c27a', '#fff3d6'][i % 5], rot: Math.random() * 360,
  })), []);
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i key={i} style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, background: p.color, transform: `rotate(${p.rot}deg)` }} />
      ))}
    </div>
  );
}

