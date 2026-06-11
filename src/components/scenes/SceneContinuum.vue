<script setup lang="ts">
import { computed, ref } from 'vue'
import DiagonalStage from '../fx/DiagonalStage.vue'
import KnowledgeGraph from '../demo/KnowledgeGraph.vue'
import Sparkle from '../brand/Sparkle.vue'
import Wordmark from '../brand/Wordmark.vue'
import { useLocale } from '../../composables/useLocale'
import { useScrollScene } from '../../composables/useScrollScene'
import { remap } from '../../lib/motion'

const { t } = useLocale()

const section = ref<HTMLElement | null>(null)
const progress = useScrollScene(section)

// Mirrored sweep: the diagonal crosses back left, CONT\NUUM takes the stage.
const sweep = computed(() => remap(progress.value, 0.15, 0.55, 0, 1))
</script>

<template>
  <section id="continuum" ref="section" class="continuum">
    <div class="stage">
      <DiagonalStage
        :from="{ topX: 94, bottomX: 86 }"
        :to="{ topX: 8, bottomX: 16 }"
        :progress="sweep"
      >
        <template #left>
          <div class="pane pane-rest"></div>
        </template>
        <template #right>
          <div class="pane pane-main"></div>
        </template>
      </DiagonalStage>
    </div>

    <div class="inner">
      <header class="head">
        <p class="kicker">
          <Wordmark brand="continuum" variant="mark" :height="16" decorative />
          <span>{{ t.continuum.kicker }}</span>
        </p>
        <h2 class="title">{{ t.continuum.title }}</h2>
        <p class="intro">{{ t.continuum.intro }}</p>
      </header>

      <div class="graph-stage">
        <KnowledgeGraph :nodes="140" :seed="23" :speed="0.05" :zoom="1.5" />
        <p class="file-note">
          <Sparkle :size="10" />
          <span>{{ t.continuum.fileNote }}</span>
        </p>
      </div>

      <ol class="caps">
        <li
          v-for="(cap, i) in t.continuum.capabilities"
          :key="cap.title"
          class="cap"
          :style="{ '--rt': 0.42 + i * 0.05 }"
        >
          <span class="cap-num">0{{ i + 1 }}</span>
          <h3 class="cap-title">{{ cap.title }}</h3>
          <code class="cap-mono">{{ cap.mono }}</code>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.continuum {
  position: relative;
  min-height: 100vh;
}

.stage {
  position: absolute;
  inset: 0;
}

/* The seam crosses behind a whole composed scene here — soften it. */
.stage :deep(.line) {
  opacity: 0.4;
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
  display: flex;
  flex-direction: column;
}

/* Mirrored composition: header sits right-aligned. */
.head {
  position: relative;
  z-index: 1;
  max-width: 620px;
  align-self: flex-end;
  text-align: right;
  margin-bottom: 0;
}

.kicker {
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  margin-left: auto;
  max-width: 56ch;
}

/* ——— central graph — rises behind the header for depth ——— */

.graph-stage {
  position: relative;
  height: clamp(360px, 54vh, 580px);
  margin-top: clamp(-130px, -12vh, -60px);
  margin-bottom: clamp(28px, 5vh, 48px);
}

.graph-stage > :first-child {
  position: absolute;
  inset: 0;
}

.file-note {
  position: absolute;
  left: 0;
  bottom: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 44ch;
  padding: 11px 16px;
  border: 1px solid var(--accent-border);
  border-radius: 6px;
  background: var(--bg);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.05em;
  line-height: 1.5;
  color: var(--text-2);
}

.file-note :first-child {
  color: var(--accent);
  flex-shrink: 0;
}

/* ——— capability strip ——— */

.caps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.cap {
  position: relative;
  padding: 18px 18px 20px 0;
  margin-right: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-right: 1px solid var(--line);
  opacity: clamp(0.04, calc((var(--p, 1) - var(--rt)) * 9), 1);
  transform: translateY(calc((1 - clamp(0, calc((var(--p, 1) - var(--rt)) * 9), 1)) * 16px));
}

.cap:last-child {
  border-right: 0;
  margin-right: 0;
}

.cap-num {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.cap-title {
  font-size: 15px;
  font-weight: 500;
}

.cap-mono {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--text-3);
  line-height: 1.5;
}

@media (prefers-reduced-motion: reduce) {
  .cap {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 820px) {
  .head {
    align-self: flex-start;
    text-align: left;
  }

  .kicker {
    justify-content: flex-start;
  }

  .intro {
    margin-left: 0;
  }

  .graph-stage {
    height: 360px;
    margin-top: 8px;
  }

  /* Stays an overlay chip pinned to the stage bottom; the solid
     background keeps it readable over the constellation. */
  .file-note {
    bottom: 0;
    right: 0;
  }

  .caps {
    grid-template-columns: 1fr 1fr;
    border: 1px solid var(--line);
  }

  .cap {
    padding: 16px;
    margin-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .cap:nth-child(2n) {
    border-right: 0;
  }

  .cap:nth-child(n + 5) {
    border-bottom: 0;
  }

  .cap:last-child {
    grid-column: 1 / -1;
  }
}
</style>
