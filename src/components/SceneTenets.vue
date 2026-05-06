<script setup lang="ts">
const tenets = [
  { n: '01', h: 'Disk first',    t: 'Models, vectors and notes stay local.' },
  { n: '02', h: 'No account',    t: 'No sign-in path required for the core loop.' },
  { n: '03', h: 'Open weights',  t: 'Bring the model you actually want to run.' },
  { n: '04', h: 'Typed tools',   t: 'Plugins and MCP servers expose visible schemas.' },
  { n: '05', h: 'Cancelable',    t: 'Long work streams and can be interrupted.' },
  { n: '06', h: 'Portable',      t: 'Plain files and local databases by default.' },
]
</script>

<template>
  <section
    id="tenets"
    class="tenets scene"
    data-scroll
    aria-label="Principles"
  >
    <header class="head">
      <p class="mono">№ VI &nbsp;·&nbsp; Constraints</p>
      <h2 class="display title">
        Operating rules.
        <span class="serif-italic accent">Plain by default.</span>
      </h2>
    </header>

    <ol class="grid">
      <li
        v-for="(t, i) in tenets"
        :key="t.n"
        :style="{ '--i': i, '--n': tenets.length }"
      >
        <span class="num">{{ t.n }}</span>
        <h3>{{ t.h }}</h3>
        <p>{{ t.t }}</p>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.tenets {
  background: var(--bg-primary);
  display: grid;
  gap: clamp(2.5rem, 5vw, 4rem);
  align-content: center;
  padding-block: clamp(8rem, 14vw, 12rem);
  padding-inline: var(--gutter);
}

.head { max-width: 64rem; display: grid; gap: 1rem; }
.mono { margin: 0; opacity: var(--in, 0); transition: opacity 0.5s var(--ease-cinema); }
.title {
  margin: 0;
  font-size: var(--t-h1);
  color: var(--text-primary);
  line-height: 1;
  opacity: calc(min(1, var(--in, 0) * 1.6));
  transform: translateY(calc((1 - min(1, var(--in, 0) * 1.6)) * 30px));
  transition: opacity 0.7s var(--ease-cinema), transform 0.7s var(--ease-cinema);
}
.title .accent { color: var(--accent); }

.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--rule);
  border: 1px solid var(--rule);
  max-width: var(--max-w);
  width: 100%;
  margin-inline: auto;
}
.grid li {
  background: var(--bg-primary);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  display: grid;
  gap: 0.6rem;
  --t: calc(min(1, max(0, var(--in, 0) * 1.8 - var(--i) / var(--n))));
  opacity: var(--t);
  transform: translateY(calc((1 - var(--t)) * 18px));
  transition: opacity 0.6s var(--ease-cinema), transform 0.7s var(--ease-cinema);
}
.num {
  font-family: var(--font-mono);
  font-size: var(--t-mono);
  letter-spacing: var(--tracking-wider);
  color: var(--accent);
}
.grid h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--t-h3);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.05;
}
.grid p {
  margin: 0;
  font-size: var(--t-body);
  color: var(--text-secondary);
  line-height: 1.55;
  max-width: 36ch;
}

@media (max-width: 820px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
