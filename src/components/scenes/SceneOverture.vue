<script setup lang="ts">
import { computed, ref } from 'vue'
import DiagonalStage from '../fx/DiagonalStage.vue'
import KnowledgeGraph from '../demo/KnowledgeGraph.vue'
import Wordmark from '../brand/Wordmark.vue'
import { useLocale } from '../../composables/useLocale'
import { useScrollScene } from '../../composables/useScrollScene'
import { useParallax } from '../../composables/useParallax'
import { LINKS } from '../../content/links'
import { remap } from '../../lib/motion'

const { t } = useLocale()

const section = ref<HTMLElement | null>(null)
const progress = useScrollScene(section)
useParallax(section, 1)

// A 100vh first section sits at scroll-progress 0.5 on load and reaches 1
// as it leaves the viewport: the diagonal closes gently on the way out.
const diagonalProgress = computed(() => remap(progress.value, 0.5, 1, 0, 1))
</script>

<template>
  <section id="overture" ref="section" class="overture">
    <!--
      The hero is deliberately theme-invariant: AL\CE side is always ivory
      (the portrait lives on white), CONT\NUUM side is always night. The
      diagonal divides light from dark in both themes.
    -->
    <div class="stage">
      <DiagonalStage
        :from="{ topX: 60, bottomX: 40 }"
        :to="{ topX: 54, bottomX: 46 }"
        :progress="diagonalProgress"
      >
        <template #left>
          <div class="pane pane-ivory"></div>
        </template>
        <template #right>
          <div class="pane pane-night">
            <div class="graph-layer">
              <KnowledgeGraph :nodes="80" :seed="7" :speed="0.045" accent="#e8dcc8" />
            </div>
          </div>
        </template>
      </DiagonalStage>
    </div>

    <div class="portrait-wrap">
      <picture>
        <source
          type="image/avif"
          srcset="/brand/gen/alice-hero-800.avif 800w, /brand/gen/alice-hero-1024.avif 1024w"
          sizes="(max-width: 820px) 70vw, 32vw"
        />
        <source
          type="image/webp"
          srcset="/brand/gen/alice-hero-800.webp 800w, /brand/gen/alice-hero-1024.webp 1024w"
          sizes="(max-width: 820px) 70vw, 32vw"
        />
        <img
          class="portrait"
          src="/brand/gen/alice-hero-1024.webp"
          :alt="t.a11y.portraitAlt"
          fetchpriority="high"
          decoding="async"
        />
      </picture>
    </div>

    <div class="pane-caption caption-alice" aria-hidden="true">
      <Wordmark brand="alice" tone="espresso" :height="12" decorative />
      <span>{{ t.hero.paneAlice }}</span>
    </div>
    <div class="pane-caption caption-continuum" aria-hidden="true">
      <Wordmark brand="continuum" tone="cream" :height="12" decorative />
      <span>{{ t.hero.paneContinuum }}</span>
    </div>

    <div class="content">
      <p class="eyebrow reveal" style="--i: 0">{{ t.hero.eyebrow }}</p>
      <h1 class="title">
        <span class="title-line reveal" style="--i: 1">{{ t.hero.titleA }}</span>
        <span class="title-line title-accent reveal" style="--i: 2">{{ t.hero.titleB }}</span>
      </h1>
      <p class="sub reveal" style="--i: 3">{{ t.hero.sub }}</p>
      <div class="ctas reveal" style="--i: 4">
        <a class="cta cta-primary" :href="LINKS.aliceRepo" target="_blank" rel="noopener noreferrer">
          {{ t.hero.ctaPrimary }}
        </a>
        <a
          class="cta cta-ghost"
          :href="LINKS.continuumRepo"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t.hero.ctaSecondary }}
        </a>
      </div>
    </div>

    <div class="scroll-hint reveal" style="--i: 6" aria-hidden="true">
      <span>{{ t.hero.scrollHint }}</span>
      <span class="hint-line"></span>
    </div>
  </section>
</template>

<style scoped>
.overture {
  /* Theme-invariant hero palette. */
  --ivory: #faf9f5;
  --ivory-ink: #1f1e1b;
  --ivory-muted: #7a5540;
  --night: #141413;
  --night-ink: #eceae5;
  --night-muted: #adaba4;
  --cream: #e8dcc8;
  --cream-hover: #f5ede0;

  /* Exit progress (0..1): ramps as the hero scrolls out of the viewport,
     driving layered depth on the way out. */
  --exit: clamp(0, calc((var(--p, 0.5) - 0.5) * 2), 1);

  position: relative;
  height: 100vh;
  height: 100svh;
  min-height: 640px;
  overflow: hidden;
  background: var(--night);
}

.stage {
  position: absolute;
  inset: 0;
}

.pane {
  position: absolute;
  inset: 0;
}

.pane-ivory {
  background: var(--ivory);
}

.pane-night {
  background: var(--night);
}

.graph-layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 64%;
  transform: translate3d(
    calc(var(--mx, 0) * -10px - var(--exit, 0) * 3vw),
    calc(var(--my, 0) * -7px),
    0
  );
}

