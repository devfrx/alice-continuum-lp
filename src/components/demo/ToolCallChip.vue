<script setup lang="ts">
import Sparkle from '../brand/Sparkle.vue'

defineProps<{
  label: string
  /** A finished call shows the brand sparkle instead of the running dot. */
  done?: boolean
}>()
</script>

<template>
  <span class="chip">
    <span class="glyph" aria-hidden="true">⌁</span>
    <code class="label">{{ label }}</code>
    <Sparkle v-if="done" :size="9" class="state state-done" />
    <span v-else class="state state-running" aria-hidden="true"></span>
  </span>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid var(--accent-border);
  border-radius: 7px;
  background: var(--accent-dim);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent);
  white-space: nowrap;
}

.glyph {
  opacity: 0.7;
}

.label {
  font-family: inherit;
}

.state-done {
  color: var(--accent);
}

.state-running {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: running-pulse 0.9s ease-in-out infinite alternate;
}

@keyframes running-pulse {
  from {
    opacity: 0.25;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .state-running {
    animation: none;
    opacity: 0.8;
  }
}
</style>
