<script setup lang="ts">
const cells = [
  { k: 'Local LLM',         v: 'LM Studio · streaming · OpenAI-compatible' },
  { k: 'Agent loop',        v: 'Plans a step, calls a tool, checks the result' },
  { k: 'Plugin system',     v: 'Typed schemas · serializable calls · visible contracts' },
  { k: 'MCP native',        v: 'Local MCP servers load as tools' },
  { k: '3D local',          v: 'Trellis and CAD generation on your GPU' },
  { k: 'Voice',             v: 'faster-whisper in · Piper / XTTS / Kokoro out' },
  { k: 'Local vectors',     v: 'Embeddings over conversations, notes and files' },
]
</script>

<template>
  <section
    id="alce"
    class="alce scene"
    data-scroll
    aria-label="AL\CE"
  >
    <!-- Large AL\CE watermark drifting upward as you scroll. -->
    <span class="watermark" aria-hidden="true" />

    <header class="head">
      <p class="mono">№ III &nbsp;·&nbsp; Execution layer</p>
      <h2 class="display title">
        <span class="row r1">Model.</span>
        <span class="row r2 serif-italic">Tools.</span>
        <span class="row r3"><span class="accent">State.</span></span>
      </h2>
      <p class="lede">
        AL\CE is the runtime around the model: chat, voice, plugins, MCP and
        desktop actions. The loop is explicit, and the result can stay local.
      </p>
    </header>

    <ol class="ledger" aria-label="Capabilities">
      <li
        v-for="(c, i) in cells"
        :key="c.k"
        class="entry"
        :style="{ '--i': i, '--n': cells.length }"
      >
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
.alce {
  background: var(--surface-1);
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: grid;
  gap: clamp(3rem, 6vw, 5rem);
  align-content: center;
  padding-block: clamp(8rem, 14vw, 12rem);
  padding-inline: var(--gutter);
}

/* Watermark drifts upward, scaling slightly with scroll */
.watermark {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: var(--logo-mark);
  background-position: 110% calc(50% + (1 - var(--p, 0)) * 10vh);
  background-repeat: no-repeat;
  background-size: clamp(360px, 55vw, 720px) auto;
  opacity: calc(0.06 + var(--in, 0) * 0.06);
  transform: scale(calc(0.95 + var(--in, 0) * 0.08));
  transition: opacity 1s var(--ease-cinema);
  filter: contrast(1.1);
}
:root[data-theme='light'] .watermark { opacity: calc(0.05 + var(--in, 0) * 0.05); }

/* Head */
.head {
  max-width: 64rem;
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
.row { display: block; }
.row .serif-italic { color: var(--text-secondary); margin-right: 0.15em; }
.row.r3 .accent { color: var(--accent); }

/* Per-row stagger driven by --in (3 rows, thresholds 0/.15/.3) */
.r1 {
  opacity: calc(min(1, var(--in, 0) * 2));
  transform: translateY(calc((1 - min(1, var(--in, 0) * 2)) * 60px));
  transition: transform 0.9s var(--ease-cinema), opacity 0.5s var(--ease-cinema);
}
.r2 {
  opacity: calc(min(1, var(--in, 0) * 2 - 0.3));
  transform: translateY(calc((1 - min(1, var(--in, 0) * 2 - 0.3)) * 60px));
  transition: transform 0.9s var(--ease-cinema), opacity 0.5s var(--ease-cinema);
}
.r3 {
  opacity: calc(min(1, var(--in, 0) * 2 - 0.6));
  transform: translateY(calc((1 - min(1, var(--in, 0) * 2 - 0.6)) * 60px));
  transition: transform 0.9s var(--ease-cinema), opacity 0.5s var(--ease-cinema);
}

.lede {
  margin: 1.5rem 0 0;
  font-size: var(--t-lede);
  line-height: 1.55;
  color: var(--text-secondary);
  max-width: 56ch;
  opacity: calc(min(1, var(--in, 0) * 2 - 0.8));
  transform: translateY(calc((1 - min(1, var(--in, 0) * 2 - 0.8)) * 20px));
  transition: opacity 0.7s var(--ease-cinema), transform 0.7s var(--ease-cinema);
}

/* Ledger rows reveal progressively */
.ledger {
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 1100px;
  display: grid;
  position: relative;
  border-top: 1px solid var(--rule);
}
.ledger::before {
  /* vertical scribe line on the left, grows as scrolled */
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
  padding: 1.4rem 0;
  border-bottom: 1px solid var(--rule);
  position: relative;
  /* stagger threshold: each row appears at i / n of --in */
  --t: calc(min(1, max(0, var(--in, 0) * 1.6 - var(--i) / var(--n))));
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
  max-width: 64ch;
}

@media (max-width: 820px) {
  .ledger::before { left: calc(34px - 0.5px); }
  .entry { grid-template-columns: 34px 14px 1fr; gap: 0.75rem; }
}
</style>
