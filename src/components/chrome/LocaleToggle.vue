<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'
import type { Locale } from '../../content/copy'

const { locale, t, toggle } = useLocale()

const options: readonly { value: Locale; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'it', label: 'IT' },
]

function select(value: Locale): void {
  if (locale.value !== value) toggle()
}
</script>

<template>
  <div class="locale-toggle" role="radiogroup" :aria-label="t.nav.ariaLocale">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="seg"
      role="radio"
      :class="{ active: locale === option.value }"
      :aria-checked="locale === option.value"
      :tabindex="locale === option.value ? 0 : -1"
      @click="select(option.value)"
      @keydown.left.prevent="toggle()"
      @keydown.right.prevent="toggle()"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.locale-toggle {
  display: inline-flex;
  align-items: center;
  padding: 2px;
  border: 1px solid var(--line);
  border-radius: 999px;
}

.seg {
  padding: 3px 8px;
  background: transparent;
  border: 0;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--text-3);
  cursor: pointer;
  transition:
    color 150ms var(--ease-smooth),
    background-color 150ms var(--ease-smooth);
}

.seg:hover {
  color: var(--text-2);
}

.seg.active {
  color: var(--accent);
  background: var(--accent-dim);
}

@media (pointer: coarse) {
  .seg {
    padding: 8px 12px;
  }
}
</style>
