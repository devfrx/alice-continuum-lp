# AL\CE × CONT\NUUM — Landing Page

Cinematic, scroll-driven landing page for the suite: **AL\CE** (local-first personal AI
assistant) and **CONT\NUUM** (AI-first knowledge base). Static, bilingual (EN/IT),
dark + light themes, zero runtime dependencies beyond Vue and the fonts.

The page's visual director is the brand backslash: a parametric diagonal that splits
the hero into an ivory (AL\CE) and a night (CONT\NUUM) plane, stays as the seam during
the pinned "living demo" session, sweeps left and right for the product focus scenes,
lies down into the bridge contract, and recomposes in the outro.

## Stack

- **Vue 3.5** + TypeScript (strict) + **Vite 6**
- No animation/3D libraries: custom scroll engine (`src/lib/raf.ts`,
  `src/composables/useScrollScene.ts`, `usePinnedTimeline.ts`) and a custom
  3D-projected canvas constellation (`src/lib/graph.ts`,
  `src/components/demo/KnowledgeGraph.vue`)
- **vitest** for the pure math (motion + graph generation/projection)
- Deploy: **Vercel** static (`vercel.json`)

## Commands

```bash
npm run dev        # dev server
npm run build      # typecheck + production build (dist/)
npm run preview    # serve the production build locally
npm run typecheck  # vue-tsc --noEmit
npm test           # vitest run
npm run assets     # regenerate public/brand/gen/ from brand sources (sharp)
```

## Structure

```
src/
  content/copy.ts        # ALL page text, EN+IT, tuple-typed for key/count parity
  content/links.ts       # GitHub repo URLs
  lib/                   # pure, tested: motion math, raf scheduler, graph
  composables/           # theme, locale, reduced-motion, scroll, parallax
  components/
    brand/               # Sparkle, Wordmark (theme- or tone-driven assets)
    chrome/              # nav, theme/locale toggles, footer
    fx/DiagonalStage.vue # the parametric diagonal (poses + clipped planes)
    demo/                # KnowledgeGraph canvas, ChatStream, chips, micro-demos
    scenes/              # the seven scenes, in scroll order
```

## Conventions

- Scene reveals are scrub-reversible: driven by the `--p` CSS custom property
  (0..1 section progress) written by the scroll composables — no one-shot observers.
- `prefers-reduced-motion`: every scene degrades to a static, fully readable layout;
  the session scene unpins; canvases render a single frame.
- The hero is deliberately theme-invariant (ivory vs night); the rest of the page
  follows the `html[data-theme]` tokens in `src/styles/tokens.css`.
- Brand asset naming is glyph color: `*_light.webp` = cream (for dark surfaces),
  `*_dark.webp` = espresso (for light surfaces).
- Generated assets in `public/brand/gen/` are committed; regenerate with
  `npm run assets` only when brand sources change. The hero source is 1024px wide.

## Deploy

Vercel project with framework `vite`. Push to deploy; `vercel.json` enables clean URLs.
