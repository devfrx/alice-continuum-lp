<script setup lang="ts">
import Wordmark from './Wordmark.vue'

const channels = [
  { k: 'Shared index', v: 'One local vector store' },
  { k: 'Knowledge API',  v: 'Notes and graph as tools' },
  { k: 'RAG context',      v: 'Sources returned with the answer' },
  { k: 'Local API',        v: 'localhost · typed · small surface' },
  { k: 'Event bus',         v: 'Updates without cloud sync' },
]
</script>

<template>
  <section
    id="bridge"
    class="bridge scene"
    data-scroll
    aria-label="The bridge"
  >
    <p class="mono number">№ V &nbsp;·&nbsp; The bridge</p>

    <h2 class="display title">
      <Wordmark brand="alce" /> <span class="serif-italic dim">queries.</span>
      <br />
      <span class="sr-gap"> </span>
      <Wordmark brand="continuum" /> <span class="serif-italic accent">stores.</span>
    </h2>

    <div class="rule" aria-hidden="true">
      <span class="rule-fill" />
    </div>

    <p class="lede">
      The bridge is a local contract: request context, return sources, write artifacts.
      <br />
      Request, sources and write target stay visible.
    </p>

    <ul class="channels" role="list">
      <li
        v-for="(c, i) in channels"
        :key="c.k"
        :style="{ '--i': i, '--n': channels.length }"
      >
        <span class="dot" aria-hidden="true" />
        <h3>{{ c.k }}</h3>
        <p>{{ c.v }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.bridge {
  background: var(--surface-2);
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  display: grid;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  align-content: center;
  text-align: center;
  padding-block: clamp(8rem, 14vw, 12rem);
  padding-inline: var(--gutter);
}

.number {
  margin: 0;
  opacity: var(--in, 0);
  transform: translateY(calc((1 - var(--in, 0)) * -8px));
  transition: opacity 0.5s var(--ease-cinema);
}

.title {
  margin: 0 auto;
  font-size: var(--t-h1);
  color: var(--text-primary);
  max-width: 28ch;
  line-height: 1.05;
  opacity: calc(min(1, var(--in, 0) * 1.6));
  transform: translateY(calc((1 - min(1, var(--in, 0) * 1.6)) * 30px));
  transition: opacity 0.7s var(--ease-cinema), transform 0.7s var(--ease-cinema);
}
.title .dim   { color: var(--text-muted); }
.title .accent { color: var(--accent); }
.sr-gap {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.rule {
  position: relative;
  height: 1px;
  width: min(100%, 720px);
  margin: clamp(1rem, 2vw, 2rem) auto;
  background: var(--rule);
}
.rule-fill {
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  background: var(--accent);
  width: calc(min(1, var(--in, 0) * 1.6) * 100%);
  transform: translateX(-50%);
  transition: width 0.9s var(--ease-cinema);
}

.lede {
  margin: 0 auto;
  font-size: var(--t-lede);
  line-height: 1.55;
  color: var(--text-secondary);
  max-width: 56ch;
  opacity: calc(min(1, var(--in, 0) * 1.6 - 0.2));
  transform: translateY(calc((1 - min(1, var(--in, 0) * 1.6 - 0.2)) * 20px));
  transition: opacity 0.7s var(--ease-cinema), transform 0.7s var(--ease-cinema);
}

.channels {
  list-style: none;
  margin: clamp(2rem, 4vw, 3rem) auto 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0;
  border-block: 1px solid var(--rule);
  max-width: 1100px;
  width: 100%;
}
.channels li {
  padding: 1.25rem 1rem;
  display: grid;
  gap: 0.4rem;
  text-align: left;
  border-inline-end: 1px solid var(--rule);
  --t: calc(min(1, max(0, var(--in, 0) * 1.8 - var(--i) / var(--n))));
  opacity: var(--t);
  transform: translateY(calc((1 - var(--t)) * 16px));
  transition: opacity 0.6s var(--ease-cinema), transform 0.7s var(--ease-cinema);
}
.channels li:last-child { border-inline-end: 0; }
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}
.channels h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}
.channels p {
  margin: 0;
  font-size: var(--t-mono);
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
  color: var(--text-secondary);
  line-height: 1.5;
}

@media (max-width: 820px) {
  .channels { grid-template-columns: 1fr; }
  .channels li {
    border-inline-end: 0;
    border-block-end: 1px solid var(--rule);
  }
  .channels li:last-child { border-block-end: 0; }
}
</style>
