<script setup lang="ts">
import { computed, ref } from 'vue'
import DiagonalStage from '../fx/DiagonalStage.vue'
import KnowledgeGraph from '../demo/KnowledgeGraph.vue'
import Sparkle from '../brand/Sparkle.vue'
import Wordmark from '../brand/Wordmark.vue'
import { useLocale } from '../../composables/useLocale'
import { usePinnedTimeline } from '../../composables/usePinnedTimeline'
import { useReducedMotion } from '../../composables/useReducedMotion'
import { remap } from '../../lib/motion'

const { t } = useLocale()
const reduced = useReducedMotion()

const section = ref<HTMLElement | null>(null)
const { progress } = usePinnedTimeline(section, 4)

/** Node the reticle hunts during the dive: deterministic (seed 23),
 *  chosen for a tight near-center orbit at deep fov and a large size. */
const TRACK_NODE = 29
const NODES = 140

// The diagonal sweeps left while the approach begins.
const sweep = computed(() => remap(progress.value, 0, 0.18, 0, 1))

// Smoothstepped dive: 0 = outside the constellation, 1 = deep inside.
const dive = computed(() => {
  const d = remap(progress.value, 0.22, 0.78, 0, 1)
  return d * d * (3 - 2 * d)
})

// Camera dolly: distance shrinks from 3 radii (outside) to ~1.08 (inside —
// nodes fly past the lens). Zoom widens the cloud as we close in.
const fov = computed(() => (reduced.value ? 3 : 3 - dive.value * 1.92))
const zoom = computed(() => (reduced.value ? 1.4 : 1 + dive.value * 0.55))

const locked = computed(() => !reduced.value && progress.value > 0.7)
const pulse = computed(() => (locked.value ? [TRACK_NODE] : []))

// Instrument readouts.
const depthLabel = computed(() => dive.value.toFixed(2))
const rangeLabel = computed(() => String(NODES - Math.round(dive.value * 78)))

// Overlay opacities, handed to CSS as vars (scrub-reversible).
const reticleOpacity = computed(() => remap(progress.value, 0.46, 0.56, 0, 1))
const noteOpacity = computed(() => remap(progress.value, 0.74, 0.82, 0, 1))

// The canvas reports the tracked node's screen position every frame; we
// pin the reticle and the file note to it without touching reactivity.
const overlay = ref<HTMLElement | null>(null)

function handleTrack(sx: number, sy: number, _scale: number, visible: boolean): void {
  const el = overlay.value
  if (!el) return
  el.style.setProperty('--tx', `${sx.toFixed(1)}px`)
  el.style.setProperty('--ty', `${sy.toFixed(1)}px`)
  el.style.setProperty('--tvis', visible ? '1' : '0')
}
</script>

<template>
  <section id="continuum" ref="section" class="continuum">
    <div class="sticky">
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

      <div class="graph-stage">
        <KnowledgeGraph
          :nodes="NODES"
          :seed="23"
          :speed="0.05"
          :zoom="zoom"
          :fov="fov"
          :pulse="pulse"
          :track="TRACK_NODE"
          :on-track="handleTrack"
        />
      </div>

      <div class="vignette" aria-hidden="true"></div>

      <header class="head">
        <p class="kicker">
          <Wordmark brand="continuum" variant="mark" :height="16" decorative />
          <span>{{ t.continuum.kicker }}</span>
        </p>
        <h2 class="title">{{ t.continuum.title }}</h2>
        <p class="intro">{{ t.continuum.intro }}</p>
      </header>

      <!-- Reticle + file note, pinned to the tracked node by the canvas. -->
      <div
        ref="overlay"
        class="overlay"
        :style="{ '--ro': reticleOpacity, '--no': noteOpacity }"
      >
        <div class="reticle" :class="{ locked }" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 14 V2 H14" />
            <path d="M34 2 H46 V14" />
            <path d="M46 34 V46 H34" />
            <path d="M14 46 H2 V34" />
            <circle cx="24" cy="24" r="1.6" fill="currentColor" stroke="none" />
          </svg>
          <span class="reticle-tag">{{ t.continuum.hud.lock }}</span>
        </div>

        <p class="file-note">
          <Sparkle :size="10" />
          <span>{{ t.continuum.fileNote }}</span>
        </p>
      </div>

      <div class="hud" aria-hidden="true">
        <p>
          <span class="hud-k">{{ t.continuum.hud.depth }}</span>
          <span class="hud-v">{{ depthLabel }}</span>
        </p>
        <p>
          <span class="hud-k">{{ t.continuum.hud.range }}</span>
          <span class="hud-v">{{ rangeLabel }}</span>
        </p>
      </div>

      <p class="dive-hint" aria-hidden="true">
        <span>{{ t.continuum.diveHint }}</span>
        <span class="hint-line"></span>
      </p>

      <ol class="caps">
        <li
          v-for="(cap, i) in t.continuum.capabilities"
          :key="cap.title"
          class="cap"
          :style="{ '--rt': 0.8 + i * 0.032 }"
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
  /* ~3 viewports of camera travel through the constellation. */
  height: 420vh;
  background: var(--bg);
}

.sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  min-height: 600px;
  overflow: hidden;
}

.stage {
  position: absolute;
  inset: 0;
}

/* The seam crosses behind the whole dive — soften it. */
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

/* ——— the constellation, full viewport ——— */

