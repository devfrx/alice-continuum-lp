<script setup lang="ts">
import Wordmark from './Wordmark.vue'

const year = new Date().getFullYear()
</script>

<template>
  <section
    id="outro"
    class="outro scene"
    data-scroll
    aria-label="Begin"
  >
    <div class="closer">
      <p class="mono">№ VII &nbsp;·&nbsp; Install</p>

      <h2 class="display title">
        Run it on<br />
        <span class="sr-gap"> </span>
        <span class="serif-italic accent">your machine.</span>
      </h2>

      <p class="lede">
        A local assistant, a notes workspace and the bridge between them.
        <br />Install it, inspect it, change it.
      </p>

      <div class="ctas">
        <a class="btn btn-primary" href="https://github.com/" target="_blank" rel="noopener">
          Download AL\CE
          <span aria-hidden="true">→</span>
        </a>
        <a class="btn btn-ghost" href="https://github.com/" target="_blank" rel="noopener">
          View CONT\NUUM
        </a>
      </div>
    </div>

    <!-- ── Footer ────────────────────────────────────────── -->
    <footer class="foot" role="contentinfo">
      <div class="lockup" aria-label="AL\CE × CONT\NUUM">
        <Wordmark brand="alce" />
        <span class="x" aria-hidden="true">×</span>
        <Wordmark brand="continuum" />
      </div>

      <p class="signature serif-italic">Local files. Local models.</p>

      <div class="meta">
        <span class="mono">© {{ year }}</span>
        <span class="dot" aria-hidden="true" />
        <span class="mono">Local build</span>
        <span class="dot" aria-hidden="true" />
        <span class="mono">v 0.1 · Atelier</span>
      </div>

      <span class="bg-mark mark-l" aria-hidden="true" />
      <span class="bg-mark mark-r" aria-hidden="true" />
    </footer>
  </section>
</template>

<style scoped>
.outro {
  background: var(--surface-1);
  border-top: 1px solid var(--rule);
  display: grid;
  grid-template-rows: 1fr auto;
  gap: clamp(4rem, 10vw, 8rem);
  align-content: center;
  padding-block: clamp(8rem, 14vw, 12rem);
  padding-inline: var(--gutter);
}

/* Closer */
.closer {
  display: grid;
  gap: 1.5rem;
  max-width: 64rem;
  opacity: var(--in, 0);
  transform: translateY(calc((1 - var(--in, 0)) * 30px));
  transition: opacity 0.8s var(--ease-cinema), transform 0.8s var(--ease-cinema);
}
.mono { margin: 0; }
.title {
  margin: 0;
  font-size: var(--t-mega);
  color: var(--text-primary);
  line-height: 0.9;
}
.title .accent { color: var(--accent); }
.sr-gap {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.lede {
  margin: 0;
  font-size: var(--t-lede);
  line-height: 1.5;
  color: var(--text-secondary);
  max-width: 50ch;
}

.ctas {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.4rem;
  font-family: var(--font-mono);
  font-size: var(--t-mono);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  border-radius: 999px;
  transition: transform var(--motion-fast), background var(--motion-fast),
    color var(--motion-fast), border-color var(--motion-fast);
}
.btn-primary {
  background: var(--accent);
  color: var(--accent-on);
  border: 1px solid var(--accent);
}
.btn-primary:hover { transform: translateY(-1px); }
.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border);
}
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

/* Footer */
.foot {
  position: relative;
  isolation: isolate;
  border-top: 1px solid var(--rule);
  padding-top: clamp(2rem, 4vw, 3rem);
  display: grid;
  gap: clamp(1rem, 2vw, 1.5rem);
  align-items: end;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'lockup    meta'
    'signature signature';
  overflow: hidden;
}

.lockup {
  grid-area: lockup;
  display: inline-flex;
  align-items: baseline;
  gap: 0.6rem;
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--text-primary);
  line-height: 1;
}
.lockup .x {
  font-family: 'Times New Roman', Georgia, serif;
  font-style: italic;
  color: var(--text-muted);
  font-size: 0.7em;
}

.signature {
  grid-area: signature;
  margin: 0;
  font-size: var(--t-lede);
  color: var(--text-secondary);
}

.meta {
  grid-area: meta;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--text-muted);
  font-size: var(--t-mono);
}
.meta .dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
  display: inline-block;
}

/* Corner watermarks of each mark */
.bg-mark {
  position: absolute;
  bottom: -40px;
  width: 220px;
  height: 220px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.04;
  pointer-events: none;
  z-index: -1;
}
.mark-l { left: -60px;  background-image: var(--logo-mark); }
.mark-r { right: -60px; background-image: var(--logo-continuum); }

@media (max-width: 700px) {
  .foot {
    grid-template-columns: 1fr;
    grid-template-areas:
      'lockup'
      'signature'
      'meta';
  }
  .meta { justify-content: flex-start; }
}
</style>
