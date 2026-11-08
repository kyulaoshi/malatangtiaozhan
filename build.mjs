// 빌드: node build.mjs → dist/index.html (파일 1개로 완성, GitHub Pages에 그대로 업로드)
import { build } from 'esbuild';
import fs from 'node:fs';

const out = await build({
  entryPoints: ['src/main.jsx'],
  bundle: true,
  minify: true,
  write: false,
  outdir: 'tmp',
  jsx: 'automatic',
  target: ['es2020'],
  define: { 'process.env.NODE_ENV': '"production"' },
  loader: { '.js': 'jsx' },
});
const js = out.outputFiles.find((f) => f.path.endsWith('.js')).text;
const css = out.outputFiles.find((f) => f.path.endsWith('.css')).text;
const config = fs.readFileSync('config.js', 'utf8');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>麻辣烫价格大挑战！</title>
<meta name="description" content="마라탕 가격 맞추기 — 중국어 음식 어휘와 가격 표현 연습 게임" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8C%B6%EF%B8%8F%3C/text%3E%3C/svg%3E" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Sans+KR:wght@500;700;900&family=Noto+Sans+SC:wght@500;700;900&family=ZCOOL+KuaiLe&display=swap" />
<style>${css}</style>
<script>
${config}
</script>
</head>
<body>
<div id="root"></div>
<noscript>이 게임은 JavaScript가 필요합니다.</noscript>
<script>${js.replace(/<\/script/gi, '<\\/script')}</script>
</body>
</html>
`;
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', html);
console.log('dist/index.html', (html.length / 1024).toFixed(1) + ' KB');
