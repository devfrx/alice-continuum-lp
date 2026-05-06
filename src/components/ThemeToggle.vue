<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const { theme, toggle } = useTheme()
</script>

<template>
  <button
    class="toggle"
    type="button"
    :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-pressed="theme === 'light'"
    :title="theme === 'dark' ? 'Light' : 'Dark'"
    @click="toggle"
  >
    <span class="dot" :data-on="theme === 'light'" aria-hidden="true" />
    <span class="lbl">{{ theme }}</span>
  </button>
</template>

<style scoped>
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: var(--t-mono);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--text-secondary);
  transition: border-color var(--motion-fast), color var(--motion-fast);
}
.toggle:hover {
  border-color: var(--accent-border);
  color: var(--text-primary);
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 1px var(--accent-border);
  transition: transform var(--motion-fast);
}
.dot[data-on='true'] {
  background: var(--text-primary);
}
</style>
