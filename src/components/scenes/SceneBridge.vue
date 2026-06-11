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
// a shallow seam entering the left edge at ~31% and leaving the right
// edge at ~69% of the section height.
const sweep = computed(() => remap(progress.value, 0.12, 0.45, 0, 1))
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

    <!-- Query packets ride the seam down into the archive; sources come back. -->
    <div class="packets" :class="{ settled }" aria-hidden="true">
      <span v-for="i in 3" :key="`f${i}`" class="packet go" :style="{ '--pd': `${(i - 1) * 2.3}s`, '--ps': `${(i - 1) * 0.3}` }">
        <Sparkle :size="8" />
      </span>
      <span v-for="i in 2" :key="`r${i}`" class="packet back" :style="{ '--pd': `${1.1 + (i - 1) * 3.1}s`, '--ps': `${0.15 + (i - 1) * 0.34}` }">
        <Sparkle :size="6" />
      </span>
    </div>

    <header class="head">
      <p class="kicker">{{ t.bridge.kicker }}</p>
      <h2 class="title">{{ t.bridge.title }}</h2>
      <p class="intro">{{ t.bridge.intro }}</p>
    </header>

    <!-- The handshake: one request and one response across the seam. -->
    <div class="handshake">
      <div class="shake-card card-ask">
        <span class="shake-label">{{ t.bridge.ask.label }}</span>
        <code class="shake-mono">{{ t.bridge.ask.mono }}</code>
      </div>
      <span class="connector" aria-hidden="true"></span>
      <div class="shake-card card-reply">
        <span class="shake-label">{{ t.bridge.reply.label }}</span>
        <code class="shake-mono">{{ t.bridge.reply.mono }}</code>
      </div>
    </div>

    <p class="label label-top">{{ t.bridge.labelTop }} <span class="dir">↓</span></p>
    <p class="label label-bottom"><span class="dir">↑</span> {{ t.bridge.labelBottom }}</p>

    <div class="clauses">
      <p class="clauses-title">{{ t.bridge.clausesTitle }}</p>
      <ol class="clause-list">
        <li v-for="(channel, i) in t.bridge.channels" :key="channel" class="clause" :style="{ '--rt': 0.36 + i * 0.028 }">
          <span class="clause-num">0{{ i + 1 }}</span>
          <span class="clause-text">{{ channel }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.bridge {
  position: relative;
  height: 100vh;
  height: 100svh;
  min-height: 700px;
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

/* Above the seam: AL\CE's side, clean runtime. */
.pane-above {
  background: var(--bg);
}

/* Below the seam: CONT\NUUM's side, a storage lattice. */
.pane-below {
  background-color: var(--bg-raise);
  background-image: radial-gradient(circle at 1px 1px, var(--accent-dim) 1px, transparent 1.6px);
  background-size: 28px 28px;
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
  background: var(--bg);
  color: var(--accent);
}

.packet.go {
  animation: packet-go 7.2s linear var(--pd) infinite;
}

.packet.back {
  width: 15px;
  height: 15px;
  margin: -7.5px;
  opacity: 0.75;
  animation: packet-back 8.8s linear var(--pd) infinite;
}

/* Seam path: x from -3vw to 103vw maps to y = (x + 80) / 260 of 100vh. */
@keyframes packet-go {
  0% {
    transform: translate(-3vw, 29.6vh);
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  92% {
    opacity: 1;
  }
  100% {
    transform: translate(103vw, 70.4vh);
    opacity: 0;
  }
}

/* The return track runs just below the seam, right to left. */
@keyframes packet-back {
  0% {
    transform: translate(103vw, 73.2vh);
    opacity: 0;
  }
  8% {
    opacity: 0.75;
  }
  92% {
    opacity: 0.75;
  }
  100% {
    transform: translate(-3vw, 32.4vh);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .packet.go,
  .packet.back {
    animation: none;
    opacity: 1;
    /* Static spots along the settled seam: y(vh) = (x(vw) + 80) / 2.6 */
    transform: translate(calc(17vw + var(--ps) * 100vw), calc(37.3vh + var(--ps) * 38.5vh));
  }
}

/* ——— copy ——— */

.head {
  position: absolute;
  top: clamp(64px, 10vh, 110px);
  left: var(--gutter);
  max-width: 600px;
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

/* ——— the handshake ——— */

.handshake {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.shake-card {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 13px 17px 14px;
  border: 1px solid var(--accent-border);
  border-radius: 6px;
  background: var(--bg);
  box-shadow: 0 12px 32px -18px rgba(0, 0, 0, 0.55);
}

.card-ask {
  left: 56%;
  bottom: 62%;
  opacity: clamp(0, calc((var(--p, 1) - 0.3) * 9), 1);
  transform: translateY(calc((1 - clamp(0, calc((var(--p, 1) - 0.3) * 9), 1)) * -14px));
}

.card-reply {
  left: 60%;
  top: 64%;
  background: var(--bg-raise);
  opacity: clamp(0, calc((var(--p, 1) - 0.36) * 9), 1);
  transform: translateY(calc((1 - clamp(0, calc((var(--p, 1) - 0.36) * 9), 1)) * 14px));
}

.shake-label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
}

.shake-mono {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.02em;
  color: var(--text);
  white-space: nowrap;
}

/* Crosses the seam between the two cards; small square terminals. */
.connector {
  position: absolute;
  left: calc(56% + 26px);
  top: 38%;
  height: 26%;
  width: 1px;
  background: repeating-linear-gradient(
    to bottom,
    var(--accent) 0 4px,
    transparent 4px 9px
  );
  opacity: clamp(0, calc((var(--p, 1) - 0.42) * 9), 1);
}

.connector::before,
.connector::after {
  content: '';
  position: absolute;
  left: -3px;
  width: 7px;
  height: 7px;
  background: var(--accent);
}

.connector::before {
  top: -3px;
}

.connector::after {
  bottom: -3px;
}

/* ——— seam-end labels ——— */

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
  top: 56%;
}

.label-bottom {
  left: var(--gutter);
  top: 58%;
}

/* ——— contract clauses ——— */

.clauses {
  position: absolute;
  bottom: 0;
  left: var(--gutter);
  right: var(--gutter);
  z-index: 1;
  display: flex;
  align-items: baseline;
  gap: clamp(20px, 4vw, 56px);
  padding: 22px 0 clamp(26px, 4.5vh, 44px);
  border-top: 1px solid var(--line);
}

.clauses-title {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-3);
  flex-shrink: 0;
}

.clause-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: clamp(16px, 2.6vw, 40px);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.clause {
  display: flex;
  align-items: baseline;
  gap: 9px;
  color: var(--text-2);
  opacity: clamp(0.04, calc((var(--p, 1) - var(--rt)) * 9), 1);
  transform: translateY(calc((1 - clamp(0, calc((var(--p, 1) - var(--rt)) * 9), 1)) * 10px));
}

.clause-num {
  color: var(--accent);
  font-size: 10.5px;
}

@media (prefers-reduced-motion: reduce) {
  .shake-card,
  .connector,
  .clause {
    opacity: 1;
    transform: none;
  }
}

/* ——— mobile: stacked contract, seam as backdrop ——— */

@media (max-width: 820px) {
  .bridge {
    height: auto;
    min-height: 0;
    padding: 84px 0 0;
  }

  .head {
    position: static;
    padding-inline: var(--gutter);
    margin-bottom: 36px;
  }

  .label {
    display: none;
  }

  .handshake {
    position: static;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding-inline: var(--gutter);
    margin-bottom: 44px;
  }

  .shake-card {
    position: static;
    width: min(100%, 360px);
  }

  .card-ask,
  .card-reply {
    transform: none;
  }

  .shake-mono {
    white-space: normal;
  }

  .connector {
    position: static;
    height: 34px;
    opacity: clamp(0, calc((var(--p, 1) - 0.42) * 9), 1);
  }

  .packets {
    display: none;
  }

  .clauses {
    position: static;
    flex-direction: column;
    gap: 14px;
    margin-inline: var(--gutter);
  }

  .clause-list {
    gap: 12px 22px;
  }
}
</style>
