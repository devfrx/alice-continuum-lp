<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '../../composables/useLocale'
import { usePinnedTimeline } from '../../composables/usePinnedTimeline'

const { t } = useLocale()

const section = ref<HTMLElement | null>(null)
// 7 stops: six tenets fly past the camera, then the stamp lands.
const { beat } = usePinnedTimeline(section, 7)

const counter = computed(() => Math.min(6, beat.value + 1))
</script>

<template>
  <section id="tenets" ref="section" class="tenets">
    <div class="sticky">
      <!-- Dotted ground plane rushing under the camera. -->
      <div class="floor" aria-hidden="true"></div>

      <header class="head">
        <p class="kicker">{{ t.tenets.kicker }}</p>
        <h2 class="title">{{ t.tenets.title }}</h2>
      </header>
      <p class="doc-id">{{ t.tenets.docId }}</p>

      <div class="hud" aria-hidden="true">
        <span class="hud-count">0{{ counter }} / 06</span>
        <span class="hud-track"><span class="hud-fill"></span></span>
      </div>

      <!-- The corridor: each tenet is a slab parked at increasing depth;
           scroll dollies the camera straight through them. -->
      <div class="world">
        <article
          v-for="(seal, i) in t.tenets.seals"
          :key="seal.label"
          class="slab"
          :style="{ '--d': i, '--sx': i % 2 === 0 ? -1 : 1, zIndex: 10 - i }"
        >
          <span class="slab-top">
            <span class="slab-num">0{{ i + 1 }}</span>
            <span class="slab-label">{{ seal.label }}</span>
          </span>
          <span class="slab-value">{{ seal.value }}</span>
          <p class="slab-note">{{ seal.note }}</p>
        </article>

        <!-- Final stop: the classification stamp slams into focus and holds. -->
        <div class="slab stamp-slab" :style="{ '--d': 6, '--sx': 0, zIndex: 3 }">
          <div class="stamp">
            <span class="stamp-ring"></span>
            <span class="stamp-text">{{ t.tenets.stamp }}</span>
          </div>
        </div>
      </div>

      <!-- Depth fog: vignette selling the distance. -->
      <div class="fog" aria-hidden="true"></div>

      <footer class="foot">
        <span>{{ t.tenets.docFoot }}</span>
        <span class="foot-brand">AL\CE × CONT\NUUM</span>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.tenets {
  position: relative;
  /* 7 camera stops, one viewport of scroll each. */
  height: 700vh;
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

/* ——— ground plane ——— */

.floor {
  position: absolute;
  left: -15%;
  right: -15%;
  bottom: -6%;
  height: 58%;
  background-image: radial-gradient(
    circle at 1px 1px,
    var(--accent-border) 1.2px,
    transparent 1.8px
  );
  background-size: 32px 32px;
  /* Texture rushes toward the viewer as the camera dollies forward. */
  background-position: 0 calc(var(--p, 0) * 1400px);
  transform: perspective(800px) rotateX(62deg);
  transform-origin: 50% 100%;
  -webkit-mask-image: linear-gradient(to top, #000 25%, transparent 95%);
  mask-image: linear-gradient(to top, #000 25%, transparent 95%);
}

.fog {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 120% 90% at 50% 54%, transparent 46%, var(--bg) 92%);
  pointer-events: none;
  z-index: 2;
}

/* ——— fixed chrome: header, doc id, hud, footer ——— */

.head {
  position: absolute;
  top: clamp(60px, 9vh, 100px);
  left: var(--gutter);
  z-index: 3;
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
  font-size: clamp(1.6rem, 2.8vw, 2.6rem);
  line-height: 1.08;
  letter-spacing: 0.02em;
}

.doc-id {
  position: absolute;
  top: clamp(60px, 9vh, 100px);
  right: var(--gutter);
  z-index: 3;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-3);
}

.hud {
  position: absolute;
  right: var(--gutter);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 3;
}

.hud-count {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--text-3);
}

.hud-track {
  position: relative;
  width: 1px;
  height: clamp(90px, 18vh, 160px);
  background: var(--line);
}

.hud-fill {
  position: absolute;
  top: 0;
  left: -0.5px;
  width: 2px;
  height: calc(var(--p, 0) * 100%);
  background: var(--accent);
}

.foot {
  position: absolute;
  bottom: clamp(20px, 4vh, 36px);
  left: var(--gutter);
  right: var(--gutter);
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-3);
  z-index: 3;
}

.foot-brand {
  color: var(--text-2);
}

