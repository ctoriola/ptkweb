// Critical CSS: inline the rules needed for the first screen of each page and
// load the full stylesheet without blocking rendering.
//
// Run by build.mjs. Needs playwright-core and a Chromium; if either is missing
// the pages keep a normal (render-blocking) stylesheet link, which is safe.
//
// A rule counts as critical if it matches any element that starts within the
// first screen at phone, tablet or desktop width (plus @font-face rules and the
// keyframes those rules use).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, extname } from 'node:path';
import { transform as cssTransform } from 'lightningcss';

const VIEWPORTS = [
  { width: 390, height: 844, isMobile: true },
  { width: 820, height: 1000, isMobile: true },
  { width: 1440, height: 900, isMobile: false },
];
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };

const START = '<!-- css:start -->', END = '<!-- css:end -->';
const plainLink = (href) => `${START}\n    <link rel="stylesheet" href="${href}">\n    ${END}`;

// Replace whatever is between the markers (or the bare link) with `block`.
export function setCssBlock(html, href, block) {
  const re = new RegExp(`${START}[\\s\\S]*?${END}|<link rel="stylesheet" href="assets/css/[\\w-]+\\.min\\.css(\\?v=\\w+)?">`);
  return html.replace(re, block ?? plainLink(href));
}

function findChromium() {
  const candidates = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/chromium', '/usr/bin/google-chrome'];
  return candidates.find((p) => p && existsSync(p));
}

export async function inlineCritical(root, pages) {
  let chromium;
  try { ({ chromium } = await import('playwright-core')); } catch { return 'playwright-core not installed'; }
  const executablePath = findChromium();
  if (!executablePath) return 'no Chromium found (set CHROMIUM_PATH)';

  const server = createServer((req, res) => {
    const path = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!existsSync(path)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' });
    res.end(readFileSync(path));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--no-proxy-server'] });
  try {
    for (const page of pages) {
      const html = readFileSync(join(root, page), 'utf8');
      const href = html.match(/assets\/css\/[\w-]+\.min\.css\?v=\w+/)[0];
      const kept = new Set();
      for (const vp of VIEWPORTS) {
        const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, javaScriptEnabled: false });
        const p = await ctx.newPage();
        await p.goto(base + page, { waitUntil: 'load' });
        const idx = await p.evaluate(() => {
          const vh = innerHeight, out = [];
          const above = (els) => { for (const el of els) if (el.getBoundingClientRect().top < vh) return true; return false; };
          const sheet = [...document.styleSheets].find((s) => s.href && s.href.includes('.min.css'));
          let i = 0;
          const walk = (rules) => {
            for (const r of rules) {
              const id = i++;
              if (r.type === 1) { // style rule
                const sel = r.selectorText.split(',').map((s) => s.replace(/::?(before|after|placeholder|selection|marker|-webkit-[\w-]+|-moz-[\w-]+)/g, '')
                  .replace(/:(hover|focus|focus-visible|focus-within|active|visited|checked|disabled|not\([^)]*\)|nth-[\w-]+\([^)]*\)|first-child|last-child|first-of-type|last-of-type|only-child|empty|root|is\([^)]*\)|where\([^)]*\))/g, '').trim() || '*');
                for (const s of sel) { try { if (above(document.querySelectorAll(s))) { out.push(id); break; } } catch { out.push(id); break; } }
              } else if (r.cssRules) { walk(r.cssRules); }
            }
          };
          walk(sheet.cssRules);
          return out;
        });
        idx.forEach((n) => kept.add(n));
        await ctx.close();
      }
      // Re-walk the stylesheet text in the same order and keep the chosen rules.
      const ctx = await browser.newContext({ javaScriptEnabled: false });
      const p = await ctx.newPage();
      await p.goto(base + page, { waitUntil: 'load' });
      const critical = await p.evaluate((keep) => {
        keep = new Set(keep);
        const sheet = [...document.styleSheets].find((s) => s.href && s.href.includes('.min.css'));
        let i = 0; const used = new Set();
        const walk = (rules) => {
          let css = '';
          for (const r of rules) {
            const id = i++;
            if (r.type === 1) { if (keep.has(id)) { css += r.cssText; (r.style.animationName || r.style.animation || '').split(/[\s,]+/).forEach((n) => used.add(n)); } }
            else if (r.type === 4) { const inner = walk(r.cssRules); if (inner) css += `@media ${r.media.mediaText}{${inner}}`; }
            else if (r.type === 12) { const inner = walk(r.cssRules); if (inner) css += `@supports ${r.conditionText}{${inner}}`; }
            else if (r.type === 5) { css += r.cssText; } // @font-face
            else if (r.cssRules) { walk(r.cssRules); }
          }
          return css;
        };
        let css = walk(sheet.cssRules);
        // keyframes used by kept rules
        const all = (rules) => [...rules].flatMap((r) => (r.type === 7 ? [r] : r.cssRules ? all(r.cssRules) : []));
        for (const k of all(sheet.cssRules)) if (used.has(k.name)) css += k.cssText;
        return css;
      }, [...kept]);
      await ctx.close();
      // url(../fonts/...) is relative to assets/css/; the inline copy lives in the page.
      const fixed = critical.replace(/url\((["']?)\.\.\/(fonts|img)\//g, 'url($1assets/$2/');
      const min = cssTransform({ filename: 'critical.css', code: Buffer.from(fixed), minify: true }).code.toString();
      const block = `${START}
    <style>${min}</style>
    <link rel="stylesheet" href="${href}" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="${href}"></noscript>
    ${END}`;
      writeFileSync(join(root, page), setCssBlock(html, href, block));
      console.log(`  critical ${page.padEnd(22)} ${(min.length / 1024).toFixed(0)} KB inline`);
    }
  } finally {
    await browser.close();
    server.close();
  }
  return null;
}
