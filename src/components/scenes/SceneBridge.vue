<script setup lang="ts">
import { computed, ref } from 'vue'
import DiagonalStage from '../fx/DiagonalStage.vue'
import Sparkle from '../brand/Sparkle.vue'
import { useLocale } from '../../composables/useLocale'
import { useScrollScene } from '../../composables/useScrollScene'
import { useReducedMotion } from '../../composables/useReducedMotion'
import { remap } from '../../lib/motion'

const { t } = useLocale()
const reduced = useReducedMotion()

const section = ref<HTMLElement | null>(null)
const progress = useScrollScene(section)

// The diagonal lies down into the local contract between the two apps:
// a shallow seam crossing the viewport from (0, 31%) to (100%, 69%).
const sweep = computed(() => remap(progress.value, 0.15, 0.5, 0, 1))
const settled = computed(() => reduced.value || sweep.value > 0.92)
</script>

<template>
  <section id="bridge" ref="section" class="bridge">
    <div class="stage">
      <DiagonalStage :from="{ topX: 8, bottomX: 16 }" :to="{ topX: -80, bottomX: 180 }" :progress="sweep">
        <template #left>
          <div class="pane pane-below"></div>
        </template>
        <template #right>
          <div class="pane pane-above"></div>
        </template>
      </DiagonalStage>
    </div>

    <div class="packets" :class="{ settled }" aria-hidden="true">
      <span v-for="i in 3" :key="i" class="packet" :style="{ '--pd': `${(i - 1) * 2.3}s`, '--ps': `${(i - 1) * 0.3}` }">
        <Sparkle :size="8" />
      </span>
    </div>

    <header class="head">
      <p class="kicker">{{ t.bridge.kicker }}</p>
      <h2 class="title">{{ t.bridge.title }}</h2>
      <p class="intro">{{ t.bridge.intro }}</p>
    </header>

    <p class="label label-top">{{ t.bridge.labelTop }} <span class="dir">↓</span></p>
    <p class="label label-bottom"><span class="dir">↑</span> {{ t.bridge.labelBottom }}</p>

    <ul class="channels">
      <template v-for="(channel, i) in t.bridge.channels" :key="channel">
        <li class="channel">{{ channel }}</li>
        <li v-if="i < t.bridge.channels.length - 1" class="sep" aria-hidden="true">·</li>
      </template>
    </ul>
  </section>
</template>

<style scoped>
.bridge {
  position: relative;
  height: 100vh;
  height: 100svh;
  min-height: 640px;
  overflow: hidden;
}

.stage {
  position: absolute;
  inset: 0;
}

.pane {
  position: absolute;
  inset: 0;
}

.pane-above {
  background: var(--bg);
}

.pane-below {
  background: var(--bg-raise);
}

/* ——— traveling packets ——— */

.packets {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 500ms var(--ease-smooth);
  pointer-events: none;
}

.packets.settled {
  opacity: 1;
}

.packet {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin: -9px;
  border: 1px solid var(--accent-border);
  border-radius: 4px;
  background: var(--accent-dim);
  color: var(--accent);
  animation: packet-travel 7.2s linear var(--pd) infinite;
}

@keyframes packet-travel {
  0% {
    transform: translate(-3vw, 30.2vh);
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  92% {
    opacity: 1;
  }
  100% {
    transform: translate(103vw, 70.5vh);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .packet {
    animation: none;
    opacity: 1;
    transform: translate(calc(20vw + var(--ps) * 30vw), calc(37.8vh + var(--ps) * 11.4vh));
  }
}

/* ——— copy ——— */

.head {
  position: absolute;
  top: clamp(68px, 11vh, 120px);
  left: var(--gutter);
  max-width: 620px;
  z-index: 1;
}

.kicker {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
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
  font-size: 15px;
  line-height: 1.65;
  color: var(--text-2);
  max-width: 58ch;
}

.label {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-2);
  z-index: 1;
}

.label .dir {
  color: var(--accent);
}

.label-top {
  right: var(--gutter);
  top: 38%;
}

.label-bottom {
  left: var(--gutter);
  bottom: 26%;
}

.channels {
  position: absolute;
  bottom: clamp(30px, 6vh, 56px);
  left: var(--gutter);
  right: var(--gutter);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  list-style: none;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-3);
  z-index: 1;
}

.sep {
  color: var(--accent);
}

@media (max-width: 820px) {
  .bridge {
    min-height: 560px;
  }

  .label-top {
    top: 30%;
  }

  .label-bottom {
    bottom: 20%;
  }

  .channels {
    gap: 8px;
    font-size: 10.5px;
  }
}
</style>
