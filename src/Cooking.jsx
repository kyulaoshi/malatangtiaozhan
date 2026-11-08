import React, { useEffect, useRef, useState } from 'react';
import Bowl, { Ico } from './Bowl.jsx';
import { sound } from './utils.js';

/** STEP 5: 주문한 재료대로 마라탕 조리 */
export default function Cooking({ order, spice, orderName, onDone }) {
  const [stage, setStage] = useState('received'); // received → start → adding → simmer → done
  const [count, setCount] = useState(0);
  const [skip, setSkip] = useState(false);
  const doneRef = useRef(false);
  const running = order.slice(0, count).reduce((s, i) => s + i.price, 0);
  const last = count > 0 ? order[count - 1] : null;

  useEffect(() => {
    if (skip) return;
    let alive = true;
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(() => alive && fn(), ms));
    let t = 0;
    at(t, () => sound.ding());
    t += 1500; at(t, () => setStage('start'));
    t += 1400; at(t, () => setStage('adding'));
    t += 300;
    order.forEach((_, i) => {
      at(t, () => { setCount(i + 1); sound.plop(); });
      t += order.length > 10 ? 560 : 760;
    });
    t += 500; at(t, () => setStage('simmer'));
    t += 1600; at(t, () => { setStage('done'); sound.fanfare(); });
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, [order, skip]);

  const finish = () => { if (!doneRef.current) { doneRef.current = true; onDone(); } };
  const doSkip = () => { setSkip(true); setCount(order.length); setStage('done'); sound.fanfare(); };

  useEffect(() => {
    if (stage !== 'done') return;
    const t = setTimeout(finish, 4200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const stepIdx = { received: 0, start: 1, adding: 2, simmer: 2, done: 3 }[stage];
  const pct = stage === 'done' ? 100
    : stage === 'received' ? 8 : stage === 'start' ? 20
    : stage === 'simmer' ? 92 : 22 + (order.length ? (count / order.length) * 66 : 66);

  return (
    <div className={`cook-screen stage-${stage}`} data-testid="cooking" data-stage={stage}>
      <ol className="cook-steps">
        {['订单已收到', '开始制作', '放入食材', '做好了'].map((s, i) => (
          <li key={s} className={i < stepIdx ? 'past' : i === stepIdx ? 'now' : ''}><i>{i + 1}</i>{s}</li>
        ))}
      </ol>

      {stage === 'received' && (
        <div className="ticket pop-in">
          <div className="ticket-title">订单已收到！</div>
          <div className="ticket-sub">주문 접수 완료! {orderName ? `· ${orderName}` : ''}</div>
          <div className="ticket-spice">辣度：<b>{spice.zh}</b> {'🌶️'.repeat(spice.level)}</div>
          <ul>
            {order.map((i) => <li key={i.id}><span>✔ {i.zh}</span><span>{i.price}元</span></li>)}
            {!order.length && <li><span>（没有食材 · 재료 없음）</span><span>0元</span></li>}
          </ul>
        </div>
      )}

      {stage !== 'received' && (
        <>
          <h2 className={`cook-banner ${stage === 'done' ? 'done' : ''}`} key={stage === 'done' ? 'd' : stage === 'start' ? 's' : 'a'}>
            {stage === 'start' && <>开始制作麻辣烫！<small>마라탕 만들기 시작! · 辣度 {spice.zh} {'🌶️'.repeat(spice.level)}</small></>}
            {stage === 'adding' && <>放入食材…<small>재료를 넣는 중 ({count}/{order.length})</small></>}
            {stage === 'simmer' && <>咕嘟咕嘟… 煮一煮！<small>보글보글 끓이는 중</small></>}
            {stage === 'done' && <>麻辣烫做好了！<small>마라탕 완성!</small></>}
          </h2>

          <div className={`cook-stage ${stage === 'done' ? 'big' : ''}`}>
            {stage === 'done' && <div className="rays" aria-hidden="true" />}
            <Bowl items={order} spice={spice.level} visible={stage === 'start' ? 0 : count} drop={stage !== 'done'}
              steam boil className="cook-bowl" labels={stage === 'done'} />
            {stage === 'adding' && last && (
              <div className="add-pop" key={last.id}>
                <Ico id={last.id} emoji={last.emoji} />
                <b>{last.zh}</b><span>{last.ko}</span><em>+{last.price}元</em>
              </div>
            )}
            {stage === 'adding' && !order.length && <div className="add-pop"><b>只有汤！</b><span>국물만 있어요</span></div>}
          </div>

          {stage !== 'done' ? (
            <div className="cook-meter">
              <div className="bar"><i style={{ width: `${pct}%` }} /></div>
              <span>制作中… 조리 중 · 现在 <b>{running}</b>元</span>
            </div>
          ) : (
            <div className="in-bowl" data-testid="in-bowl">
              <span className="lbl">碗里有 · 그릇 속 재료</span>
              {order.map((i) => (
                <span className="chip" key={i.id}><Ico id={i.id} emoji={i.emoji} />{i.zh}<small>{i.ko}</small></span>
              ))}
              {!order.length && <span className="chip">只有汤 · 국물만</span>}
            </div>
          )}
        </>
      )}

      <div className="cook-actions">
        {stage === 'done'
          ? <button className="btn primary" onClick={finish} data-testid="to-result">查看价格 ▶ <small>가격 확인</small></button>
          : <button className="btn ghost small" onClick={doSkip} data-testid="skip">跳过 ⏭ <small>건너뛰기</small></button>}
      </div>
    </div>
  );
}
