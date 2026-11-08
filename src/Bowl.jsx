import React, { useId, useMemo } from 'react';
import { iconSvg } from './icons.js';
import { bowlLayout } from './utils.js';

/**
 * 마라탕 그릇
 * items   : 그릇에 들어갈 재료 배열 (주문한 재료만!)
 * visible : 현재까지 들어간 개수 (조리 애니메이션용)
 * drop    : 새로 들어가는 재료에 낙하 애니메이션
 */
// 맵기 단계별 국물 색 [가운데, 중간, 가장자리, 기름]
const SOUP = [
  ['#f8ead0', '#ecd3a8', '#c9a46e', '#fff6e2'], // 不辣: 뽀얀 사골 국물
  ['#f9a95c', '#ea7a30', '#b5531a', '#ffc070'], // 微辣
  ['#f0592a', '#d23418', '#8f1608', '#ffa23a'], // 中辣
  ['#d6281b', '#a3110a', '#560603', '#ff5a1f'], // 特辣
];

export default function Bowl({ items = [], visible, drop = false, steam = true, boil = true, className = '', labels = false, spice = 2 }) {
  const lv = Math.max(0, Math.min(3, spice));
  const soup = SOUP[lv];
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const n = items.length;
  const layout = useMemo(() => bowlLayout(n), [n]);
  const shown = visible == null ? n : visible;

  return (
    <div className={`bowl ${className}`} data-testid="bowl">
      {steam && (
        <svg className="steam" viewBox="0 0 400 200" aria-hidden="true">
          {[120, 200, 280].map((x, i) => (
            <path key={x} className={`wisp w${i}`}
              d={`M${x} 190 C${x - 25} 160 ${x + 25} 130 ${x} 100 C${x - 25} 70 ${x + 25} 40 ${x} 10`} />
          ))}
        </svg>
      )}

      {/* 뒤쪽: 그릇 입구 + 국물 */}
      <svg className="bowl-layer" viewBox="0 0 400 300" aria-hidden="true">
        <defs>
          <radialGradient id={`soup${uid}`} cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor={soup[0]} />
            <stop offset="55%" stopColor={soup[1]} />
            <stop offset="100%" stopColor={soup[2]} />
          </radialGradient>
          <linearGradient id={`wall${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6e9d4" />
            <stop offset="100%" stopColor="#dcc5a2" />
          </linearGradient>
        </defs>
        <ellipse cx="200" cy="292" rx="150" ry="10" fill="rgba(40,0,0,.28)" />
        <ellipse cx="200" cy="110" rx="182" ry="56" fill="#fff6e6" stroke="#6e170e" strokeWidth="4" />
        <ellipse cx="200" cy="114" rx="168" ry="47" fill={`url(#wall${uid})`} />
        <ellipse cx="200" cy="124" rx="160" ry="38" fill={`url(#soup${uid})`} />
        {/* 고추기름, 깨, 파 */}
        <g className={boil ? 'soup-shimmer' : ''}>
          {[[110, 118, 14, 5], [270, 130, 18, 6], [190, 140, 12, 4], [320, 116, 10, 4], [80, 132, 9, 3], [230, 106, 11, 4]].map(([x, y, rx, ry], i) => (
            <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={soup[3]} opacity=".55" />
          ))}
          {[[140, 108], [250, 148], [300, 136], [96, 122], [210, 120], [170, 150], [330, 128], [60, 126]].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="2.6" ry="1.5" fill="#fff4d6" />
          ))}
          {lv > 0 && [[124, 140], [286, 112], [222, 152], [72, 116], [176, 116], [312, 146], [100, 150], [256, 104]]
            .slice(0, lv * 3).map(([x, y], i) => (
              <path key={i} d={`M${x} ${y} l9 -3 l2 4 l-9 3z`} fill="#8e0f06" />
            ))}
          {lv === 3 && [[150, 152, -20], [300, 104, 25], [64, 136, 10], [236, 140, -35]].map(([x, y, r], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
              <path d="M0 0 C6 -6 20 -6 26 -2 C20 2 8 4 0 0Z" fill="#c4140c" stroke="#5c0703" strokeWidth="1.5" />
              <path d="M0 0 l-5 -3" stroke="#3f8f2f" strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
          {[[150, 128], [262, 120], [338, 140], [100, 146]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3.4" fill="none" stroke="#5fb84a" strokeWidth="2.2" />
          ))}
        </g>
        {boil && (
          <g className="bubbles">
            {[[90, 128], [150, 144], [210, 130], [262, 146], [318, 126], [180, 108], [240, 112], [120, 112]].map(([x, y], i) => (
              <circle key={i} className={`bub b${i % 4}`} cx={x} cy={y} r="5" fill="none" stroke={lv === 0 ? "#fffaf0" : "#ffc58a"} strokeWidth="2" />
            ))}
          </g>
        )}
      </svg>

      {/* 재료 */}
      <div className="bowl-items">
        {items.slice(0, shown).map((it, i) => {
          const p = layout[i];
          return (
            <div key={it.id} className="bowl-item" data-testid="bowl-item" data-id={it.id}
              title={`${it.zh} ${it.ko}`}
              style={{
                left: `${(p.x / 400) * 100}%`, top: `${(p.y / 300) * 100}%`,
                width: `${(p.size / 400) * 100}%`, zIndex: Math.round(p.y),
              }}>
              <div className={drop ? 'drop-in' : ''}>
                <div className="bowl-item-img" style={{ transform: `rotate(${p.rot}deg)` }}
                  dangerouslySetInnerHTML={{ __html: iconSvg(it.id, it.emoji) }} />
                {drop && <span className="splash" />}
              </div>
              {labels && n <= 8 && <span className="bowl-tag">{it.zh}</span>}
            </div>
          );
        })}
      </div>

      {/* 앞쪽: 그릇 몸통 (재료 아래쪽을 가려서 그릇 안에 들어간 것처럼 보이게) */}
      <svg className="bowl-layer front" viewBox="0 0 400 300" aria-hidden="true">
        <defs>
          <linearGradient id={`body${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8352a" />
            <stop offset="60%" stopColor="#c11d14" />
            <stop offset="100%" stopColor="#8a0f09" />
          </linearGradient>
        </defs>
        <path d="M18 110 C24 215 110 288 200 288 C290 288 376 215 382 110 A182 56 0 0 1 18 110Z"
          fill={`url(#body${uid})`} stroke="#6e170e" strokeWidth="4" />
        <path d="M44 190 Q200 262 356 190" fill="none" stroke="#f7c948" strokeWidth="4" />
        <path d="M54 206 Q200 274 346 206" fill="none" stroke="#f7c948" strokeWidth="2" strokeDasharray="10 7" />
        <path d="M30 150 Q200 230 370 150" fill="none" stroke="#f7c948" strokeWidth="2" opacity=".75" />
        <circle cx="200" cy="232" r="28" fill="#fff4dc" stroke="#f7c948" strokeWidth="4" />
        <text x="200" y="244" textAnchor="middle" fontSize="32" fontWeight="900" fill="#c11d14"
          fontFamily="'Ma Shan Zheng','ZCOOL KuaiLe','Noto Serif SC','Noto Sans CJK SC',serif">辣</text>
        <path d="M60 170 C80 220 120 250 160 262" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity=".22" />
        <path d="M18 110 A182 56 0 0 0 382 110" fill="none" stroke="#6e170e" strokeWidth="15" />
        <path d="M18 110 A182 56 0 0 0 382 110" fill="none" stroke="#fff6e6" strokeWidth="9" />
      </svg>
    </div>
  );
}

export function Ico({ id, emoji, className = '' }) {
  return <span className={`ico ${className}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconSvg(id, emoji) }} />;
}
