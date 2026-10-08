// Builds one CSS file and one JS file per page, containing only what that page
// uses, then stamps a content hash (?v=) into the page so browsers can cache the
// files and still pick up changes.
//
//   assets/css/<page>.min.css       assets/js/<page>.min.js (+ .map)
//
// Libraries are included per page based on what the page's HTML contains
// (see FEATURES). main.js copes with any library being absent.
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gzipSync, constants as zlib } from 'node:zlib'; // only used for the size report
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PurgeCSS } from 'purgecss';
import { transform as cssTransform } from 'lightningcss';
import { transform as jsTransform } from 'esbuild';
import { inlineCritical, setCssBlock } from './critical.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const write = (p, data) => writeFileSync(join(ROOT, p), data);
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);
const pages = readdirSync(ROOT).filter((f) => f.endsWith('.html'));

// Optional libraries, and how to tell a page needs them.
const FEATURES = {
  swiper: /class="[^"]*\bswiper\b/,
  bootstrap: /data-bs-/,
  anim: /text-anime-style|text-effect|class="[^"]*\breveal\b|vl-clip-anim|text-scale-anim|tp-letter-span/,
};

// JS in load order. `when` names a FEATURES key; no `when` = every page.
const JS = [
  { file: 'assets/js/jquery-3.7.1.min.js' },
  { file: 'assets/js/bootstrap.bundle.min.js', when: 'bootstrap' },
  { file: 'assets/js/swiper-bundle.min.js', when: 'swiper' },
  { file: 'assets/js/aos.js' },
  { file: 'assets/js/plugin.js', when: 'anim' }, // GSAP + ScrollTrigger + SplitText
  { file: 'assets/js/gAnim.js', when: 'anim' },
  { file: 'assets/js/main.js' },
];

// CSS in cascade order. `purge: true` strips selectors the page doesn't use.
const CSS = [
  { file: 'assets/css/fonts.css' },
  { file: 'assets/css/bootstrap.min.css', purge: true },
  { file: 'assets/css/swiper-bundle.min.css', when: 'swiper' },
  { file: 'assets/css/aos.css' },
  { file: 'assets/css/fontawesome-subset.css' },
  { file: 'assets/css/style.css', purge: true },
  { file: 'assets/css/sections.css' },
];

// Classes that only appear at runtime (added by JS libraries).
const SAFELIST = {
  standard: [/^swiper/, /^aos/, /^show$/, /^active/, /^open$/, /sticky/, /^th-offcanvas/, /cursor-hover/,
    /^th-active$/, /^split-line$/, /^current$/, /^selected$/, /^disabled$/, /^focus$/, /^collaps/, /^fade$/,
    /^is-armed$/, /^is-live$/],
  greedy: [/data-aos/],
};

const gz = (s) => gzipSync(s, { level: zlib.Z_BEST_COMPRESSION });
const minified = new Map(); // file -> { code, map }

async function minifyJs(file) {
  if (!minified.has(file)) {
    const r = await jsTransform(read(file), {
      minify: true, legalComments: 'inline', target: 'es2018', loader: 'js',
      sourcemap: 'external', sourcefile: '../../' + file, sourcesContent: true,
    });
    minified.set(file, { code: r.code.trim().replace(/;?$/, ';'), map: JSON.parse(r.map) });
  }
  return minified.get(file);
}

async function buildJs(page, needs) {
  const parts = [], sections = [];
  let line = 0;
  for (const { file, when } of JS) {
    if (when && !needs[when]) continue;
    const { code, map } = await minifyJs(file);
    sections.push({ offset: { line, column: 0 }, map });
    parts.push(code);
    line += code.split('\n').length;
  }
  const name = page.replace(/\.html$/, '');
  const code = parts.join('\n') + `\n//# sourceMappingURL=${name}.min.js.map\n`;
  // An "index map" stitches the per-library source maps together.
  write(`assets/js/${name}.min.js.map`, JSON.stringify({ version: 3, file: `${name}.min.js`, sections }));
  return code;
}

async function buildCss(page, needs) {
  const jsContent = JS.filter((j) => (!j.when || needs[j.when]) && !j.file.includes('bootstrap'))
    .map((j) => ({ raw: read(j.file), extension: 'js' }));
  const content = [{ raw: read(page), extension: 'html' }, ...jsContent];
  const out = [];
  for (const { file, purge, when } of CSS) {
    if (when && !needs[when]) continue;
    let css = read(file);
    if (purge) {
      const [res] = await new PurgeCSS().purge({
        content, css: [{ raw: css }], safelist: SAFELIST, keyframes: true, fontFace: false, variables: false,
      });
      css = res.css;
    }
    out.push(css);
  }
  return cssTransform({ filename: 'page.css', code: Buffer.from(out.join('\n')), minify: true }).code.toString();
}

// Remove the old single-bundle files from earlier builds.
for (const f of ['assets/css/bundle.min.css', 'assets/js/bundle.min.js']) {
  if (existsSync(join(ROOT, f))) unlinkSync(join(ROOT, f));
}

for (const page of pages) {
  const html = read(page);
  const needs = Object.fromEntries(Object.entries(FEATURES).map(([k, re]) => [k, re.test(html)]));
  const name = page.replace(/\.html$/, '');
  const [js, css] = await Promise.all([buildJs(page, needs), buildCss(page, needs)]);
  write(`assets/js/${name}.min.js`, js);
  write(`assets/css/${name}.min.css`, css);
  const cssHref = `assets/css/${name}.min.css?v=${hash(css)}`;
  const next = setCssBlock(html, cssHref) // plain <link>; critical.mjs inlines below if it can
    .replace(/assets\/js\/[\w-]+\.min\.js(\?v=\w+)?/g, `assets/js/${name}.min.js?v=${hash(js)}`);
  if (next !== html) write(page, next);
  const libs = Object.keys(needs).filter((k) => needs[k]).join(', ') || 'core only';
  console.log(`${page.padEnd(22)} css ${(css.length / 1024).toFixed(0).padStart(4)} KB (${(gz(css).length / 1024).toFixed(0)} gz)  js ${(js.length / 1024).toFixed(0).padStart(4)} KB (${(gz(js).length / 1024).toFixed(0)} gz)  [${libs}]`);
}

// Inline critical CSS (optional: needs playwright-core + Chromium).
const skipped = await inlineCritical(ROOT, pages);
if (skipped) console.log(`critical CSS skipped (${skipped}); pages use a normal stylesheet link`);
