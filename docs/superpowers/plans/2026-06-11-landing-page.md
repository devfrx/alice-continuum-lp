# AL\CE + CONT\NUUM Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **For the implementer:** ogni task di scena va eseguito con la skill `frontend-design:frontend-design` attiva come guida di qualità. Spec di riferimento: `docs/superpowers/specs/2026-06-11-landing-page-design.md`.

**Goal:** Landing page cinematica scroll-driven per la suite AL\CE + CONT\NUUM, statica, bilingue EN/IT, dark+light, Vercel-ready, zero dipendenze runtime oltre Vue e i font.

**Architecture:** Vue 3 + Vite SPA single-page composta da 7 scene-sezioni. Una diagonale ("backslash") parametrica fa da regista: ogni scena dichiara la posa della diagonale e lo scroll interpola. Demo "sessione vivente" in sezione pinned. Grafo 3D in canvas custom. Scroll engine proprio (rAF + CSS var `--p`), niente GSAP/Three.

**Tech Stack:** Vue 3.5, TypeScript strict, Vite 6, @fontsource-variable/geist, sharp (dev, asset pipeline), vitest (dev, unit per la matematica di motion). Deploy: Vercel static (`vercel.json` esistente).

**Convenzioni globali:**
- Stile: CSS scoped per componente + token globali. Solo `transform`/`opacity` animati. Niente emoji nel copy.
- Naming poses diagonale: `{ topX, bottomX }` = percentuale (0–100) dove la linea interseca il bordo alto/basso del viewport.
- Tutte le scene sono `<section>` con id ancorabile: `#overture #session #alice #continuum #bridge #tenets #outro`.
- Commit frequenti, messaggio convenzionale, suffisso Co-Authored-By Claude.

---

### Task 1: Reset del progetto e fondamenta (tokens, base, shell)

**Files:**
- Delete: tutto `src/` esistente, `index.html` esistente
- Create: `index.html`, `src/main.ts`, `src/App.vue`, `src/env.d.ts`, `src/styles/tokens.css`, `src/styles/base.css`
- Modify: `package.json` (deps: `@fontsource-variable/geist`; devDeps: `sharp`, `vitest`)

- [ ] **Step 1: pulizia e dipendenze**

```powershell
Remove-Item -Recurse -Force src; Remove-Item index.html
npm i @fontsource-variable/geist; npm i -D sharp vitest
```

- [ ] **Step 2: `index.html`** — meta suite completa (title "AL\CE × CONT\NUUM — Private AI workspace", description, canonical, OG/Twitter con `og:image` = `/brand/og.png` generata in Task 2, JSON-LD con due `SoftwareApplication`), preload font Kaluar woff2 + hero image del tema attivo, e **bootstrap inline** anti-flash:

```html
<script>
  (function () {
    var t = localStorage.getItem('lp-theme');
    if (t !== 'dark' && t !== 'light')
      t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.dataset.theme = t;
    var l = localStorage.getItem('lp-locale');
    if (l !== 'en' && l !== 'it')
      l = (navigator.language || 'en').toLowerCase().startsWith('it') ? 'it' : 'en';
    document.documentElement.lang = l;
  })();
</script>
```

- [ ] **Step 3: `src/styles/tokens.css`** — token derivati dalle app, due temi via `html[data-theme]`:

