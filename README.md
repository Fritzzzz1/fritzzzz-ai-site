# fritzzzz-ai-site

The public site of fritzzzz_ai — Liran Friedman's AI coaching and building practice. Hebrew, RTL, single page: hero with a rotating image deck, problems, method, why, CTA — plus the newspaper.

## The newspaper

The עליי button in the nav opens Liran's career told as a four-page broadsheet — *The Friedman Record* in English, *רשומות פרידמן* in Hebrew — in a full-screen flipbook over frosted glass:

- 3D page flips with drag-to-turn, arrows, keyboard, and a page-rustle sound.
- Two reading modes: **ZOOM** (map-style — wheel/pinch toward the cursor, click steps, drag pans, +/− buttons) and **LENS** (a magnifying glass that follows the cursor).
- Language toggle; each edition has its own downloadable PDF.

The pages themselves are designed in `tools/newspaper.html` (eight sheets: `p1`–`p4` English, `p1he`–`p4he` Hebrew) and rendered to `public/newspaper/` as deckle-edged webp images plus the two PDFs:

```sh
node tools/render-newspaper.mjs
```

Requires macOS with Google Chrome installed (`puppeteer-core` drives it; `sips` compresses the PDF pages).

## Stack and commands

React 18 + TypeScript + Vite. Deployed under `/fritzzzz-ai-site/` (see `base` in `vite.config.ts`).

```sh
npm run dev       # dev server
npm run build     # type-check + production build to dist/
npm run preview   # serve dist/
npm run lint      # oxlint
```

`tools/og-image.html` is the source of `public/og.png`.