.graph-stage {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.vignette {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(ellipse 90% 75% at 50% 50%, transparent 55%, var(--bg) 118%);
  /* Tunnel feeling: edges close in as the camera goes deeper. */
  opacity: clamp(0, calc((var(--p, 0) - 0.25) * 3), 0.85);
}

/* ——— header: right-composed, dives away as we enter ——— */

.head {
  position: absolute;
  top: clamp(64px, 9vh, 110px);
  right: var(--gutter);
  max-width: 620px;
  text-align: right;
  z-index: 3;
  opacity: clamp(0, calc((0.4 - var(--p, 0)) * 5), 1);
  transform: translateY(calc(clamp(0, calc((var(--p, 0) - 0.26) * 5), 1) * -36px));
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

/* ——— reticle + file note, riding the tracked node ——— */

.overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.reticle {
  position: absolute;
  left: var(--tx, 50%);
  top: var(--ty, 50%);
  width: 58px;
  height: 58px;
  transform: translate(-50%, -50%) scale(1.7) rotate(45deg);
  color: var(--text-3);
  opacity: calc(var(--tvis, 0) * var(--ro, 0));
  transition:
    transform 500ms var(--ease-smooth),
    color 500ms var(--ease-smooth);
}

.reticle svg {
  display: block;
  width: 100%;
  height: 100%;
}

.reticle.locked {
  transform: translate(-50%, -50%) scale(1) rotate(0deg);
  color: var(--accent);
}

.reticle-tag {
  position: absolute;
  top: calc(100% + 9px);
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--accent);
  opacity: 0;
  transition: opacity 300ms var(--ease-smooth) 250ms;
}

.reticle.locked .reticle-tag {
  opacity: 1;
}

.file-note {
  position: absolute;
  left: clamp(16px, calc(var(--tx, 50%) + 48px), calc(100% - 356px));
  top: clamp(90px, calc(var(--ty, 50%) + 54px), calc(100% - 230px));
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(330px, 76vw);
  padding: 11px 16px;
  border: 1px solid var(--accent-border);
  border-radius: 6px;
  background: var(--bg);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.05em;
  line-height: 1.5;
  color: var(--text-2);
  opacity: calc(var(--tvis, 0) * var(--no, 0));
}

.file-note :first-child {
  color: var(--accent);
  flex-shrink: 0;
}

/* ——— instrument HUD ——— */

.hud {
  position: absolute;
  left: var(--gutter);
  bottom: clamp(26px, 5vh, 48px);
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  opacity: min(
    clamp(0, calc((var(--p, 0) - 0.3) * 8), 1),
    clamp(0, calc((0.8 - var(--p, 0)) * 8), 1)
  );
}

.hud p {
  display: flex;
  justify-content: space-between;
  gap: 22px;
  min-width: 220px;
}

.hud-k {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-3);
}

.hud-v {
  color: var(--accent);
}

/* ——— pre-dive scroll affordance ——— */

.dive-hint {
  position: absolute;
  bottom: clamp(26px, 5vh, 48px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-3);
  opacity: clamp(0, calc((0.16 - var(--p, 0)) * 9), 1);
}

.hint-line {
  width: 1px;
  height: 26px;
  background: linear-gradient(to bottom, var(--accent), transparent);
  transform-origin: top;
  animation: dive-drop 2.2s var(--ease-smooth) infinite;
}

@keyframes dive-drop {
  0% {
    transform: scaleY(0);
  }
  45% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(1);
    opacity: 0;
  }
}

/* ——— capability strip, surfacing at the end of the dive ——— */

.caps {
  list-style: none;
  position: absolute;
  left: var(--gutter);
  right: var(--gutter);
  bottom: clamp(22px, 4.5vh, 44px);
  z-index: 4;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  perspective: 1000px;
}

.cap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  /* Legible over the constellation without killing it. */
  background: color-mix(in srgb, var(--bg) 78%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  --r: clamp(0, calc((var(--p, 1) - var(--rt)) * 12), 1);
  opacity: var(--r);
  transform: translateY(calc((1 - var(--r)) * 26px)) rotateX(calc((1 - var(--r)) * -18deg));
  transform-origin: 50% 0;
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

/* ——— reduced motion: static composition, no dive ——— */

@media (prefers-reduced-motion: reduce) {
  .continuum {
    height: auto;
  }

  .sticky {
    position: static;
    height: auto;
    min-height: 0;
    overflow: visible;
    padding: clamp(90px, 14vh, 150px) 0 clamp(70px, 10vh, 120px);
  }

  .vignette,
  .hud,
  .dive-hint,
  .reticle {
    display: none;
  }

  .head {
    position: static;
    opacity: 1;
    transform: none;
    margin: 0 var(--gutter) 28px auto;
  }

  .graph-stage {
    position: relative;
    height: 420px;
    margin-inline: var(--gutter);
  }

  .overlay {
    position: static;
  }

  .file-note {
    position: static;
    opacity: 1;
    width: auto;
    max-width: 44ch;
    margin: 18px var(--gutter) 40px;
  }

  .caps {
    position: static;
    margin-inline: var(--gutter);
  }

  .cap {
    opacity: 1;
    transform: none;
  }
}

/* ——— mobile ——— */

@media (max-width: 820px) {
  .head {
    left: var(--gutter);
    right: var(--gutter);
    max-width: none;
    text-align: left;
  }

  .kicker {
    justify-content: flex-start;
  }

  .intro {
    margin-left: 0;
  }

  /* Pinned under the (by-then faded) header, clear of the caps strip. */
  .file-note {
    left: var(--gutter);
    right: var(--gutter);
    top: clamp(86px, 12vh, 150px);
    bottom: auto;
    width: auto;
  }

  .hud p {
    min-width: 180px;
  }

  .caps {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .cap {
    padding: 12px 14px;
  }

  .cap:last-child {
    grid-column: 1 / -1;
  }

  .cap-title {
    font-size: 14px;
  }
}
</style>
