<script setup lang="ts">
import { computed, ref } from 'vue'
import DiagonalStage from '../fx/DiagonalStage.vue'
import MicroWaveform from '../demo/MicroWaveform.vue'
import MicroLoop from '../demo/MicroLoop.vue'
import Wordmark from '../brand/Wordmark.vue'
import { useLocale } from '../../composables/useLocale'
import { useScrollScene } from '../../composables/useScrollScene'
import { remap } from '../../lib/motion'

const { t } = useLocale()

const section = ref<HTMLElement | null>(null)
const progress = useScrollScene(section)

// The diagonal sweeps right, giving AL\CE the full stage.
const sweep = computed(() => remap(progress.value, 0.2, 0.6, 0, 1))
</script>

<template>
  <section id="alice" ref="section" class="alice">
    <div class="stage">
      <DiagonalStage
        :from="{ topX: 55, bottomX: 45 }"
        :to="{ topX: 94, bottomX: 86 }"
        :progress="sweep"
      >
        <template #left>
          <div class="pane pane-main"></div>
        </template>
        <template #right>
          <div class="pane pane-rest"></div>
        </template>
      </DiagonalStage>
    </div>

    <div class="inner">
      <header class="head">
        <p class="kicker">
          <Wordmark brand="alice" variant="mark" :height="18" decorative />
          <span>{{ t.alice.kicker }}</span>
        </p>
        <h2 class="title">{{ t.alice.title }}</h2>
        <p class="intro">{{ t.alice.intro }}</p>
      </header>

      <ol class="ledger">
        <li
          v-for="(cap, i) in t.alice.capabilities"
          :key="cap.title"
          class="row"
          :style="{ '--rt': 0.26 + i * 0.045 }"
        >
          <span class="num" aria-hidden="true">0{{ i + 1 }}</span>
          <div class="row-main">
            <h3 class="row-title">{{ cap.title }}</h3>
            <p class="row-desc">{{ cap.desc }}</p>
          </div>
          <div class="row-side">
            <code class="row-mono">{{ cap.mono }}</code>
            <MicroWaveform v-if="i === 1" class="micro" />
            <MicroLoop v-else-if="i === 2" class="micro" />
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.alice {
  position: relative;
  min-height: 100vh;
}

.stage {
  position: absolute;
  inset: 0;
}

.pane {
  position: absolute;
  inset: 0;
}

.pane-main {
  background: var(--bg);
}

.pane-rest {
  background: var(--bg-raise);
}

.inner {
  position: relative;
  z-index: 1;
  max-width: var(--max-w);
  margin-inline: auto;
  padding: clamp(90px, 14vh, 150px) var(--gutter) clamp(70px, 10vh, 120px);
}

.head {
  max-width: 640px;
  margin-bottom: clamp(48px, 7vh, 80px);
}

.kicker {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 14px;
}

.title {
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(1.7rem, 3.2vw, 2.9rem);
  line-height: 1.08;
  letter-spacing: 0.02em;
  margin-bottom: 14px;
}

.intro {
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--text-2);
  max-width: 56ch;
}

/* ——— capability ledger ——— */

.ledger {
  list-style: none;
  max-width: 880px;
}

.row {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) minmax(180px, 280px);
  gap: 18px;
  align-items: start;
  padding: 22px 0;
  border-top: 1px solid var(--line);
  /* Scrub-reversible reveal driven by the section's --p. */
  opacity: clamp(0.04, calc((var(--p, 1) - var(--rt)) * 9), 1);
  transform: translateY(calc((1 - clamp(0, calc((var(--p, 1) - var(--rt)) * 9), 1)) * 22px));
}

.row:last-child {
  border-bottom: 1px solid var(--line);
}

.num {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--text-3);
  padding-top: 3px;
}

.row-title {
  font-size: 16.5px;
  font-weight: 500;
  margin-bottom: 6px;
}

.row-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-2);
  max-width: 46ch;
}

.row-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  text-align: right;
}

.row-mono {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.06em;
  color: var(--accent);
  background: var(--accent-dim);
  border-radius: 5px;
  padding: 4px 9px;
}

@media (prefers-reduced-motion: reduce) {
  .row {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 820px) {
  .row {
    grid-template-columns: 38px minmax(0, 1fr);
  }

  .row-side {
    grid-column: 2;
    align-items: flex-start;
    text-align: left;
  }
}
</style>
