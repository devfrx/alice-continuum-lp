# AL\CE × Continuum Landing

High-end editorial landing page for the AL\CE + Continuum local-first AI ecosystem.

## Stack

- Vite + Vue 3 (`<script setup lang="ts">`) + TypeScript (strict)
- Pure CSS, no UI framework
- Design tokens mirrored from `frontend/src/renderer/src/assets/styles/theme.css`
- Brand font: **Kaluar Demo Semi-Bold** (already shipped in `public/fonts`)
- All branding assets in `public/brand` (copies from `landing-assets/`)

## Develop

```powershell
cd landing
npm install
npm run dev
```

## Build

```powershell
npm run build
npm run preview
```

## Deploy

The project is **Vercel-ready**. The included `vercel.json` selects the Vite
preset; the build command is `npm run build` and the output directory is `dist`.
No environment variables required.

## Structure

```
landing/
├── index.html              # SEO metadata + theme bootstrap (no FOUC)
├── public/
│   ├── brand/              # Logos, header, app marks (webp + png)
│   └── fonts/              # kaluar-demo.semi-bold.ttf
├── src/
│   ├── App.vue
│   ├── main.ts
│   ├── env.d.ts
│   ├── styles/
│   │   ├── tokens.css      # ALICE light/dark palette + type scale
│   │   └── base.css        # reset, rhythm, focus, scrollbar
│   ├── composables/
│   │   └── useTheme.ts     # dark mode toggle, persisted
│   └── components/
│       ├── SiteHeader.vue
│       ├── SiteFooter.vue
│       ├── ThemeToggle.vue
│       ├── HeroSection.vue
│       ├── ManifestoSection.vue
│       ├── AliceSection.vue
│       ├── ContinuumSection.vue
│       ├── BridgeSection.vue
│       └── CapabilitiesSection.vue
├── vite.config.ts
├── vercel.json
├── tsconfig.json
└── tsconfig.node.json
```

## Design rules

- Editorial / fashion-magazine layout with asymmetric grids and heavy whitespace
- Two type families only: **Kaluar** (display) and a system sans (body)
- Roman-numeral section markers (№ I … № VI)
- Italic Times-New-Roman fragments as editorial accents
- Strict ALICE palette, no foreign colors, no glassy gradients
- Dark mode default; light mode mirrors ALICE light theme (`#7A5540` accent)
