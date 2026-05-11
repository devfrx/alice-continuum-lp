<script setup lang="ts">
import { computed } from 'vue'

const cells = [
  { k: 'Knowledge graph', v: '2D and 3D views for notes, links and clusters' },
  { k: 'Editor', v: 'Markdown with structured blocks' },
  { k: 'Backlinks', v: 'Plain [[links]] create graph structure' },
  { k: 'Vector search', v: 'Local semantic search over notes, files and conversations' },
  { k: 'Realtime', v: 'Y.js CRDT for live editing' },
  { k: 'Assistant hooks', v: 'AL\\CE can read only the context you select' },
  { k: 'Open files', v: 'Markdown and artifacts you can inspect outside the app' },
]

// A small constellation. Edges are drawn with stroke-dashoffset bound to --in.
interface Node { x: number; y: number; r: number }
const nodes: Node[] = [
  { x: 90, y: 80, r: 3 },
  { x: 320, y: 60, r: 3 },
  { x: 220, y: 180, r: 6 }, // center
  { x: 60, y: 260, r: 3 },
  { x: 350, y: 230, r: 3 },
  { x: 170, y: 320, r: 3 },
  { x: 290, y: 340, r: 3 },
]
const edges = computed(() => {
  // connect everything to center + a few peripheral edges for graph feel
  const c = 2 // center index
  const list: Array<[number, number]> = []
  nodes.forEach((_, i) => {
    if (i !== c) list.push([c, i])
  })
  list.push([0, 1], [3, 5], [4, 6], [1, 4], [0, 3])
  return list
})
</script>

