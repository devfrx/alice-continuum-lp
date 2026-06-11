# Landing page AL\CE + CONT\NUUM — Design

Data: 2026-06-11
Stato: approvato in brainstorming, in attesa di review finale spec

## 1. Obiettivo e pubblico

Landing page della suite **AL\CE** (assistente AI personale 100% locale) e **CONT\NUUM**
(knowledge base AI-first), ricostruita **da zero** in `alice-continuum-lp`. Del progetto
esistente si riutilizzano **solo** gli asset in `public/brand/` e `public/fonts/`.

Priorità (in ordine):
1. **Showcase** — la pagina è un'opera: deve comunicare qualità e identità della suite.
2. **Waitlist → GitHub** — i prodotti sono pre-release: la CTA è watch/star dei repo
   ("la waitlist è il repo"). Nessuna raccolta email per ora.
3. **Download** — predisposto per il futuro (slot CTA che oggi punta a GitHub, domani
   agli installer).

Pubblico: developer, power user, creator/worldbuilder attenti a privacy e local-first.

Non-goal: nessun backend, nessun form, nessuna analytics di terze parti (coerenza col
messaggio "no telemetry"), nessun CMS.

## 2. Direzione creativa

Fusione delle direzioni **A (demo vivente)** + **B (il backslash)**, con un momento
**C (dossier)** compresso nella scena dei principi:

- **Il backslash come architettura**: la diagonale dei wordmark (`AL\CE`, `CONT\NUUM`)
  è il dispositivo grafico che regge l'intera pagina. Divide il viewport nell'hero,
  fa da quinta alla demo, spazza a destra/sinistra per i focus prodotto, si adagia a
  ponte, si ricompone nell'outro. L'architettura della pagina cita il logo.
- **La demo vivente**: il cuore della pagina è una sessione simulata della suite —
  prompt utente, AL\CE che ragiona e chiama tool, il grafo di CONT\NUUM che cresce
  in risposta. Convincere mostrando, non elencando feature.
- **Credibilità dossier**: la scena dei principi usa il registro "specifiche tecniche"
  (CLOUD CALLS: 0, ACCOUNTS: NONE, …) con tono asciutto e lievemente ironico, come
  il system prompt di AL\CE.

Qualità percepita: niente template-like, niente stock pattern da landing AI (gradienti
viola, glassmorphism generico, emoji). Palette e motion derivano dai design token
reali delle due app.

## 3. Le sette scene

1. **Overture (hero)** — Diagonale panna che taglia il viewport. Lato sinistro AL\CE:
   ritratto `alice_header` scontornato come layer 2.5D + orb che respira. Lato destro
   CONT\NUUM: costellazione 3D (canvas). Wordmark, tagline, CTA GitHub, hint di scroll.
   Parallax leggero sul mouse (desktop) e sullo scroll.
2. **La sessione (demo vivente)** — Sezione pinned (sticky); lo scroll fa avanzare
   4 battute: (1) prompt utente, (2) AL\CE ragiona + tool call, (3) CONT\NUUM scrive
   (nuovi nodi nel grafo, con stellina a 4 punte), (4) richiamo successivo: AL\CE
   risponde citando le fonti dal grafo. Chat a sinistra della diagonale, grafo a destra.
3. **Focus AL\CE** — La diagonale spazza verso destra. Registro capability con
   micro-demo per riga: voce (waveform), agent loop (plan→act→verify), plugin + MCP,
   automazione PC, memoria locale, audit trail.
4. **Focus CONT\NUUM** — La diagonale spazza a sinistra. Il grafo 3D al centro;
   capability attorno: editor, backlink, ricerca semantica, template, file leggibili
   fuori dall'app.
5. **Il ponte** — La diagonale si adagia quasi orizzontale: è il contratto locale tra
   le due app. Pacchetti (query, sorgenti, artifact) la attraversano animati.
   Etichette: shared index, knowledge API, RAG context, event bus, artifacts.