/* ——— the corridor ——— */

.world {
  position: absolute;
  inset: 0;
  perspective: 1000px;
  z-index: 1;
}

.slab {
  position: absolute;
  left: 50%;
  top: 52%;
  width: min(680px, 86vw);
  /* Camera-relative depth: 0 = in focus, negative = ahead, positive = passed.
     The 6.6 multiplier parks the stamp slightly before p = 1 so it holds. */
  --v: calc(var(--p, 0) * 6.6 - var(--d));
  --depth: 820px;
  --side: 20%;
  --tilt: -5deg;
  transform: translate(-50%, -50%) translateX(calc(var(--sx) * var(--side)))
    translateZ(calc(var(--v) * var(--depth))) rotateY(calc(var(--sx) * var(--tilt)));
  /* Fade in from the deep, fade out as it passes the lens. */
  opacity: min(
    clamp(0, calc((var(--v) + 1.6) / 1.15), 1),
    clamp(0, calc((0.45 - var(--v)) / 0.3), 1)
  );
  /* Depth of field: distant and just-passed slabs go soft. */
  filter: blur(calc(max(0px, (-0.35 - var(--v)) * 5px, (var(--v) - 0.16) * 14px)));
  pointer-events: none;
}

/* Brand backslash ghosting behind each statement. */
.slab::before {
  content: '\\';
  position: absolute;
  top: -0.42em;
  right: -2%;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(180px, 24vw, 300px);
  line-height: 1;
  color: var(--accent);
  opacity: 0.06;
  pointer-events: none;
}

.slab-top {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding-bottom: 14px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.slab-num {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.slab-label {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-3);
}

.slab-value {
  display: block;
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(3rem, 10vw, 7.5rem);
  line-height: 0.95;
  letter-spacing: 0.01em;
  color: var(--accent);
  margin-bottom: 18px;
}

.slab-note {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-2);
  max-width: 42ch;
}

/* ——— the stamp finale ——— */

.stamp-slab {
  display: flex;
  justify-content: center;
  /* The stamp parks at v = 0 and never passes the camera. */
  --v: min(calc(var(--p, 0) * 6.6 - var(--d)), 0);
}

.stamp-slab::before {
  content: none;
}

.stamp {
  position: relative;
  width: clamp(190px, 26vw, 260px);
  height: clamp(190px, 26vw, 260px);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-12deg);
  color: var(--accent);
}

.stamp-ring {
  position: absolute;
  inset: 0;
  border: 2px solid var(--accent-border);
  border-radius: 50%;
}

.stamp-ring::before {
  content: '';
  position: absolute;
  inset: 12px;
  border: 1px dashed var(--accent-border);
  border-radius: 50%;
}

.stamp-text {
  font-family: var(--font-mono);
  font-size: clamp(16px, 2vw, 21px);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.5;
  max-width: 7ch;
}

/* ——— reduced motion: a readable static ledger ——— */

@media (prefers-reduced-motion: reduce) {
  .tenets {
    height: auto;
  }

  .sticky {
    position: static;
    height: auto;
    min-height: 0;
    overflow: visible;
    padding: clamp(90px, 14vh, 150px) 0 clamp(70px, 10vh, 120px);
  }

  .floor,
  .fog,
  .hud {
    display: none;
  }

  .head,
  .doc-id {
    position: static;
  }

  .head {
    padding-inline: var(--gutter);
    margin-bottom: 10px;
  }

  .doc-id {
    padding-inline: var(--gutter);
    margin-bottom: 48px;
  }

  .world {
    position: static;
    perspective: none;
    display: grid;
    gap: 44px;
    max-width: 820px;
    margin-inline: auto;
    padding-inline: var(--gutter);
  }

  .slab {
    position: static;
    width: auto;
    transform: none;
    opacity: 1;
    filter: none;
  }

  .foot {
    position: static;
    margin: 56px var(--gutter) 0;
  }
}

/* ——— mobile: same corridor, tighter framing ——— */

@media (max-width: 820px) {
  .slab {
    --depth: 540px;
    --side: 0%;
    --tilt: 0deg;
    width: 86vw;
    top: 50%;
    /* Blur is expensive on small GPUs; depth cues carry the effect alone. */
    filter: none;
  }

  .slab::before {
    font-size: 170px;
    top: -0.3em;
  }

  .slab-value {
    font-size: clamp(2.6rem, 13vw, 4rem);
  }

  .doc-id {
    display: none;
  }

  .hud {
    right: 14px;
  }

  .foot {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
