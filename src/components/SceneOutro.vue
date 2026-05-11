<script setup lang="ts">
import Wordmark from './Wordmark.vue'

const year = new Date().getFullYear()
const repoUrl = 'https://github.com/devfrx/alice-continuum-lp'
const releasesUrl = `${repoUrl}/releases`
const readmeUrl = `${repoUrl}#readme`
const issuesUrl = `${repoUrl}/issues`

interface NavLink {
  label: string
  href: string
  external?: boolean
  num?: string
}

const sitemap: NavLink[] = [
  { label: 'Overture', href: '#overture', num: 'I' },
  { label: 'Pair', href: '#duo', num: 'II' },
  { label: 'Assistant', href: '#alce', num: 'III' },
  { label: 'Workspace', href: '#continuum', num: 'IV' },
  { label: 'Bridge', href: '#bridge', num: 'V' },
  { label: 'Principles', href: '#tenets', num: 'VI' },
]

const resources: NavLink[] = [
  { label: 'Source repository', href: repoUrl, external: true },
  { label: 'Install guide', href: readmeUrl, external: true },
  { label: 'Release notes', href: releasesUrl, external: true },
  { label: 'Issues and roadmap', href: issuesUrl, external: true },
]

function scrollTop(e: MouseEvent): void {
  e.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <section id="outro" class="outro scene" data-scroll aria-label="Begin">
    <!-- ── Closer ─────────────────────────────────────────── -->
    <div class="closer">
      <p class="mono">№ VII &nbsp;·&nbsp; Install</p>

      <h2 class="display title" aria-label="Run it on your machine.">
        Run it on<br />
        <span class="sr-gap"> </span>
        <span class="serif-italic accent">your machine.</span>
      </h2>

      <p class="lede">
        A local assistant, a private graph and the bridge between them.
        <br />Install it, inspect it, make it yours.
      </p>

      <div class="ctas">
        <a class="btn btn-primary" :href="releasesUrl" target="_blank" rel="noopener">
          <span>Download AL\CE</span>
          <span class="arrow" aria-hidden="true">↓</span>
        </a>
        <a class="btn btn-ghost" :href="repoUrl" target="_blank" rel="noopener">
          <span>View CONT\NUUM</span>
          <span class="arrow arrow-out" aria-hidden="true">↗</span>
        </a>
      </div>

      <ul class="specs" aria-label="Build details">
        <li><span class="k">Platform</span><span class="v">Windows · local-first</span></li>
        <li><span class="k">Runtime</span><span class="v">LM Studio · MCP · plugins</span></li>
        <li><span class="k">Principle</span><span class="v">Private by default</span></li>
      </ul>
    </div>

    <!-- ── Footer ────────────────────────────────────────── -->
    <footer class="foot" role="contentinfo">
      <p class="foot-mono mono">№ End &nbsp;·&nbsp; Colophon</p>

      <div class="foot-grid">
        <!-- Brand column -->
        <div class="col col-brand">
          <div class="lockup" aria-label="AL\CE × CONT\NUUM">
            <Wordmark brand="alce" />
            <span class="x" aria-hidden="true">×</span>
            <Wordmark brand="continuum" />
          </div>
          <p class="signature serif-italic">
            Local files. Local models.
            <br />Visible work, on disk.
          </p>
        </div>

        <!-- Sitemap column -->
        <nav class="col col-nav" aria-label="Sections">
          <h4 class="col-title">Sections</h4>
          <ul>
            <li v-for="m in sitemap" :key="m.href">
              <a :href="m.href">
                <span class="link-num">{{ m.num }}</span>
                <span class="link-label">{{ m.label }}</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- Resources column -->
        <nav class="col col-nav" aria-label="Resources">
          <h4 class="col-title">Resources</h4>
          <ul>
            <li v-for="r in resources" :key="r.label">
              <a :href="r.href" :target="r.external ? '_blank' : undefined" :rel="r.external ? 'noopener' : undefined">
                <span class="link-label">{{ r.label }}</span>
                <span v-if="r.external" class="link-ext" aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <hr class="foot-rule" />

      <div class="foot-bar">
        <div class="meta">
          <span class="mono">© {{ year }}</span>
          <span class="dot" aria-hidden="true" />
          <span class="mono">v 0.1 · Atelier</span>
          <span class="dot" aria-hidden="true" />
          <span class="mono">Local build</span>
        </div>

        <a class="back-top" href="#overture" @click="scrollTop">
          <span class="mono">Back to top</span>
          <span class="up" aria-hidden="true">↑</span>
        </a>
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

/* ── Closer ─────────────────────────────────────────────── */
.closer {
  display: grid;
  gap: 1.5rem;
  max-width: 64rem;
  opacity: var(--in, 0);
  transform: translateY(calc((1 - var(--in, 0)) * 30px));
  transition: opacity 0.8s var(--ease-cinema), transform 0.8s var(--ease-cinema);
}

.mono {
  margin: 0;
}

.title {
  margin: 0;
  font-size: var(--t-mega);
  color: var(--text-primary);
  line-height: 0.9;
}

.title .accent {
  color: var(--accent);
}

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
  margin-top: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.95rem 1.5rem;
  font-family: var(--font-mono);
  font-size: var(--t-mono);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  border-radius: 999px;
  transition: transform var(--motion-fast), background var(--motion-fast),
    color var(--motion-fast), border-color var(--motion-fast),
    box-shadow var(--motion-fast);
}

