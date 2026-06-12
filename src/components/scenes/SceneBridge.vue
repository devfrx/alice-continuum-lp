<script setup lang="ts">
import { computed, ref } from 'vue'
import DiagonalStage from '../fx/DiagonalStage.vue'
import Sparkle from '../brand/Sparkle.vue'
import { useLocale } from '../../composables/useLocale'
import { usePinnedTimeline } from '../../composables/usePinnedTimeline'
import { useReducedMotion } from '../../composables/useReducedMotion'
import { remap } from '../../lib/motion'

const { t } = useLocale()
const reduced = useReducedMotion()

const section = ref<HTMLElement | null>(null)
const { progress } = usePinnedTimeline(section, 4)

// The diagonal lies down into the local contract between the two apps:
// a shallow seam entering the left edge at ~31% and leaving the right
// edge at ~69% of the viewport height.
const sweep = computed(() => remap(progress.value, 0, 0.22, 0, 1))
const settled = computed(() => reduced.value || sweep.value > 0.95)
</script>

<template>
  <section id="bridge" ref="section" class="bridge">
    <div class="sticky">
      <div class="stage">
        <DiagonalStage
          :from="{ topX: 8, bottomX: 16 }"
          :to="{ topX: -80, bottomX: 180 }"
          :progress="sweep"
        >
          <template #left>
            <div class="pane pane-below">
              <!-- Archive heartbeat while the request is being served. -->
              <div class="pulse" aria-hidden="true"></div>
            </div>
          </template>
          <template #right>
            <div class="pane pane-above"></div>
          </template>
        </DiagonalStage>
      </div>

      <!-- Ambient packets riding the settled seam. -->
      <div class="packets" :class="{ settled }" aria-hidden="true">
        <span
          v-for="i in 3"
          :key="`f${i}`"
          class="packet go"
          :style="{ '--pd': `${(i - 1) * 2.3}s`, '--ps': `${(i - 1) * 0.3}` }"
        >
          <Sparkle :size="8" />
        </span>
        <span
          v-for="i in 2"
          :key="`r${i}`"
          class="packet back"
          :style="{ '--pd': `${1.1 + (i - 1) * 3.1}s`, '--ps': `${0.15 + (i - 1) * 0.34}` }"
        >
          <Sparkle :size="6" />
        </span>
      </div>

      <header class="head">
        <p class="kicker">{{ t.bridge.kicker }}</p>
        <h2 class="title">{{ t.bridge.title }}</h2>
        <p class="intro">{{ t.bridge.intro }}</p>
      </header>

      <p class="exhibit">{{ t.bridge.exhibit }}</p>

      <p class="label label-top">{{ t.bridge.labelTop }} <span class="dir">↓</span></p>
      <p class="label label-bottom"><span class="dir">↑</span> {{ t.bridge.labelBottom }}</p>

      <!-- The negotiation: request travels down, the archive answers up. -->
      <div class="handshake">
        <div class="shake-card card-ask">
          <span class="shake-label">{{ t.bridge.ask.label }}</span>
          <code class="shake-mono">{{ t.bridge.ask.mono }}</code>
        </div>

        <div class="conn-wrap" aria-hidden="true">
          <span class="conn-line"></span>
          <span class="pkt pkt-down"></span>
          <span class="pkt pkt-up"></span>
        </div>

        <div class="shake-card card-reply">
          <span class="shake-label">{{ t.bridge.reply.label }}</span>
          <code class="shake-mono">{{ t.bridge.reply.mono }}</code>
        </div>
      </div>

      <!-- The clauses stamp in one by one; the seal closes the deal. -->
      <div class="clauses">
        <p class="clauses-title">{{ t.bridge.clausesTitle }}</p>
        <ol class="clause-list">
          <li
            v-for="(channel, i) in t.bridge.channels"
            :key="channel"
            class="clause"
            :style="{ '--rt': 0.72 + i * 0.045, '--rot': i % 2 ? '1.8deg' : '-2.4deg' }"
          >
            <span class="clause-num">0{{ i + 1 }}</span>
            <span class="clause-text">{{ channel }}</span>
          </li>
        </ol>
        <p class="seal">
          <Sparkle :size="10" />
          <span>{{ t.bridge.sealed }}</span>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bridge {
  position: relative;
  /* Sweep → request → response → signing: four movements of contract. */
  height: 380vh;
  background: var(--bg);
}

.sticky {
  position: sticky;
  top: 0;
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

/* The lattice flares while the archive serves the request. */
.pulse {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at 1px 1px,
    var(--accent-border) 1.2px,
    transparent 1.8px
  );
  background-size: 28px 28px;
  opacity: calc(
    min(
        clamp(0, calc((var(--p, 0) - 0.46) * 10), 1),
        clamp(0, calc((0.62 - var(--p, 0)) * 10), 1)
      ) * 0.9
  );
  animation: lattice-throb 1.1s ease-in-out infinite alternate;
}