```css
html[data-theme='dark'] {
  --bg: #161616; --bg-raise: #1a1a19; --surface-1: #222221; --surface-2: #2a2a28;
  --text: #eceae5; --text-2: #adaba4; --text-3: #74726b;
  --accent: #e8dcc8; --accent-hover: #f5ede0; --on-accent: #1a1a19;
  --accent-dim: rgba(232,220,200,.10); --accent-border: rgba(232,220,200,.25);
  --line: rgba(255,255,255,.07);
  --pane-alt: #faf9f5; --pane-alt-text: #1f1e1b; /* piano avorio (lato alice nell'hero) */
}
html[data-theme='light'] {
  --bg: #faf9f5; --bg-raise: #f3efe9; --surface-1: #efeae2; --surface-2: #e7e1d7;
  --text: #1f1e1b; --text-2: #5f5b53; --text-3: #8c887e;
  --accent: #7a5540; --accent-hover: #5f4232; --on-accent: #faf9f5;
  --accent-dim: rgba(122,85,64,.10); --accent-border: rgba(122,85,64,.30);
  --line: rgba(31,30,27,.10);
  --pane-alt: #1a1a19; --pane-alt-text: #eceae5;
}
:root {
  --font-display: 'Kaluar', 'Geist Variable', sans-serif;
  --font-sans: 'Geist Variable', system-ui, sans-serif;
  --font-mono: ui-monospace, 'Cascadia Mono', Consolas, monospace;
  --ease-out-expo: cubic-bezier(.19,1,.22,1); --ease-spring: cubic-bezier(.175,.885,.32,1.275);
  --ease-smooth: cubic-bezier(.16,1,.3,1);
  --max-w: 1280px; --gutter: clamp(20px, 5vw, 72px);
}
@font-face {
  font-family: 'Kaluar'; src: url('/fonts/kaluar.woff2') format('woff2'),
  url('/fonts/kaluar-demo.semi-bold.ttf') format('truetype');
  font-weight: 600; font-display: swap;
}
```

- [ ] **Step 4: `src/styles/base.css`** — reset minimale, `scroll-behavior: smooth` (disattivato sotto reduced-motion), selection color accent, focus-visible ring accent, scrollbar sottile, `body { background: var(--bg); color: var(--text); font-family: var(--font-sans); }`, util `.visually-hidden`.

- [ ] **Step 5: `src/main.ts` + `src/App.vue` stub** — App monta solo `<main>` con placeholder per le 7 scene (commenti), import dei css e di `@fontsource-variable/geist`.

- [ ] **Step 6: verifica** — `npm run dev` parte, pagina vuota con bg corretto in entrambi i temi (toggle manuale di `data-theme` da devtools). `npm run typecheck` pulito.

- [ ] **Step 7: commit** — `feat: reset project, design tokens and app shell`

---

### Task 2: Pipeline asset (immagini responsive, font subset, og:image, favicon)

**Files:**
- Create: `scripts/process-assets.mjs`, output in `public/brand/gen/` (gitignored? NO — committati, sono build-time once)
- Modify: `public/site.webmanifest`, `package.json` (script `assets`)

