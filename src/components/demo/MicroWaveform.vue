<template>
  <span class="wave" aria-hidden="true">
    <span v-for="i in 14" :key="i" class="bar" :style="{ '--d': `${(i % 7) * 0.12}s`, '--h': barHeight(i) }"></span>
  </span>
</template>

<script setup lang="ts">
/** Deterministic pseudo-random bar heights so SSR/clients agree. */
function barHeight(i: number): string {
  const h = 0.25 + 0.75 * Math.abs(Math.sin(i * 2.7))
  return h.toFixed(2)
}
</script>

<style scoped>
.wave {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 22px;
}

.bar {
  width: 2px;
  height: calc(var(--h) * 22px);
  border-radius: 1px;
  background: var(--accent);
  opacity: 0.85;
  transform-origin: center;
  animation: wave-bounce 1.1s ease-in-out var(--d) infinite alternate;
}

@keyframes wave-bounce {
  from {
    transform: scaleY(0.3);
    opacity: 0.4;
  }
  to {
    transform: scaleY(1);
    opacity: 0.9;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bar {
    animation: none;
  }
}
</style>
