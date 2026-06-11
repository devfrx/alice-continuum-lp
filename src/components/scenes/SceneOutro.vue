<script setup lang="ts">
import { ref } from 'vue'
import Sparkle from '../brand/Sparkle.vue'
import Wordmark from '../brand/Wordmark.vue'
import { useLocale } from '../../composables/useLocale'
import { useScrollScene } from '../../composables/useScrollScene'
import { LINKS } from '../../content/links'

const { t } = useLocale()

const section = ref<HTMLElement | null>(null)
useScrollScene(section)

const cards = [
  { key: 'alice' as const, href: LINKS.aliceRepo, primary: true },
  { key: 'continuum' as const, href: LINKS.continuumRepo, primary: false },
]
</script>

<template>
  <section id="outro" ref="section" class="outro">
    <!-- The two halves recompose: the brand backslash draws itself in. -->
    <svg class="backslash" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <line x1="30" y1="-4" x2="74" y2="104" pathLength="100" class="stroke" />
    </svg>
    <Sparkle :size="16" class="backslash-star" aria-hidden="true" />

    <div class="inner">
      <h2 class="title">{{ t.outro.title }}</h2>
      <p class="sub">{{ t.outro.sub }}</p>

      <div class="cards">
        <a
          v-for="card in cards"
          :key="card.key"
          class="card"
          :href="card.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="card-head">
            <Wordmark :brand="card.key" variant="mark" :height="26" decorative />
            <Wordmark :brand="card.key" :height="15" decorative />
          </span>
          <span class="card-tagline">{{
            card.key === 'alice' ? t.outro.ctaAlice.tagline : t.outro.ctaContinuum.tagline
          }}</span>
          <span class="card-action" :class="card.primary ? 'action-primary' : 'action-ghost'">
            <svg class="gh" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
              />
            </svg>
            <span>{{ card.key === 'alice' ? t.outro.ctaAlice.action : t.outro.ctaContinuum.action }}</span>
          </span>
        </a>
      </div>

      <p class="note">{{ t.outro.note }}</p>
    </div>
  </section>
</template>

<style scoped>
.outro {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg-raise);
  padding: clamp(90px, 12vh, 140px) 0;
}

/* ——— the recomposed backslash ——— */

.backslash {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.stroke {
  stroke: var(--accent);
  stroke-width: 1.5;
  vector-effect: non-scaling-stroke;
  opacity: 0.3;
  stroke-dasharray: 100;
  /* Draw-on tied to scroll progress; fully drawn by p≈0.65. */
  stroke-dashoffset: calc(100 - clamp(0, calc((var(--p, 1) - 0.25) * 250), 100));
}

.backslash-star {
  position: absolute;
  top: 12%;
  left: calc(50% + 24%);
  color: var(--accent);
  opacity: clamp(0, calc((var(--p, 1) - 0.6) * 8), 0.75);
}

@media (prefers-reduced-motion: reduce) {
  .stroke {
    stroke-dashoffset: 0;
  }
  .backslash-star {
    opacity: 0.75;
  }
}

/* ——— content ——— */

.inner {
  position: relative;
  max-width: 760px;
  padding-inline: var(--gutter);
  text-align: center;
  z-index: 1;
}

.title {
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(2rem, 4.4vw, 3.8rem);
  line-height: 1.06;
  letter-spacing: 0.02em;
  margin-bottom: 18px;
}

.sub {
  font-size: clamp(15px, 1.2vw, 17px);
  line-height: 1.65;
  color: var(--text-2);
  max-width: 52ch;
  margin: 0 auto 44px;
}

.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
  text-align: left;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--bg);
  text-decoration: none;
  color: var(--text);
  transition:
    border-color 180ms var(--ease-smooth),
    transform 180ms var(--ease-smooth);
}

.card:hover {
  border-color: var(--accent-border);
  transform: translateY(-2px);
}

.card-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-tagline {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-3);
}

.card-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 9px 18px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 500;
  transition:
    background-color 160ms var(--ease-smooth),
    border-color 160ms var(--ease-smooth);
}

.action-primary {
  background: var(--accent);
  color: var(--on-accent);
}

.card:hover .action-primary {
  background: var(--accent-hover);
}

.action-ghost {
  border: 1px solid var(--accent-border);
  color: var(--accent);
}

.card:hover .action-ghost {
  border-color: var(--accent);
}

.note {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-3);
  max-width: 56ch;
  margin: 0 auto;
}

@media (max-width: 680px) {
  .cards {
    grid-template-columns: 1fr;
  }

  .backslash-star {
    left: auto;
    right: 14%;
  }
}
</style>
