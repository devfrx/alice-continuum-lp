<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '../../composables/useLocale'
import { useScrollScene } from '../../composables/useScrollScene'

const { t } = useLocale()

const section = ref<HTMLElement | null>(null)
useScrollScene(section)
</script>

<template>
  <section id="tenets" ref="section" class="tenets">
    <div class="inner">
      <!-- The dossier: a case file, classification public, nothing redacted. -->
      <article class="sheet">
        <span class="crop crop-tl" aria-hidden="true"></span>
        <span class="crop crop-tr" aria-hidden="true"></span>
        <span class="crop crop-bl" aria-hidden="true"></span>
        <span class="crop crop-br" aria-hidden="true"></span>

        <span class="watermark" aria-hidden="true">\</span>

        <header class="sheet-head">
          <span class="doc-id">{{ t.tenets.docId }}</span>
          <span class="doc-kicker">{{ t.tenets.kicker }}</span>
        </header>

        <div class="head">
          <h2 class="title">{{ t.tenets.title }}</h2>
          <div class="stamp" aria-hidden="true">
            <span class="stamp-ring"></span>
            <span class="stamp-text">{{ t.tenets.stamp }}</span>
          </div>
        </div>

        <ol class="seals">
          <li
            v-for="(seal, i) in t.tenets.seals"
            :key="seal.label"
            class="seal"
            :style="{ '--rt': 0.25 + i * 0.04 }"
          >
            <span class="seal-top">
              <span class="seal-num">0{{ i + 1 }}</span>
              <span class="seal-label">{{ seal.label }}</span>
            </span>
            <span class="seal-value">{{ seal.value }}</span>
            <span class="seal-note">{{ seal.note }}</span>
          </li>
        </ol>

        <footer class="sheet-foot">
          <span>{{ t.tenets.docFoot }}</span>
          <span class="foot-brand">AL\CE × CONT\NUUM</span>
        </footer>
      </article>
    </div>
  </section>
</template>

<style scoped>
.tenets {
  position: relative;
  background: var(--bg);
}

.inner {
  max-width: var(--max-w);
  margin-inline: auto;
  padding: clamp(90px, 14vh, 150px) var(--gutter);
}

/* ——— the case file ——— */

.sheet {
  position: relative;
  border: 1px solid var(--line);
  background: var(--bg-raise);
  padding: 0;
  overflow: hidden;
}

/* Registration marks just outside the sheet corners. */
.crop {
  position: absolute;
  width: 14px;
  height: 14px;
  color: var(--text-3);
  pointer-events: none;
  z-index: 2;
}

.crop::before,
.crop::after {
  content: '';
  position: absolute;
  background: currentColor;
}

.crop::before {
  width: 100%;
  height: 1px;
}

.crop::after {
  width: 1px;
  height: 100%;
}

.crop-tl { top: 7px; left: 7px; }
.crop-tl::before { top: 0; left: 0; }
.crop-tl::after { top: 0; left: 0; }
.crop-tr { top: 7px; right: 7px; }
.crop-tr::before { top: 0; right: 0; }
.crop-tr::after { top: 0; right: 0; }
.crop-bl { bottom: 7px; left: 7px; }
.crop-bl::before { bottom: 0; left: 0; }
.crop-bl::after { bottom: 0; left: 0; }
.crop-br { bottom: 7px; right: 7px; }
.crop-br::before { bottom: 0; right: 0; }
.crop-br::after { bottom: 0; right: 0; }

/* Giant brand backslash bleeding off the sheet's right edge. */
.watermark {
  position: absolute;
  top: -0.18em;
  right: -0.12em;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(340px, 38vw, 560px);
  line-height: 1;
  color: var(--accent);
  opacity: 0.05;
  pointer-events: none;
  user-select: none;
}

/* ——— sheet header strip ——— */

.sheet-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  padding: 16px clamp(20px, 3vw, 40px);
  border-bottom: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.doc-id {
  color: var(--text-2);
}

.doc-kicker {
  color: var(--accent);
}

/* ——— title + stamp ——— */

.head {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: clamp(30px, 4.5vh, 52px) clamp(20px, 3vw, 40px) clamp(26px, 4vh, 44px);
}

.title {
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(1.9rem, 3.6vw, 3.3rem);
  line-height: 1.06;
  letter-spacing: 0.02em;
  max-width: 14ch;
}

.stamp {
  position: relative;
  flex-shrink: 0;
  width: clamp(96px, 10vw, 124px);
  height: clamp(96px, 10vw, 124px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: clamp(4px, 3vw, 48px);
  transform: rotate(-12deg) scale(clamp(0.001, calc((var(--p, 1) - 0.14) * 12), 1));
  transform-origin: center;
  color: var(--accent);
}

.stamp-ring {
  position: absolute;
  inset: 0;
  border: 1.5px solid var(--accent-border);
  border-radius: 50%;
}

.stamp-ring::before {
  content: '';
  position: absolute;
  inset: 8px;
  border: 1px dashed var(--accent-border);
  border-radius: 50%;
}

.stamp-text {
  font-family: var(--font-mono);
  font-size: 12.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.5;
  max-width: 86px;
}

/* ——— seals grid ——— */

.seals {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--line);
}

.seal {
  position: relative;
  padding: clamp(22px, 3vh, 30px) clamp(20px, 3vw, 40px) clamp(24px, 3.4vh, 34px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  opacity: clamp(0.04, calc((var(--p, 1) - var(--rt)) * 9), 1);
  transform: translateY(calc((1 - clamp(0, calc((var(--p, 1) - var(--rt)) * 9), 1)) * 18px));
  transition: background-color 200ms var(--ease-smooth);
}

.seal:nth-child(3n) {
  border-right: 0;
}

.seal:nth-child(n + 4) {
  border-bottom: 0;
}

.seal:hover {
  background: var(--accent-dim);
}

.seal-top {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.seal-num {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.seal-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--text-3);
}

.seal-value {
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(2.2rem, 3.6vw, 3.2rem);
  line-height: 0.95;
  color: var(--accent);
}

.seal-note {
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-2);
  max-width: 30ch;
}

/* ——— sheet footer ——— */

.sheet-foot {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px clamp(20px, 3vw, 40px);
  border-top: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-3);
}

.foot-brand {
  color: var(--text-2);
}

@media (prefers-reduced-motion: reduce) {
  .seal {
    opacity: 1;
    transform: none;
  }

  .stamp {
    transform: rotate(-12deg);
  }
}

@media (max-width: 1080px) {
  .seals {
    grid-template-columns: 1fr 1fr;
  }

  .seal:nth-child(3n) {
    border-right: 1px solid var(--line);
  }

  .seal:nth-child(2n) {
    border-right: 0;
  }

  .seal:nth-child(n + 4) {
    border-bottom: 1px solid var(--line);
  }

  .seal:nth-child(n + 5) {
    border-bottom: 0;
  }
}

@media (max-width: 820px) {
  .sheet-head {
    flex-direction: column;
    gap: 6px;
  }

  .head {
    flex-direction: column;
    gap: 18px;
  }

  .stamp {
    align-self: flex-end;
    margin-top: -34px;
    margin-right: 0;
  }

  .watermark {
    font-size: 300px;
  }

  .seals {
    grid-template-columns: 1fr;
  }

  .seal,
  .seal:nth-child(2n),
  .seal:nth-child(3n) {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .seal:last-child {
    border-bottom: 0;
  }

  .sheet-foot {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