.btn .arrow {
  display: inline-block;
  transition: transform var(--motion-fast);
}

.btn-primary {
  background: var(--accent);
  color: var(--accent-on, var(--surface-0));
  border: 1px solid var(--accent);
  box-shadow: 0 1px 0 0 var(--accent-strong) inset, 0 8px 24px -12px var(--accent-strong);
}

.btn-primary:hover {
  transform: translateY(-1px);
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  color: var(--accent-on, var(--surface-0));
}

.btn-primary:hover .arrow {
  transform: translateY(2px);
}

.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.btn-ghost:hover .arrow-out {
  transform: translate(2px, -2px);
}

/* Build specs row */
.specs {
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: var(--rule);
  border-block: 1px solid var(--rule);
  max-width: 56rem;
}

.specs li {
  background: var(--surface-1);
  padding: 0.85rem 1.1rem;
  display: grid;
  gap: 0.2rem;
}

.specs .k {
  font-family: var(--font-mono);
  font-size: var(--t-mono);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--text-muted);
}

.specs .v {
  font-family: var(--font-sans);
  font-size: 0.92rem;
  color: var(--text-primary);
}

/* ── Footer ─────────────────────────────────────────────── */
.foot {
  position: relative;
  isolation: isolate;
  scroll-margin-top: 8rem;
  border-top: 1px solid var(--rule);
  padding-top: clamp(2.5rem, 5vw, 4rem);
  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
  overflow: hidden;
}

.foot-mono {
  color: var(--text-muted);
}

.foot-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: start;
}

.col {
  display: grid;
  gap: 1rem;
  min-width: 0;
}

.col-brand {
  gap: 1.25rem;
}

.lockup {
  display: inline-flex;
  align-items: baseline;
  gap: 0.55rem;
  font-size: clamp(1.6rem, 3.6vw, 2.4rem);
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
  margin: 0;
  font-size: var(--t-lede);
  color: var(--text-secondary);
  line-height: 1.45;
  max-width: 28ch;
}

.col-title {
  margin: 0 0 0.25rem 0;
  font-family: var(--font-mono);
  font-size: var(--t-mono);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 400;
}

.col-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.45rem;
}

.col-nav a {
  display: inline-flex;
  align-items: baseline;
  gap: 0.65rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
  transition: color var(--motion-fast), transform var(--motion-fast);
}

.col-nav a:hover,
.col-nav a:focus-visible {
  color: var(--accent);
  transform: translateX(2px);
}

.link-num {
  font-family: var(--font-mono);
  font-size: var(--t-mono);
  letter-spacing: var(--tracking-wider);
  color: var(--text-muted);
  min-width: 1.5rem;
}

