# Build tools

Each page loads **its own** stylesheet and script, containing only what that
page uses (`assets/css/<page>.min.css`, `assets/js/<page>.min.js`). They are
generated — edit the source files, then rebuild:

```sh
cd tools
npm install      # first time only
npm run build
```

`build.mjs`:

- picks the libraries each page needs from its HTML (Swiper for sliders,
  Bootstrap for the FAQ accordion, GSAP for heading animations — see
  `FEATURES` in the script), purges unused CSS and minifies;
- inlines the page's **critical CSS** (what the first screen needs) and loads
  the rest without blocking (`critical.mjs`; needs a Chromium — set
  `CHROMIUM_PATH` if it isn't found, otherwise the page keeps a normal
  stylesheet link);
- stamps a content hash (`?v=…`) into each page, writes source maps.

The page script starts right after the first paint (small inline loader in
each page's `<head>`), so content never waits for JavaScript.

- **CSS sources** (in order): `fonts.css`, `bootstrap.min.css`,
  `swiper-bundle.min.css`, `aos.css`, `fontawesome-subset.css`, `style.css`,
  `sections.css` (PrimeTEK's own sections and fixes).
- **JS sources**: the `JS` array in `build.mjs`. `main.js` must keep working
  when an optional library is absent.
- If a class is only ever added by JavaScript and disappears after a build,
  add it to `SAFELIST` in `build.mjs`.

## Images

All images are WebP. When adding a new image:

- Convert it to WebP and resize it to about 2× the largest size it is shown
  at (max 1920px wide), e.g. `npx sharp-cli` or `cwebp -q 75 -resize 1920 0`.
- Give `<img>` tags `width`/`height` (the image's real size), `loading="lazy"`
  (unless it's at the top of the page) and `decoding="async"`.
- Social preview images (`og:image`) live in `assets/img/og/` as 1200×630 JPEGs.

## Icons (Font Awesome)

Only the icons the site uses are included (`assets/css/fontawesome-subset.css`
plus the `*-subset.woff2` fonts). To add an icon: copy its `.fa-…::before`
rule from `fontawesome-pro.css` into the subset file, then regenerate the
fonts with the new codepoint added:

```sh
pip install fonttools brotli
cd assets/fonts
pyftsubset fa-solid-900.woff2 --unicodes="U+F00D,U+F107,U+F105,U+F061,U+F002,U+F04B,U+F434,U+E5E9,U+F2F7,U+F233,U+F648,U+F054,U+F062,U+F6EB,U+F071,U+F3ED,U+F66F,U+F275,U+F7C0,U+F46C,U+F1C0,U+F441,U+F023,U+F8AC,U+F085,U+F19D,<new>" --flavor=woff2 --output-file=fa-solid-900-subset.woff2
```