- [ ] **Step 1: `scripts/process-assets.mjs`** — con sharp: da `public/brand/alice_header.png` genera `alice-hero-{800,1200,1600}.{avif,webp}` (qualità avif 55, webp 80, fit inside); da `desktop_app_*_logo_*.webp` genera `favicon-32.png`, `favicon-180.png` (apple), `icon-512.png`; genera `og.png` 1200×630 (composizione: bg #161616, i due wordmark `_light` centrati con divisore backslash — usare sharp composite).
- [ ] **Step 2: run** — `node scripts/process-assets.mjs`; verificare dimensioni output (`alice-hero-1600.avif` atteso < 150 KB).
- [ ] **Step 3: subset Kaluar** — tentare `pip install fonttools brotli` + `pyftsubset public/fonts/kaluar-demo.semi-bold.ttf --output-file=public/fonts/kaluar.woff2 --flavor=woff2 --unicodes=U+0020-007E,U+00A0-00FF,U+2018-201D,U+2026`. Se l'ambiente non ha Python/pip disponibili: copiare il TTF e aggiornare il `@font-face` per usare solo TTF (accettabile, 202 KB) e annotarlo nel commit.
- [ ] **Step 4: webmanifest + favicon** — aggiornare `site.webmanifest` (nome, theme_color #161616, icone generate); link in `index.html`.
- [ ] **Step 5: commit** — `feat(assets): responsive hero, og image, icons, font subset`

---

### Task 3: Copy bilingue e config link

**Files:**
- Create: `src/content/copy.ts`, `src/content/links.ts`

- [ ] **Step 1: `src/content/links.ts`**

```ts
export const LINKS = {
  aliceRepo: 'https://github.com/devfrx/omnia',        // CONFERMARE con l'utente
  continuumRepo: 'https://github.com/devfrx/continuum', // CONFERMARE con l'utente
} as const
```

- [ ] **Step 2: `src/content/copy.ts`** — dizionario tipizzato; `en` è la fonte del tipo, `it` vincolato a `Copy`. Contiene TUTTO il testo della pagina: nav, hero (eyebrow/title/sub/cta), le 4 battute della sessione (messaggi chat, nomi tool call, etichette grafo), capability di alice (6 voci: titolo+riga mono+descrizione), capability di continuum (5 voci), canali del ponte (5), principi (6 sigilli: label+valore+nota ironica), outro, footer, aria-labels. Tono: diretto, asciutto, lievemente ironico, zero emoji. Esempi chiave EN: hero title "One mind. Two halves." / sub "A private AI workspace that runs on your machine and answers to no one."; tenet "CLOUD CALLS — 0 — we checked twice"; outro "The waitlist is the repo." Struttura:

```ts
export type Locale = 'en' | 'it'
const en = { nav: {...}, hero: {...}, session: { beats: [...4] }, alice: {...},
  continuum: {...}, bridge: {...}, tenets: {...}, outro: {...}, footer: {...} }
export type Copy = typeof en
export const copy: Record<Locale, Copy> = { en, it }
```

- [ ] **Step 3: verifica** — `npm run typecheck` (l'IT incompleto non compila: il tipo forza la parità delle chiavi).
- [ ] **Step 4: commit** — `feat(content): bilingual copy dictionary and repo links`

---

### Task 4: Motion lib testata + composables

**Files:**
- Create: `src/lib/motion.ts`, `src/lib/motion.test.ts`, `src/composables/useTheme.ts`, `src/composables/useLocale.ts`, `src/composables/useReducedMotion.ts`, `src/composables/useScrollScene.ts`, `src/composables/usePinnedTimeline.ts`, `src/composables/useParallax.ts`
- Modify: `package.json` (script `test: vitest run`)

- [ ] **Step 1: test failing per la matematica pura** (`src/lib/motion.test.ts`): `clamp01`, `lerp`, `remap(value, in0, in1, out0, out1)` clampato, `segment(p, count)` → `{ index, local }` che divide 0..1 in N battute (p=1 → ultima battuta, local=1), `damp(current, target, lambda, dt)` smoothing esponenziale frame-rate-independent.

```ts
import { describe, expect, it } from 'vitest'
import { clamp01, damp, lerp, remap, segment } from './motion'
it('segment splits progress into beats', () => {
  expect(segment(0, 4)).toEqual({ index: 0, local: 0 })
  expect(segment(0.49, 4).index).toBe(1)
  expect(segment(1, 4)).toEqual({ index: 3, local: 1 })
})
it('remap clamps outside the input range', () => {
  expect(remap(2, 0, 1, 0, 10)).toBe(10)
  expect(remap(0.25, 0, 0.5, 0, 1)).toBe(0.5)
})
```

- [ ] **Step 2: run** `npm test` → FAIL (modulo inesistente).
- [ ] **Step 3: implementare `src/lib/motion.ts`** (funzioni pure, ~30 righe) e far passare i test.
- [ ] **Step 4: composables** (niente unit test, verifica runtime):
  - `useTheme`: `theme` ref sincronizzato con `html[data-theme]` + localStorage `lp-theme`; `toggle()`.
  - `useLocale`: `locale` ref (`lp-locale`), aggiorna `html.lang`; `t` computed = `copy[locale]`.
  - `useReducedMotion`: ref reattivo su `matchMedia('(prefers-reduced-motion: reduce)')`.
  - **Scheduler condiviso** (module-level in `useScrollScene.ts`): un solo `requestAnimationFrame` loop + un solo listener scroll passivo; i subscriber ricevono `(scrollY, dt)`.
  - `useScrollScene(el)`: progress 0..1 = attraversamento dell'elemento nel viewport (`enter bottom → leave top`), scritto come CSS var `--p` sull'elemento (solo se cambia > 0.001) e restituito come ref.
  - `usePinnedTimeline(el, beats)`: per sezioni sticky alte `beats × 100vh`; progress = scroll interno / (height − vh); restituisce `{ progress, beat, local }` usando `segment`.
  - `useParallax(el)`: su pointer fine e no reduced-motion, mousemove normalizzato −1..1 con `damp` (λ=6), scrive `--mx`/`--my`.
- [ ] **Step 5: verifica** — `npm test` PASS, `npm run typecheck` pulito.
- [ ] **Step 6: commit** — `feat(motion): tested motion math, scroll engine and composables`

---

### Task 5: Componenti brand + chrome (nav, toggles, footer)

**Files:**
- Create: `src/components/brand/Sparkle.vue`, `src/components/brand/Wordmark.vue`, `src/components/chrome/SiteNav.vue`, `src/components/chrome/ThemeToggle.vue`, `src/components/chrome/LocaleToggle.vue`, `src/components/chrome/SiteFooter.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: `Sparkle.vue`** — SVG inline della stella a 4 punte del brand (path con curve concave, `fill="currentColor"`), props `size`. È il micro-motivo riusato ovunque (nodi grafo esclusi: lì è ridisegnata in canvas).
- [ ] **Step 2: `Wordmark.vue`** — props `brand: 'alice' | 'continuum'`, `variant: 'text' | 'mark'`; `<img>` con `src` calcolato dal tema (`_light` su dark, `_dark` su light) e swap reattivo; `alt` corretto; `height` fissata per evitare CLS.
- [ ] **Step 3: chrome** — `SiteNav`: fixed top, blur leggero sul bg, wordmark AL\CE + "×" + CONT\NUUM a sinistra, ancore alle sezioni (dal copy), `ThemeToggle` (icona sole/luna disegnata, no libreria) e `LocaleToggle` (EN | IT, aria-pressed) a destra; su mobile: solo wordmark + toggles. `SiteFooter`: una riga, copy footer + link GitHub.
- [ ] **Step 4: integrazione in App.vue** + verifica visiva (entrambi i temi, entrambe le lingue, tastiera).
- [ ] **Step 5: commit** — `feat(chrome): brand components, nav, theme and locale toggles`

---

### Task 6: DiagonalStage — la diagonale registica

**Files:**
- Create: `src/components/fx/DiagonalStage.vue`

- [ ] **Step 1: API** — props:

```ts
{ from: Pose; to: Pose; progress: number; showLine?: boolean; leftClass?: string; rightClass?: string }
type Pose = { topX: number; bottomX: number } // % viewport width
```

Render: contenitore `position:absolute; inset:0; overflow:hidden` con due piani clip-path:
piano sinistro `polygon(0 0, X_top% 0, X_bottom% 100%, 0 100%)`, piano destro complementare,
e la linea: div ruotato calcolato da `atan2` tra i punti (larghezza 2px, colore `var(--accent)`,
glow leggerissimo via `box-shadow` solo su dark). Le X correnti = `lerp(from, to, progress)`,
scritte come CSS var `--dx-top`/`--dx-bottom` così i piani usano `clip-path` con `calc`.
Slot `#left` e `#right` per il contenuto dei piani (ognuno clippato dal proprio piano).

- [ ] **Step 2: reduced-motion** — se attivo, `progress` viene ignorato e si usa direttamente `to`.
- [ ] **Step 3: verifica** — pagina di prova temporanea in App.vue con slider che muove `progress`; controllare che i piani restino allineati alla linea a ogni angolo e su resize.
- [ ] **Step 4: commit** — `feat(fx): parametric diagonal stage with clipped planes`

---

### Task 7: KnowledgeGraph — costellazione canvas 3D

**Files:**
- Create: `src/components/demo/KnowledgeGraph.vue`, `src/lib/graph.ts`, `src/lib/graph.test.ts`

- [ ] **Step 1: test per la generazione** (`graph.test.ts`): `makeGraph(seed, count)` deterministico (PRNG mulberry32) → `count` nodi in un ellissoide raggio 1, ogni nodo con 1–3 archi verso i k-nearest; `project(p, rotY, fov, viewport)` → coordinate schermo + scala prospettica positiva.
- [ ] **Step 2: implementare `src/lib/graph.ts`** e far passare i test.
- [ ] **Step 3: `KnowledgeGraph.vue`** — canvas DPR-aware; props `{ nodes?: number; revealed?: number; speed?: number }` (`revealed` = quanti nodi visibili, per la crescita nella scena sessione — i nuovi nodi entrano con scale-in + flash stella). Rotazione Y lenta (0.05 rad/s) via scheduler condiviso; archi con alpha proporzionale alla profondità; nodi disegnati come stella a 4 punte (path 8 punti con controllo concavo) in `var(--accent)` letto da `getComputedStyle` e ricalcolato su cambio `data-theme` (MutationObserver). Pausa quando fuori viewport (IntersectionObserver). Reduced-motion: un solo render statico. Fallback: se `getContext('2d')` è null, render SVG statico con 12 nodi.
- [ ] **Step 4: verifica** — `npm test` PASS; smoke visivo (rotazione fluida, niente jank, tema switch ricolora).
- [ ] **Step 5: commit** — `feat(demo): 3d-projected knowledge graph canvas`

---

### Task 8: Scena 1 — Overture (hero)

**Files:**
- Create: `src/components/scenes/SceneOverture.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: struttura** — `<section id="overture">` alta 100vh (+ piccola coda di scroll). DiagonalStage posa `{topX: 58, bottomX: 42}`. Piano sinistro = **avorio** (`background: var(--pane-alt)`): ritratto `alice-hero` in `<picture>` (avif/webp, srcset 800/1200/1600, `fetchpriority="high"`), ancorato in basso, mask-image a gradiente per fondere i bordi; parallax `--mx/--my` ±10px su layer separato (2.5D: ritratto z=1, orb ring z=2). Piano destro = scuro: `KnowledgeGraph` (≈80 nodi) con parallax inverso.
- [ ] **Step 2: contenuto** — sopra i piani, centrato sulla diagonale: eyebrow mono ("PRIVATE AI WORKSPACE — PRE-RELEASE"), titolo display Kaluar `clamp(2.8rem, 7vw, 6rem)` su due righe con la seconda in accent, sub, due CTA (primaria accent → repo alice, ghost → continuum), hint scroll (chevron animato). Wordmark dei due prodotti agli angoli dei rispettivi piani. Reveal d'ingresso: stagger 80ms, translateY 24px + fade, `--ease-out-expo`.
- [ ] **Step 3: leggibilità cross-piano** — il testo che cavalca la diagonale sta in un blocco con `mix-blend-mode: difference`? NO (fragile): il blocco testo sta interamente sul piano scuro su desktop (offset a destra), su mobile la diagonale si fa ripida (`{topX: 72, bottomX: 28}`) e il testo sta sotto il ritratto. Verificare contrasto AA su entrambi i temi.
- [ ] **Step 4: verifica visiva** (preview browser: dark/light, EN/IT, 390px/1440px) + `typecheck`.
- [ ] **Step 5: commit** — `feat(scene): overture hero with ivory/dark split and parallax`

---

### Task 9: Scena 2 — La sessione (demo vivente, pinned)

**Files:**
- Create: `src/components/scenes/SceneSession.vue`, `src/components/demo/ChatStream.vue`, `src/components/demo/ToolCallChip.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: struttura pinned** — `<section id="session">` alta `500vh` (4 battute + respiro), child sticky 100vh. `usePinnedTimeline(el, 4)`. DiagonalStage fissa `{topX: 55, bottomX: 45}`, linea visibile.
- [ ] **Step 2: `ToolCallChip.vue`** — chip mono bordata accent con prefisso `⌁` (glifo testuale), prop `label`, animazione d'ingresso scale-in spring + puntino "running" che diventa stella `Sparkle` a completamento.
- [ ] **Step 3: `ChatStream.vue`** — props `{ beats: SessionBeat[]; beat: number; local: number }`; rende i messaggi fino alla battuta corrente: bolla utente (surface-2, radius asimmetrico), risposta di AL\CE come testo nudo con caret `▌` lampeggiante mentre `local < .6`, tool chips. I messaggi vecchi scalano leggermente e perdono opacità (focus sull'ultimo).
- [ ] **Step 4: coreografia grafo** — lato destro: `KnowledgeGraph` con `revealed` che cresce per battuta (es. 18 → 24 → 31 → 31) + etichetta mono sotto ("+3 nodes · sources attached" dal copy). Battuta 4: i nodi citati pulsano mentre AL\CE risponde citando le fonti.
- [ ] **Step 5: progress UI** — a sinistra, indicatore verticale 4 tacche (battuta attiva = stella accent); numerini mono `01–04`.
- [ ] **Step 6: reduced-motion** — sezione NON pinned (altezza auto), le 4 battute rese in sequenza statica leggibile (chat completa + grafo statico finale).
- [ ] **Step 7: verifica visiva** (scrub avanti/indietro, nessun salto; mobile: colonna singola con grafo ridotto sopra la chat) + commit — `feat(scene): pinned living-demo session with growing graph`

---

### Task 10: Scene 3+4 — Focus AL\CE e Focus CONT\NUUM

**Files:**
- Create: `src/components/scenes/SceneAlice.vue`, `src/components/scenes/SceneContinuum.vue`, `src/components/demo/MicroWaveform.vue`, `src/components/demo/MicroLoop.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: `SceneAlice`** — `useScrollScene`; DiagonalStage interpola `{55,45} → {88,80}` (spazzata a destra) con `--p`. Contenuto su piano sinistro: wordmark AL\CE, intro breve, **registro capability** (6 righe dal copy): numero mono `01–06`, titolo, riga mono descrittiva, micro-demo a destra della riga. Micro-demo implementate: `MicroWaveform` (barre SVG animate, voce), `MicroLoop` (plan→act→verify, tre stelle che si accendono in ciclo); le altre 4 righe usano dettagli CSS (cursore che digita, led pulse) senza componenti dedicati. Righe rivelate in stagger da `--p`.
- [ ] **Step 2: `SceneContinuum`** — speculare: diagonale `{88,80} → {12,20}` (spazzata a sinistra). Centro: `KnowledgeGraph` grande (120 nodi) con anello orbitale; attorno, 5 capability card minimali (titolo + mono). Dettaglio: una card "open files" mostra un path reale `notes/dragon.md` con stellina.
- [ ] **Step 3: verifica visiva** (le due spazzate si concatenano senza stacco con la scena sessione; mobile: diagonale ripida fissa, card in stack) + `typecheck`.
- [ ] **Step 4: commit** — `feat(scene): alice and continuum focus sweeps with micro-demos`

---

### Task 11: Scene 5+6 — Il ponte e I principi

**Files:**
- Create: `src/components/scenes/SceneBridge.vue`, `src/components/scenes/SceneTenets.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: `SceneBridge`** — diagonale che si adagia: `{12,20} → {0,100}`→ in pratica interpolare verso una linea quasi orizzontale (`topX:-20, bottomX:120` produce ~asse orizzontale al centro: verificare con lo slider di Task 6). Sopra/sotto le etichette `AL\CE queries ↓` / `↑ CONT\NUUM answers` (mono). Lungo la linea, 3 "pacchetti" (quadratini accent con stella) che la percorrono in loop (`offset-path: path()` oppure translate su rAF, scelta in base al supporto; reduced-motion: statici equidistanti). Sotto, 5 canali dal copy come riga mono con separatori `·`.
- [ ] **Step 2: `SceneTenets`** — registro dossier: griglia 3×2 (mobile 1×6) di sigilli `border: 1px solid var(--line)`, label mono piccola, valore grande Kaluar, nota ironica `--text-3`; timbro circolare "100% LOCAL" ruotato −12° con bordo accent che appare con scale-in spring all'ingresso nel viewport. Diagonale: solo eco di fondo (banda `--accent-dim` larga, statica).
- [ ] **Step 3: verifica visiva + commit** — `feat(scene): bridge contract and tenets dossier`

---

### Task 12: Scena 7 — Outro + integrazione finale

**Files:**
- Create: `src/components/scenes/SceneOutro.vue`
- Modify: `src/App.vue` (ordine finale scene + footer)

- [ ] **Step 1: `SceneOutro`** — le due metà si ricompongono: DiagonalStage torna a `{58,42}` con la linea che "completa" il backslash gigante al centro (il mark `\` + stella di continuum reso enorme in SVG, stroke che si disegna con `stroke-dashoffset` legato a `--p`). Titolo outro, paragrafo "the waitlist is the repo", due CTA card (una per prodotto: mark, wordmark, "Watch on GitHub", conteggio note pre-release dal copy). Footer sotto.
- [ ] **Step 2: App.vue finale** — sequenza scene, skip-link "salta al contenuto", `<noscript>` nota che la pagina è leggibile anche così (le scene sono HTML statico).
- [ ] **Step 3: verifica end-to-end** — scroll completo della pagina senza salti di diagonale tra scene (le pose si concatenano: 58/42 → 55/45 → 88/80 → 12/20 → orizzontale → 58/42).
- [ ] **Step 4: commit** — `feat(scene): outro recomposition and final shell`

---

### Task 13: Hardening — accessibilità, mobile, performance

**Files:**
- Modify: tutti i componenti scena (passata trasversale), `index.html`

- [ ] **Step 1: reduced-motion audit** — con emulazione attiva: nessun pinning, nessun parallax, canvas statico, contenuto integralmente leggibile in ordine.
- [ ] **Step 2: mobile audit (390px)** — diagonali ripide fisse, stack verticali, font display ridimensionati, tap target ≥ 44px, niente overflow orizzontale.
- [ ] **Step 3: a11y audit** — heading order h1→h2 coerente, aria-label su toggles e CTA, `aria-hidden` su tutti gli elementi decorativi (diagonale, grafo, stelle), contrasto AA su entrambi i temi (verificare accent espresso su avorio), focus order.
- [ ] **Step 4: perf audit** — `npm run build`; bundle JS < 90 KB gzip (controllare output vite); immagini servite nel formato giusto; nessun CLS (riservare aspect-ratio su picture/wordmark); Lighthouse su `npm run preview`: Perf/A11y/SEO ≥ 95.
- [ ] **Step 5: commit** — `polish: a11y, mobile and performance hardening`

---

### Task 14: Verifica finale e deploy preview

- [ ] **Step 1:** `npm run typecheck && npm test && npm run build` tutti puliti.
- [ ] **Step 2:** verifica visiva finale delle 8 combinazioni (dark/light × EN/IT × desktop/mobile) con preview browser; screenshot di controllo.
- [ ] **Step 3:** README.md riscritto (descrizione progetto, comandi, struttura, pipeline asset).
- [ ] **Step 4:** commit `docs: rewrite README for the new landing` + (se Vercel CLI disponibile/autorizzato) `vercel deploy` per preview URL da consegnare all'utente; altrimenti indicare che il push su main triggera il deploy.

---

## Self-review (eseguito)

- **Copertura spec:** scene 1–7 ✓ (Task 8–12), token/temi ✓ (1), i18n ✓ (3+4), asset/branding ✓ (2+5), motion/regia ✓ (4+6), grafo ✓ (7), degradi no-JS/canvas/mobile ✓ (9.6, 7.3, 13), SEO ✓ (1.2, 13.4), perf budget ✓ (13.4), fuori scope rispettato ✓.
- **Placeholder:** gli URL GitHub in Task 3 sono esplicitamente da confermare con l'utente prima o durante l'esecuzione — unico punto aperto, segnalato.
- **Coerenza tipi:** `Pose{topX,bottomX}` (Task 6) usata in 8–12; `segment` (Task 4) usata da `usePinnedTimeline` (4) e SceneSession (9); `revealed` (7) usato in 9–10. ✓
