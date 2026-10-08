// Bundles + minifies CSS and JS into assets/css/bundle.min.css and
// assets/js/bundle.min.js, then stamps a content hash (?v=) into every page
// so browsers can cache the bundles forever and still pick up changes.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PurgeCSS } from 'purgecss';
import { transform as cssTransform } from 'lightningcss';
import { transform as jsTransform } from 'esbuild';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const pages = readdirSync(ROOT).filter((f) => f.endsWith('.html'));

// Order matters (same order the pages used to load them).
const JS = [
  'assets/js/jquery-3.7.1.min.js',
  'assets/js/bootstrap.bundle.min.js',
  'assets/js/jquery.magnific-popup.min.js',
  'assets/js/swiper-bundle.min.js',
  'assets/js/nice-select.js',
  'assets/js/aos.js',
  'assets/js/plugin.js', // GSAP + ScrollTrigger + SplitText
  'assets/js/gAnim.js',
  'assets/js/jquery.waypoints.js',
  'assets/js/jquery.counterup.min.js',
  'assets/js/parallaxie.js',
  'assets/js/main.js',
];

// `purge: true` strips selectors not used by any page or script.
const CSS = [
  { file: 'assets/css/fonts.css' },
  { file: 'assets/css/bootstrap.min.css', purge: true },
  { file: 'assets/css/magnific-popup.css' },
  { file: 'assets/css/swiper-bundle.min.css' },
  { file: 'assets/css/nice-select.css' },
  { file: 'assets/css/aos.css' },
  { file: 'assets/css/fontawesome-subset.css' },
  { file: 'assets/css/style.css', purge: true },
  { file: 'assets/css/sections.css' },
];

const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);

async function buildJs() {
  const parts = [];
  for (const f of JS) {
    const { code } = await jsTransform(read(f), { minify: true, legalComments: 'inline', target: 'es2018', loader: 'js' });
    parts.push(code.trim().replace(/;?$/, ';'));
  }
  return parts.join('\n');
}

async function buildCss() {
  const content = [
    ...pages.map((p) => ({ raw: read(p), extension: 'html' })),
    // Bootstrap's bundle is left out: it mentions every Bootstrap class and
    // would keep them all. Its runtime classes are safelisted below instead.
    ...JS.filter((f) => !f.includes('bootstrap')).map((f) => ({ raw: read(f), extension: 'js' })),
  ];
  const out = [];
  for (const { file, purge } of CSS) {
    let css = read(file);
    if (purge) {
      const [res] = await new PurgeCSS().purge({
        content,
        css: [{ raw: css }],
        safelist: {
          standard: [/^swiper/, /^mfp-/, /^aos/, /^show$/, /^active/, /^open$/, /sticky/, /^th-offcanvas/, /cursor-hover/, /^th-active$/, /^split-line$/, /^nice-select/, /^current$/, /^selected$/, /^disabled$/, /^focus$/, /^collaps/, /^fade$/, /^modal/],
          greedy: [/data-aos/],
        },
        keyframes: true,
        fontFace: false,
        variables: false,
      });
      css = res.css;
    }
    out.push(css);
  }
  const { code } = cssTransform({ filename: 'bundle.css', code: Buffer.from(out.join('\n')), minify: true });
  return code.toString();
}

const [js, css] = await Promise.all([buildJs(), buildCss()]);
writeFileSync(join(ROOT, 'assets/js/bundle.min.js'), js);
writeFileSync(join(ROOT, 'assets/css/bundle.min.css'), css);
const jsV = hash(js), cssV = hash(css);

for (const p of pages) {
  const html = read(p);
  const next = html
    .replace(/assets\/js\/bundle\.min\.js(\?v=[\w]+)?/g, `assets/js/bundle.min.js?v=${jsV}`)
    .replace(/assets\/css\/bundle\.min\.css(\?v=[\w]+)?/g, `assets/css/bundle.min.css?v=${cssV}`);
  if (next !== html) writeFileSync(join(ROOT, p), next);
}
console.log(`css ${(css.length / 1024).toFixed(1)} KB (v=${cssV}), js ${(js.length / 1024).toFixed(1)} KB (v=${jsV})`);