.graph-layer > * {
  position: absolute;
  inset: 0;
}

/* ——— portrait ——— */

.portrait-wrap {
  position: absolute;
  bottom: 0;
  left: 3%;
  height: 86%;
  display: flex;
  align-items: flex-end;
  /* 2.5D: the portrait leans with the cursor and sinks on exit. */
  transform: perspective(1100px)
    translate3d(calc(var(--mx, 0) * 12px), calc(var(--my, 0) * 7px + var(--exit, 0) * 9vh), 0)
    rotateY(calc(var(--mx, 0) * 3.5deg));
  transform-origin: 50% 100%;
}

.portrait {
  height: 100%;
  width: auto;
  display: block;
  user-select: none;
  -webkit-mask-image: linear-gradient(to bottom, #000 86%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 86%, transparent 100%);
}

/* ——— pane captions ——— */

.pane-caption {
  position: absolute;
  bottom: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.caption-alice {
  left: var(--gutter);
  color: var(--ivory-muted);
}

.caption-continuum {
  right: var(--gutter);
  color: var(--night-muted);
}

/* ——— content ——— */

.content {
  position: absolute;
  top: 50%;
  right: var(--gutter);
  /* Copy rises faster than the portrait on exit — cheap parallax depth. */
  transform: translateY(calc(-52% - var(--exit, 0) * 12vh));
  opacity: calc(1 - var(--exit, 0) * 0.85);
  width: min(560px, 42vw);
  color: var(--night-ink);
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--night-muted);
  margin-bottom: 22px;
}

.title {
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(2.6rem, 5.4vw, 5rem);
  line-height: 1.04;
  letter-spacing: 0.02em;
  margin-bottom: 24px;
}

.title-line {
  display: block;
}

.title-accent {
  color: var(--cream);
}

.sub {
  font-size: clamp(1rem, 1.25vw, 1.125rem);
  line-height: 1.65;
  color: var(--night-muted);
  max-width: 46ch;
  margin-bottom: 34px;
}

.ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
}

.cta {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition:
    background-color 160ms var(--ease-smooth),
    border-color 160ms var(--ease-smooth),
    color 160ms var(--ease-smooth),
    transform 160ms var(--ease-smooth);
}

.cta-primary {
  background: var(--cream);
  color: var(--night);
}

.cta-primary:hover {
  background: var(--cream-hover);
  transform: translateY(-1px);
}

.cta-ghost {
  border: 1px solid rgba(232, 220, 200, 0.28);
  color: var(--cream);
}

.cta-ghost:hover {
  border-color: rgba(232, 220, 200, 0.55);
  transform: translateY(-1px);
}

/* ——— scroll hint ——— */

.scroll-hint {
  position: absolute;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--night-muted);
  /* Fades as the visitor starts scrolling (–p is written by useScrollScene). */
  opacity: clamp(0, calc((0.6 - var(--p, 0.5)) * 10), 1);
}

.hint-line {
  width: 1px;
  height: 34px;
  background: linear-gradient(to bottom, var(--cream), transparent);
  animation: hint-drop 2.2s var(--ease-smooth) infinite;
  transform-origin: top;
}

@keyframes hint-drop {
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

/* ——— entrance reveal ——— */

.reveal {
  animation: rise 0.9s var(--ease-out-expo) both;
  animation-delay: calc(var(--i) * 90ms + 120ms);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(26px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Reveal must not fight the centering transform of .content children's parent. */
.content .reveal {
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .overture {
    --exit: 0;
  }
  .reveal {
    animation: none;
  }
  .hint-line {
    animation: none;
  }
  .portrait-wrap,
  .graph-layer {
    transform: none;
  }
  .content {
    transform: translateY(-52%);
    opacity: 1;
  }
}

/* ——— mobile: stacked composition, no diagonal stage ——— */

@media (max-width: 820px) {
  .overture {
    height: auto;
    min-height: 0;
    background: var(--bg);
  }

  .stage,
  .pane-caption,
  .scroll-hint {
    display: none;
  }

  .portrait-wrap {
    position: relative;
    left: auto;
    bottom: auto;
    height: auto;
    transform: none;
    background: var(--ivory);
    justify-content: center;
    padding-top: 76px;
    clip-path: polygon(0 0, 100% 0, 100% 94%, 0 100%);
  }

  .portrait {
    height: min(45vh, 420px);
    -webkit-mask-image: none;
    mask-image: none;
  }

  .content {
    position: relative;
    top: auto;
    right: auto;
    transform: none;
    opacity: 1;
    width: auto;
    color: var(--text);
    padding: 40px var(--gutter) 56px;
  }

  .eyebrow,
  .sub {
    color: var(--text-2);
  }

  .title-accent {
    color: var(--accent);
  }

  .cta-primary {
    background: var(--accent);
    color: var(--on-accent);
  }

  .cta-primary:hover {
    background: var(--accent-hover);
  }

  .cta-ghost {
    border-color: var(--accent-border);
    color: var(--accent);
  }
}
</style>
