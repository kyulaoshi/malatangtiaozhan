import React, { useEffect, useMemo, useRef, useState } from 'react';
import { sound } from './utils.js';

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

/** STEP 3~4: 중국식 종이 주문서 + 타이머 */
export default function OrderSheet({ cfg, round, time, name, setName, onSubmit }) {
  const [selected, setSelected] = useState([]); // 선택 순서대로 id 저장
  const [spice, setSpice] = useState(null); // 맵기 (하나만 선택)
  const spiceRef = useRef(spice);
  spiceRef.current = spice;
  const [locked, setLocked] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [warn, setWarn] = useState('');
  const [left, setLeft] = useState(time);
  const submittedRef = useRef(false);
  const endRef = useRef(Date.now() + time * 1000);
  const selRef = useRef(selected);
  selRef.current = selected;
  const orderNo = useMemo(() => String(Math.floor(1000 + Math.random() * 9000)), []);

  const byId = useMemo(() => Object.fromEntries(cfg.ingredients.map((i) => [i.id, i])), [cfg]);
  const total = selected.reduce((s, id) => s + byId[id].price, 0);

  const submit = (auto = false) => {
    if (submittedRef.current) return;
    if (!auto && !spiceRef.current) {
      setWarn('请选择辣度！ 맵기(辣度)를 골라 주세요.');
      sound.alarm();
      setTimeout(() => setWarn(''), 2200);
      return;
    }
    if (!auto && selRef.current.length === 0) {
      setWarn('请至少选择一种食材！ 재료를 1개 이상 골라 주세요.');
      sound.alarm();
      setTimeout(() => setWarn(''), 2200);
      return;
    }
    submittedRef.current = true;
    setLocked(true);
    sound.stamp();
    const order = selRef.current.map((id) => byId[id]);
    // 시간이 끝날 때까지 맵기를 안 고르면 不辣(첫 번째)
    const sp = cfg.spice.find((x) => x.id === spiceRef.current) || cfg.spice[0];
    setTimeout(() => onSubmit(order, sp), auto ? 2000 : 1300);
  };

  // 타이머 (실제 시간 기준이라 오차 없음)
  useEffect(() => {
    let last = time;
    const t = setInterval(() => {
      if (submittedRef.current) { clearInterval(t); return; }
      const s = Math.max(0, Math.ceil((endRef.current - Date.now()) / 1000));
      if (s !== last) {
        last = s;
        setLeft(s);
        if (s <= 10 && s > 0) sound.tick();
      }
      if (s <= 0) {
        clearInterval(t);
        setTimeUp(true);
        sound.alarm();
        submit(true);
      }
    }, 100);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id) => {
    if (locked) return;
    setSelected((cur) => {
      if (cur.includes(id)) { sound.uncheck(); return cur.filter((x) => x !== id); }
      sound.check();
      return [...cur, id];
    });
  };

  const danger = left <= 10;
  const pct = Math.max(0, (left / time) * 100);

  return (
    <div className="order-screen">
      {/* 상단 타이머 바 */}
      <header className={`timerbar ${danger ? 'danger' : ''}`} data-testid="timerbar">
        <div className="tb-left">
          <span className="round-pill">ROUND {round}</span>
          <span className="target-chip">🎯 目标价格：听老师说！<small> 선생님이 말한 가격</small></span>
        </div>
        <div className="tb-timer">
          <span className="clock">⏱</span>
          <span className="tb-text">剩余时间：<b data-testid="time-left">{left}</b>秒</span>
          {danger && !locked && <span className="hurry">快点！서둘러!</span>}
        </div>
        <div className="tb-progress"><i style={{ width: `${pct}%` }} /></div>
      </header>

      <div className="sheet-wrap">
        <article className={`sheet ${locked ? 'locked' : ''}`} data-testid="sheet">
          <div className="sheet-holes" aria-hidden="true" />
          <div className="sheet-head">
            <div className="shop">红火麻辣烫 · 自选食材 · 按份计价</div>
            <h2 className="sheet-title">麻辣烫点菜单</h2>
            <div className="sheet-meta">
              <span>No. <b>{orderNo}</b></span>
              <span>{today()}</span>
              <span>第 {round} 轮</span>
            </div>
            <label className="cust">
              顾客姓名：
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={12}
                placeholder="이름을 쓰세요" disabled={locked} data-testid="name-input" />
            </label>
            <p className="sheet-hint">✔ 想吃的食材请打勾 · 먹고 싶은 재료에 체크하세요 (각 1개)</p>
          </div>

          <section className="spice-group">
            <h3><span>辣度</span><small>免费 · 0元</small></h3>
            <div className="spice-row">
              {cfg.spice.map((sp) => {
                const on = spice === sp.id;
                return (
                  <button type="button" key={sp.id} className={`row spice ${on ? 'on' : ''}`} disabled={locked}
                    onClick={() => { if (!locked && spice !== sp.id) { sound.check(); setSpice(sp.id); } }}
                    aria-pressed={on} data-testid={`spice-${sp.id}`}>
                    <span className="box round" aria-hidden="true">
                      {on && <svg viewBox="0 0 40 40"><path className="tick" d="M7 21 L16 30 L35 6" /></svg>}
                    </span>
                    <span className="names">
                      <span className="zh">{sp.zh}</span>
                      <span className="py">{sp.pinyin}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="sheet-body">
            {cfg.groups.map((grp) => {
              const list = cfg.ingredients.filter((i) => i.group === grp.id);
              if (!list.length) return null;
              return (
                <section className="sheet-group" key={grp.id}>
                  <h3><span>{grp.zh}</span></h3>
                  <ul>
                    {list.map((it) => {
                      const on = selected.includes(it.id);
                      return (
                        <li key={it.id}>
                          <button type="button" className={`row ${on ? 'on' : ''}`} onClick={() => toggle(it.id)}
                            disabled={locked} aria-pressed={on} data-testid={`row-${it.id}`}>
                            <span className="box" aria-hidden="true">
                              {on && (
                                <svg viewBox="0 0 40 40"><path className="tick" d="M7 21 L16 30 L35 6" /></svg>
                              )}
                            </span>
                            <span className="names">
                              <span className="zh">{it.zh}</span>
                              <span className="py">{it.pinyin}</span>
                            </span>
                            <span className="dots" aria-hidden="true" />
                            <span className="price">{it.price}元</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>

          <footer className="sheet-foot">
            <div className="sum">
              <span>辣度：<b className="sp" data-testid="spice-chosen">{spice ? cfg.spice.find((x) => x.id === spice).zh : '—'}</b></span>
              <span>已选食材：<b data-testid="count">{selected.length}</b>种</span>
              <span className="total">合计：<b data-testid="total">{total}</b>元</span>
            </div>
            <button type="button" className="submit-btn" onClick={() => submit(false)} disabled={locked}
              data-testid="submit">
              <span>提交订单</span><small>주문서 제출</small>
            </button>
          </footer>

          {locked && (
            <div className="stamp" data-testid="stamp">
              <span>已下单</span><small>ORDER OK</small>
            </div>
          )}
        </article>
      </div>

      {warn && <div className="toast" role="alert">{warn}</div>}
      {timeUp && (
        <div className="timeup" data-testid="timeup">
          <div><b>时间到！</b><span>시간 종료! 주문서가 자동으로 제출됩니다</span></div>
        </div>
      )}
    </div>
  );
}