.link-label {
  line-height: 1.3;
}

.link-ext {
  font-size: 0.78em;
  color: var(--text-muted);
  transition: transform var(--motion-fast), color var(--motion-fast);
}

.col-nav a:hover .link-ext {
  color: var(--accent);
  transform: translate(1px, -1px);
}

/* Rule + bottom bar */
.foot-rule {
  border: 0;
  height: 1px;
  background: var(--rule);
  margin: 0;
}

.foot-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--text-muted);
  font-size: var(--t-mono);
  flex-wrap: wrap;
}

.meta .dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
  display: inline-block;
}

.back-top {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-secondary);
  transition: color var(--motion-fast), border-color var(--motion-fast),
    transform var(--motion-fast);
}

.back-top:hover,
.back-top:focus-visible {
  color: var(--accent);
  border-color: var(--accent);
}

.back-top .up {
  transition: transform var(--motion-fast);
}

.back-top:hover .up {
  transform: translateY(-2px);
}

/* Corner watermarks */
.bg-mark {
  position: absolute;
  bottom: -60px;
  width: 260px;
  height: 260px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.035;
  pointer-events: none;
  z-index: -1;
}

.mark-l {
  left: -70px;
  background-image: var(--logo-mark);
}

.mark-r {
  right: -70px;
  background-image: var(--logo-continuum);
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 960px) {
  .foot-grid {
    grid-template-columns: 1fr 1fr;
  }

  .col-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .outro {
    gap: clamp(4.5rem, 18vw, 6.5rem);
    padding-inline: clamp(1rem, 5vw, 1.25rem);
    padding-block: clamp(7rem, 20vw, 9rem) clamp(5rem, 18vw, 7rem);
  }

  .closer,
  .foot {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  .title {
    font-size: clamp(4.3rem, 17vw, 5.55rem);
    line-height: 0.92;
  }

  .title .accent {
    display: block;
    font-size: 0.68em;
    line-height: 1.02;
  }

  .lede {
    max-width: 29ch;
  }

  .ctas {
    display: grid;
    grid-template-columns: 1fr;
    max-width: 21rem;
  }

  .btn {
    width: 100%;
    min-height: 72px;
    justify-content: space-between;
    padding-inline: 1.35rem;
    letter-spacing: 0.18em;
  }

  .foot-grid {
    grid-template-columns: 1fr;
    gap: clamp(2.25rem, 10vw, 3rem);
  }

  .foot {
    margin-inline: -0.25rem;
    padding-top: clamp(7.75rem, 28vw, 9.5rem);
    padding-inline: 0.25rem;
    gap: clamp(2.25rem, 9vw, 3rem);
  }

  .foot-mono,
  .col-title {
    letter-spacing: 0.24em;
  }

  .specs {
    grid-template-columns: 1fr;
    width: 100%;
    max-width: 100%;
  }

  .foot-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .bg-mark {
    width: 180px;
    height: 180px;
  }

  .lockup {
    font-size: clamp(1.85rem, 9.8vw, 2.45rem);
    flex-wrap: wrap;
    row-gap: 0.4rem;
  }

  .signature {
    font-size: clamp(1.45rem, 6.2vw, 1.9rem);
    max-width: 18ch;
  }

  .col-nav ul {
    gap: 0;
    border-top: 1px solid var(--rule);
  }

  .col-nav a,
  .back-top {
    min-height: 44px;
    align-items: center;
  }

  .col-nav a {
    display: flex;
    width: 100%;
    max-width: 100%;
    padding: 0.88rem 0;
    border-bottom: 1px solid var(--rule);
    transform: none;
  }

  .col-nav a:hover,
  .col-nav a:focus-visible {
    transform: none;
  }

  .link-num {
    min-width: 3rem;
  }

  .link-label {
    font-size: 1rem;
  }

  .back-top {
    padding-inline: 1rem;
  }

  .meta {
    row-gap: 0.45rem;
  }
}
</style>