6. **I principi (dossier)** — Sigilli e contatori verificabili: 0 cloud calls,
   no accounts, no telemetry, open files, interruptible, portable. Layout spec-sheet
   monospace, timbro "100% LOCAL".
7. **Outro** — Le due metà si ricompongono nel backslash completo. CTA: star/watch
   dei due repo GitHub, nota pre-release ("gli installer arrivano qui"), footer
   minimale (no social clutter).

Chrome persistente: nav minimale (wordmark, ancore sezioni, toggle tema, switch EN/IT).

## 4. Branding e asset

Convenzione nomi: `_light` = glifo panna #E8DCC8 (per tema dark), `_dark` = glifo
espresso (per tema light).

| Asset | Uso |
|---|---|
| `alice_header.png` (2.2 MB) | Hero, lato AL\CE. Scontorno (fondo quasi bianco), export AVIF + WebP responsive, trattamento duotone su tema dark. L'originale non si serve mai. |
| Wordmark text logo (×4) | Nav, hero, outro. Immagini ad alta risoluzione con dettagli non riproducibili dal font (stellina nella A, A senza traversa). Swap automatico col tema. |
| Mark `A` + stella, `\` + stella (×4) | Favicon, marcatori sezione, CTA cards. Il backslash-mark è la matrice della diagonale di pagina. |
| Stellina a 4 punte | Estratta come SVG inline: nodi grafo, bullet, indicatore thinking, dettagli hover. Micro-motivo ricorrente. |
| `kaluar-demo.semi-bold.ttf` | Subset → WOFF2, `font-display: swap`, preload. Solo display/titoli. |
| Geist Variable | Via npm (`@fontsource-variable/geist`). Body e UI. |

Screenshot delle app: non esistono e non servono — le UI nelle scene demo sono
ricostruite in HTML/CSS dal vivo (nitide, theme-aware, animabili).

## 5. Design system della pagina

Token derivati dalle app (sorgente di verità: `theme.css` di omnia / `themes.css` di
continuum), in `src/styles/tokens.css`:

- **Dark (default)**: bg #161616 / #1A1A19, surface #222221–#2A2A28, testo #ECEAE5 /
  #ADABA4 / #74726B, accent panna #E8DCC8 (hover #F5EDE0).
- **Light**: bg #FAF9F5, testo #1F1E1B, accent espresso #7A5540–#8C6A4A.
- **Tipografia**: Kaluar (display), Geist Variable (body), monospace di sistema per
  i registri tecnici. Scala dedicata alla landing (display fino a clamp ~6rem).
- **Motion**: easing delle app (`--ease-out-expo`, `--ease-spring`, `--ease-smooth`),
  durate 100–700ms per i micro, scroll-driven per la regia.
- Niente emoji nel copy. Tono diretto, asciutto, lievemente ironico.

## 6. Architettura tecnica

Stack: **Vue 3 + TypeScript (strict) + Vite**, output statico, deploy Vercel
(`vercel.json` esistente: framework vite, clean URLs). Nessuna dipendenza runtime
oltre Vue + fontsource. Niente GSAP/Three.js: regia e grafo sono custom.

```
src/
  main.ts
  App.vue                     # shell: nav, scene in sequenza, footer
  styles/
    tokens.css                # design token dark/light
    base.css                  # reset, focus, selection, scrollbar
  content/
    copy.ts                   # dizionario EN/IT tipizzato (unica fonte del copy)
  composables/
    useTheme.ts               # dark/light, localStorage + prefers-color-scheme
    useLocale.ts              # EN/IT, localStorage + navigator.language
    useScrollScene.ts         # progress 0..1 per sezione (rAF + CSS var --p)
    usePinnedTimeline.ts      # mappa progress → beat per le sezioni sticky
    useParallax.ts            # mouse/scroll parallax con damping
    useReducedMotion.ts       # media query reactive
  components/
    chrome/  SiteNav.vue, ThemeToggle.vue, LocaleToggle.vue, SiteFooter.vue
    brand/   Wordmark.vue, BrandMark.vue, Sparkle.vue (SVG inline)
    scenes/  SceneOverture.vue, SceneSession.vue, SceneAlice.vue,
             SceneContinuum.vue, SceneBridge.vue, SceneTenets.vue, SceneOutro.vue
    demo/    ChatStream.vue, ToolCallChip.vue, KnowledgeGraph.vue (canvas 3D),
             MicroDemo*.vue (waveform, loop, ecc.)
    fx/      DiagonalStage.vue (la diagonale condivisa tra le scene)
