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
      <header class="head">
        <p class="kicker">{{ t.tenets.kicker }}</p>
        <h2 class="title">{{ t.tenets.title }}</h2>
        <div class="stamp" aria-hidden="true">
          <span class="stamp-ring"></span>
          <span class="stamp-text">{{ t.tenets.stamp }}</span>
        </div>
      </header>

      <ul class="seals">
        <li
          v-for="(seal, i) in t.tenets.seals"
          :key="seal.label"
          class="seal"
          :style="{ '--rt': 0.22 + i * 0.04 }"
        >
          <span class="seal-label">{{ seal.label }}</span>
          <span class="seal-value">{{ seal.value }}</span>
          <span class="seal-note">{{ seal.note }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.tenets {
  position: relative;
  overflow: hidden;
  background: var(--bg);
}

/* Faint echo of the diagonal behind the dossier. */
.tenets::before {
  content: '';
  position: absolute;
  top: -20%;
  bottom: -20%;
  left: 58%;
  width: clamp(60px, 9vw, 130px);
  background: var(--accent-dim);
  transform: rotate(16deg);
  pointer-events: none;
}

.inner {
  position: relative;
  max-width: var(--max-w);
  margin-inline: auto;
  padding: clamp(90px, 14vh, 150px) var(--gutter);
}

.head {
  position: relative;
  max-width: 640px;
  margin-bottom: clamp(44px, 6vh, 70px);
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
}

/* ——— the stamp ——— */

.stamp {
  position: absolute;
  right: clamp(-40px, -3vw, -10px);
  top: -8px;
  width: 108px;
  height: 108px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-12deg) scale(clamp(0.001, calc((var(--p, 1) - 0.18) * 14), 1));
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
  inset: 7px;
  border: 1px dashed var(--accent-border);
  border-radius: 50%;
}

.stamp-text {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.5;
  max-width: 80px;
}

/* ——— seals grid ——— */

.seals {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);
}

.seal {
  background: var(--bg);
  padding: 26px 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: clamp(0.04, calc((var(--p, 1) - var(--rt)) * 9), 1);
  transform: translateY(calc((1 - clamp(0, calc((var(--p, 1) - var(--rt)) * 9), 1)) * 18px));
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
  font-size: clamp(1.5rem, 2.4vw, 2.1rem);
  line-height: 1;
  color: var(--accent);
}

.seal-note {
  font-size: 13px;
  line-height: 1.55;
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

@media (max-width: 820px) {
  .tenets::before {
    left: 70%;
  }

  .stamp {
    position: static;
    margin-top: 24px;
    width: 92px;
    height: 92px;
  }

  .seals {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 821px) and (max-width: 1080px) {
  .seals {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
