<script setup lang="ts">
import Sparkle from '../brand/Sparkle.vue'

const STEPS = ['plan', 'act', 'verify'] as const
</script>

<template>
  <span class="loop" aria-hidden="true">
    <template v-for="(step, i) in STEPS" :key="step">
      <span class="step" :style="{ '--d': `${i * 1}s` }">
        <Sparkle :size="9" class="star" />
        <span class="name">{{ step }}</span>
      </span>
      <span v-if="i < STEPS.length - 1" class="arrow">→</span>
    </template>
  </span>
</template>

<style scoped>
.loop {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.08em;
  color: var(--text-3);
}

.step {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  animation: step-live 3s linear var(--d) infinite;
}

.star {
  color: var(--accent);
  opacity: 0.35;
}

.arrow {
  opacity: 0.5;
}

@keyframes step-live {
  0%,
  28% {
    color: var(--accent);
  }
  33%,
  100% {
    color: var(--text-3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .step {
    animation: none;
  }
  .step:first-child {
    color: var(--accent);
  }
}
</style>
