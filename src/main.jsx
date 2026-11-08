import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const raw = window.MALATANG_CONFIG || {};
const cfg = {
  time: Number.isFinite(raw.time) ? raw.time : (raw.rounds && raw.rounds[0] && raw.rounds[0].time) || 60,
  closeRange: Number.isFinite(raw.closeRange) ? raw.closeRange : 3,
  ingredients: (raw.ingredients || []).map((i) => ({ ...i, price: Number(i.price) || 0 })),
  spice: raw.spice && raw.spice.length ? raw.spice : [
    { id: 'bula', zh: '不辣', pinyin: 'bú là', ko: '안 매운맛', level: 0 },
    { id: 'weila', zh: '微辣', pinyin: 'wēi là', ko: '약간 매운맛', level: 1 },
    { id: 'zhongla', zh: '中辣', pinyin: 'zhōng là', ko: '중간 매운맛', level: 2 },
    { id: 'tela', zh: '特辣', pinyin: 'tè là', ko: '아주 매운맛', level: 3 },
  ],
  groups: raw.groups || [{ id: 'all', zh: '食材', ko: '재료' }],
};
// 구역(group)이 없는 재료는 마지막 구역에 넣기
const gids = new Set(cfg.groups.map((g) => g.id));
cfg.ingredients.forEach((i) => { if (!gids.has(i.group)) i.group = cfg.groups[cfg.groups.length - 1].id; });

createRoot(document.getElementById('root')).render(<App cfg={cfg} />);