```

Decisioni chiave:

- **DiagonalStage**: la diagonale è un singolo sistema (clip-path/transform su piani
  2.5D) parametrizzato da angolo e posizione; ogni scena dichiara la posa target e
  la transizione è guidata dallo scroll. È il filo registico, non un ornamento
  ripetuto per sezione.
- **KnowledgeGraph**: canvas 2D con proiezione prospettica custom (~60–120 nodi,
  rotazione lenta, nodi = stellina). DPR-aware, in pausa fuori viewport
  (IntersectionObserver), `matchMedia` per reduced-motion.
- **Scroll engine**: nessuna libreria. `useScrollScene` espone progress per sezione
  via CSS custom property `--p`; le sezioni pinned usano `position: sticky` con
  altezza N×100vh e `usePinnedTimeline` per discretizzare le battute della demo.
- **i18n**: dizionario TS tipizzato (chiavi condivise EN/IT), `useLocale` con
  persistenza; `<html lang>` aggiornato. Default: EN; auto-detect iniziale da
  `navigator.language` (it → IT).
- **Tema**: `data-theme` su `<html>`, bootstrap inline in `index.html` per evitare
  flash; default dark, rispetto di `prefers-color-scheme` solo alla prima visita.

## 7. Performance, SEO, accessibilità

- **Budget**: JS totale < 90 KB gzip (Vue incluso), LCP < 2.0s su 4G, CLS ~0,
  nessun layout shift da font (preload + `size-adjust` fallback).
- Immagini: AVIF + WebP via `<picture>`, dimensioni responsive, `fetchpriority=high`
  solo sull'asset hero del tema attivo, lazy per il resto.
- SEO: meta suite completa (title/description/OG/Twitter/canonical/JSON-LD
  SoftwareApplication ×2), `og:image` dedicata, sitemap non necessaria (pagina
  singola), `robots.txt` e `site.webmanifest` aggiornati con i mark come icone.
- Accessibilità: tutta la narrazione demo è testo reale nel DOM (non immagini),
  contrasti AA su entrambi i temi, focus visibile, `prefers-reduced-motion` →
  niente pinning/scrubbing, reveal statici e demo come sequenza leggibile;
  nav da tastiera completa; `aria-hidden` sugli elementi decorativi.
- Le animazioni usano solo `transform`/`opacity` (compositor-friendly); rAF unico
  condiviso per scroll e canvas.

## 8. Error handling e degradi

- No-JS: i contenuti restano leggibili in ordine documentale (le scene sono sezioni
  HTML normali; la regia è progressive enhancement).
- Canvas non disponibile / GPU debole: il grafo degrada a SVG statico con i nodi
  in posa finale.
- Asset mancante (404): le immagini hanno fallback (`onerror` → mark SVG); la pagina
  non dipende da nessun asset per la struttura.
- Viewport piccoli: sotto i 768px la diagonale si fa più ripida e le coppie
  sinistra/destra diventano stack verticali; la demo pinned conserva le battute ma
  con layout a colonna singola.

## 9. Verifica

- `npm run typecheck` + `npm run build` puliti.
- Verifica visiva con preview browser su: dark/light × EN/IT × desktop/mobile ×
  reduced-motion on/off (8 combinazioni chiave).
- Lighthouse: Performance ≥ 95, Accessibility ≥ 95, SEO ≥ 95 su build di produzione.
- Deploy preview Vercel prima della promozione a produzione.

## 10. Fuori scope (per dopo)

- Raccolta email waitlist (Vercel Function + storage) — lo slot CTA è già pronto.
- Pagina download con installer e checksum.
- Versioni localizzate aggiuntive oltre EN/IT.