@keyframes lattice-throb {
  from {
    filter: brightness(0.85);
  }
  to {
    filter: brightness(1.25);
  }
}

/* ——— ambient packets ——— */

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

/* ——— copy ——— */

.head {
  position: absolute;
  top: clamp(58px, 9vh, 104px);
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

.exhibit {
  position: absolute;
  top: clamp(58px, 9vh, 104px);
  right: var(--gutter);
  z-index: 1;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-3);
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
  opacity: clamp(0, calc((var(--p, 0) - 0.18) * 10), 1);
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

/* ——— the negotiation ——— */

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
  --w: clamp(0, calc((var(--p, 0) - 0.26) * 12), 1);
  opacity: var(--w);
  transform: translateY(calc((1 - var(--w)) * -16px));
}

.card-reply {
  left: 60%;
  top: 64%;
  background: var(--bg-raise);
  --w: clamp(0, calc((var(--p, 0) - 0.56) * 12), 1);
  opacity: var(--w);
  transform: translateY(calc((1 - var(--w)) * 16px));
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

/* Crosses the seam between the two cards; packets travel it. */
.conn-wrap {
  position: absolute;
  left: calc(56% + 26px);
  top: 38%;
  height: 26%;
  width: 1px;
}

.conn-line {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(to bottom, var(--accent) 0 4px, transparent 4px 9px);
  /* The line draws itself ahead of the request packet. */
  transform: scaleY(clamp(0, calc((var(--p, 0) - 0.32) * 8), 1));
  transform-origin: top;
}

.conn-line::before,
.conn-line::after {
  content: '';
  position: absolute;
  left: -3px;
  width: 7px;
  height: 7px;
  background: var(--accent);
}

.conn-line::before {
  top: -3px;
}

.conn-line::after {
  bottom: -3px;
}

/* Request rides down; the answer climbs back up. */
.pkt {
  position: absolute;
  left: -4px;
  width: 9px;
  height: 9px;
  background: var(--accent);
}

.pkt-down {
  --seg: clamp(0, calc((var(--p, 0) - 0.36) * 6.25), 1);
  top: calc(var(--seg) * 100%);
  opacity: min(
    clamp(0, calc((var(--p, 0) - 0.36) * 14), 1),
    clamp(0, calc((0.54 - var(--p, 0)) * 14), 1)
  );
}

.pkt-up {
  --seg: clamp(0, calc((var(--p, 0) - 0.62) * 8.3), 1);
  top: calc((1 - var(--seg)) * 100%);
  background: var(--bg);
  border: 1.5px solid var(--accent);
  opacity: min(
    clamp(0, calc((var(--p, 0) - 0.62) * 14), 1),
    clamp(0, calc((0.78 - var(--p, 0)) * 14), 1)
  );
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

/* Each clause is stamped onto the page: presses in, settles flat. */
.clause {
  display: flex;
  align-items: baseline;
  gap: 9px;
  color: var(--text-2);
  --r: clamp(0, calc((var(--p, 0) - var(--rt)) * 16), 1);
  opacity: var(--r);
  transform: scale(calc(1.45 - var(--r) * 0.45)) rotate(calc(var(--rot) * (1 - var(--r))));
}

.clause-num {
  color: var(--accent);
  font-size: 10.5px;
}

.seal {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  --w: clamp(0, calc((var(--p, 0) - 0.94) * 18), 1);
  opacity: var(--w);
  transform: scale(calc(1.3 - var(--w) * 0.3));
}

/* ——— reduced motion: the executed contract, at rest ——— */

@media (prefers-reduced-motion: reduce) {
  .bridge {
    height: auto;
  }

  .sticky {
    position: static;
    height: auto;
    min-height: 640px;
    overflow: hidden;
  }

  .pulse,
  .pkt {
    display: none;
  }

  .packet.go,
  .packet.back {
    animation: none;
    opacity: 1;
    /* Static spots along the settled seam: y(vh) = (x(vw) + 80) / 2.6 */
    transform: translate(calc(17vw + var(--ps) * 100vw), calc(37.3vh + var(--ps) * 38.5vh));
  }

  .label,
  .card-ask,
  .card-reply,
  .clause,
  .seal {
    opacity: 1;
    transform: none;
  }

  .conn-line {
    transform: none;
  }
}

/* ——— mobile: the negotiation as a centered column ——— */

@media (max-width: 820px) {
  .head {
    right: var(--gutter);
    max-width: none;
  }

  .exhibit,
  .label,
  .packets {
    display: none;
  }

  .handshake {
    inset: auto;
    left: var(--gutter);
    right: var(--gutter);
    top: 38vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
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

  .conn-wrap {
    position: relative;
    left: auto;
    top: auto;
    height: 48px;
    width: 1px;
  }

  .clauses {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .clause-list {
    gap: 12px 22px;
  }

  .seal {
    margin-left: 0;
  }
}
</style>