<template>
  <section id="continuum" class="continuum scene" data-scroll aria-label="CONT\NUUM">
    <header class="head">
      <p class="mono">№ IV &nbsp;·&nbsp; Knowledge layer</p>
      <h2 class="display title" aria-label="Files. Links. Vectors.">
        <span class="row r1">Files.</span>
        <span class="sr-gap"> </span>
        <span class="row r2 serif-italic">Links.</span>
        <span class="sr-gap"> </span>
        <span class="row r3"><span class="accent">Vectors.</span></span>
      </h2>
      <p class="lede">
        CONT\NUUM keeps notes, backlinks, graph data and embeddings in a form
        AL\CE can query with sources attached. The files stay readable outside the app.
      </p>
    </header>

    <!-- Constellation: edges draw on scroll, nodes pop in. -->
    <figure class="constellation" aria-hidden="true">
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
        <g class="edges" stroke="var(--accent-border)" stroke-width="1" fill="none">
          <line v-for="(e, i) in edges" :key="`e${i}`" :x1="nodes[e[0]].x" :y1="nodes[e[0]].y" :x2="nodes[e[1]].x"
            :y2="nodes[e[1]].y" :style="{ '--i': i, '--n': edges.length }" />
        </g>
        <g class="nodes" fill="var(--accent)">
          <circle v-for="(n, i) in nodes" :key="`n${i}`" :cx="n.x" :cy="n.y" :r="n.r"
            :style="{ '--i': i, '--n': nodes.length }" :class="{ center: i === 2 }" />
        </g>
        <circle cx="220" cy="180" r="14" fill="none" stroke="var(--accent)" stroke-width="1" opacity="0.6" class="halo">
          <animate attributeName="r" values="14;48;14" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" />
        </circle>
      </svg>
    </figure>

    <ol class="ledger" aria-label="Capabilities">
      <li v-for="(c, i) in cells" :key="c.k" class="entry" :style="{ '--i': i, '--n': cells.length }">
        <span class="idx">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="dot" aria-hidden="true" />
        <div class="text">
          <h3>{{ c.k }}</h3>
          <p>{{ c.v }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.continuum {
  background: var(--bg-primary);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  grid-template-areas:
    'head        constellation'
    'ledger      constellation';
  column-gap: clamp(2rem, 5vw, 5rem);
  row-gap: clamp(3rem, 6vw, 5rem);
  align-content: center;
  padding-block: clamp(8rem, 14vw, 12rem);
  padding-inline: var(--gutter);
}

/* Head */
.head {
  grid-area: head;
  max-width: 56rem;
  display: grid;
  gap: 1.25rem;
}

.mono {
  margin: 0;
  opacity: var(--in, 0);
  transform: translateY(calc((1 - var(--in, 0)) * -8px));
  transition: opacity 0.5s var(--ease-cinema);
}

.title {
  margin: 0;
  font-size: var(--t-h1);
  color: var(--text-primary);
  display: grid;
  gap: 0.04em;
}

.row {
  display: block;
}

.sr-gap {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.r1 {
  opacity: calc(min(1, var(--in, 0) * 2));
  transform: translateY(calc((1 - min(1, var(--in, 0) * 2)) * 60px));
  transition: transform 0.9s var(--ease-cinema), opacity 0.5s var(--ease-cinema);
}

.r2 {
  opacity: calc(min(1, var(--in, 0) * 2 - 0.3));
  transform: translateY(calc((1 - min(1, var(--in, 0) * 2 - 0.3)) * 60px));
  transition: transform 0.9s var(--ease-cinema), opacity 0.5s var(--ease-cinema);
  color: var(--text-secondary);
}

.r3 {
  opacity: calc(min(1, var(--in, 0) * 2 - 0.6));
  transform: translateY(calc((1 - min(1, var(--in, 0) * 2 - 0.6)) * 60px));
  transition: transform 0.9s var(--ease-cinema), opacity 0.5s var(--ease-cinema);
}

.r3 .accent {
  color: var(--accent);
}

.lede {
  margin: 1.5rem 0 0;
  font-size: var(--t-lede);
  line-height: 1.55;
  color: var(--text-secondary);
  max-width: 52ch;
  opacity: calc(min(1, var(--in, 0) * 2 - 0.8));
  transform: translateY(calc((1 - min(1, var(--in, 0) * 2 - 0.8)) * 20px));
  transition: opacity 0.7s var(--ease-cinema), transform 0.7s var(--ease-cinema);
}

/* Constellation */
.constellation {
  grid-area: constellation;
  margin: 0;
  align-self: center;
  justify-self: center;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 1;
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
  background: radial-gradient(circle at center, var(--accent-faint) 0%, transparent 62%);
}

.constellation::before,
.constellation::after {
  content: '';
  position: absolute;
  inset: 10%;
  border: 1px solid var(--rule);
  border-radius: 50%;
  opacity: calc(0.2 + var(--in, 0) * 0.18);
  pointer-events: none;
  transform: scale(calc(0.86 + var(--in, 0) * 0.14));
  transition: opacity 0.7s var(--ease-cinema), transform 0.7s var(--ease-cinema);
}

.constellation::after {
  inset: 24%;
  border-color: var(--accent-border);
  transform: scale(calc(1.12 - var(--in, 0) * 0.12));
}

.constellation svg {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
}

.edges line {
  stroke-dasharray: 600;
  /* Each edge has its own threshold based on --i / --n */
  --t: calc(min(1, max(0, var(--in, 0) * 1.6 - var(--i) / var(--n) * 0.5)));
  stroke-dashoffset: calc(600 - var(--t) * 600);
  opacity: calc(0.4 + var(--t) * 0.6);
  transition: stroke-dashoffset 0.6s var(--ease-cinema), opacity 0.6s var(--ease-cinema);
}

.nodes circle {
  --t: calc(min(1, max(0, var(--in, 0) * 1.8 - var(--i) / var(--n) * 0.5)));
  transform-origin: center;
  transform-box: fill-box;
  transform: scale(var(--t));
  transition: transform 0.6s var(--ease-cinema);
}

.nodes circle.center {
  fill: var(--text-primary);
}

/* Ledger */
.ledger {
  grid-area: ledger;
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--rule);
  position: relative;
  max-width: 720px;
}

.ledger::before {
  content: '';
  position: absolute;
  top: 0;
  left: calc(60px - 0.5px);
  width: 1px;
  height: calc(var(--in, 0) * 100%);
  background: var(--accent-border);
  transition: height 0.5s var(--ease-cinema);
}

.entry {
  display: grid;
  grid-template-columns: 60px 18px 1fr;
  gap: 1.5rem;
  align-items: baseline;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--rule);
  --t: calc(min(1, max(0, var(--in, 0) * 1.8 - var(--i) / var(--n))));
  opacity: var(--t);
  transform: translateX(calc((1 - var(--t)) * -24px));
  transition: opacity 0.6s var(--ease-cinema), transform 0.7s var(--ease-cinema);
}

.idx {
  font-family: var(--font-mono);
  font-size: var(--t-mono);
  letter-spacing: var(--tracking-wider);
  color: var(--text-muted);
  text-align: right;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  align-self: center;
  justify-self: center;
  transform: scale(var(--t));
  transition: transform 0.6s var(--ease-cinema);
}

.text h3 {
  margin: 0 0 0.35rem;
  font-family: var(--font-display);
  font-size: var(--t-h3);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.05;
  letter-spacing: 0;
}

.text p {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--t-body);
  line-height: 1.6;
  max-width: 56ch;
}

@media (max-width: 980px) {
  .continuum {
    grid-template-columns: 1fr;
    grid-template-areas: 'head' 'constellation' 'ledger';
  }

  .constellation {
    position: static;
    transform: none;
    max-width: 320px;
  }

  .ledger::before {
    left: calc(34px - 0.5px);
  }

  .entry {
    grid-template-columns: 34px 14px 1fr;
    gap: 0.75rem;
  }
}
</style>
